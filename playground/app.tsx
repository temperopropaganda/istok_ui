import { useEffect, useRef, useState, type ComponentType } from "react";
import { Button, cn, Tooltip, TooltipContent, TooltipTrigger } from "../src/index.ts";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  CloseIcon,
  MenuIcon,
  MoonIcon,
  SunIcon,
} from "./icons.tsx";
import { groups, pages, type PageId } from "./pages.ts";
import { useRoute } from "./router.ts";
import { PageView } from "./section.tsx";
import { HomeSection } from "./sections/home.tsx";
import { AlertSection } from "./sections/alert.tsx";
import { AlertDialogSection } from "./sections/alert-dialog.tsx";
import { AvatarSection } from "./sections/avatar.tsx";
import { BadgeSection } from "./sections/badge.tsx";
import { ButtonSection } from "./sections/button.tsx";
import { CardSection } from "./sections/card.tsx";
import { CheckboxSection } from "./sections/checkbox.tsx";
import { DialogSection } from "./sections/dialog.tsx";
import { FieldSection } from "./sections/field.tsx";
import { InputSection } from "./sections/input.tsx";
import { LabelSection } from "./sections/label.tsx";
import { RadioGroupSection } from "./sections/radio-group.tsx";
import { SeparatorSection } from "./sections/separator.tsx";
import { SkeletonSection } from "./sections/skeleton.tsx";
import { SpinnerSection } from "./sections/spinner.tsx";
import { SwitchSection } from "./sections/switch.tsx";
import { TextareaSection } from "./sections/textarea.tsx";
import { TokensSection } from "./sections/tokens.tsx";
import { TooltipSection } from "./sections/tooltip.tsx";
import { useDarkTheme } from "./theme.ts";

// Vitrine no estilo da documentação do shadcn: sidebar à esquerda e uma página por componente.
// Componente novo = seção em `sections/`, entrada em `pages.ts` e aqui.
const views = {
  "": HomeSection,
  tokens: TokensSection,
  alert: AlertSection,
  "alert-dialog": AlertDialogSection,
  avatar: AvatarSection,
  badge: BadgeSection,
  button: ButtonSection,
  card: CardSection,
  checkbox: CheckboxSection,
  dialog: DialogSection,
  field: FieldSection,
  input: InputSection,
  label: LabelSection,
  "radio-group": RadioGroupSection,
  separator: SeparatorSection,
  skeleton: SkeletonSection,
  spinner: SpinnerSection,
  switch: SwitchSection,
  textarea: TextareaSection,
  tooltip: TooltipSection,
} satisfies Record<PageId, ComponentType>;

export function App() {
  const route = useRoute();
  const index = Math.max(
    0,
    pages.findIndex((page) => page.id === route),
  );
  const page = pages[index] ?? pages[0];
  const View = views[page.id];
  const previous = pages[index - 1];
  const next = pages[index + 1];

  const [dark, setDark] = useDarkTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  const shownRoute = useRef(page.id);

  useEffect(() => {
    document.title = `${page.id ? page.label : "Visão geral"} · istok_ui`;
    // Ao trocar de página (não no carregamento): volta ao topo e leva o foco ao título, para
    // leitores de tela anunciarem a página nova.
    if (shownRoute.current === page.id) return;
    shownRoute.current = page.id;
    window.scrollTo(0, 0);
    document.getElementById(`${page.id || "inicio"}-titulo`)?.focus();
  }, [page]);

  // Menu do celular: Esc fecha e devolve o foco ao botão.
  useEffect(() => {
    if (!menuOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setMenuOpen(false);
      menuButton.current?.focus();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [menuOpen]);

  return (
    <>
      <a
        href="#conteudo"
        onClick={(event) => {
          // O hash é das rotas: o atalho só move o foco para o conteúdo.
          event.preventDefault();
          document.getElementById("conteudo")?.focus();
        }}
        className="sr-only z-50 rounded-md bg-background px-3 py-2 text-sm font-medium focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:ring-[3px] focus:ring-ring/50"
      >
        Pular para o conteúdo
      </a>
      <header className="sticky top-0 z-30 border-b bg-background/95 backdrop-blur">
        <div className="flex h-14 items-center gap-2 px-4 md:px-6">
          <Button
            ref={menuButton}
            variant="ghost"
            size="icon"
            className="md:hidden"
            aria-label="Menu"
            aria-expanded={menuOpen}
            aria-controls="navegacao"
            onClick={() => {
              setMenuOpen((open) => !open);
            }}
          >
            {menuOpen ? <CloseIcon /> : <MenuIcon />}
          </Button>
          <a
            href="#/"
            className="rounded-md px-1 text-lg font-bold outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
          >
            istok_ui
          </a>
          <div className="ml-auto">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Tema escuro"
                  aria-pressed={dark}
                  onClick={() => {
                    setDark((value) => !value);
                  }}
                >
                  {dark ? <MoonIcon /> : <SunIcon />}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                {dark ? "Mudar para o tema claro" : "Mudar para o tema escuro"}
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      </header>
      <div className="flex">
        <nav
          id="navegacao"
          aria-label="Navegação"
          className={cn(
            "md:sticky md:top-14 md:block md:h-[calc(100dvh-3.5rem)] md:w-60 md:shrink-0 md:overflow-y-auto md:border-r md:p-4",
            menuOpen
              ? "fixed inset-x-0 top-14 bottom-0 z-20 overflow-y-auto bg-background p-4"
              : "hidden",
          )}
        >
          {groups.map((group) => (
            <div key={group} className="mb-6">
              <h2 className="mb-1 px-2 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                {group}
              </h2>
              <ul className="space-y-0.5">
                {pages
                  .filter((item) => item.group === group)
                  .map((item) => (
                    <li key={item.id}>
                      <a
                        href={`#/${item.id}`}
                        aria-current={item.id === page.id ? "page" : undefined}
                        onClick={() => {
                          setMenuOpen(false);
                        }}
                        className={cn(
                          "block rounded-md px-2 py-1.5 text-sm text-muted-foreground outline-none hover:bg-accent hover:text-accent-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50",
                          item.id === page.id && "bg-accent font-medium text-accent-foreground",
                        )}
                      >
                        {item.label}
                      </a>
                    </li>
                  ))}
              </ul>
            </div>
          ))}
        </nav>
        <main
          id="conteudo"
          tabIndex={-1}
          className="min-w-0 flex-1 px-4 py-10 outline-none md:px-10"
        >
          <div className="mx-auto max-w-4xl space-y-12">
            <PageView
              key={page.id}
              id={page.id}
              title={"title" in page ? page.title : page.label}
              description={page.description}
            >
              <View />
            </PageView>
            <nav aria-label="Páginas vizinhas" className="flex justify-between gap-4 border-t pt-6">
              {previous ? (
                <Button asChild variant="ghost">
                  <a href={`#/${previous.id}`}>
                    <ChevronLeftIcon />
                    {previous.label}
                  </a>
                </Button>
              ) : (
                <span />
              )}
              {next && (
                <Button asChild variant="ghost">
                  <a href={`#/${next.id}`}>
                    {next.label}
                    <ChevronRightIcon />
                  </a>
                </Button>
              )}
            </nav>
          </div>
        </main>
      </div>
    </>
  );
}
