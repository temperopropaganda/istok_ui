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
import { ApiSection } from "./api-section.tsx";
import { BrandLogo } from "./brand.tsx";
import { groups, pages, type PageId } from "./pages.ts";
import { useRoute } from "./router.ts";
import { PageView } from "./section.tsx";
import { HomeSection } from "./sections/home.tsx";
import { AccordionSection } from "./sections/accordion.tsx";
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
import { NewsCardSection } from "./sections/news-card.tsx";
import { ProductCardSection } from "./sections/product-card.tsx";
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
  accordion: AccordionSection,
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
  "news-card": NewsCardSection,
  "product-card": ProductCardSection,
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
      <header className="preview-header sticky top-0 z-30 border-b backdrop-blur">
        <div className="flex h-18 items-center gap-3 px-4 md:px-7">
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
            aria-label="istok_ui — início"
            className="shrink-0 rounded-md outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
          >
            <BrandLogo className="w-36 md:w-40" />
          </a>
          <span className="ml-5 hidden border-l border-border pl-5 text-sm text-muted-foreground sm:block">
            Biblioteca de componentes
          </span>
          <div className="ml-auto flex items-center gap-4">
            <span className="hidden text-xs text-muted-foreground lg:block">
              Feito pela Tempero
            </span>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
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
            "preview-sidebar md:sticky md:top-18 md:block md:h-[calc(100dvh-4.5rem)] md:w-64 md:shrink-0 md:overflow-y-auto md:border-r md:px-5 md:py-8",
            menuOpen
              ? "fixed inset-x-0 top-18 bottom-0 z-20 overflow-y-auto bg-background p-5"
              : "hidden",
          )}
        >
          {groups.map((group) => (
            <div key={group} className="mb-6">
              <h2 className="mb-3 px-3 text-[0.65rem] font-semibold tracking-[0.16em] text-muted-foreground uppercase">
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
                          "preview-nav-link block rounded-lg px-3 py-2 text-sm text-muted-foreground outline-none hover:bg-accent hover:text-accent-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50",
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
          className="preview-main min-w-0 flex-1 px-4 py-7 outline-none md:px-10 md:py-10"
        >
          <div className="mx-auto max-w-5xl space-y-12">
            <PageView
              key={page.id}
              id={page.id}
              title={"title" in page ? page.title : page.label}
              description={page.description}
            >
              <View />
              <ApiSection id={page.id} />
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
            <footer className="flex flex-wrap items-center justify-between gap-2 pb-2 text-xs text-muted-foreground">
              <span>Istok · Tempero Design System</span>
              <span>Uma base comum para criar.</span>
            </footer>
          </div>
        </main>
      </div>
    </>
  );
}
