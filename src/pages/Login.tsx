import { useState } from "react";
import { API_URL } from "../services/api";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

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
    <div className="flex min-h-screen flex-col gap-4 p-6">
      <Button>Botão primário</Button>

      <Button variant="secondary">Botão secundário</Button>

      <Button variant="outline">Botão outline</Button>

      <Button variant="text">Botão texto</Button>
    </div>
  );
}

export default Login;
