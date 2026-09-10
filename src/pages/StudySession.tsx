import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { API_URL } from "../services/api";
import { Button } from "@/components/ui/button";

type Card = {
  id: string;
  deckId: string;
  front: string;
  back: string;
  createdAt: string;
};

function StudySession() {
  const { deckId, mode } = useParams();

  const [cards, setCards] = useState<Card[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAnswer, setShowAnswer] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isReviewing, setIsReviewing] = useState(false);
  const [error, setError] = useState("");
  const [loadError, setLoadError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    async function loadAvailableCards() {
      setLoadError("");

      try {
        const token = localStorage.getItem("token");

        const response = await fetch(
          `${API_URL}/decks/${deckId}/reviews/available?mode=${mode}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (!response.ok) {
          setLoadError("Não foi possível carregar os cards.");
          return;
        }

        const data = await response.json();

        setCards(data);
      } catch {
        setLoadError("Não foi possível conectar ao servidor.");
      } finally {
        setIsLoading(false);
      }
    }

    loadAvailableCards();
  }, [deckId, mode]);

  if (isLoading) {
    return <p>Carregando...</p>;
  }

  const currentCard = cards[currentIndex];
  const currentPosition = currentIndex + 1;
  const totalCards = cards.length;
  const progress = totalCards > 0 ? (currentPosition / totalCards) * 100 : 0;

  const sessionFinished = cards.length > 0 && currentIndex >= cards.length;

  async function handleReview(rating: string) {
    if (!currentCard) return;
    if (isReviewing) return;

    setError("");
    setIsReviewing(true);

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${API_URL}/cards/${currentCard.id}/reviews`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            rating,
          }),
        },
      );

      if (!response.ok) {
        setError("Não foi possível registrar sua resposta.");
        return;
      }

      setShowAnswer(false);
      setCurrentIndex((current) => current + 1);
    } catch {
      setError("Não foi possível conectar ao servidor.");
    } finally {
      setIsReviewing(false);
    }
  }

  return (
    <main>
      <h1>Sessão de estudo</h1>

      {sessionFinished ? (
        <section>
          <h2>Sessão concluída 🎉</h2>

          <p>Você revisou todos os cards disponíveis deste modo.</p>

          <Button
            variant="primary"
            onClick={() => navigate(`/decks/${deckId}`)}
          >
            Voltar ao baralho
          </Button>
        </section>
      ) : !currentCard ? (
        <p>Nenhum card disponível para estudar agora.</p>
      ) : (
        <section className="space-y-6">
          <div className="space-y-2">
            <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full bg-primary transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>

            <p className="text-caption text-muted-foreground">
              {currentPosition} de {totalCards}
            </p>
          </div>

          <div className="rounded-2xl bg-card p-6 shadow-sm">
            <h2 className="text-h2">{currentCard.front}</h2>

            {showAnswer && (
              <p className="mt-6 text-body-lg">{currentCard.back}</p>
            )}
          </div>

          {error && <p className="text-body text-danger">{error}</p>}

          {!showAnswer ? (
            <Button
              variant="primary"
              className="w-full font-bold"
              disabled={isReviewing}
              onClick={() => setShowAnswer(true)}
            >
              Mostrar resposta
            </Button>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                className="border-danger text-danger"
                disabled={isReviewing}
                onClick={() => handleReview("AGAIN")}
              >
                Não lembro
              </Button>

              <Button
                variant="outline"
                className="border-orange-400 text-orange-500"
                disabled={isReviewing}
                onClick={() => handleReview("HARD")}
              >
                Difícil
              </Button>

              <Button
                variant="outline"
                className="border-info text-info"
                disabled={isReviewing}
                onClick={() => handleReview("GOOD")}
              >
                Bom
              </Button>

              <Button
                variant="outline"
                className="border-success text-success"
                disabled={isReviewing}
                onClick={() => handleReview("EASY")}
              >
                Fácil
              </Button>
            </div>
          )}
        </section>
      )}
    </main>
  );
}

export default StudySession;
