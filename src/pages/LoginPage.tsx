import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";


const LoginPage: React.FC = () => {
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const err =
      mode === "login"
        ? await signIn(email, password)
        : await signUp(email, password);

    if (err) {
      setError(err);
      return;
    }

    navigate("/");
  };

  return (
    <section className="container" style={{ maxWidth: 420 }}>
      <h1 style={{ marginTop: 24 }}>{mode === "login" ? "Login" : "Sign up"}</h1>

      <form onSubmit={onSubmit} style={{ display: "grid", gap: 12, marginTop: 16 }}>
        <input
          className="checkout-field__input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          type="email"
          required
        />
        <input
          className="checkout-field__input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          type="password"
          required
        />

        {error && <p className="error">{error}</p>}

        <button className="car-card__button" type="submit">
          {mode === "login" ? "Login" : "Create account"}
        </button>

        <button
          type="button"
          className="detail__back"
          onClick={() => setMode(mode === "login" ? "signup" : "login")}
        >
          {mode === "login" ? "No account? Sign up" : "Have an account? Login"}
        </button>
      </form>
    </section>
  );
};

export default LoginPage;
