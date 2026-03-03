import React, { useState } from "react";
import "./App.css";

// стартовый список скульптур
const initialSculptures = [
  { id: 1, title: "Bear", imageUrl: "https://via.placeholder.com/800x600" },
  { id: 2, title: "Watcher I", imageUrl: "https://via.placeholder.com/800x600" },
  { id: 3, title: "Stone figure", imageUrl: "https://via.placeholder.com/800x600" },
];

function App() {
  const [isOwner, setIsOwner] = useState(false);
  const [sculptures, setSculptures] = useState(initialSculptures);
  const [nextId, setNextId] = useState(4);

  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newFile, setNewFile] = useState(null);

  const [activeSculpture, setActiveSculpture] = useState(null);

  const handleOwnerLogin = () => {
    if (isOwner) return;

    const password = window.prompt("Enter owner password:");
    if (password === "admin123") {
      setIsOwner(true);
      alert("Owner logged in");
    } else {
      alert("Wrong password");
    }
  };

  const handleOwnerLogout = () => {
    setIsOwner(false);
    setIsAdding(false);
    setNewTitle("");
    setNewFile(null);
    setActiveSculpture(null);
  };

  const handleOpenAddForm = () => {
    if (!isOwner) return;
    setIsAdding(true);
    setNewTitle("");
    setNewFile(null);
  };

  const handleCancelAdd = () => {
    setIsAdding(false);
    setNewTitle("");
    setNewFile(null);
  };

  const handleSaveNew = (event) => {
    event.preventDefault();
    if (!newTitle || !newFile) {
      alert("Please add title and image");
      return;
    }

    const imageUrl = URL.createObjectURL(newFile);

    const newSculpture = {
      id: nextId,
      title: newTitle,
      imageUrl,
    };

    setSculptures((prev) => [...prev, newSculpture]);
    setNextId((id) => id + 1);
    setIsAdding(false);
    setNewTitle("");
    setNewFile(null);
  };

  const handleDelete = (id) => {
    if (!isOwner) return;
    const ok = window.confirm("Delete this sculpture?");
    if (!ok) return;
    setSculptures((prev) => prev.filter((item) => item.id !== id));
  };

  const handleCloseViewer = () => {
    setActiveSculpture(null);
  };

  return (
    <div className="page">
      <header className="header">
        <div className="header-text">
          <h1 className="site-title">Watching sculptures, V.K.</h1>
          <p className="contacts">
            email: <span>volodimir.kapula@gmail.com</span>{" "}
            post number: <span>77570</span>{" "}
            address: <span>Jäppilä Huhtimäentie 307</span>
          </p>
        </div>

        <div className="owner-controls">
          {isOwner ? (
            <>
              <span className="owner-status">Owner: logged in</span>
              <button className="owner-button" onClick={handleOwnerLogout}>
                Logout
              </button>
            </>
          ) : (
            <button className="owner-button" onClick={handleOwnerLogin}>
              Owner login
            </button>
          )}
        </div>
      </header>

      <main className="main">
        <section className="gallery-section">
          <h2 className="section-title">Gallery</h2>

          <div className="cards">
            {sculptures.map((item) => (
              <article
                className="card"
                key={item.id}
                onClick={() => setActiveSculpture(item)}
              >
                <div className="card-image-wrapper">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="card-image"
                  />
                </div>
                <div className="card-info">
                  <h3 className="card-title">{item.title}</h3>
                  {isOwner && (
                    <button
                      className="delete-button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(item.id);
                      }}
                    >
                      Delete
                    </button>
                  )}
                </div>
              </article>
            ))}

            {isOwner && !isAdding && (
              <article className="card add-card">
                <button className="add-button" onClick={handleOpenAddForm}>
                  + Add new sculpture
                </button>
              </article>
            )}
          </div>

          {isOwner && isAdding && (
            <form className="add-form" onSubmit={handleSaveNew}>
              <h3>Add new sculpture</h3>
              <label>
                Title:
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                />
              </label>
              <label>
                Image:
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setNewFile(e.target.files[0] || null)}
                />
              </label>
              <div className="add-form-buttons">
                <button type="submit">Save</button>
                <button type="button" onClick={handleCancelAdd}>
                  Cancel
                </button>
              </div>
            </form>
          )}
        </section>

        {/* БОЛЬШОЙ БЛОК СНИЗУ — ПОЯВЛЯЕТСЯ ТОЛЬКО ЕСЛИ ЧТО-ТО ВЫБРАНО */}
        {activeSculpture && (
          <section className="viewer">
            <button className="viewer-close" onClick={handleCloseViewer}>
              ✕
            </button>
            <div className="viewer-image-wrapper">
              <img
                src={activeSculpture.imageUrl}
                alt={activeSculpture.title}
                className="viewer-image"
              />
            </div>
            <h3 className="viewer-title">{activeSculpture.title}</h3>
            <p className="viewer-description">
              Here will be a longer description of the sculpture.
            </p>
          </section>
        )}
      </main>
    </div>
  );
}

export default App;
