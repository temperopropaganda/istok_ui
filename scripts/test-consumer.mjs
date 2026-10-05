// Teste de consumo: empacota a lib, instala o tarball em examples/consumer-app (um projeto
// Vite + Tailwind como os que vão usar a istok_ui), builda e confere o resultado.
import { execFileSync } from "node:child_process";
import { mkdtemp, readFile, readdir, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const app = join(root, "examples/consumer-app");

const run = (args, cwd, options = {}) =>
  execFileSync("npm", args, {
    cwd,
    stdio: options.capture ? "pipe" : "inherit",
    encoding: "utf8",
    shell: process.platform === "win32",
  });

const failures = [];
const check = (ok, label) => {
  console.log(`${ok ? "✓" : "✗"} ${label}`);
  if (!ok) failures.push(label);
};

const packDir = await mkdtemp(join(tmpdir(), "istok-ui-pack-"));
try {
  console.log("› Buildando e empacotando a lib…");
  run(["run", "build"], root);
  const [packed] = JSON.parse(
    run(["pack", "--json", "--ignore-scripts", "--pack-destination", packDir], root, {
      capture: true,
    }),
  );
  const tarball = join(packDir, packed.filename);

  console.log("› Instalando no app consumidor…");
  run(["ci", "--no-audit", "--no-fund"], app);
  run(["install", "--no-save", "--no-audit", "--no-fund", tarball], app);

  console.log("› Buildando o app consumidor (tsc + vite)…");
  run(["run", "build"], app);

  const assetsDir = join(app, "dist/assets");
  const assets = await readdir(assetsDir);
  const readAsset = async (extension) => {
    const file = assets.find((name) => name.endsWith(extension));
    return file ? readFile(join(assetsDir, file), "utf8") : "";
  };
  const css = await readAsset(".css");
  const js = await readAsset(".js");

  check(css.includes(".bg-primary{"), "utilitários do tema gerados (bg-primary)");
  check(
    css.includes(".text-primary-foreground{"),
    "pares foreground gerados (text-primary-foreground)",
  );
  check(css.includes("--primary:"), "variáveis do tema presentes (--primary)");
  check(/\.dark\{[^}]*--background:/.test(css), "tema escuro presente (.dark)");
  check(css.includes(".dark\\:bg-card:where(.dark"), "variante dark: segue a classe .dark");
  // O app não escreve essas classes: elas só existem dentro do Button da lib. Prova que o
  // @source do theme.css faz o Tailwind do projeto escanear o JS da lib.
  check(
    css.includes(".focus-visible\\:ring-\\[3px\\]:focus-visible{"),
    "classes usadas dentro da lib são geradas (@source)",
  );

  check(/"data-slot":["`]button["`]/.test(js), "Button da lib está no bundle do app");
  // Importar só o Button não pode arrastar outros componentes do Radix (tree-shaking).
  const otherRadix = ["DialogContent", "PopoverContent", "DropdownMenuContent", "TooltipContent"];
  check(
    otherRadix.every((name) => !js.includes(name)),
    "tree-shaking: outros componentes do Radix fora do bundle",
  );
  // Idem para os componentes da própria lib: o app só importa Button e cn (o Spinner vem junto,
  // porque o Button usa no estado `loading`).
  check(/"data-slot":["`]spinner["`]/.test(js), "Spinner usado pelo Button está no bundle");
  const otherSlots = ["alert", "card", "badge", "avatar", "separator", "skeleton"];
  check(
    otherSlots.every((slot) => !new RegExp(`"data-slot":["\`]${slot}["\`]`).test(js)),
    "tree-shaking: componentes não importados da lib fora do bundle",
  );

  const output = execFileSync(
    process.execPath,
    [
      "--input-type=module",
      "-e",
      'import { cn } from "istok-ui"; process.stdout.write(cn("px-2 py-1", "px-4"));',
    ],
    { cwd: app, encoding: "utf8" },
  );
  check(output === "py-1 px-4", "import do pacote funciona em runtime (cn)");
} finally {
  await rm(packDir, { recursive: true, force: true });
}

if (failures.length > 0) {
  console.error(`\n${failures.length} verificação(ões) falharam.`);
  process.exit(1);
}
console.log("\nTeste de consumo OK.");
