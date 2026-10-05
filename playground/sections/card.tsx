import {
  Badge,
  Button,
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../src/index.ts";
import { Example } from "../section.tsx";

const orders = [
  { id: "4821", status: "Entregue", variant: "success" },
  { id: "4822", status: "Pendente", variant: "warning" },
] as const;

export function CardSection() {
  return (
    <>
      <Example label="Completo e simples">
        <div className="grid w-full gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Plano Pro</CardTitle>
              <CardDescription>Para times que publicam toda semana.</CardDescription>
              <CardAction>
                <Badge variant="success">Ativo</Badge>
              </CardAction>
            </CardHeader>
            <CardContent>
              <p className="text-sm">R$ 49/mês por pessoa, com projetos ilimitados.</p>
            </CardContent>
            <CardFooter className="gap-2">
              <Button>Assinar</Button>
              <Button variant="ghost">Comparar planos</Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Notificações</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Nenhuma notificação nova.
            </CardContent>
          </Card>
        </div>
      </Example>

      <Example label="Lista (Card asChild como li)">
        <ul aria-label="Pedidos" className="grid w-full gap-4 md:grid-cols-2">
          {orders.map((order) => (
            <Card key={order.id} asChild>
              <li>
                <CardHeader>
                  <CardTitle>Pedido #{order.id}</CardTitle>
                  <CardAction>
                    <Badge variant={order.variant}>{order.status}</Badge>
                  </CardAction>
                </CardHeader>
              </li>
            </Card>
          ))}
        </ul>
      </Example>
    </>
  );
}
