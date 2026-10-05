import { NewsCard } from "../../src/index.ts";
import { coverImage } from "../images.ts";
import { Example } from "../section.tsx";

export function NewsCardSection() {
  return (
    <>
      <Example label="Com capa (default)">
        <div className="grid w-full gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <NewsCard
            image={coverImage("#bae6fd", "#0ea5e9")}
            title="Feira de design reúne 200 expositores no centro da cidade"
            href="#/news-card/feira"
            excerpt="Evento segue até domingo, com entrada gratuita e oficinas para crianças."
            date="2026-10-05"
          />
          <NewsCard
            image={coverImage("#d9f99d", "#65a30d")}
            title="Parque ganha nova ciclovia de 3 km"
            href="#/news-card/ciclovia"
            excerpt="Trecho liga a entrada norte ao lago e tem iluminação noturna."
            date={new Date(2026, 8, 28)}
          />
          <NewsCard
            image={coverImage("#e9d5ff", "#9333ea")}
            title="Festival de música anuncia programação"
            href="#/news-card/festival"
            date="2026-09-15"
          />
        </div>
      </Example>
      <Example label="Só texto (simple)">
        <div className="grid w-full gap-4 sm:grid-cols-2">
          <NewsCard
            variant="simple"
            title="Novo horário de atendimento a partir de novembro"
            href="#/news-card/horario"
            excerpt="As lojas passam a abrir às 8h de segunda a sábado."
            date="2026-10-01"
          />
          <NewsCard
            variant="simple"
            title="Resultado do concurso de fotografia"
            href="#/news-card/concurso"
          />
        </div>
      </Example>
    </>
  );
}
