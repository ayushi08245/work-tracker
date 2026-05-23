import { useState, useEffect, useRef } from "react";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const TODAY = new Date();
const WEEK_DATES = Array.from({ length: 5 }, (_, i) => {
  const d = new Date(TODAY);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1) + i;
  d.setDate(diff);
  return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
});

const FIELD_LABELS = {
  tasks: "Tasks Completed",
  progress: "Progress / Work Status",
  pending: "Pending Tasks",
  achievements: "Key Achievements",
  notes: "Notes / Issues",
};

const PLACEHOLDER = {
  tasks: "e.g. Fixed login bug, Reviewed PR #42, Updated API documentation...",
  progress: "e.g. Sprint 3 - 70% complete, Backend integration in progress...",
  pending: "e.g. Unit testing, Deploy to staging, Client feedback review...",
  achievements: "e.g. Resolved critical blocker, Delivered feature ahead of schedule...",
  notes: "e.g. Dependency on DevOps for environment config, Awaiting design mockups...",
};

const emptyDay = () => ({ tasks: "", progress: "", pending: "", achievements: "", notes: "" });

const ACCENT = "#00C9A7";
const ACCENT2 = "#845EF7";
const BG = "#0D0F1A";
const CARD = "#13162A";
const BORDER = "#1E2240";
const TEXT = "#E8EAF6";
const MUTED = "#6B7280";
const SUCCESS = "#00C9A7";
const WARN = "#F59E0B";

const styles = {
  app: {
    minHeight: "100vh",
    background: BG,
    color: TEXT,
    fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
    padding: "0",
  },
  header: {
    background: `linear-gradient(135deg, #0D0F1A 0%, #13162A 100%)`,
    borderBottom: `1px solid ${BORDER}`,
    padding: "24px 40px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    position: "sticky",
    top: 0,
    zIndex: 100,
  },
  logo: {
    display: "flex",
    alignItems: "center",
    gap: 12,
  },
  logoIcon: {
    width: 38,
    height: 38,
    borderRadius: 10,
    background: `linear-gradient(135deg, ${ACCENT}, ${ACCENT2})`,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 18,
    fontWeight: 800,
    color: "#fff",
    letterSpacing: -1,
  },
  logoText: {
    fontSize: 20,
    fontWeight: 700,
    background: `linear-gradient(90deg, ${ACCENT}, ${ACCENT2})`,
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    letterSpacing: -0.5,
  },
  weekBadge: {
    fontSize: 12,
    color: MUTED,
    background: CARD,
    border: `1px solid ${BORDER}`,
    borderRadius: 20,
    padding: "4px 14px",
  },
  body: {
    maxWidth: 1100,
    margin: "0 auto",
    padding: "36px 24px 60px",
  },
  tabs: {
    display: "flex",
    gap: 6,
    marginBottom: 28,
    background: CARD,
    borderRadius: 14,
    padding: 6,
    border: `1px solid ${BORDER}`,
    overflowX: "auto",
  },
  tab: (active) => ({
    flex: 1,
    minWidth: 100,
    padding: "10px 14px",
    borderRadius: 10,
    border: "none",
    cursor: "pointer",
    fontWeight: active ? 700 : 500,
    fontSize: 13,
    background: active ? `linear-gradient(135deg, ${ACCENT}, ${ACCENT2})` : "transparent",
    color: active ? "#fff" : MUTED,
    transition: "all 0.2s",
    whiteSpace: "nowrap",
  }),
  tabInner: { display: "flex", flexDirection: "column", alignItems: "center", gap: 2 },
  tabDay: { fontSize: 13 },
  tabDate: { fontSize: 10, opacity: 0.8 },
  card: {
    background: CARD,
    border: `1px solid ${BORDER}`,
    borderRadius: 16,
    padding: "28px 32px",
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: 1.5,
    color: ACCENT,
    textTransform: "uppercase",
    marginBottom: 8,
  },
  fieldGroup: {
    marginBottom: 22,
  },
  label: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
    fontSize: 13,
    fontWeight: 600,
    color: TEXT,
  },
  textarea: {
    width: "100%",
    minHeight: 80,
    background: "#0D0F1A",
    border: `1px solid ${BORDER}`,
    borderRadius: 10,
    color: TEXT,
    fontSize: 13.5,
    padding: "12px 14px",
    resize: "vertical",
    fontFamily: "inherit",
    transition: "border-color 0.2s",
    boxSizing: "border-box",
    lineHeight: 1.6,
    outline: "none",
  },
  suggestionBox: {
    background: "#0a0c18",
    border: `1px solid ${ACCENT}44`,
    borderRadius: 8,
    padding: "10px 12px",
    marginTop: 6,
    fontSize: 12,
    color: MUTED,
  },
  suggChip: {
    display: "inline-block",
    background: `${ACCENT}18`,
    border: `1px solid ${ACCENT}44`,
    borderRadius: 6,
    padding: "3px 10px",
    margin: "3px 4px 3px 0",
    cursor: "pointer",
    color: ACCENT,
    fontSize: 11.5,
    fontWeight: 500,
    transition: "background 0.15s",
  },
  row: {
    display: "flex",
    gap: 16,
    marginBottom: 20,
  },
  saveBtn: {
    background: `linear-gradient(135deg, ${ACCENT}, #00a88c)`,
    color: "#fff",
    border: "none",
    borderRadius: 10,
    padding: "12px 28px",
    fontWeight: 700,
    fontSize: 14,
    cursor: "pointer",
    transition: "opacity 0.2s, transform 0.1s",
  },
  aiBtn: {
    background: `linear-gradient(135deg, ${ACCENT2}, #6030e0)`,
    color: "#fff",
    border: "none",
    borderRadius: 10,
    padding: "12px 22px",
    fontWeight: 700,
    fontSize: 14,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: 8,
    transition: "opacity 0.2s",
  },
  outlineBtn: {
    background: "transparent",
    color: ACCENT,
    border: `1px solid ${ACCENT}55`,
    borderRadius: 10,
    padding: "10px 20px",
    fontWeight: 600,
    fontSize: 13,
    cursor: "pointer",
  },
  status: (saved) => ({
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    fontSize: 12,
    color: saved ? SUCCESS : WARN,
    fontWeight: 600,
  }),
  dot: (color) => ({
    width: 7,
    height: 7,
    borderRadius: "50%",
    background: color,
    display: "inline-block",
  }),
  summaryCard: {
    background: `linear-gradient(135deg, #13162A, #0f1225)`,
    border: `1px solid ${ACCENT2}44`,
    borderRadius: 16,
    padding: "28px 32px",
    marginTop: 10,
  },
  summaryMeta: {
    display: "flex",
    gap: 16,
    flexWrap: "wrap",
    marginBottom: 24,
  },
  metaBadge: (color) => ({
    background: `${color}18`,
    border: `1px solid ${color}44`,
    borderRadius: 8,
    padding: "6px 16px",
    fontSize: 12,
    color: color,
    fontWeight: 600,
  }),
  spinner: {
    display: "inline-block",
    width: 16,
    height: 16,
    border: "2px solid #ffffff44",
    borderTop: "2px solid #fff",
    borderRadius: "50%",
    animation: "spin 0.7s linear infinite",
  },
  progress: {
    background: "#0D0F1A",
    borderRadius: 8,
    height: 8,
    marginTop: 4,
    overflow: "hidden",
  },
  progressBar: (pct, color) => ({
    width: `${pct}%`,
    height: "100%",
    background: `linear-gradient(90deg, ${color}, ${color}99)`,
    borderRadius: 8,
    transition: "width 0.5s ease",
  }),
  preBlock: {
    whiteSpace: "pre-wrap",
    fontFamily: "'DM Sans', sans-serif",
    fontSize: 13.5,
    lineHeight: 1.8,
    color: TEXT,
    margin: 0,
  },
  emptyState: {
    textAlign: "center",
    padding: "40px 20px",
    color: MUTED,
  },
};

function SuggestionChips({ field, allDays, currentDay, onPick }) {
  const seen = new Set();
  const chips = [];
  for (let i = 0; i < currentDay; i++) {
    const val = allDays[i][field];
    if (!val) continue;
    val.split(/[,\n]/).forEach((chunk) => {
      const t = chunk.trim();
      if (t && t.length > 4 && !seen.has(t.toLowerCase())) {
        seen.add(t.toLowerCase());
        chips.push(t);
      }
    });
  }
  if (!chips.length) return null;
  return (
    <div style={styles.suggestionBox}>
      <div style={{ marginBottom: 6, fontSize: 11, color: MUTED, fontWeight: 600, letterSpacing: 0.5 }}>
        ✦ RECURRING FROM PREVIOUS DAYS — click to reuse:
      </div>
      {chips.slice(0, 8).map((c, i) => (
        <span key={i} style={styles.suggChip} 
  onMouseDown={(e) => { e.preventDefault(); onPick(field, c); }}
          onMouseEnter={e => e.target.style.background = `${ACCENT}35`}
          onMouseLeave={e => e.target.style.background = `${ACCENT}18`}>
          + {c}
        </span>
      ))}
    </div>
  );
}

function DayForm({ dayIndex, days, setDays }) {
  const data = days[dayIndex];
  const [focusedField, setFocusedField] = useState(null);

  const update = (field, value) => {
    const copy = [...days];
    copy[dayIndex] = { ...copy[dayIndex], [field]: value };
    setDays(copy);
  };
 const handlePick = (field, chip) => {
    const existing = days[dayIndex][field];
    const newVal = existing ? `${existing}\n${chip}` : chip;
    const copy = [...days];
    copy[dayIndex] = { ...copy[dayIndex], [field]: newVal };
    setDays(copy);
  };

  const filledFields = Object.values(data).filter(Boolean).length;
  const pct = Math.round((filledFields / 5) * 100);

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div>
          <div style={{ fontSize: 20, fontWeight: 800, letterSpacing: -0.5 }}>
            {DAYS[dayIndex]}
            <span style={{ fontSize: 13, fontWeight: 500, color: MUTED, marginLeft: 10 }}>{WEEK_DATES[dayIndex]}</span>
          </div>
          <div style={{ fontSize: 12, color: MUTED, marginTop: 4 }}>
            Entry completeness: <span style={{ color: pct === 100 ? SUCCESS : WARN, fontWeight: 700 }}>{pct}%</span>
          </div>
        </div>
        <div style={styles.status(filledFields === 5)}>
          <span style={styles.dot(filledFields === 5 ? SUCCESS : WARN)} />
          {filledFields === 5 ? "Complete" : `${filledFields}/5 fields`}
        </div>
      </div>

      <div style={styles.progress}>
        <div style={styles.progressBar(pct, pct === 100 ? ACCENT : WARN)} />
      </div>

      <div style={{ height: 24 }} />

      {Object.keys(FIELD_LABELS).map((field) => (
        <div key={field} style={styles.fieldGroup}>
          <label style={styles.label}>
            <span>{FIELD_LABELS[field]}</span>
            {data[field] && (
              <span style={{ fontSize: 11, color: SUCCESS, fontWeight: 500 }}>✓ Filled</span>
            )}
          </label>
          <textarea
            style={{
              ...styles.textarea,
              borderColor: focusedField === field ? ACCENT : BORDER,
            }}
            value={data[field]}
            placeholder={PLACEHOLDER[field]}
            onFocus={() => setFocusedField(field)}
            onBlur={() => setFocusedField(null)}
            onChange={(e) => update(field, e.target.value)}
            rows={3}
          />
          {focusedField === field && dayIndex > 0 && (
            <SuggestionChips field={field} allDays={days} currentDay={dayIndex} onPick={handlePick} />
          )}
        </div>
      ))}
    </div>
  );
}

function WeeklySummary({ days, loading, summary, onGenerate }) {
  const filledDays = days.filter(d => Object.values(d).some(Boolean)).length;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
        <div>
          <div style={{ fontSize: 20, fontWeight: 800, letterSpacing: -0.5 }}>Weekly Summary</div>
          <div style={{ fontSize: 12, color: MUTED, marginTop: 4 }}>
            Auto-generated professional report for manager / stakeholder sharing
          </div>
        </div>
        <button
          style={{
            ...styles.aiBtn,
            opacity: loading ? 0.7 : 1,
          }}
          onClick={onGenerate}
          disabled={loading}
        >
          {loading ? <span style={styles.spinner} /> : "✦"}
          {loading ? "Generating..." : "Generate AI Summary"}
        </button>
      </div>

      <div style={styles.summaryMeta}>
        <span style={styles.metaBadge(ACCENT)}>📅 Week of {WEEK_DATES[0]}</span>
        <span style={styles.metaBadge(ACCENT2)}>{filledDays}/5 Days Logged</span>
        <span style={styles.metaBadge(WARN)}>
          {days.filter(d => d.pending).length} Days with Pending Items
        </span>
      </div>

      {!summary && !loading && (
        <div style={styles.emptyState}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>✦</div>
          <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 6 }}>No summary yet</div>
          <div style={{ fontSize: 13 }}>
            {filledDays < 1
              ? "Fill in at least one day's data, then generate your summary."
              : `${filledDays} day(s) logged. Click "Generate AI Summary" to create your report.`}
          </div>
        </div>
      )}

      {summary && (
        <div style={styles.summaryCard}>
          <div style={styles.sectionTitle}>📋 Weekly Status Report</div>
          <pre style={styles.preBlock}>{summary}</pre>
          <div style={{ marginTop: 20, display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button style={styles.outlineBtn} onClick={() => navigator.clipboard.writeText(summary)}>
              Copy Report
            </button>
            <button style={styles.outlineBtn} onClick={() => {
              const blob = new Blob([summary], { type: "text/plain" });
              const a = document.createElement("a");
              a.href = URL.createObjectURL(blob);
              a.download = `weekly_summary_${WEEK_DATES[0].replace(/ /g, "_")}.txt`;
              a.click();
            }}>
              Download .txt
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function DaySidebar({ days }) {
  const allText = days.flatMap(d => [d.tasks, d.pending, d.achievements, d.notes, d.progress])
    .filter(Boolean).join(" ");

  const wordCount = allText.split(/\s+/).filter(Boolean).length;
  const tasksCount = days.filter(d => d.tasks).reduce((a, d) =>
    a + d.tasks.split(/[,\n]/).filter(t => t.trim().length > 3).length, 0);

  return (
    <div>
      <div style={{ ...styles.card, marginBottom: 16 }}>
        <div style={styles.sectionTitle}>Week Overview</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 8 }}>
          {DAYS.map((day, i) => {
            const d = days[i];
            const filled = Object.values(d).filter(Boolean).length;
            return (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 12, color: MUTED, width: 70 }}>{day}</span>
                <div style={{ flex: 1, ...styles.progress }}>
                  <div style={styles.progressBar((filled / 5) * 100, filled === 5 ? ACCENT : filled > 0 ? WARN : BORDER)} />
                </div>
                <span style={{ fontSize: 11, color: filled === 5 ? ACCENT : MUTED, width: 30, textAlign: "right" }}>
                  {filled}/5
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ ...styles.card, marginBottom: 16 }}>
        <div style={styles.sectionTitle}>Stats</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 8 }}>
          {[
            { label: "Days Logged", value: days.filter(d => Object.values(d).some(Boolean)).length, color: ACCENT },
            { label: "Total Tasks", value: tasksCount, color: ACCENT2 },
            { label: "Words Entered", value: wordCount, color: WARN },
            { label: "Pending Items", value: days.filter(d => d.pending).length, color: "#EF4444" },
          ].map(({ label, value, color }) => (
            <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 12, color: MUTED }}>{label}</span>
              <span style={{ fontSize: 16, fontWeight: 800, color }}>{value}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={styles.card}>
        <div style={styles.sectionTitle}>💡 Tips</div>
        <div style={{ fontSize: 12, color: MUTED, lineHeight: 1.7, marginTop: 8 }}>
          • Fill all 5 days for the best AI summary<br />
          • Click suggestion chips to reuse tasks<br />
          • Use Day 5 tab to generate your weekly report<br />
          • Download the summary to share with your manager
        </div>
      </div>
    </div>
  );
}

export default function WorkTracker() {
  const [activeTab, setActiveTab] = useState(0);
  const [days, setDays] = useState(() => {
  try {
    const saved = localStorage.getItem("worktracker-days");
    return saved ? JSON.parse(saved) : Array.from({ length: 5 }, emptyDay);
  } catch {
    return Array.from({ length: 5 }, emptyDay);
  }
});
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  useEffect(() => {
  localStorage.setItem("worktracker-days", JSON.stringify(days));
}, [days]);
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      @keyframes spin { to { transform: rotate(360deg); } }
      @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
      * { box-sizing: border-box; }
      textarea:focus { outline: none; }
      ::-webkit-scrollbar { width: 6px; height: 6px; }
      ::-webkit-scrollbar-track { background: #0D0F1A; }
      ::-webkit-scrollbar-thumb { background: #1E2240; border-radius: 3px; }
    `;
    document.head.appendChild(style);
  }, []);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const generateSummary = async () => {
    setLoading(true);
    setSummary("");

    const dayEntries = days.map((d, i) => {
      const hasSome = Object.values(d).some(Boolean);
      if (!hasSome) return null;
      return `--- ${DAYS[i]} (${WEEK_DATES[i]}) ---
Tasks Completed: ${d.tasks || "N/A"}
Progress/Status: ${d.progress || "N/A"}
Pending Tasks: ${d.pending || "N/A"}
Key Achievements: ${d.achievements || "N/A"}
Notes/Issues: ${d.notes || "N/A"}`;
    }).filter(Boolean).join("\n\n");

    if (!dayEntries) {
      setSummary("No data logged yet. Please fill in at least one day.");
      setLoading(false);
      return;
    }

    const prompt = `You are a professional work tracker assistant. Below is a 5-day (Mon–Fri) work log. Generate a concise, structured Weekly Status Report suitable for sharing with a manager or team lead.

WORK LOG:
${dayEntries}

Generate a weekly summary with the following sections:
1. WEEKLY OVERVIEW — 2-3 sentences summarizing the week
2. TOTAL WORK COMPLETED — bullet points of all tasks done
3. MAJOR ACHIEVEMENTS — highlight top accomplishments
4. RECURRING RESPONSIBILITIES — tasks that appeared on multiple days
5. PENDING / CARRY-FORWARD ITEMS — outstanding work
6. KEY BLOCKERS / ISSUES — any notes or impediments
7. PRODUCTIVITY OVERVIEW — brief performance assessment (1-2 sentences)

Keep it professional, concise, and manager-friendly. Use clean formatting with clear section headers.`;

    try {
  const res = await fetch(
  "https://api.groq.com/openai/v1/chat/completions",
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization":  `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 1000,
    }),
  }
);
const data = await res.json();
if (data.error) {
  setSummary(`API Error: ${data.error.message}`);
  setLoading(false);
  return;
}
const text = data.choices?.[0]?.message?.content || "Failed to generate summary.";
setSummary(text);
} catch (e) {
  console.error("Fetch error:", e);
  setSummary(`Error: ${e.message}`);
} finally {
  setLoading(false);
}
  };

  const isDay5Tab = activeTab === 5;

  return (
    <div style={styles.app}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;0,9..40,800&display=swap');
        * { box-sizing: border-box; }
        textarea { outline: none !important; }
        textarea:focus { border-color: ${ACCENT} !important; box-shadow: 0 0 0 3px ${ACCENT}18; }
        button:active { transform: scale(0.97); }
        @keyframes spin { to { transform: rotate(360deg); } }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: #0D0F1A; }
        ::-webkit-scrollbar-thumb { background: #1E2240; border-radius: 3px; }
      `}</style>

      <div style={styles.header}>
        <div style={styles.logo}>
          <div style={styles.logoIcon}>W</div>
          <span style={styles.logoText}>WorkTracker Pro</span>
        </div>
        <span style={styles.weekBadge}>Week of {WEEK_DATES[0]}</span>
      </div>

      <div style={styles.body}>
        <div style={styles.tabs}>
          {DAYS.map((day, i) => {
            const filled = Object.values(days[i]).filter(Boolean).length;
            return (
              <button key={i} style={styles.tab(activeTab === i)} onClick={() => setActiveTab(i)}>
                <div style={styles.tabInner}>
                  <span style={styles.tabDay}>{day}</span>
                  <span style={styles.tabDate}>{WEEK_DATES[i]}</span>
                  {filled > 0 && (
                    <span style={{
                      width: 6, height: 6, borderRadius: "50%",
                      background: filled === 5 ? ACCENT : WARN,
                      display: "block", marginTop: 2,
                    }} />
                  )}
                </div>
              </button>
            );
          })}
          <button style={styles.tab(activeTab === 5)} onClick={() => setActiveTab(5)}>
            <div style={styles.tabInner}>
              <span style={styles.tabDay}>📋 Summary</span>
              <span style={styles.tabDate}>Week Report</span>
            </div>
          </button>
        </div>

        <div style={{ display: "flex", gap: 24, alignItems: "flex-start" }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={styles.card}>
              {!isDay5Tab ? (
                <>
                  <DayForm dayIndex={activeTab} days={days} setDays={setDays} />
                  <div style={{ display: "flex", gap: 12, marginTop: 8, alignItems: "center", flexWrap: "wrap" }}>
                    <button style={styles.saveBtn} onClick={handleSave}>
                      {saved ? "✓ Saved!" : "Save Entry"}
                    </button>
                    {activeTab < 4 && (
                      <button style={styles.outlineBtn} onClick={() => setActiveTab(activeTab + 1)}>
                        Next Day →
                      </button>
                    )}
                    {activeTab === 4 && (
                      <button style={styles.outlineBtn} onClick={() => setActiveTab(5)}>
                        View Summary →
                      </button>
                    )}
                  </div>
                </>
              ) : (
                <WeeklySummary
                  days={days}
                  loading={loading}
                  summary={summary}
                  onGenerate={generateSummary}
                />
              )}
            </div>
          </div>

          <div style={{ width: 240, flexShrink: 0 }}>
            <DaySidebar days={days} />
          </div>
        </div>
      </div>
    </div>
  );
}