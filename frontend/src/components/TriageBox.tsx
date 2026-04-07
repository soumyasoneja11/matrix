import { useState } from "react";
import { getTriageResult } from "../api/triage";

export default function TriageBox() {

  const [input, setInput] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!input.trim()) return;

    setLoading(true);
    const res = await getTriageResult(input);
    setResult(res);
    setLoading(false);
  };

  const getColor = () => {
    if (result === "CRITICAL") return "red";
    if (result === "URGENT") return "orange";
    if (result === "STANDARD") return "green";
    return "white";
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>

      <h1>🧠 AI Triage System</h1>

      <textarea
        rows={4}
        cols={50}
        placeholder="Enter patient symptoms..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        style={{ padding: "10px", fontSize: "16px" }}
      />

      <br /><br />

      <button onClick={handleSubmit} style={{ padding: "10px 20px" }}>
        Analyze
      </button>

      <br /><br />

      {loading && <p>Processing...</p>}

      {result && (
        <h2 style={{ color: getColor() }}>
          {result}
        </h2>
      )}

    </div>
  );
}