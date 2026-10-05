import { Field, FieldContent, FieldDescription, FieldLabel, Switch } from "../../src/index.ts";
import { Example } from "../section.tsx";

const states = [
  { label: "Desligado", props: {} },
  { label: "Ligado", props: { defaultChecked: true } },
  { label: "Desabilitado", props: { disabled: true } },
  { label: "Desabilitado e ligado", props: { disabled: true, defaultChecked: true } },
];

export function SwitchSection() {
  return (
    <>
      <Example label="Estados">
        {states.map(({ label, props }) => (
          <Field key={label} orientation="horizontal" className="w-auto">
            <Switch {...props} />
            <FieldLabel>{label}</FieldLabel>
          </Field>
        ))}
      </Example>
      <Example label="Configuração">
        <Field orientation="horizontal" className="max-w-md justify-between rounded-lg border p-4">
          <FieldContent>
            <FieldLabel>E-mails de marketing</FieldLabel>
            <FieldDescription>Receba novidades e ofertas.</FieldDescription>
          </FieldContent>
          <Switch defaultChecked />
        </Field>
      </Example>
    </>
  );
}
