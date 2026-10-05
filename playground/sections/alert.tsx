import { useEffect, useRef, useState } from "react";
import { Alert, AlertDescription, AlertTitle, Button } from "../../src/index.ts";
import { CheckIcon, ErrorIcon, InfoIcon, WarningIcon } from "../icons.tsx";
import { Example } from "../section.tsx";

const examples = [
  {
    variant: "default",
    Icon: InfoIcon,
    title: "Atualização disponível",
    description: "Recarregue a página para ver as novidades.",
  },
  {
    variant: "success",
    Icon: CheckIcon,
    title: "Pedido enviado",
    description: "Você vai receber a confirmação por e-mail.",
  },
  {
    variant: "warning",
    Icon: WarningIcon,
    title: "Assinatura vence em 3 dias",
    description: "Renove para não perder o acesso aos projetos.",
  },
  {
    variant: "destructive",
    Icon: ErrorIcon,
    title: "Falha no pagamento",
    description: "O cartão foi recusado. Confira os dados e tente de novo.",
  },
] as const;

type Outcome = "success" | "error";

export function AlertSection() {
  const [pending, setPending] = useState<Outcome | null>(null);
  const [result, setResult] = useState<Outcome | null>(null);
  const timer = useRef<number>(undefined);

  useEffect(
    () => () => {
      window.clearTimeout(timer.current);
    },
    [],
  );

  // Simula uma requisição: o botão fica em loading e, no fim, o resultado aparece num Alert.
  const send = (outcome: Outcome) => {
    setResult(null);
    setPending(outcome);
    timer.current = window.setTimeout(() => {
      setPending(null);
      setResult(outcome);
    }, 800);
  };

  return (
    <>
      <Example label="Variantes">
        <div className="grid w-full gap-3 md:grid-cols-2">
          {examples.map(({ variant, Icon, title, description }) => (
            <Alert key={variant} variant={variant}>
              <Icon />
              <AlertTitle>{title}</AlertTitle>
              <AlertDescription>{description}</AlertDescription>
            </Alert>
          ))}
        </div>
      </Example>
      <Example label="Sem ícone">
        <Alert className="md:w-1/2">
          <AlertTitle>Manutenção programada</AlertTitle>
          <AlertDescription>O sistema fica fora do ar no domingo, das 2h às 4h.</AlertDescription>
        </Alert>
      </Example>
      <Example label="Depois de uma ação">
        <div className="w-full space-y-3">
          <div className="flex flex-wrap gap-3">
            <Button
              loading={pending === "success"}
              onClick={() => {
                send("success");
              }}
            >
              {pending === "success" ? "Enviando…" : "Enviar pedido"}
            </Button>
            <Button
              variant="outline"
              loading={pending === "error"}
              onClick={() => {
                send("error");
              }}
            >
              {pending === "error" ? "Enviando…" : "Enviar com erro"}
            </Button>
          </div>
          <div data-testid="alert-result" className="md:w-1/2">
            {result === "success" && (
              <Alert variant="success">
                <CheckIcon />
                <AlertTitle>Pedido enviado</AlertTitle>
                <AlertDescription>Você vai receber a confirmação por e-mail.</AlertDescription>
              </Alert>
            )}
            {result === "error" && (
              <Alert variant="destructive">
                <ErrorIcon />
                <AlertTitle>Não foi possível enviar</AlertTitle>
                <AlertDescription>Verifique a conexão e tente de novo.</AlertDescription>
              </Alert>
            )}
          </div>
        </div>
      </Example>
    </>
  );
}
