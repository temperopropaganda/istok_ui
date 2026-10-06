import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../../src/index.ts";
import { Example } from "../section.tsx";

const faq = [
  {
    value: "entrega",
    question: "Qual o prazo de entrega?",
    answer: "De 3 a 5 dias úteis para capitais e de 5 a 10 dias para o interior.",
  },
  {
    value: "troca",
    question: "Posso trocar o produto?",
    answer: "Sim, em até 30 dias após o recebimento, com a nota fiscal.",
  },
  {
    value: "pagamento",
    question: "Quais formas de pagamento vocês aceitam?",
    answer: "Pix, cartão de crédito em até 6 vezes e boleto.",
  },
];

const specs = [
  { value: "ingredientes", title: "Ingredientes", text: "Suco de laranja integral, sem açúcar." },
  { value: "conservacao", title: "Conservação", text: "Depois de aberto, mantenha na geladeira." },
  { value: "validade", title: "Validade", text: "120 dias a partir da fabricação." },
];

export function AccordionSection() {
  return (
    <>
      <Example label="Uma por vez (single, collapsible)">
        <Accordion type="single" collapsible defaultValue="entrega" className="w-full">
          {faq.map((item) => (
            <AccordionItem key={item.value} value={item.value}>
              <AccordionTrigger>{item.question}</AccordionTrigger>
              <AccordionContent>{item.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </Example>
      <Example label="Várias abertas (multiple)">
        {/* Perguntas diferentes do exemplo acima: cada conteúdo aberto é uma região nomeada pelo título. */}
        <Accordion
          type="multiple"
          defaultValue={["ingredientes", "conservacao"]}
          className="w-full"
        >
          {specs.map((item) => (
            <AccordionItem key={item.value} value={item.value}>
              <AccordionTrigger>{item.title}</AccordionTrigger>
              <AccordionContent>{item.text}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </Example>
      <Example label="Item desabilitado">
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="disponivel">
            <AccordionTrigger>Seção disponível</AccordionTrigger>
            <AccordionContent>Este conteúdo abre normalmente.</AccordionContent>
          </AccordionItem>
          <AccordionItem value="bloqueada" disabled>
            <AccordionTrigger>Seção bloqueada</AccordionTrigger>
            <AccordionContent>Não abre.</AccordionContent>
          </AccordionItem>
        </Accordion>
      </Example>
    </>
  );
}
