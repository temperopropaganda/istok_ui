// Lê os tipos e o JSDoc de src/ (API do TypeScript) e gera, do mesmo modelo de dados:
// - docs/guia-para-agentes.md: guia para agentes de IA (e pessoas), publicado junto no pacote;
// - playground/api.generated.ts: as tabelas de "Propriedades" de cada página do playground.
// `--check` só confere se os dois estão em dia (roda no `npm run check` e no CI).
import { readFile, writeFile } from "node:fs/promises";
import { join, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";
import * as prettier from "prettier";
import ts from "typescript";

const root = fileURLToPath(new URL("..", import.meta.url));
const srcDir = join(root, "src") + sep;
const outputPath = join(root, "docs/guia-para-agentes.md");
const apiPath = join(root, "playground/api.generated.ts");
const checkOnly = process.argv.includes("--check");

// --- Programa TypeScript com a mesma config do build dos tipos ---------------------------------
const parsed = ts.getParsedCommandLineOfConfigFile(
  join(root, "tsconfig.build.json"),
  {},
  {
    ...ts.sys,
    onUnRecoverableConfigFileDiagnostic: (diagnostic) => {
      throw new Error(ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n"));
    },
  },
);
if (!parsed) throw new Error("tsconfig.build.json não encontrado");
const program = ts.createProgram({
  rootNames: parsed.fileNames,
  options: { ...parsed.options, noEmit: true },
});
const checker = program.getTypeChecker();
const indexFile = program.getSourceFile(join(root, "src/index.ts"));
const indexSymbol = indexFile && checker.getSymbolAtLocation(indexFile);
if (!indexSymbol) throw new Error("src/index.ts não encontrado");

const isOurs = (node) => node.getSourceFile().fileName.startsWith(srcDir);
const text = (parts) => ts.displayPartsToString(parts).trim();
const oneLine = (value) => value.replace(/\s*\n\s*/g, " ").trim();
// Dentro de tabela: listas viram quebras de linha (`<br>`), o resto fica numa linha só.
const cell = (value) => oneLine(value.replace(/\n\s*- /g, " <br>- ")).replaceAll("|", "\\|") || "—";
const toKebab = (name) => name.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();

// --- Exports públicos, agrupados por pasta (src/components/<pasta>/) ----------------------------
const groups = new Map();
for (const exported of checker.getExportsOfModule(indexSymbol)) {
  const symbol =
    exported.flags & ts.SymbolFlags.Alias ? checker.getAliasedSymbol(exported) : exported;
  const declaration = symbol.declarations?.find(ts.isFunctionDeclaration);
  if (!declaration) continue; // tipos (ButtonProps…) entram nas tabelas de props
  const file = relative(srcDir, declaration.getSourceFile().fileName).split(sep);
  const group = file[0] === "components" ? file[1] : "utilitarios";
  if (!groups.has(group)) groups.set(group, []);
  groups.get(group).push({ name: exported.getName(), symbol, declaration });
}

const exceptList = (value) =>
  value ? [...value.matchAll(/"([^"]+)"/g)].map((match) => match[1]) : [];

/** O que mais a função aceita além das props próprias: elemento nativo, peça do Radix ou outro tipo. */
function baseProps(typeText) {
  const native = /^(?:Omit<)?ComponentProps<"(\w+)">(?:, (.+)>)?$/.exec(typeText);
  if (native) return { kind: "native", element: native[1], except: exceptList(native[2]) };
  const radix = /^(?:Omit<)?ComponentProps<typeof (\w+)Primitive\.(\w+)>(?:, (.+)>)?$/.exec(
    typeText,
  );
  if (radix) {
    return {
      kind: "radix",
      primitive: radix[1],
      part: radix[2],
      href: `https://www.radix-ui.com/primitives/docs/components/${toKebab(radix[1])}`,
      except: exceptList(radix[3]),
    };
  }
  // Props de outro componente da lib (ex.: FieldLabel aceita as do Label).
  const component = /^ComponentProps<typeof (\w+)>$/.exec(typeText);
  return { kind: "type", name: component ? component[1] : typeText };
}

/** A base em texto corrido (Markdown), para o guia. */
function baseText(base) {
  const except = base.except?.length
    ? `, exceto ${base.except.map((name) => `\`${name}\``).join(", ")}`
    : "";
  if (base.kind === "native") return `as props nativas de \`<${base.element}>\`${except}`;
  if (base.kind === "radix")
    return `as props de [\`${base.primitive}.${base.part}\`](${base.href}) do Radix${except}`;
  return `as props de \`${base.name}\``;
}

/** Tipo declarado do primeiro parâmetro, seguindo interfaces/aliases da própria lib até a base. */
function describeBase(param) {
  const typeNode = param.type;
  if (!typeNode) return [];
  const bases = [];
  const visit = (node) => {
    // Props escritas no próprio tipo ({ alt: string }) já entram na tabela.
    if (ts.isTypeLiteralNode(node)) return;
    if (ts.isIntersectionTypeNode(node) || ts.isUnionTypeNode(node)) {
      node.types.forEach(visit);
      return;
    }
    // `extends` de interface (ExpressionWithTypeArguments) ou referência de tipo comum.
    if (ts.isTypeReferenceNode(node) || ts.isExpressionWithTypeArguments(node)) {
      const symbol = checker.getSymbolAtLocation(
        ts.isTypeReferenceNode(node) ? node.typeName : node.expression,
      );
      const target =
        symbol && symbol.flags & ts.SymbolFlags.Alias ? checker.getAliasedSymbol(symbol) : symbol;
      const declaration = target?.declarations?.[0];
      if (declaration && isOurs(declaration) && ts.isInterfaceDeclaration(declaration)) {
        declaration.heritageClauses?.forEach((clause) => clause.types.forEach(visit));
        return;
      }
      if (declaration && isOurs(declaration) && ts.isTypeAliasDeclaration(declaration)) {
        visit(declaration.type);
        return;
      }
    }
    // Tipo escrito em várias linhas no código: normaliza antes de interpretar.
    const typeText = node
      .getText()
      .replace(/\s+/g, " ")
      .replace(/<\s/g, "<")
      .replace(/,?\s>/g, ">");
    bases.push(baseProps(typeText));
  };
  visit(typeNode);
  // Uniões (ex.: NewsCard com e sem capa) repetem a mesma base.
  return [...new Map(bases.map((base) => [JSON.stringify(base), base])).values()];
}

/** Dados de uma peça exportada: descrição, bases, props próprias e exemplos. */
function extract({ name, symbol, declaration }) {
  const part = {
    name,
    description: text(symbol.getDocumentationComment(checker)),
    bases: [],
    props: [],
    examples: symbol
      .getJsDocTags(checker)
      .filter((tag) => tag.name === "example")
      .map((tag) => text(tag.text ?? [])),
  };
  const param = declaration.parameters[0];
  if (!param || name === "cn" || name.startsWith("use")) return part;

  part.bases = describeBase(param);
  part.props = checker
    .getTypeAtLocation(param)
    .getProperties()
    .filter((prop) => prop.declarations?.some(isOurs))
    .map((prop) => {
      const propType = checker.typeToString(
        checker.getTypeOfSymbolAtLocation(prop, param),
        undefined,
        ts.TypeFormatFlags.NoTruncation | ts.TypeFormatFlags.UseAliasDefinedOutsideCurrentScope,
      );
      const defaultTag = prop.getJsDocTags(checker).find((tag) => tag.name === "default");
      return {
        name: prop.getName(),
        type: propType.replace(/( \| null| \| undefined)+$/, ""),
        required: !(prop.flags & ts.SymbolFlags.Optional),
        defaultValue: defaultTag ? text(defaultTag.text ?? []) : "",
        description: text(prop.getDocumentationComment(checker)),
      };
    });
  return part;
}

function partMarkdown(part) {
  const lines = [`#### \`${part.name}\``, ""];
  if (part.description) lines.push(part.description, "");
  if (part.bases.length > 0) lines.push(`Aceita ${part.bases.map(baseText).join(" e ")}.`, "");
  if (part.props.length > 0) {
    lines.push("| Prop | Tipo | Padrão | Descrição |", "| --- | --- | --- | --- |");
    for (const prop of part.props) {
      const label = `\`${prop.name}\`${prop.required ? " (obrigatória)" : ""}`;
      const fallback = prop.defaultValue ? `\`${prop.defaultValue}\`` : "—";
      lines.push(`| ${label} | \`${cell(prop.type)}\` | ${fallback} | ${cell(prop.description)} |`);
    }
    lines.push("");
  }
  for (const example of part.examples) lines.push(example, "");
  return lines;
}

// --- Tokens do theme.css -------------------------------------------------------------------------
const themeCss = await readFile(join(root, "src/styles/theme.css"), "utf8");
const inlineTheme = /@theme inline \{([\s\S]*?)\n\}/.exec(themeCss)?.[1] ?? "";
const colors = [...inlineTheme.matchAll(/--color-([\w-]+):/g)].map((match) => match[1]);
const radii = [...inlineTheme.matchAll(/--radius-([\w-]+):/g)].map((match) => match[1]);
const animations = [...themeCss.matchAll(/--animate-([\w-]+):/g)].map((match) => match[1]);

// --- Documento -----------------------------------------------------------------------------------
const pkg = JSON.parse(await readFile(join(root, "package.json"), "utf8"));
const title = (group) => {
  const main = groups.get(group).find((item) => toKebab(item.name) === group);
  return main?.name ?? group;
};
const componentGroups = [...groups.keys()].filter((group) => group !== "utilitarios").sort();
const components = componentGroups.map((group) => ({
  id: group,
  title: title(group),
  parts: groups.get(group).map(extract),
}));
const utilities = (groups.get("utilitarios") ?? []).map(extract);

const lines = [
  `# ${pkg.name}: guia para agentes`,
  "",
  `> Gerado de \`src/\` (tipos e JSDoc) por \`npm run guide\` na versão ${pkg.version}. Não edite à mão.`,
  "",
  "Biblioteca de componentes React 19 + Tailwind CSS 4, acessível (WCAG AA), com tema claro/escuro e tokens",
  "trocáveis por projeto. Use este guia para montar telas com a API certa.",
  "",
  "## Instalação",
  "",
  "```bash",
  `npm install ${pkg.name}`,
  "```",
  "",
  "No CSS principal do projeto, logo depois do Tailwind:",
  "",
  "```css",
  '@import "tailwindcss";',
  `@import "${pkg.name}/theme.css";`,
  "```",
  "",
  "Tema escuro: classe `dark` no `<html>`.",
  "",
  "## Regras de uso",
  "",
  `- Importe tudo de \`${pkg.name}\` (ex.: \`import { Button, Field } from "${pkg.name}"\`).`,
  "- Estilize só com classes **literais** do Tailwind e **tokens** do tema (`bg-primary`, `text-muted-foreground`).",
  "  Nada de `bg-${cor}` montado em tempo de execução nem de cor da paleta crua (`bg-neutral-500`).",
  "- Ajuste um componente com `className` (é mesclado com `cn()`; a classe passada vence conflitos).",
  "- Formulário: um `Field` por controle, com `FieldLabel`, `FieldDescription` e `FieldError`; ele liga `id`,",
  "  `aria-describedby`, `aria-invalid`, `required` e `disabled` sozinho. Checkbox, Switch e opções de RadioGroup",
  '  vão num `Field orientation="horizontal"`.',
  '- Botão só com ícone: `size="icon"` e `aria-label`. O `Tooltip` é complemento, não substitui o nome.',
  "- `Dialog` e `AlertDialog` precisam de título; sem descrição, passe `aria-describedby={undefined}`. Para",
  "  confirmar ações destrutivas, use `AlertDialog`.",
  '- Navegação com visual de botão: `<Button asChild><a href="…">…</a></Button>`.',
  "",
  "## Tokens",
  "",
  `Cores (viram \`bg-*\`, \`text-*\`, \`border-*\`, \`ring-*\`…): ${colors.map((name) => `\`${name}\``).join(", ")}.`,
  "Cada cor de fundo tem um par `*-foreground` para o texto por cima.",
  "",
  `Raio: ${radii.map((name) => `\`rounded-${name}\``).join(", ")} (derivados de \`--radius\`).`,
  "",
  `Animações (use com \`motion-safe:\`): ${animations.map((name) => `\`animate-${name}\``).join(", ")}.`,
  "",
  "## Componentes",
  "",
];
for (const component of components) {
  lines.push(`### ${component.title}`, "");
  if (component.parts.length > 1)
    lines.push(`Peças: ${component.parts.map((part) => `\`${part.name}\``).join(", ")}.`, "");
  for (const part of component.parts) lines.push(...partMarkdown(part));
}
lines.push("## Utilitários", "");
for (const part of utilities) lines.push(...partMarkdown(part));

// Para o playground: sem os exemplos (cada página já mostra os componentes funcionando).
const playgroundApi = Object.fromEntries(
  components.map((component) => [
    component.id,
    {
      title: component.title,
      parts: component.parts.map((part) => ({
        name: part.name,
        description: part.description,
        bases: part.bases,
        props: part.props,
      })),
    },
  ]),
);
const apiModule = `// Gerado por scripts/generate-guide.mjs a partir de src/ (tipos e JSDoc). Não edite à mão:
// rode \`npm run guide\`.

export interface PropApi {
  name: string;
  type: string;
  required: boolean;
  defaultValue: string;
  description: string;
}

export type BaseApi =
  | { kind: "native"; element: string; except: string[] }
  | { kind: "radix"; primitive: string; part: string; href: string; except: string[] }
  | { kind: "type"; name: string };

export interface PartApi {
  name: string;
  description: string;
  bases: BaseApi[];
  props: PropApi[];
}

export interface ComponentApi {
  title: string;
  parts: PartApi[];
}

export const api: Record<string, ComponentApi> = ${JSON.stringify(playgroundApi)};
`;

const format = async (source, filepath) =>
  prettier.format(source, { ...((await prettier.resolveConfig(filepath)) ?? {}), filepath });
const outputs = [
  [outputPath, await format(lines.join("\n"), outputPath)],
  [apiPath, await format(apiModule, apiPath)],
];

if (checkOnly) {
  let stale = false;
  for (const [path, content] of outputs) {
    const current = await readFile(path, "utf8").catch(() => "");
    if (current === content) {
      console.log(`✓ ${relative(root, path)} em dia`);
    } else {
      stale = true;
      console.error(
        `✗ ${relative(root, path)} está desatualizado. Rode \`npm run guide\` e commite.`,
      );
    }
  }
  if (stale) process.exit(1);
} else {
  for (const [path, content] of outputs) await writeFile(path, content);
  console.log(
    `✓ guia e propriedades do playground gerados (${String(components.length)} componentes)`,
  );
}
