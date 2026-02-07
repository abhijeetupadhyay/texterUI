import { useState } from "react";

export default function App() {
  const [text, setText] = useState("");
  const [contentId, setContentId] = useState("");
  const [loading, setLoading] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalText, setModalText] = useState("");

  const openModal = (title, text) => {
    setModalTitle(title);
    setModalText(text);
    setModalOpen(true);
  };

  const closeModal = () => setModalOpen(false);

  // ✅ UPDATED HERE
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(modalText);
      alert("Copied to clipboard!");
      closeModal(); // 👈 close modal after copy
    } catch {
      alert("Failed to copy");
    }
  };

  const uploadContent = async () => {
    if (!text.trim()) return alert("Please enter some text!");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:8080/api/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(text),
      });

      const data = await res.json();
      openModal("Content Uploaded 🎉", data.id);
      setText("");
    } catch {
      alert("Error uploading content");
    }
    setLoading(false);
  };

  const fetchContent = async () => {
    if (!contentId.trim()) return alert("Please enter Content ID!");
    setLoading(true);

    try {
      const res = await fetch(
        `http://localhost:8080/api/content/${contentId}`,
        { headers: { "Content-Type": "application/json" } }
      );

      const data = await res.json();
      openModal("Fetched Content 📄", data.content);
    } catch {
      alert("Error fetching content");
    }
    setLoading(false);
  };

  return (
    <>
      <div className="app-bg">
        <div className="glass-card">
          <h1 className="title">✨ Texter</h1>
          <p className="subtitle">Upload & retrieve text securely</p>

          {/* Upload */}
          <div className="section">
            <label className="label">Enter Content</label>
            <textarea
              className="input textarea"
              rows="4"
              placeholder="Enter text here. No pressure. Shakespeare started somewhere."
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <button onClick={uploadContent} className="btn primary">
              {loading ? "Uploading..." : "Upload Content"}
            </button>
          </div>

          {/* Fetch */}
          <div className="section">
            <label className="label">Fetch by Content ID</label>
            <input
              className="input"
              placeholder="Got an ID? Drop it here."
              value={contentId}
              onChange={(e) => setContentId(e.target.value)}
            />
            <button onClick={fetchContent} className="btn secondary">
              {loading ? "Fetching..." : "Get Content"}
            </button>
          </div>
        </div>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="modal-backdrop">
          <div className="modal">
            <h2 className="modal-title">{modalTitle}</h2>
            <div className="modal-content">{modalText}</div>
            <div className="modal-actions">
              <button onClick={copyToClipboard} className="btn success">
                📋 Copy
              </button>
              <button onClick={closeModal} className="btn danger">
                ❌ Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
