// Growth Leap prototype — shared atoms (Direction A · Editorial)

// Palette
const C = {
  paper:     "#F6F1E8",
  paper2:    "#EFEAE0",
  card:      "#FBF8F1",
  ink:       "#1F1A14",
  ink70:     "#4A4036",
  ink50:     "#7A6E5E",
  ink30:     "#B6A98F",
  rule:      "#D8CDB5",
  ruleSoft:  "#E8DFC9",
  rust:      "#B5733F",
  rustInk:   "#7A4823",
  rustSoft:  "#F2DCC4",
  sage:      "#8A9376",
  blush:     "#D4A689",
  black:     "#15110B",
};

// Fonts
const F = {
  serif: `'Source Serif 4', 'Source Serif Pro', Georgia, serif`,
  mono:  `'JetBrains Mono', 'IBM Plex Mono', ui-monospace, monospace`,
  sys:   `system-ui, -apple-system, "Segoe UI", sans-serif`,
};

// ─── App Context ─────────────────────────────────────────────────────────────
const AppContext = React.createContext(null);

const AppProvider = ({ children }) => {
  const [route, setRoute]                       = React.useState("today");
  const [drawerDoc, setDrawerDoc]               = React.useState(null); // doctor id
  const [phoneOpen, setPhoneOpen]               = React.useState(false);
  const [phoneTab, setPhoneTab]                 = React.useState("whatsapp"); // whatsapp | sms

  // Action state — James outreach
  const [jamesStatus, setJamesStatus]           = React.useState("drafted"); // drafted | sending | sent | held
  const [jamesMessage, setJamesMessage]         = React.useState(
    "Hey James — no need to respond to this. Just wanted to say I saw you were on call Tuesday and the morning prompts catch most of us on the worst days. The arc keeps moving with or without a post. Glad you're here either way. — Sana"
  );

  // Celebration state
  const [celStatus, setCelStatus]               = React.useState("drafted"); // drafted | scheduled | regenerating
  const [celText, setCelText]                   = React.useState(window.GL_CELEBRATION_DRAFT);
  const [celEditing, setCelEditing]             = React.useState(false);

  // Toast
  const [toast, setToast]                       = React.useState(null);
  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3200);
  };

  const value = {
    route, setRoute,
    drawerDoc, setDrawerDoc,
    phoneOpen, setPhoneOpen, phoneTab, setPhoneTab,
    jamesStatus, setJamesStatus, jamesMessage, setJamesMessage,
    celStatus, setCelStatus, celText, setCelText, celEditing, setCelEditing,
    toast, showToast,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

const useApp = () => React.useContext(AppContext);

// ─── Atoms ───────────────────────────────────────────────────────────────────

const Eyebrow = ({ children, style, color }) => (
  <div style={{
    fontFamily: F.mono, fontSize: 10, letterSpacing: "0.16em",
    textTransform: "uppercase", color: color || C.ink50, ...style,
  }}>{children}</div>
);

const Rule = ({ color = C.rule, style }) => (
  <div style={{ height: 1, background: color, ...style }}></div>
);

const Avatar = ({ doc, size = 32, ring }) => (
  <div style={{
    width: size, height: size, borderRadius: "50%",
    background: doc.color, color: C.card,
    fontFamily: F.serif, fontSize: size * 0.42, fontWeight: 500,
    display: "flex", alignItems: "center", justifyContent: "center",
    flexShrink: 0, letterSpacing: "-0.01em",
    boxShadow: ring ? `0 0 0 3px ${C.paper}, 0 0 0 5px ${ring}` : "none",
    transition: "box-shadow .15s",
  }}>{doc.initials}</div>
);

const Chip = ({ tone = "neutral", children, onClick, style }) => {
  const map = {
    in:      { bg: C.rust, fg: C.card, border: "none" },
    quiet:   { bg: "transparent", fg: C.rustInk, border: `1px solid ${C.rust}` },
    held:    { bg: "transparent", fg: C.ink50, border: `1px dashed ${C.rule}` },
    sent:    { bg: C.sage, fg: C.card, border: "none" },
    later:   { bg: "transparent", fg: C.ink50, border: `1px dashed ${C.rule}` },
    neutral: { bg: "transparent", fg: C.ink50, border: `1px solid ${C.rule}` },
    scheduled: { bg: C.sage, fg: C.card, border: "none" },
  };
  const m = map[tone];
  return (
    <span onClick={onClick} style={{
      display: "inline-flex", alignItems: "center",
      padding: "3px 9px", borderRadius: 999,
      background: m.bg, color: m.fg, border: m.border,
      fontFamily: F.mono, fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase",
      cursor: onClick ? "pointer" : "default",
      ...style,
    }}>{children}</span>
  );
};

const Btn = ({ kind = "secondary", children, onClick, disabled, style, full }) => {
  const kinds = {
    primary:   { bg: C.rust, fg: C.card, border: "none" },
    sage:      { bg: C.sage, fg: C.card, border: "none" },
    secondary: { bg: "transparent", fg: C.ink, border: `1px solid ${C.rule}` },
    ghost:     { bg: "transparent", fg: C.ink50, border: "none" },
  };
  const k = kinds[kind];
  return (
    <button onClick={onClick} disabled={disabled} style={{
      padding: "10px 18px",
      background: k.bg, color: k.fg, border: k.border,
      borderRadius: 4,
      fontFamily: F.serif, fontSize: 14,
      cursor: disabled ? "default" : "pointer",
      opacity: disabled ? 0.5 : 1,
      width: full ? "100%" : "auto",
      transition: "transform .08s, background .15s, opacity .15s",
      ...style,
    }}
    onMouseDown={e => { if (!disabled) e.currentTarget.style.transform = "translateY(1px)"; }}
    onMouseUp={e => { e.currentTarget.style.transform = ""; }}
    onMouseLeave={e => { e.currentTarget.style.transform = ""; }}
    >{children}</button>
  );
};

// One-time injected styles
if (typeof document !== "undefined" && !document.getElementById("gl-prototype-styles")) {
  const s = document.createElement("style");
  s.id = "gl-prototype-styles";
  s.textContent = `
    .gl-row:hover { background: ${C.paper2} !important; }
    .gl-cell:hover { transform: translateY(-1px); box-shadow: 0 2px 8px rgba(0,0,0,0.08); }
    .gl-cell { transition: transform .12s, box-shadow .12s; }
    .gl-tip {
      position: absolute; bottom: calc(100% + 8px); left: 50%; transform: translateX(-50%);
      background: ${C.black}; color: ${C.card};
      padding: 8px 12px; border-radius: 6px; font-family: ${F.serif}; font-size: 12.5px;
      white-space: normal; max-width: 260px; min-width: 140px; z-index: 100;
      box-shadow: 0 6px 20px rgba(0,0,0,0.18); pointer-events: none;
      opacity: 0; transition: opacity .12s;
    }
    .gl-cell-tip:hover .gl-tip { opacity: 1; }
    .gl-link { color: ${C.rustInk}; cursor: pointer; text-decoration: none; border-bottom: 1px solid ${C.rust}88; }
    .gl-link:hover { border-bottom-color: ${C.rust}; color: ${C.rust}; }
    button { font: inherit; }
    button:focus-visible, input:focus-visible, textarea:focus-visible {
      outline: 2px solid ${C.rust}; outline-offset: 2px;
    }
    *::-webkit-scrollbar { width: 6px; height: 6px; }
    *::-webkit-scrollbar-thumb { background: ${C.ink30}; border-radius: 3px; }
    *::-webkit-scrollbar-track { background: transparent; }
    @keyframes gl-fade-in { from { opacity: 0; transform: translateY(4px);} to { opacity: 1; transform: translateY(0);} }
    @keyframes gl-slide-in { from { transform: translateX(100%);} to { transform: translateX(0);} }
    @keyframes gl-pulse { 0%,100% { opacity: 1;} 50% { opacity: 0.55;} }
    .gl-fade-in { animation: gl-fade-in .25s ease-out both; }
    .gl-pulse { animation: gl-pulse 1.6s ease-in-out infinite; }
  `;
  document.head.appendChild(s);
}

Object.assign(window, {
  C, F, AppContext, AppProvider, useApp,
  Eyebrow, Rule, Avatar, Chip, Btn,
});
