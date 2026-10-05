import { useEffect, useState } from "react";
import { Button } from "../src/index.ts";
import { AlertSection } from "./sections/alert.tsx";
import { AvatarSection } from "./sections/avatar.tsx";
import { BadgeSection } from "./sections/badge.tsx";
import { ButtonSection } from "./sections/button.tsx";
import { CardSection } from "./sections/card.tsx";
import { CheckboxSection } from "./sections/checkbox.tsx";
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

// Vitrine: todos os componentes da lib numa página só. Componente novo = seção nova aqui
// (Tokens primeiro, componentes em ordem alfabética).
const sections = [
  { id: "tokens", label: "Tokens", Component: TokensSection },
  { id: "alert", label: "Alert", Component: AlertSection },
  { id: "avatar", label: "Avatar", Component: AvatarSection },
  { id: "badge", label: "Badge", Component: BadgeSection },
  { id: "button", label: "Button", Component: ButtonSection },
  { id: "card", label: "Card", Component: CardSection },
  { id: "checkbox", label: "Checkbox", Component: CheckboxSection },
  { id: "field", label: "Field", Component: FieldSection },
  { id: "input", label: "Input", Component: InputSection },
  { id: "label", label: "Label", Component: LabelSection },
  { id: "radio-group", label: "RadioGroup", Component: RadioGroupSection },
  { id: "separator", label: "Separator", Component: SeparatorSection },
  { id: "skeleton", label: "Skeleton", Component: SkeletonSection },
  { id: "spinner", label: "Spinner", Component: SpinnerSection },
  { id: "switch", label: "Switch", Component: SwitchSection },
  { id: "textarea", label: "Textarea", Component: TextareaSection },
];

export function App() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  return (
    <>
      <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-8 py-3">
          <div className="flex items-center gap-6">
            <h1 className="text-lg font-bold">istok_ui</h1>
            <nav aria-label="Seções">
              <ul className="flex flex-wrap gap-1">
                {sections.map((section) => (
                  <li key={section.id}>
                    <Button asChild variant="ghost" size="sm">
                      <a href={`#${section.id}`}>{section.label}</a>
                    </Button>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
          <Button
            variant="outline"
            size="sm"
            aria-pressed={dark}
            onClick={() => {
              setDark((value) => !value);
            }}
          >
            Tema escuro
          </Button>
        </div>
      </header>
      <main className="mx-auto max-w-5xl space-y-12 px-8 py-10">
        {sections.map(({ id, Component }) => (
          <Component key={id} />
        ))}
      </main>
    </>
  );
}
