import { useState } from "react";
import { API_URL } from "../services/api";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
    const navigate = useNavigate();

  async function handleLogin(event: React.FormEvent) {
    event.preventDefault();

    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    const data = await response.json();

    if (response.ok) {
        localStorage.setItem("token", data.token);
        navigate("/dashboard");
    }

    console.log(data);
  }

  return (
    <form onSubmit={handleLogin}>
      <h1>Entrar</h1>

      <input
        type="email"
        placeholder="E-mail"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
      />

      <input
        type="password"
        placeholder="Senha"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
      />

      <button type="submit">Entrar</button>
    </form>
  );
}

export default Login;