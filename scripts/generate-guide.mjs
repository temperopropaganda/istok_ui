// Gera docs/guia-para-agentes.md a partir dos tipos e do JSDoc de src/ (API do TypeScript), para
// agentes de IA (e pessoas) usarem a lib sem abrir o código. Vai junto no pacote publicado.
// `--check` só confere se o arquivo está em dia (roda no `npm run check` e no CI).
import { readFile, writeFile } from "node:fs/promises";
import { join, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";
import * as prettier from "prettier";
import ts from "typescript";

const root = fileURLToPath(new URL("..", import.meta.url));
const srcDir = join(root, "src") + sep;
const outputPath = join(root, "docs/guia-para-agentes.md");
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

/** O que mais a função aceita além das props próprias (elemento nativo, Radix ou outro tipo). */
function baseProps(typeText) {
  const native = /^ComponentProps<"(\w+)">$/.exec(typeText);
  if (native) return `as props nativas de \`<${native[1]}>\``;
  const omitted = /^Omit<ComponentProps<"(\w+)">, (.+)>$/.exec(typeText);
  if (omitted)
    return `as props nativas de \`<${omitted[1]}>\`, exceto ${omitted[2].replaceAll('"', "`")}`;
  const radix = /^(?:Omit<)?ComponentProps<typeof (\w+)Primitive\.(\w+)>(?:, (.+)>)?$/.exec(
    typeText,
  );
  if (radix) {
    const except = radix[3] ? `, exceto ${radix[3].replaceAll('"', "`")}` : "";
    return `as props de \`${radix[1]}.${radix[2]}\` do Radix (https://www.radix-ui.com/primitives/docs/components/${toKebab(radix[1])})${except}`;
  }
  return `as props de \`${typeText}\``;
}

/** Tipo declarado do primeiro parâmetro, seguindo interfaces/aliases da própria lib até a base. */
function describeBase(param) {
  const typeNode = param.type;
  if (!typeNode) return [];
  const bases = [];
  const visit = (node) => {
    if (ts.isIntersectionTypeNode(node)) {
      node.types.filter((part) => !ts.isTypeLiteralNode(part)).forEach(visit);
      return;
    }
    if (ts.isTypeReferenceNode(node)) {
      const symbol = checker.getSymbolAtLocation(node.typeName);
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
  return bases;
}

function describeFunction({ name, symbol, declaration }) {
  const lines = [`#### \`${name}\``, ""];
  const doc = text(symbol.getDocumentationComment(checker));
  if (doc) lines.push(doc, "");

  const param = declaration.parameters[0];
  if (param && name !== "cn" && !name.startsWith("use")) {
    const type = checker.getTypeAtLocation(param);
    const own = type
      .getProperties()
      .filter((prop) => prop.declarations?.some(isOurs))
      .map((prop) => {
        const propType = checker.typeToString(
          checker.getTypeOfSymbolAtLocation(prop, param),
          undefined,
          ts.TypeFormatFlags.NoTruncation | ts.TypeFormatFlags.UseAliasDefinedOutsideCurrentScope,
        );
        const tags = prop.getJsDocTags(checker);
        const defaultValue = tags.find((tag) => tag.name === "default");
        return {
          name: prop.getName(),
          required: !(prop.flags & ts.SymbolFlags.Optional),
          type: propType.replace(/( \| null| \| undefined)+$/, ""),
          defaultValue: defaultValue ? text(defaultValue.text ?? []) : "",
          doc: text(prop.getDocumentationComment(checker)),
        };
      });
    const bases = describeBase(param);
    if (bases.length > 0) lines.push(`Aceita ${bases.join(" e ")}.`, "");
    if (own.length > 0) {
      lines.push("| Prop | Tipo | Padrão | Descrição |", "| --- | --- | --- | --- |");
      for (const prop of own) {
        const label = `\`${prop.name}\`${prop.required ? " (obrigatória)" : ""}`;
        const fallback = prop.defaultValue ? `\`${prop.defaultValue}\`` : "—";
        lines.push(`| ${label} | \`${cell(prop.type)}\` | ${fallback} | ${cell(prop.doc)} |`);
      }
      lines.push("");
    }
  }

  for (const tag of symbol.getJsDocTags(checker).filter((item) => item.name === "example")) {
    lines.push(text(tag.text ?? []), "");
  }
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
for (const group of componentGroups) {
  const items = groups.get(group);
  lines.push(`### ${title(group)}`, "");
  if (items.length > 1)
    lines.push(`Peças: ${items.map((item) => `\`${item.name}\``).join(", ")}.`, "");
  for (const item of items) lines.push(...describeFunction(item));
}
lines.push("## Utilitários", "");
for (const item of groups.get("utilitarios") ?? []) lines.push(...describeFunction(item));

const prettierConfig = (await prettier.resolveConfig(outputPath)) ?? {};
const content = await prettier.format(lines.join("\n"), {
  ...prettierConfig,
  filepath: outputPath,
});

if (checkOnly) {
  const current = await readFile(outputPath, "utf8").catch(() => "");
  if (current !== content) {
    console.error(
      `✗ ${relative(root, outputPath)} está desatualizado. Rode \`npm run guide\` e commite o resultado.`,
    );
    process.exit(1);
  }
  console.log(`✓ ${relative(root, outputPath)} em dia`);
} else {
  await writeFile(outputPath, content);
  console.log(
    `✓ ${relative(root, outputPath)} gerado (${String(componentGroups.length)} componentes)`,
  );
}
