import axios from "axios";
import { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const COLORS = {
  bg: "#0a0e1a",
  panel: "#0d1220",
  panelAlt: "#11162a",
  border: "#1c2333",
  blue: "#2563eb",
  blueLight: "#60a5fa",
  cyan: "#7dd3fc",
  green: "#22c55e",
  greenDim: "#16a34a",
  text: "#e2e8f0",
  textDim: "#94a3b8",
  textFaint: "#64748b",
};

function AgentCard({ title, content }) {
  if (!content) return null;

  const copyContent = () => {
    navigator.clipboard.writeText(content);
  };

  return (
    <div
      style={{
        background: COLORS.panel,
        border: `1px solid ${COLORS.border}`,
        borderRadius: "16px",
        padding: "28px 32px",
        marginTop: "20px",
        boxShadow: "0 0 30px rgba(37,99,235,0.08)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <h2
          style={{
            color: COLORS.blueLight,
            margin: 0,
            fontSize: "1.4rem",
            fontWeight: 700,
          }}
        >
          {title}
        </h2>

        <button
          onClick={copyContent}
          style={{
            background: COLORS.blue,
            border: "none",
            color: "white",
            padding: "8px 16px",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: 500,
          }}
        >
          📋 Copy
        </button>
      </div>

      <div
        className="markdown-content"
        style={{
          color: COLORS.text,
          lineHeight: "1.8",
          fontSize: "15px",
        }}
      >
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            h1: ({ children }) => (
              <h1 style={{ color: COLORS.cyan }}>{children}</h1>
            ),
            h2: ({ children }) => (
              <h2 style={{ color: COLORS.blueLight }}>{children}</h2>
            ),
            p: ({ children }) => (
              <p style={{ marginBottom: "16px", lineHeight: "1.9" }}>
                {children}
              </p>
            ),
            li: ({ children }) => (
              <li style={{ marginBottom: "8px" }}>{children}</li>
            ),
          }}
        >
          {content}
        </ReactMarkdown>
      </div>
    </div>
  );
}

function App() {
  const [idea, setIdea] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [activeTab, setActiveTab] = useState("product");
  const [agentProgress, setAgentProgress] = useState([]);
  const [history, setHistory] = useState([]);
  const [showInputForm, setShowInputForm] = useState(true);
  const [historySearch, setHistorySearch] = useState("");

  const ideaInputRef = useRef(null);
  const historyRef = useRef(null);

  const agents = [
    "📦 Product Manager",
    "🏗 Architect",
    "🔍 Reviewer",
    "⚙ Backend Engineer",
    "🎨 Frontend Engineer",
  ];

  useEffect(() => {
    const savedHistory =
      JSON.parse(localStorage.getItem("projectHistory")) || [];
    setHistory(savedHistory);
  }, []);

  const generateProject = async () => {
    if (!idea.trim()) {
  alert("Please enter a startup idea");
  return;
}

    setShowInputForm(false);
    setLoading(true);
    setResult(null);
    setAgentProgress([]);

    agents.forEach((agent, index) => {
      setTimeout(() => {
        setAgentProgress((prev) => [...prev, agent]);
      }, index * 1000);
    });

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/generate-project`,
        { idea }
      );

      setAgentProgress(agents);
      const newProject = {
        idea,
        result: response.data,
        createdAt: new Date().toISOString(),
      };

      const updatedHistory = [newProject, ...history].slice(0, 20);

      localStorage.setItem("projectHistory", JSON.stringify(updatedHistory));

      setHistory(updatedHistory);
      setResult(response.data);
    } catch (error) {
      console.error(error);
      alert(
  "Generation failed. Please try again in a few moments."
);
    }

    setLoading(false);
  };

  const handleNewProject = () => {
  window.open(
    `${window.location.origin}?project=${Date.now()}`,
    "_blank"
  );
};

  const handleHistoryClick = () => {
    historyRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const clearHistory = () => {
  if (
    window.confirm(
      "Are you sure you want to clear all project history?"
    )
  ) {
    localStorage.removeItem("projectHistory");
    setHistory([]);
  }
};

  const openHistoryItem = (project) => {
    setResult(project.result);
    setIdea(project.idea);
    setAgentProgress(agents);
    setShowInputForm(false);
  };

  const downloadPlan = () => {
    if (!result) return;

    const content = `
# Product Manager

${result.product_plan}

# Architect

${result.architecture_plan}

# Reviewer

${result.review_notes}

# Backend Engineer

${result.backend_plan}

# Frontend Engineer

${result.frontend_plan}

# QA Engineer

${result.qa_plan}
`;

    const blob = new Blob([content], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");


    a.href = url;
    a.download = "startup-plan.md";

    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    URL.revokeObjectURL(url);
  };

  const tabs = [
    { key: "product", label: "📦 Product", content: result?.product_plan },
    { key: "architect", label: "🏗 Architect", content: result?.architecture_plan },
    { key: "reviewer", label: "🔍 Reviewer", content: result?.review_notes },
    { key: "backend", label: "⚙ Backend", content: result?.backend_plan },
    { key: "frontend", label: "🎨 Frontend", content: result?.frontend_plan },
  ];

  const activeContent = tabs.find((tab) => tab.key === activeTab);
  const allDone = agentProgress.length === agents.length;
  const filteredHistory = history.filter((p) =>
    p.idea.toLowerCase().includes(historySearch.toLowerCase())
  );

  return (
    <div
      style={{
        minHeight: "100vh",
        background: COLORS.bg,
        color: "white",
        fontFamily: "Inter, sans-serif",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "16px 32px",
          borderBottom: `1px solid ${COLORS.border}`,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <span style={{ fontSize: "24px" }}>🚀</span>
          <span style={{ fontSize: "20px", fontWeight: 700, color: "white" }}>
            AI Startup Builder
          </span>
          <span
            style={{
              marginLeft: "8px",
              fontSize: "14px",
              color: COLORS.textDim,
              borderLeft: `1px solid ${COLORS.border}`,
              paddingLeft: "16px",
            }}
          >
            Multi-Agent Startup Planning System
          </span>
        </div>

        <div style={{ display: "flex", gap: "12px" }}>
          <button
            onClick={handleHistoryClick}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              background: COLORS.panelAlt,
              border: `1px solid ${COLORS.border}`,
              color: COLORS.text,
              padding: "10px 16px",
              borderRadius: "10px",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: 500,
            }}
          >
            🕘 History
          </button>
          <button
            onClick={handleNewProject}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              background: COLORS.blue,
              border: "none",
              color: "white",
              padding: "10px 16px",
              borderRadius: "10px",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: 600,
            }}
          >
            + New Project
          </button>
        </div>
      </div>

      <div style={{ width: "100%", padding: "24px 32px", boxSizing: "border-box" }}>
        {/* Idea input */}
        {showInputForm && (
          <div
            style={{
              display: "flex",
              gap: "10px",
              marginTop: "20px",
              marginBottom: "10px",
            }}
          >
            <input
              ref={ideaInputRef}
              type="text"
              placeholder="Enter startup idea..."
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && generateProject()}
              style={{
                flex: 1,
                padding: "15px 18px",
                borderRadius: "10px",
                border: `1px solid ${COLORS.border}`,
                background: COLORS.panelAlt,
                color: "white",
                fontSize: "16px",
                outline: "none",
              }}
            />

            <button
              onClick={generateProject}
              disabled={loading}
              style={{
                padding: "15px 25px",
                borderRadius: "10px",
                border: "none",
                cursor: loading ? "default" : "pointer",
                background: COLORS.blue,
                color: "white",
                fontWeight: "bold",
                opacity: loading ? 0.7 : 1,
              }}
            >
              Generate
            </button>
          </div>
        )}

        {/* Three column layout */}
        {!showInputForm && (
          <div
            style={{
              display: "flex",
              gap: "20px",
              marginTop: "20px",
              alignItems: "flex-start",
            }}
          >
            {/* Left: Agents */}
            <div style={{ width: "250px", flexShrink: 0 }}>
              <div
                style={{
                  background: COLORS.panel,
                  border: `1px solid ${COLORS.border}`,
                  borderRadius: "16px",
                  padding: "20px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    marginBottom: "16px",
                  }}
                >
                  <span style={{ color: "#facc15" }}>⚡</span>
                  <h2
                    style={{
                      color: COLORS.blueLight,
                      margin: 0,
                      fontSize: "18px",
                      fontWeight: 700,
                    }}
                  >
                    Agents
                  </h2>
                </div>

                {agents.map((agent) => {
                  const isDone = agentProgress.includes(agent);
                  return (
                    <div
                      key={agent}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "10px 12px",
                        marginBottom: "8px",
                        borderRadius: "10px",
                        background: COLORS.panelAlt,
                        border: `1px solid ${COLORS.border}`,
                        fontSize: "14px",
                        fontWeight: 500,
                        color: isDone ? "white" : COLORS.textDim,
                      }}
                    >
                      <span>{agent}</span>
                      {isDone ? (
                        <span
                          style={{
                            background: COLORS.green,
                            color: "white",
                            borderRadius: "50%",
                            width: "16px",
                            height: "16px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "10px",
                            flexShrink: 0,
                          }}
                        >
                          ✓
                        </span>
                      ) : (
                        <span style={{ color: COLORS.textFaint, fontSize: "12px" }}>
                          ⏳
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>

              {allDone && result && (
                <div
                  style={{
                    background: COLORS.panel,
                    border: "1px solid rgba(34,197,94,0.3)",
                    borderRadius: "16px",
                    padding: "16px",
                    marginTop: "16px",
                  }}
                >
                  <p
                    style={{
                      color: COLORS.green,
                      fontWeight: 600,
                      fontSize: "14px",
                      margin: 0,
                    }}
                  >
                    All agents completed 🎉
                  </p>
                  <p
                    style={{
                      color: COLORS.textDim,
                      fontSize: "13px",
                      margin: "6px 0 0 0",
                    }}
                  >
                    Startup plan generated successfully.
                  </p>
                </div>
              )}
            </div>

            {/* Center: Content */}
            <div style={{ flex: 1, minWidth: 0 }}>
              {loading && !result ? (
                <div
                  style={{
                    background: COLORS.panel,
                    border: `1px solid ${COLORS.border}`,
                    borderRadius: "16px",
                    padding: "40px",
                    textAlign: "center",
                    color: COLORS.textDim,
                  }}
                >
                  ⏳ Generating your startup plan — this can take a minute...
                </div>
              ) : (
                result && (
                  <>
                    <div
                      style={{
                        display: "flex",
                        gap: "10px",
                        marginBottom: "20px",
                        overflowX: "auto",
                      }}
                    >
                      {tabs.map((tab) => (
                        <button
                          key={tab.key}
                          onClick={() => setActiveTab(tab.key)}
                          style={{
                            padding: "10px 16px",
                            borderRadius: "10px",
                            border: `1px solid ${COLORS.border}`,
                            cursor: "pointer",
                            whiteSpace: "nowrap",
                            background:
                              activeTab === tab.key ? COLORS.blue : COLORS.panelAlt,
                            color: "white",
                            fontSize: "14px",
                            fontWeight: 500,
                          }}
                        >
                          {tab.label}
                        </button>
                      ))}
                    </div>

                    <AgentCard
                      title={activeContent?.label}
                      content={activeContent?.content}
                    />

                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        marginTop: "24px",
                        marginBottom: "40px",
                      }}
                    >
                      <button
                        onClick={downloadPlan}
                        style={{
                          padding: "15px 30px",
                          borderRadius: "12px",
                          border: "none",
                          cursor: "pointer",
                          background: COLORS.greenDim,
                          color: "white",
                          fontWeight: "bold",
                          fontSize: "16px",
                        }}
                      >
                        ⬇ Download Full Startup Plan
                      </button>
                    </div>
                  </>
                )
              )}
            </div>

            {/* Right: History */}
            <div
              ref={historyRef}
              style={{
                width: "270px",
                flexShrink: 0,
                background: COLORS.panel,
                border: `1px solid ${COLORS.border}`,
                borderRadius: "16px",
                padding: "20px",
                position: "sticky",
                top: "20px",
                maxHeight: "calc(100vh - 40px)",
                overflowY: "auto",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "14px",
                }}
              >
                <h2
                  style={{
                    color: COLORS.blueLight,
                    margin: 0,
                    fontSize: "18px",
                    fontWeight: 700,
                  }}
                >
                  📂 History
                </h2>
                <button
                  onClick={clearHistory}
                  title="Clear all history"
                  style={{
                    background: "transparent",
                    border: "none",
                    color: COLORS.textFaint,
                    cursor: "pointer",
                    fontSize: "16px",
                  }}
                >
                  🗑
                </button>
              </div>

              <input
                placeholder="🔍 Search history..."
                value={historySearch}
                onChange={(e) => setHistorySearch(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  marginBottom: "14px",
                  borderRadius: "10px",
                  border: `1px solid ${COLORS.border}`,
                  background: COLORS.panelAlt,
                  color: "white",
                  fontSize: "14px",
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />

              {filteredHistory.length === 0 && (
                <p style={{ color: COLORS.textFaint, fontSize: "13px" }}>
                  No projects found.
                </p>
              )}

              {filteredHistory.map((project, index) => (
                <div
                  key={index}
                  onClick={() => openHistoryItem(project)}
                  style={{
                    padding: "12px",
                    marginBottom: "10px",
                    borderRadius: "10px",
                    cursor: "pointer",
                    background: COLORS.panelAlt,
                    border: `1px solid ${COLORS.border}`,
                  }}
                >
                  <div style={{ fontWeight: 600, fontSize: "14px", color: "white" }}>
                    {project.idea}
                  </div>
                  <div
                    style={{
                      fontSize: "12px",
                      color: COLORS.textFaint,
                      marginTop: "4px",
                    }}
                  >
                    {new Date(project.createdAt).toLocaleDateString()} •{" "}
                    {new Date(project.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
              ))}

              {history.length > 0 && (
                <button
                  onClick={clearHistory}
                  style={{
                    width: "100%",
                    marginTop: "8px",
                    padding: "10px",
                    borderRadius: "10px",
                    border: "1px solid rgba(248,113,113,0.3)",
                    background: COLORS.panelAlt,
                    color: "#f87171",
                    cursor: "pointer",
                    fontSize: "13px",
                    fontWeight: 500,
                  }}
                >
                  🗑 Clear All History
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;