import { useEffect, useRef, useState, type SubmitEvent } from "react";
import { flushSync } from "react-dom";
import {
  Alert,
  AlertDescription,
  AlertTitle,
  Button,
  Checkbox,
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
  FieldLegend,
  FieldSet,
  Input,
  RadioGroup,
  RadioGroupItem,
  Switch,
  Textarea,
} from "../../src/index.ts";
import { CheckIcon } from "../icons.tsx";
import { Example, Section } from "../section.tsx";

interface Values {
  nome: string;
  email: string;
  mensagem: string;
  plano: string;
  novidades: boolean;
  termos: boolean;
}

const initialValues: Values = {
  nome: "",
  email: "",
  mensagem: "",
  plano: "",
  novidades: false,
  termos: false,
};

function validate(values: Values) {
  const errors: Partial<Record<keyof Values, string>> = {};
  if (!values.nome.trim()) errors.nome = "Informe seu nome.";
  if (!values.email.trim()) errors.email = "Informe seu e-mail.";
  else if (!/^\S+@\S+\.\S+$/.test(values.email)) errors.email = "Informe um e-mail válido.";
  if (!values.plano) errors.plano = "Escolha um plano.";
  if (!values.termos) errors.termos = "Aceite os termos para continuar.";
  return errors;
}

// Cadastro de ponta a ponta: valida no envio, leva o foco ao primeiro campo inválido e, se tudo
// estiver certo, mostra o loading do botão e o resultado (com o FormData nativo do formulário).
function SignupForm() {
  const [values, setValues] = useState(initialValues);
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<Record<string, FormDataEntryValue> | null>(null);
  const timer = useRef<number>(undefined);
  const errors = submitted ? validate(values) : {};

  useEffect(
    () => () => {
      window.clearTimeout(timer.current);
    },
    [],
  );

  const set = <K extends keyof Values>(key: K, value: Values[K]) => {
    setValues((current) => ({ ...current, [key]: value }));
    setResult(null);
  };

  const onSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    flushSync(() => {
      setSubmitted(true);
    });
    const invalid = form.querySelector('[aria-invalid="true"]');
    if (invalid) {
      // No RadioGroup, o foco vai para a opção que está no Tab (a marcada ou a primeira).
      const target = invalid.matches('[role="radiogroup"]')
        ? invalid.querySelector('[tabindex="0"]')
        : invalid;
      if (target instanceof HTMLElement) target.focus();
      return;
    }
    const data = Object.fromEntries(new FormData(form));
    setSending(true);
    timer.current = window.setTimeout(() => {
      setSending(false);
      setResult(data);
    }, 800);
  };

  return (
    <form noValidate aria-label="Cadastro" onSubmit={onSubmit} className="grid max-w-md gap-6">
      <Field required>
        <FieldLabel>Nome</FieldLabel>
        <Input
          name="nome"
          autoComplete="name"
          value={values.nome}
          onChange={(event) => {
            set("nome", event.target.value);
          }}
        />
        <FieldError>{errors.nome}</FieldError>
      </Field>
      <Field required>
        <FieldLabel>E-mail</FieldLabel>
        <Input
          name="email"
          type="email"
          autoComplete="email"
          value={values.email}
          onChange={(event) => {
            set("email", event.target.value);
          }}
        />
        <FieldDescription>Usado só para enviar a confirmação.</FieldDescription>
        <FieldError>{errors.email}</FieldError>
      </Field>
      <Field>
        <FieldLabel>Mensagem</FieldLabel>
        <Textarea
          name="mensagem"
          value={values.mensagem}
          onChange={(event) => {
            set("mensagem", event.target.value);
          }}
        />
        <FieldDescription>Opcional.</FieldDescription>
      </Field>
      <Field required>
        <FieldLabel>Plano</FieldLabel>
        <RadioGroup
          name="plano"
          orientation="horizontal"
          value={values.plano}
          onValueChange={(value) => {
            set("plano", value);
          }}
        >
          <Field orientation="horizontal" className="w-auto">
            <RadioGroupItem value="mensal" />
            <FieldLabel>Mensal</FieldLabel>
          </Field>
          <Field orientation="horizontal" className="w-auto">
            <RadioGroupItem value="anual" />
            <FieldLabel>Anual</FieldLabel>
          </Field>
        </RadioGroup>
        <FieldError>{errors.plano}</FieldError>
      </Field>
      <Field orientation="horizontal">
        <Switch
          name="novidades"
          checked={values.novidades}
          onCheckedChange={(checked) => {
            set("novidades", checked);
          }}
        />
        <FieldLabel>Receber novidades por e-mail</FieldLabel>
      </Field>
      <Field orientation="horizontal" required>
        <Checkbox
          name="termos"
          checked={values.termos}
          onCheckedChange={(checked) => {
            set("termos", checked === true);
          }}
        />
        <FieldContent>
          <FieldLabel>Aceito os termos de uso</FieldLabel>
          <FieldError>{errors.termos}</FieldError>
        </FieldContent>
      </Field>
      <Button type="submit" loading={sending} className="justify-self-start">
        {sending ? "Enviando…" : "Criar conta"}
      </Button>
      {result && (
        <Alert variant="success">
          <CheckIcon />
          <AlertTitle>Conta criada</AlertTitle>
          <AlertDescription>
            <output data-testid="form-data" className="font-mono text-xs">
              {JSON.stringify(result)}
            </output>
          </AlertDescription>
        </Alert>
      )}
    </form>
  );
}

export function FieldSection() {
  return (
    <Section
      id="field"
      title="Field"
      description="Liga rótulo, descrição e erro ao controle sozinho (id, aria-describedby, aria-invalid, required, disabled)."
    >
      <Example label="Vertical">
        <div className="grid w-full max-w-md gap-6">
          <Field>
            <FieldLabel>Nome de usuário</FieldLabel>
            <Input placeholder="ana.souza" />
            <FieldDescription>Aparece no seu perfil público.</FieldDescription>
          </Field>
          <Field required>
            <FieldLabel>Empresa</FieldLabel>
            <Input />
          </Field>
          <Field>
            <FieldLabel>Site</FieldLabel>
            <Input defaultValue="tempero" />
            <FieldError>Informe um endereço completo, como https://tempero.com.br.</FieldError>
          </Field>
          <Field disabled>
            <FieldLabel>CNPJ</FieldLabel>
            <Input defaultValue="00.000.000/0001-00" />
          </Field>
        </div>
      </Example>
      <Example label="Grupo (FieldSet)">
        <FieldSet className="max-w-md">
          <FieldLegend>Notificações</FieldLegend>
          <FieldDescription>Escolha como quer ser avisado.</FieldDescription>
          <Field orientation="horizontal">
            <Checkbox defaultChecked />
            <FieldLabel>Por e-mail</FieldLabel>
          </Field>
          <Field orientation="horizontal">
            <Checkbox />
            <FieldLabel>Por SMS</FieldLabel>
          </Field>
        </FieldSet>
      </Example>
      <Example label="Formulário de cadastro">
        <SignupForm />
      </Example>
    </Section>
  );
}
