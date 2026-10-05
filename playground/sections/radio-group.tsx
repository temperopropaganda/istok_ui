import {
  Field,
  FieldDescription,
  FieldLabel,
  RadioGroup,
  RadioGroupItem,
} from "../../src/index.ts";
import { Example } from "../section.tsx";

const plans = [
  { value: "mensal", label: "Mensal", description: "R$ 49 por mês" },
  { value: "anual", label: "Anual", description: "R$ 490 por ano" },
  { value: "vitalicio", label: "Vitalício", description: "Pagamento único" },
];

export function RadioGroupSection() {
  return (
    <>
      <Example label="Vertical, com descrição">
        <Field className="max-w-md">
          <FieldLabel>Plano</FieldLabel>
          <RadioGroup defaultValue="anual">
            {plans.map((plan) => (
              <Field key={plan.value} orientation="horizontal">
                <RadioGroupItem value={plan.value} />
                <div className="grid gap-1">
                  <FieldLabel>{plan.label}</FieldLabel>
                  <FieldDescription>{plan.description}</FieldDescription>
                </div>
              </Field>
            ))}
          </RadioGroup>
        </Field>
      </Example>
      <Example label="Horizontal">
        <Field>
          <FieldLabel>Tamanho</FieldLabel>
          <RadioGroup defaultValue="m" orientation="horizontal">
            {["P", "M", "G"].map((size) => (
              <Field key={size} orientation="horizontal" className="w-auto">
                <RadioGroupItem value={size.toLowerCase()} />
                <FieldLabel>{size}</FieldLabel>
              </Field>
            ))}
          </RadioGroup>
        </Field>
      </Example>
      <Example label="Desabilitado">
        <Field className="max-w-md">
          <FieldLabel>Entrega</FieldLabel>
          <RadioGroup defaultValue="normal">
            <Field orientation="horizontal">
              <RadioGroupItem value="normal" />
              <FieldLabel>Normal</FieldLabel>
            </Field>
            <Field orientation="horizontal">
              <RadioGroupItem value="expressa" disabled />
              <FieldLabel>Expressa (indisponível)</FieldLabel>
            </Field>
          </RadioGroup>
        </Field>
      </Example>
    </>
  );
}
