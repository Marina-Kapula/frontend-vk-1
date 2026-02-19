import React, { useState } from "react";
import "./App.css";

// список скульптур (пока статичный)
const sculptures = [
  {
    id: 1,
    title: "Bear",
    imageUrl: "https://via.placeholder.com/400x300",
  },
  {
    id: 2,
    title: "Watcher I",
    imageUrl: "https://via.placeholder.com/400x300",
  },
  {
    id: 3,
    title: "Stone figure",
    imageUrl: "https://via.placeholder.com/400x300",
  },
];

function App() {
  // флаг: вошёл ли владелец
  const [isOwner, setIsOwner] = useState(false);

  // простая фейковая авторизация (для экзамена)
  const handleOwnerLogin = () => {
    const password = window.prompt("Enter owner password:");
    if (password === "admin123") {
      setIsOwner(true);
      alert("Owner logged in");
    } else {
      alert("Wrong password");
    }
  };

  return (
    <div className="page">
      <header className="header">
        <div>
          <h1 className="site-title">Watching sculptures, V.K.</h1>
          <p className="contacts">
            email: <span>volodimir.kapula@gmail.com</span>
            {"  "}post number: <span>77570</span>
            {"  "}address: <span>Jäppilä Huhtimäentie 307</span>
          </p>
        </div>

        {/* кнопка входа владельца */}
        <button className="owner-button" onClick={handleOwnerLogin}>
          Owner login
        </button>
      </header>

      <main>
        <section className="gallery-section">
          <h2 className="section-title">Gallery</h2>

          <div className="cards">
            {sculptures.map((item) => (
              <article className="card" key={item.id}>
                <div className="card-image-wrapper">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="card-image"
                  />
                </div>
                <div className="card-info">
                  <h3 className="card-title">{item.title}</h3>
                </div>
              </article>
            ))}

            {/* кнопка добавления видна только владельцу */}
            {isOwner && (
              <article className="card add-card">
                <button className="add-button">+ Add new sculpture</button>
              </article>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
