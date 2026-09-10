import { useEffect, useState } from "react";
import { API_URL } from "../services/api";
import { Button } from "@/components/ui/button";
import memDeckLogo from "@/assets/images/logos/memdeck-logo-principal.svg";
import { useNavigate } from "react-router-dom";
import {
  BarChart3,
  Bell,
  ChevronRight,
  Compass,
  Flame,
  House,
  Layers3,
  LibraryBig,
  Menu,
  MoreVertical,
  UserRound,
  Zap,
} from "lucide-react";

type Deck = {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
};

function Dashboard() {
  const [decks, setDecks] = useState<Deck[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadDecks() {
      const token = localStorage.getItem("token");

      const response = await fetch(`${API_URL}/decks`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      setDecks(data);
      setIsLoading(false);
    }

    loadDecks();
  }, []);

  if (isLoading) {
    return <p>Carregando...</p>;
  }
  const hasDecks = decks.length > 0;

  return (
    <main>
      {hasDecks ? (
        <section>
          <h2>Meus baralhos</h2>

          {decks.map((deck) => (
            <button
              key={deck.id}
              type="button"
              onClick={() => navigate(`/decks/${deck.id}`)}
            >
              <h3>{deck.name}</h3>

              {deck.description && <p>{deck.description}</p>}
            </button>
          ))}
        </section>
      ) : (
        <section>
          <h2>Você ainda não tem baralhos</h2>
          <p>Crie seu primeiro baralho para começar a estudar.</p>

          <Button variant="primary" onClick={() => navigate("/decks/new")}>
            Criar primeiro baralho
          </Button>
        </section>
      )}
    </main>
  );

  /*return (
    <main className="min-h-screen bg-background px-4 py-3 pb-24 text-foreground">
      <div className="mx-auto max-w-md">
        <header className="mb-5 flex items-center justify-between">
          <button
            aria-label="Abrir menu"
            className="rounded-xl p-2 hover:bg-white"
          >
            <Menu className="size-7" strokeWidth={2.8} />
          </button>
          <img src={memDeckLogo} alt="MemDeck" className="h-9 w-auto" />
          <button
            aria-label="Notificações"
            className="relative rounded-xl p-2 hover:bg-white"
          >
            <Bell className="size-7" strokeWidth={2.6} />
            <span className="absolute right-1.5 top-1.5 size-3 rounded-full border-2 border-[#f6f8ff] bg-red-500" />
          </button>
        </header>

        <section className="mb-5">
          <h1 className="text-[28px] font-extrabold leading-tight tracking-tight">
            Olá, Camilla! <span aria-hidden="true">👋</span>
          </h1>
          <p className="mt-0.5 text-lg font-semibold text-slate-500">
            Vamos estudar hoje?
          </p>
        </section>

        <section className="relative mb-5 overflow-hidden rounded-[25px] bg-gradient-to-br from-[#7436ef] via-[#6425ec] to-[#4f21d7] p-5 text-white shadow-[0_12px_25px_rgba(91,41,220,0.2)]">
          <div className="absolute -right-8 -top-9 size-32 rounded-full bg-white/10" />
          <div className="absolute -bottom-12 right-14 size-28 rounded-full bg-violet-400/20" />
          <MoreVertical className="absolute right-4 top-4 size-6 text-white/90" />
          <div className="relative flex items-center gap-3">
            <Zap
              className="size-12 fill-[#ffde22] text-slate-900"
              strokeWidth={2.5}
            />
            <div>
              <p className="text-5xl font-black leading-none">24</p>
              <p className="mt-1 text-base font-bold text-violet-100">
                cards para revisar hoje
              </p>
            </div>
          </div>
          <Button
            variant="primary"
            className="relative mt-4 w-full font-extrabold"
          >
            Estudar agora
            <ChevronRight className="size-6" strokeWidth={3} />
          </Button>
        </section>

        <section className="mb-5 grid grid-cols-3 gap-3">
          <StatCard
            icon={<Layers3 />}
            value={decks.length}
            label="Baralhos"
            color="text-primary"
          />
          <StatCard
            icon={<BarChart3 />}
            value="178"
            label="Total de cards"
            color="text-primary"
          />
          <StatCard
            icon={<Flame />}
            value="7 dias"
            label="Seguindo"
            color="text-danger"
          />
        </section>

        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-xl font-extrabold">Seus baralhos</h2>
            <button className="flex items-center text-sm font-extrabold text-primary">
              Ver todos <ChevronRight className="size-4" strokeWidth={3} />
            </button>
          </div>

          {displayedDecks.length > 0 ? (
            <div className="space-y-3">
              {displayedDecks.map((deck, index) => (
                <DeckCard key={deck.id} deck={deck} index={index} />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl bg-card px-5 py-8 text-center shadow-sm">
              <LibraryBig className="mx-auto size-10 text-primary" />

              <h3 className="text-h3 mt-4">Você ainda não tem baralhos</h3>

              <p className="text-body mt-2 text-muted-foreground">
                Crie seu primeiro baralho para começar a estudar.
              </p>

              <Button variant="primary" className="mt-5 w-full font-bold">
                Criar primeiro baralho
              </Button>
            </div>
          )}
        </section>
      </div>
      <nav
        aria-label="Navegação principal"
        className="fixed inset-x-0 bottom-0 border-t border-slate-100 bg-white/95 px-4 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 backdrop-blur"
      >
        <div className="mx-auto grid max-w-md grid-cols-5">
          <NavItem icon={<House />} label="Início" active />
          <NavItem icon={<LibraryBig />} label="Baralhos" />
          <NavItem icon={<Compass />} label="Explorar" />
          <NavItem icon={<BarChart3 />} label="Estatísticas" />
          <NavItem icon={<UserRound />} label="Perfil" />
        </div>
      </nav>
    </main>
  );
}

function StatCard({
  icon,
  value,
  label,
  color,
}: {
  icon: React.ReactNode;
  value: string | number;
  label: string;
  color: string;
}) {
  return (
    <article className="flex min-h-27 flex-col items-center justify-center rounded-2xl bg-white px-1 text-center shadow-[0_4px_15px_rgba(69,76,130,0.08)]">
      <span className={`${color} [&>svg]:size-8 [&>svg]:stroke-[3]`}>
        {icon}
      </span>
      <strong className="mt-1 text-xl leading-none">{value}</strong>
      <span className="mt-1 text-xs font-bold text-slate-500">{label}</span>
    </article>
  );
}

function DeckCard({ deck, index }: { deck: Deck; index: number }) {
  const isFirst = index % 2 === 0;
  return (
    <article className="flex items-center gap-3 rounded-2xl bg-white px-4 py-3 shadow-[0_4px_15px_rgba(69,76,130,0.08)]">
      <div
        className={`flex size-12 shrink-0 items-center justify-center rounded-full text-2xl shadow-sm ${isFirst ? "bg-red-500" : "bg-emerald-400"}`}
      >
        {isFirst ? "🇬🇧" : "📖"}
      </div>
      <div className="min-w-0 flex-1">
        <h3 className="truncate text-lg font-extrabold leading-tight">
          {deck.name}
        </h3>
        <p className="text-sm font-bold text-slate-500">
          {deck.description || "86 cards"}
        </p>
        <p className="text-sm font-extrabold text-red-500">
          {isFirst ? "12" : "8"} para revisar
        </p>
        <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
          <div className="h-full w-2/3 rounded-full bg-[#7441ee]" />
        </div>
      </div>
      <button
        aria-label={`Opções do baralho ${deck.name}`}
        className="self-start p-1 text-slate-700"
      >
        <MoreVertical className="size-5" strokeWidth={3} />
      </button>
    </article>
  );
}

function NavItem({
  icon,
  label,
  active = false,
}: {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}) {
  return (
    <button
      className={`flex flex-col items-center gap-1 py-1 text-[11px] font-extrabold ${active ? "text-primary" : "text-slate-500"}`}
    >
      <span className="[&_svg]:size-5 [&_svg]:stroke-[2.8]">{icon}</span>
      {label}
    </button>
  );

*/
}

export default Dashboard;
