export default function NotFound() {
  return (
    <main
      style={{
        alignItems: "center",
        background: "#080808",
        color: "#f0f0ee",
        display: "flex",
        justifyContent: "center",
        minHeight: "100vh",
        padding: "32px",
        textAlign: "center"
      }}
    >
      <div>
        <p style={{ color: "#888", fontSize: "12px", letterSpacing: "0.18em", textTransform: "uppercase" }}>
          404
        </p>
        <h1 style={{ fontSize: "40px", fontWeight: 500, margin: "12px 0" }}>Page not found</h1>
        <p style={{ color: "#c8c8c6", lineHeight: 1.8 }}>
          The page you were looking for does not exist.
        </p>
      </div>
    </main>
  );
}
