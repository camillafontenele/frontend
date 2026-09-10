import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./routes/ProtectedRoute";
import CreateDeck from "./pages/CreateDeck";
import DeckDetails from "./pages/DeckDetails";
import CreateCard from "./pages/CreateCard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/decks/new" element={<CreateDeck />} />
        <Route path="/decks/:deckId" element={<DeckDetails />} />
        <Route path="/decks/:deckId/cards/new" element={<CreateCard />} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;
