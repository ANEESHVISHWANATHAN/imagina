import React from "react";
import Header from "./components/Header.tsx";
import Footer from "./components/Footer.tsx";
import Converter from "./components/Converter.tsx";
import "./App.css";

const App: React.FC = () => {
  return (
    <div className="app">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="main-content">
        <section id="home" className="home-section">
          <h2>Welcome to IMAGINA</h2>
          <p>
            Transform your images effortlessly. IMAGINA makes image format
            conversion elegant, fast, and fun — powered by cutting-edge web tech.
          </p>
        </section>

        <section id="convert" className="convert-section">
          <Converter />
        </section>

        <section id="about" className="about-section">
          <h2>About Us</h2>
          <p>
            IMAGINA is a sleek online converter tool designed to bring simplicity
            and beauty to your workflow. Convert images directly in your browser,
            no uploads, no ads — pure creativity.
          </p>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default App;
