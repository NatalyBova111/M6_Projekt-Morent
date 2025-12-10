import React, { useState } from "react";
import "./index.css";
import { Header } from "./components/Header";
import HomePage from "./pages/Home";
import { Footer } from "./components/Footer";

function App() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="app">
      <Header searchTerm={searchTerm} onSearchChange={setSearchTerm} />
      <main className="main">
        <div className="container">
          <HomePage searchTerm={searchTerm} />
        </div>
      </main>
            <Footer />
    </div>
  );
}

export default App;

