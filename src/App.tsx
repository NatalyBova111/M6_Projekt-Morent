// src/App.tsx
import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import "./index.css";

import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { ProtectedRoute } from "./components/ProtectedRoute";

import HomePage from "./pages/Home";
import FilterPage from "./pages/FilterPage";
import CarDetailPage from "./pages/CarDetail";
import CheckoutPage from "./pages/CheckoutPage";
import LoginPage from "./pages/LoginPage";
import MyBookingsPage from "./pages/MyBookingsPage";

function App() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="app">
      <Header searchTerm={searchTerm} onSearchChange={setSearchTerm} />

      <main className="main">
        <div className="container">
          <Routes>
            <Route path="/" element={<HomePage searchTerm={searchTerm} />} />

            <Route
              path="/filter"
              element={<FilterPage searchTerm={searchTerm} />}
            />

            <Route path="/cars/:id" element={<CarDetailPage />} />

            <Route
              path="/checkout/:id"
              element={
                <ProtectedRoute>
                  <CheckoutPage />
                </ProtectedRoute>
              }
            />

            <Route path="/login" element={<LoginPage />} />

            <Route
              path="/my-bookings"
              element={
                <ProtectedRoute>
                  <MyBookingsPage />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default App;
