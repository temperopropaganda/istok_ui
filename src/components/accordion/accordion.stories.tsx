import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./accordion.tsx";

const faq = [
  { value: "entrega", question: "Qual o prazo de entrega?", answer: "De 3 a 5 dias úteis." },
  { value: "troca", question: "Posso trocar o produto?", answer: "Sim, em até 30 dias." },
  { value: "pagamento", question: "Quais formas de pagamento?", answer: "Pix, cartão e boleto." },
];

const meta = {
  title: "Componentes/Accordion",
  component: Accordion,
  subcomponents: { AccordionItem, AccordionTrigger, AccordionContent },
  args: { type: "single", collapsible: true, defaultValue: "entrega" },
  render: (args) => (
    <Accordion {...args} className="max-w-md">
      {faq.map((item) => (
        <AccordionItem key={item.value} value={item.value}>
          <AccordionTrigger>{item.question}</AccordionTrigger>
          <AccordionContent>{item.answer}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  ),
} satisfies Meta<typeof Accordion>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Uma seção por vez; `collapsible` deixa fechar a aberta. */
export const Padrao: Story = {
  name: "Padrão",
  play: async ({ canvas, userEvent }) => {
    const returns = canvas.getByRole("button", { name: "Posso trocar o produto?" });
    await userEvent.click(returns);
    await expect(returns).toHaveAttribute("aria-expanded", "true");
    await expect(canvas.getByRole("button", { name: "Qual o prazo de entrega?" })).toHaveAttribute(
      "aria-expanded",
      "false",
    );
  },
};

/** No tema escuro. */
export const PadraoEscuro: Story = {
  ...Padrao,
  name: "Padrão (escuro)",
  globals: { theme: "escuro" },
};

/** Várias seções abertas ao mesmo tempo (`type="multiple"`). */
export const Multiplo: Story = {
  name: "Várias abertas",
  args: { type: "multiple", defaultValue: ["entrega", "troca"] },
};
