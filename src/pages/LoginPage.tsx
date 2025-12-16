// src/pages/LoginPage.tsx
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

type LocationState = {
  from?: {
    pathname: string;
  };
};

const LoginPage: React.FC = () => {
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const state = location.state as LocationState | null;
  const from = state?.from?.pathname || "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const err =
      mode === "login"
        ? await signIn(email, password)
        : await signUp(email, password);

    setSubmitting(false);

    if (err) {
      setError(err);
      return;
    }

    // ✅ UX: возвращаем туда, откуда пришли (например, /checkout/:id)
    navigate(from, { replace: true });
  };

  return (
    <section className="container" style={{ maxWidth: 420 }}>
      <h1 style={{ marginTop: 24 }}>
        {mode === "login" ? "Login" : "Sign up"}
      </h1>

      <form
        onSubmit={onSubmit}
        style={{ display: "grid", gap: 12, marginTop: 16 }}
      >
        <input
          className="checkout-field__input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          type="email"
          required
          autoComplete="email"
        />

        <input
          className="checkout-field__input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          type="password"
          required
          autoComplete={mode === "login" ? "current-password" : "new-password"}
        />

        {error && <p className="error">{error}</p>}

        <button className="car-card__button" type="submit" disabled={submitting}>
          {submitting
            ? "Please wait..."
            : mode === "login"
            ? "Login"
            : "Create account"}
        </button>

        <button
          type="button"
          className="detail__back"
          onClick={() => {
            setMode((m) => (m === "login" ? "signup" : "login"));
            setError(null);
          }}
        >
          {mode === "login" ? "No account? Sign up" : "Have an account? Login"}
        </button>
      </form>
    </section>
  );
};

export default LoginPage;
