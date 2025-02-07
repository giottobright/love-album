import React, { useState, useEffect } from "react";

const DebugConsole = () => {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const originalLog = console.log;
    const originalWarn = console.warn;
    const originalError = console.error;

    const handleLog = (type, ...args) => {
      setLogs((prevLogs) => [...prevLogs.slice(-9), { type, message: args.join(" ") }]);
      originalLog(...args);
    };

    console.log = (...args) => handleLog("log", ...args);
    console.warn = (...args) => handleLog("warn", ...args);
    console.error = (...args) => handleLog("error", ...args);

    return () => {
      console.log = originalLog;
      console.warn = originalWarn;
      console.error = originalError;
    };
  }, []);

  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      maxHeight: "200px",
      backgroundColor: "rgba(0, 0, 0, 0.8)",
      color: "#fff",
      fontSize: "12px",
      overflowY: "auto",
      padding: "10px",
      zIndex: 9999
    }}>
      {logs.map((log, index) => (
        <div key={index} style={{ color: log.type === "error" ? "red" : log.type === "warn" ? "yellow" : "white" }}>
          {log.message}
        </div>
      ))}
    </div>
  );
};

export default DebugConsole;
