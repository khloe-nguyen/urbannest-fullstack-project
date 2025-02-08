const LoadingPage = () => {
  return (
    <div
      style={{
        overflow: "hidden", // Prevent any unwanted overflow
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "white",
        position: "absolute",
        width: "100%",
        pointerEvents: "none",
      }}
    >
      <div
        className="spinner"
        style={{
          border: "8px solid #f3f3f3",
          borderTop: "8px solid #ff0000",
          borderRadius: "50%",
          width: "120px",
          height: "120px",
          animation: "spin 1s linear infinite",
        }}
      ></div>
      <style>{`
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `}</style>
    </div>
  );
};

export default LoadingPage;
