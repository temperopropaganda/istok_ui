import { useState } from "react";
import {
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Field,
  FieldLabel,
  Input,
  type DialogContentProps,
} from "../../src/index.ts";
import { Example, Section } from "../section.tsx";

const sizes: NonNullable<DialogContentProps["size"]>[] = ["sm", "md", "lg"];

function EditProfile() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("Ana Souza");

  return (
    <div className="flex items-center gap-3">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline">Editar perfil</Button>
        </DialogTrigger>
        <DialogContent>
          <form
            className="grid gap-4"
            onSubmit={(event) => {
              event.preventDefault();
              const value = new FormData(event.currentTarget).get("nome");
              setName(typeof value === "string" ? value : name);
              setOpen(false);
            }}
          >
            <DialogHeader>
              <DialogTitle>Editar perfil</DialogTitle>
              <DialogDescription>As mudanças aparecem para todo o time.</DialogDescription>
            </DialogHeader>
            <Field>
              <FieldLabel>Nome</FieldLabel>
              <Input name="nome" defaultValue={name} />
            </Field>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancelar</Button>
              </DialogClose>
              <Button type="submit">Salvar</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      <p className="text-sm">
        Nome: <output data-testid="dialog-name">{name}</output>
      </p>
    </div>
  );
}

export function DialogSection() {
  return (
    <Section
      id="dialog"
      title="Dialog"
      description="Modal: prende o foco, fecha com Esc, clique fora ou X, e devolve o foco a quem abriu."
    >
      <Example label="Com formulário">
        <EditProfile />
      </Example>
      <Example label="Tamanhos">
        {sizes.map((size) => (
          <Dialog key={size}>
            <DialogTrigger asChild>
              <Button variant="outline">Abrir {size}</Button>
            </DialogTrigger>
            <DialogContent size={size}>
              <DialogHeader>
                <DialogTitle>Tamanho {size}</DialogTitle>
                <DialogDescription>A largura máxima muda com o size.</DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        ))}
      </Example>
      <Example label="Conteúdo longo">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">Ler os termos</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Termos de uso</DialogTitle>
              <DialogDescription>Última atualização: outubro de 2026.</DialogDescription>
            </DialogHeader>
            {Array.from({ length: 12 }, (_, index) => (
              <p key={index} className="text-sm">
                {index + 1}. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod
                tempor incididunt ut labore et dolore magna aliqua.
              </p>
            ))}
            <DialogFooter>
              <DialogClose asChild>
                <Button>Entendi</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </Example>
    </Section>
  );
}
