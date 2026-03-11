import React, { useState, useEffect } from "react";
import "./App.css";

const API_BASE = "http://localhost:4000";

function App() {
  const [isOwner, setIsOwner] = useState(false);

  const [sculptures, setSculptures] = useState([]);
  const [nextId, setNextId] = useState(4);

  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newFiles, setNewFiles] = useState([]);

  const [currentIndex, setCurrentIndex] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // при загрузке тянем список скульптур с бекенда
  useEffect(() => {
    const fetchSculptures = async () => {
      try {
        const response = await fetch(`${API_BASE}/api/sculptures`);
        if (!response.ok) {
          console.error("Failed to load sculptures, status:", response.status);
          return;
        }
        const data = await response.json();
        setSculptures(data);

        const maxId = data.reduce(
          (max, s) => (s.id > max ? s.id : max),
          0
        );
        setNextId(maxId + 1);
      } catch (error) {
        console.error("Failed to load sculptures", error);
      }
    };

    fetchSculptures();
  }, []);

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
    setNewFiles([]);
    setCurrentIndex(null);
    setCurrentImageIndex(0);
  };

  const handleOpenAddForm = () => {
    if (!isOwner) return;
    setIsAdding(true);
    setNewTitle("");
    setNewFiles([]);
  };

  const handleCancelAdd = () => {
    setIsAdding(false);
    setNewTitle("");
    setNewFiles([]);
  };

  // сохранение НОВОЙ скульптуры с реальными файлами через FormData
  const handleSaveNew = async (event) => {
    event.preventDefault();
    if (!newTitle || newFiles.length === 0) {
      alert("Please add title and at least one image");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("title", newTitle);
      newFiles.forEach((file) => {
        formData.append("images", file); // "images" — то же имя, что в upload.array
      });

      const response = await fetch(`${API_BASE}/api/sculptures`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        let errMsg = "Error while saving sculpture";
        try {
          const err = await response.json();
          console.error("Failed to create sculpture", err);
          if (err && err.error) errMsg = err.error;
        } catch {
          // ignore
        }
        alert(errMsg);
        return;
      }

      const created = await response.json();

      setSculptures((prev) => [...prev, created]);
      setNextId((id) => id + 1);
      setIsAdding(false);
      setNewTitle("");
      setNewFiles([]);
    } catch (error) {
      console.error("Upload request failed", error);
      alert("Network error while uploading");
    }
  };

  const handleDelete = async (id) => {
    if (!isOwner) return;
    const ok = window.confirm("Delete this sculpture?");
    if (!ok) return;

    try {
      const response = await fetch(`${API_BASE}/api/sculptures/${id}`, {
        method: "DELETE",
      });

      if (!response.ok && response.status !== 204) {
        console.error("Failed to delete, status:", response.status);
        alert("Error while deleting sculpture");
        return;
      }

      setSculptures((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Delete request failed", error);
      alert("Network error while deleting");
    }
  };

  const handleOpenViewer = (index) => {
    setCurrentIndex(index);
    setCurrentImageIndex(0);
  };

  const handleCloseViewer = () => {
    setCurrentIndex(null);
    setCurrentImageIndex(0);
  };

  const handleNextImage = () => {
    if (currentIndex === null) return;
    const item = sculptures[currentIndex];
    if (!item || item.images.length === 0) return;

    setCurrentImageIndex((prev) => {
      const last = item.images.length - 1;
      return prev === last ? 0 : prev + 1;
    });
  };

  const handlePrevImage = () => {
    if (currentIndex === null) return;
    const item = sculptures[currentIndex];
    if (!item || item.images.length === 0) return;

    setCurrentImageIndex((prev) => {
      const last = item.images.length - 1;
      return prev === 0 ? last : prev - 1;
    });
  };

  const activeSculpture =
    currentIndex !== null ? sculptures[currentIndex] : null;

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
            {sculptures.map((item, index) => (
              <article
                className="card"
                key={item.id}
                onClick={() => handleOpenViewer(index)}
              >
                <div className="card-image-wrapper">
                  <img
                    src={item.images[0]}
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
                Images:
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) =>
                    setNewFiles(Array.from(e.target.files))
                  }
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

        {activeSculpture && (
          <section className="viewer">
            <button className="viewer-close" onClick={handleCloseViewer}>
              ✕
            </button>

            <div className="viewer-inner">
              <button className="viewer-arrow" onClick={handlePrevImage}>
                ‹
              </button>

              <div className="viewer-image-wrapper">
                <img
                  src={activeSculpture.images[currentImageIndex]}
                  alt={activeSculpture.title}
                  className="viewer-image"
                />
              </div>

              <button className="viewer-arrow" onClick={handleNextImage}>
                ›
              </button>
            </div>

            <h3 className="viewer-title">{activeSculpture.title}</h3>
            <p className="viewer-description">
              Here will be a longer description of the sculpture.
            </p>

            {activeSculpture.images.length > 1 && (
              <p className="viewer-counter">
                {currentImageIndex + 1}/{activeSculpture.images.length}
              </p>
            )}
          </section>
        )}
      </main>
    </div>
  );
}

export default App;
