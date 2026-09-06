import { useEffect, useState } from "react";
import { API_URL } from "../services/api";

type Deck = {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
};

function Dashboard() {
  const [decks, setDecks] = useState<Deck[]>([]);

  useEffect(() => {
    async function loadDecks() {
      const token = localStorage.getItem("memdeck_token");

      const response = await fetch(`${API_URL}/decks`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      setDecks(data);
    }

    loadDecks();
  }, []);

  return (
    <main>
      <h1>Meus baralhos</h1>

      {decks.map((deck) => (
        <div key={deck.id}>
          <h2>{deck.name}</h2>
          <p>{deck.description}</p>
        </div>
      ))}
    </main>
  );
}

export default Dashboard;