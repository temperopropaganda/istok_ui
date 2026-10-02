import { useState } from "react";
import { Avatar, AvatarFallback, Button, Skeleton } from "../../src/index.ts";
import { Example, Section } from "../section.tsx";

export function SkeletonSection() {
  const [loading, setLoading] = useState(true);

  return (
    <Section
      id="skeleton"
      title="Skeleton"
      description="Bloco de carregamento no formato do conteúdo. Decorativo: o contêiner usa aria-busy."
    >
      <Button
        variant="outline"
        size="sm"
        aria-pressed={loading}
        onClick={() => {
          setLoading((value) => !value);
        }}
      >
        Simular carregamento
      </Button>
      <Example label="Perfil">
        <div aria-busy={loading} data-testid="skeleton-demo" className="flex items-center gap-3">
          {loading ? (
            <>
              <span className="sr-only">Carregando perfil…</span>
              <Skeleton className="size-10 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-4 w-28" />
              </div>
            </>
          ) : (
            <>
              <Avatar size="lg">
                <AvatarFallback aria-label="Ana Souza">AS</AvatarFallback>
              </Avatar>
              <div className="text-sm">
                <p className="font-medium">Ana Souza</p>
                <p className="text-muted-foreground">Designer</p>
              </div>
            </>
          )}
        </div>
      </Example>
    </Section>
  );
}
