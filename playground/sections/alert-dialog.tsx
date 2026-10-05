import { useEffect, useRef, useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  Button,
} from "../../src/index.ts";
import { Example } from "../section.tsx";

export function AlertDialogSection() {
  const [open, setOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleted, setDeleted] = useState(0);
  const timer = useRef<number>(undefined);

  useEffect(
    () => () => {
      window.clearTimeout(timer.current);
    },
    [],
  );

  return (
    <>
      <Example label="Exclusão">
        <AlertDialog open={open} onOpenChange={setOpen}>
          <AlertDialogTrigger asChild>
            <Button variant="destructive">Excluir projeto</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Excluir o projeto?</AlertDialogTitle>
              <AlertDialogDescription>
                O projeto e todos os arquivos dele serão apagados. Isso não pode ser desfeito.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={deleting}>Cancelar</AlertDialogCancel>
              <AlertDialogAction
                variant="destructive"
                loading={deleting}
                onClick={(event) => {
                  // Mantém aberto durante a exclusão; fecha pelo `open` quando terminar.
                  event.preventDefault();
                  setDeleting(true);
                  timer.current = window.setTimeout(() => {
                    setDeleting(false);
                    setOpen(false);
                    setDeleted((count) => count + 1);
                  }, 800);
                }}
              >
                {deleting ? "Excluindo…" : "Excluir"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        <p className="text-sm">
          Projetos excluídos: <output data-testid="alert-dialog-deleted">{deleted}</output>
        </p>
      </Example>
    </>
  );
}
