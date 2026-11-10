export default function App() {
  return (
    <main style={{
      minHeight: "100vh",
      display: "grid",
      placeItems: "center",
      background: "linear-gradient(135deg, #0f172a, #1d4ed8)",
      color: "white",
      fontFamily: "Arial, sans-serif",
      textAlign: "center",
      padding: "2rem"
    }}>
      <div>
        <h1 style={{ fontSize: "3rem", marginBottom: "1rem" }}>JanaSetu</h1>
        <p style={{ fontSize: "1.1rem", maxWidth: "600px", lineHeight: 1.6 }}>
          Welcome to your app. This is a real working React component with a clean layout,
          proper styling, and a usable landing page.
        </p>
        <button
          style={{
            marginTop: "1.5rem",
            padding: "0.8rem 1.5rem",
            border: "none",
            borderRadius: "999px",
            background: "#f8fafc",
            color: "#0f172a",
            fontWeight: 700,
            cursor: "pointer"
          }}
          onClick={() => alert("Welcome to JanaSetu!")}
        >
          Get Started
        </button>
      </div>
    </main>
  );
}
