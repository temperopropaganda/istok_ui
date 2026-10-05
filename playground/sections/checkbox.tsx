import { useState } from "react";
import { Checkbox, Field, FieldContent, FieldDescription, FieldLabel } from "../../src/index.ts";
import { Example } from "../section.tsx";

const states = [
  { label: "Desmarcado", props: {} },
  { label: "Marcado", props: { defaultChecked: true } },
  { label: "Indeterminado", props: { checked: "indeterminate" as const } },
  { label: "Desabilitado", props: { disabled: true } },
  { label: "Inválido", props: { "aria-invalid": true } },
];

const fruits = ["Maçã", "Banana", "Uva"];

export function CheckboxSection() {
  const [selected, setSelected] = useState<string[]>(["Maçã"]);
  const all =
    selected.length === fruits.length ? true : selected.length > 0 ? "indeterminate" : false;

  return (
    <>
      <Example label="Estados">
        {states.map(({ label, props }) => (
          <Field key={label} orientation="horizontal" className="w-auto">
            <Checkbox {...props} />
            <FieldLabel>{label}</FieldLabel>
          </Field>
        ))}
      </Example>
      <Example label="Com descrição">
        <Field orientation="horizontal" className="max-w-md">
          <Checkbox defaultChecked />
          <FieldContent>
            <FieldLabel>Receber novidades</FieldLabel>
            <FieldDescription>No máximo um e-mail por semana.</FieldDescription>
          </FieldContent>
        </Field>
      </Example>
      <Example label="Selecionar todos">
        <div className="grid gap-3">
          <Field orientation="horizontal">
            <Checkbox
              checked={all}
              onCheckedChange={(checked) => {
                setSelected(checked === true ? fruits : []);
              }}
            />
            <FieldLabel>Selecionar todas</FieldLabel>
          </Field>
          {fruits.map((fruit) => (
            <Field key={fruit} orientation="horizontal" className="pl-6">
              <Checkbox
                checked={selected.includes(fruit)}
                onCheckedChange={(checked) => {
                  setSelected((current) =>
                    checked === true
                      ? [...current, fruit]
                      : current.filter((item) => item !== fruit),
                  );
                }}
              />
              <FieldLabel>{fruit}</FieldLabel>
            </Field>
          ))}
        </div>
      </Example>
    </>
  );
}
