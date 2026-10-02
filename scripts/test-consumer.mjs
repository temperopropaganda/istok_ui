// Teste de consumo: empacota a lib, instala o tarball em examples/consumer-app (um projeto
// Vite + Tailwind como os que vão usar a istok_ui), builda e confere o resultado.
import { execFileSync } from "node:child_process";
import { mkdtemp, readFile, readdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const app = join(root, "examples/consumer-app");
const pkgDir = join(app, "node_modules/@temperopropaganda/istok-ui");

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

  // Classe que só existe "dentro da lib": prova que o @source do theme.css faz o Tailwind
  // do projeto escanear o JS da lib, sem configuração extra.
  await writeFile(join(pkgDir, "dist/__probe.js"), 'export const probe = "tracking-[0.321em]";\n');

  console.log("› Buildando o app consumidor (tsc + vite)…");
  run(["run", "build"], app);

  const assetsDir = join(app, "dist/assets");
  const cssFile = (await readdir(assetsDir)).find((file) => file.endsWith(".css"));
  const css = cssFile ? await readFile(join(assetsDir, cssFile), "utf8") : "";

  check(css.includes(".bg-primary{"), "utilitários do tema gerados (bg-primary)");
  check(
    css.includes(".text-primary-foreground{"),
    "pares foreground gerados (text-primary-foreground)",
  );
  check(css.includes("--primary:"), "variáveis do tema presentes (--primary)");
  check(/\.dark\{[^}]*--background:/.test(css), "tema escuro presente (.dark)");
  check(css.includes(".dark\\:bg-card:where(.dark"), "variante dark: segue a classe .dark");
  check(
    css.includes(".tracking-\\[0\\.321em\\]{"),
    "classes usadas dentro da lib são geradas (@source)",
  );

  const output = execFileSync(
    process.execPath,
    [
      "--input-type=module",
      "-e",
      'import { cn } from "@temperopropaganda/istok-ui"; process.stdout.write(cn("px-2 py-1", "px-4"));',
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
