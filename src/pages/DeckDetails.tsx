import { useParams } from "react-router-dom";
import { API_URL } from "../services/api";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

type Card = {
  id: string;
  deckId: string;
  front: string;
  back: string;
  createdAt: string;
};

function DeckDetails() {
  const { deckId } = useParams();

  const [cards, setCards] = useState<Card[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    async function loadCards() {
      const token = localStorage.getItem("token");

      const response = await fetch(`${API_URL}/decks/${deckId}/cards`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      setCards(data);
      setIsLoading(false);
    }

    loadCards();
  }, [deckId]);

  if (isLoading) {
    return <p>Carregando...</p>;
  }

  return (
    <main>
      <h1>Detalhes do baralho</h1>
      <Button
        variant="primary"
        onClick={() => navigate(`/decks/${deckId}/study`)}
      >
        Estudar
      </Button>
      {cards.length === 0 ? (
        <p>Este baralho ainda não possui cards.</p>
      ) : (
        <div>
          {cards.map((card) => (
            <div key={card.id}>
              <h2>{card.front}</h2>
              <p>{card.back}</p>
            </div>
          ))}
        </div>
      )}
      <Button
        variant="primary"
        onClick={() => navigate(`/decks/${deckId}/cards/new`)}
      >
        Adicionar card
      </Button>
    </main>
  );
}

export default DeckDetails;
