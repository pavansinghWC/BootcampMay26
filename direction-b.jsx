// Direction B — "Almanac"
// Warmer cream, Fraunces display + Inter body, olive primary + ochre secondary.
// Denser editorial grid with a left sidebar, more decorative — like a thoughtful field notebook.

const B_CREAM   = "#EFE7D6";
const B_CREAM_2 = "#E6DCC4";
const B_PAPER   = "#F8F1DF";
const B_INK     = "#2A2418";
const B_INK_70  = "#54493A";
const B_INK_50  = "#7B6F5C";
const B_RULE    = "#D4C7A7";
const B_RULE_SOFT = "#E0D5B7";
const B_OLIVE   = "#6B7A48";
const B_OLIVE_DEEP = "#4A5631";
const B_OCHRE   = "#B8893A";
const B_OCHRE_DEEP = "#8A641F";
const B_TERRA   = "#A55A3E";

const b_display = `'Fraunces', 'Recoleta', Georgia, serif`;
const b_body    = `'Inter', system-ui, -apple-system, sans-serif`;
const b_mono    = `'JetBrains Mono', 'IBM Plex Mono', ui-monospace, monospace`;

// ─────────────────────────────────────────────────────────────────────────────
// Shared chrome
// ─────────────────────────────────────────────────────────────────────────────

const BSidebar = ({ active }) => {
  const items = [
    { key: "today",        label: "Today",        sub: "snapshot" },
    { key: "arc",          label: "Arc",          sub: "5-day trend" },
    { key: "quiet",        label: "Radar",        sub: "who's gone quiet" },
    { key: "celebration",  label: "Celebration",  sub: "tomorrow's draft" },
    { key: "settings",     label: "Settings",     sub: "" },
  ];
  return (
    <div style={{ width: 240, background: B_CREAM_2, borderRight: `1px solid ${B_RULE}`, padding: "28px 0", display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={{ padding: "0 24px 24px", borderBottom: `1px solid ${B_RULE_SOFT}` }}>
        <div style={{ fontFamily: b_display, fontSize: 24, fontWeight: 500, letterSpacing: "-0.01em", color: B_INK, lineHeight: 1 }}>
          Growth<br/>Leap.
        </div>
        <div style={{ marginTop: 10, fontFamily: b_mono, fontSize: 9.5, letterSpacing: "0.14em", color: B_INK_50, textTransform: "uppercase" }}>
          Facilitator console
        </div>
      </div>

      <div style={{ padding: "20px 0", flex: 1 }}>
        {items.map((it) => {
          const on = it.key === active;
          return (
            <div key={it.key} style={{
              padding: "10px 24px 10px 24px",
              borderLeft: on ? `3px solid ${B_OLIVE}` : "3px solid transparent",
              background: on ? B_PAPER : "transparent",
              marginRight: on ? 0 : 0,
            }}>
              <div style={{ fontFamily: b_display, fontSize: 17, fontWeight: 500, color: on ? B_OLIVE_DEEP : B_INK, letterSpacing: "-0.005em" }}>
                {it.label}
              </div>
              {it.sub && <div style={{ fontFamily: b_body, fontSize: 11.5, color: B_INK_50, marginTop: 1 }}>{it.sub}</div>}
            </div>
          );
        })}
      </div>

      <div style={{ padding: "16px 24px", borderTop: `1px solid ${B_RULE_SOFT}`, fontFamily: b_body, fontSize: 11.5, color: B_INK_50 }}>
        <div style={{ fontFamily: b_mono, fontSize: 9, letterSpacing: "0.12em", textTransform: "uppercase", color: B_INK_50, marginBottom: 6 }}>Cohort</div>
        <div style={{ color: B_INK, fontFamily: b_body, fontWeight: 500, fontSize: 13 }}>Pacific Mercy</div>
        <div>Hospitalist Pod 2</div>
        <div style={{ marginTop: 10, display: "flex", alignItems: "center", gap: 6 }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: B_OLIVE }}></div>
          <span>{GL_FACILITATOR}</span>
        </div>
      </div>
    </div>
  );
};

const BAvatar = ({ doc, size = 32, ring }) => (
  <div style={{
    width: size, height: size, borderRadius: "50%",
    background: doc.color, color: B_PAPER,
    fontFamily: b_display, fontSize: size * 0.4, fontWeight: 500,
    display: "flex", alignItems: "center", justifyContent: "center",
    flexShrink: 0, boxShadow: ring ? `0 0 0 3px ${B_CREAM}, 0 0 0 4px ${ring}` : "none",
  }}>{doc.initials}</div>
);

const BTag = ({ children, tone = "neutral" }) => {
  const tones = {
    neutral: { bg: "transparent", fg: B_INK_50, border: B_RULE },
    in:      { bg: B_OLIVE, fg: B_PAPER, border: B_OLIVE },
    quiet:   { bg: "transparent", fg: B_TERRA, border: B_TERRA },
    later:   { bg: "transparent", fg: B_INK_50, border: B_RULE, dashed: true },
  };
  const t = tones[tone];
  return (
    <span style={{
      display: "inline-flex", alignItems: "center",
      padding: "2px 9px", borderRadius: 3,
      background: t.bg, color: t.fg,
      border: `1px ${t.dashed ? "dashed" : "solid"} ${t.border}`,
      fontFamily: b_mono, fontSize: 9.5, letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 500,
    }}>{children}</span>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Screen 1 — Today snapshot
// ─────────────────────────────────────────────────────────────────────────────

const B_Today = () => {
  const stateMap = { pr: "in", mc: "in", sr: "in", jo: "quiet", hw: "in", dp: "in" };
  const findDoc = (id) => GL_DOCTORS.find(d => d.id === id);

  return (
    <div style={{ width: 1280, height: 820, background: B_CREAM, color: B_INK, fontFamily: b_body, display: "flex" }}>
      <BSidebar active="today" />
      <div style={{ flex: 1, padding: "28px 36px 28px", overflow: "hidden", position: "relative" }}>
        {/* header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 18 }}>
          <div>
            <div style={{ fontFamily: b_mono, fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", color: B_INK_50 }}>
              {GL_TODAY} · {GL_NOW}
            </div>
            <div style={{ marginTop: 4, fontFamily: b_display, fontSize: 32, fontWeight: 500, letterSpacing: "-0.015em", color: B_INK }}>
              Day three. <span style={{ color: B_OLIVE_DEEP, fontStyle: "italic" }}>Reaching.</span>
            </div>
          </div>
          <div style={{ display: "flex", gap: 18, alignItems: "flex-end" }}>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontFamily: b_mono, fontSize: 9.5, letterSpacing: "0.12em", textTransform: "uppercase", color: B_INK_50 }}>Morning</div>
              <div style={{ fontFamily: b_display, fontSize: 28, fontWeight: 500, color: B_OLIVE_DEEP, lineHeight: 1 }}>5<span style={{ color: B_INK_50, fontSize: 16 }}>/6</span></div>
            </div>
            <div style={{ width: 1, height: 32, background: B_RULE }}></div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontFamily: b_mono, fontSize: 9.5, letterSpacing: "0.12em", textTransform: "uppercase", color: B_INK_50 }}>Closed</div>
              <div style={{ fontFamily: b_display, fontSize: 28, fontWeight: 500, color: B_INK, lineHeight: 1 }}>10:00</div>
            </div>
          </div>
        </div>

        {/* the prompt card */}
        <div style={{ background: B_PAPER, border: `1px solid ${B_RULE}`, borderRadius: 4, padding: "20px 24px", marginBottom: 18, display: "grid", gridTemplateColumns: "auto 1fr auto", gap: 20, alignItems: "center" }}>
          <div style={{ width: 60, textAlign: "center", borderRight: `1px solid ${B_RULE_SOFT}`, paddingRight: 16 }}>
            <div style={{ fontFamily: b_mono, fontSize: 9, letterSpacing: "0.14em", color: B_INK_50, textTransform: "uppercase" }}>Day</div>
            <div style={{ fontFamily: b_display, fontSize: 40, fontWeight: 500, color: B_OLIVE_DEEP, lineHeight: 1 }}>III</div>
          </div>
          <div>
            <div style={{ fontFamily: b_mono, fontSize: 9.5, letterSpacing: "0.12em", textTransform: "uppercase", color: B_INK_50 }}>Morning prompt · commitment</div>
            <div style={{ fontFamily: b_display, fontSize: 22, fontWeight: 400, letterSpacing: "-0.01em", color: B_INK, marginTop: 4, lineHeight: 1.3 }}>
              Who on this team could use <em style={{ color: B_OCHRE_DEEP, fontStyle: "italic" }}>one sentence</em> from you today? Commit to it here.
            </div>
          </div>
          <button style={{ padding: "8px 14px", background: "transparent", border: `1px solid ${B_RULE}`, borderRadius: 3, fontFamily: b_mono, fontSize: 10, letterSpacing: "0.1em", color: B_INK_70, textTransform: "uppercase" }}>
            Open in WhatsApp →
          </button>
        </div>

        {/* main grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1.05fr 1fr", gap: 28 }}>
          {/* Roster */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 10 }}>
              <div style={{ fontFamily: b_mono, fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", color: B_INK_50 }}>The pod, this morning</div>
              <div style={{ fontFamily: b_body, fontSize: 11, color: B_INK_50 }}>sorted by post time</div>
            </div>
            <div style={{ border: `1px solid ${B_RULE_SOFT}`, borderRadius: 4, background: B_PAPER, overflow: "hidden" }}>
              {[...GL_DOCTORS].sort((a,b) => {
                const pa = GL_TODAY_POSTS.find(p => p.who === a.id);
                const pb = GL_TODAY_POSTS.find(p => p.who === b.id);
                if (!pa) return 1;
                if (!pb) return -1;
                return pa.t.localeCompare(pb.t);
              }).map((d, i, arr) => {
                const state = stateMap[d.id];
                const post = GL_TODAY_POSTS.find(p => p.who === d.id);
                return (
                  <div key={d.id} style={{ padding: "12px 16px", borderBottom: i < arr.length - 1 ? `1px solid ${B_RULE_SOFT}` : "none", display: "flex", alignItems: "center", gap: 12 }}>
                    <BAvatar doc={d} size={34} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontFamily: b_display, fontSize: 15, fontWeight: 500, color: B_INK }}>
                        {d.first} {d.last}
                      </div>
                      <div style={{ fontFamily: b_body, fontSize: 11.5, color: B_INK_50, marginTop: 1 }}>
                        {d.role} · {post ? `posted ${post.t}` : "no response yet"}
                      </div>
                    </div>
                    <BTag tone={state === "in" ? "in" : "quiet"}>{state === "in" ? "in" : "quiet · 2"}</BTag>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Feed */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 10 }}>
              <div style={{ fontFamily: b_mono, fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", color: B_INK_50 }}>What they committed to</div>
              <div style={{ fontFamily: b_body, fontSize: 11, color: B_INK_50 }}>Read-only · WhatsApp mirror</div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {GL_TODAY_POSTS.slice(0, 4).map((p, i) => {
                const d = findDoc(p.who);
                return (
                  <div key={p.t} style={{ padding: "12px 14px", background: B_PAPER, border: `1px solid ${B_RULE_SOFT}`, borderRadius: 4 }}>
                    <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 4 }}>
                      <div style={{ fontFamily: b_display, fontSize: 13.5, fontWeight: 600, color: d.color }}>{d.first} {d.last}</div>
                      <div style={{ fontFamily: b_mono, fontSize: 9.5, letterSpacing: "0.06em", color: B_INK_50 }}>{p.t}</div>
                      <div style={{ marginLeft: "auto", fontFamily: b_mono, fontSize: 9.5, color: B_INK_50 }}>{[2,4,3,5][i]} react</div>
                    </div>
                    <div style={{ fontFamily: b_display, fontSize: 14, fontWeight: 400, color: B_INK_70, lineHeight: 1.45, fontStyle: "italic" }}>
                      "{p.text}"
                    </div>
                  </div>
                );
              })}
              <div style={{ padding: "8px 14px", fontFamily: b_body, fontSize: 12, color: B_INK_50, textAlign: "center" }}>
                + 1 more · Daniel Park at 9:23 AM
              </div>
            </div>
          </div>
        </div>

        {/* bottom — nudge timeline */}
        <div style={{ position: "absolute", left: 36, right: 36, bottom: 24 }}>
          <div style={{ fontFamily: b_mono, fontSize: 9.5, letterSpacing: "0.14em", textTransform: "uppercase", color: B_INK_50, marginBottom: 8 }}>Today's nudges · all SMS · 1 doctor affected</div>
          <div style={{ position: "relative", height: 38, background: B_PAPER, border: `1px solid ${B_RULE_SOFT}`, borderRadius: 4 }}>
            {/* progress to now (11:42 of a 6:00–18:00 day = ~47%) */}
            <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: "47%", background: `linear-gradient(90deg, ${B_OLIVE}11, ${B_OLIVE}22)`, borderRight: `1px solid ${B_OLIVE}` }}></div>
            {[
              { left: "0%",   label: "06:00", sub: "prompt", state: "past" },
              { left: "31%",  label: "09:45", sub: "reminder ↗", state: "past", accent: true },
              { left: "47%",  label: "11:42", sub: "now", state: "now" },
              { left: "42%",  label: "11:00", sub: "social ↗", state: "queued", accent: true },
              { left: "100%", label: "18:00", sub: "evening", state: "future" },
            ].map((m, i) => (
              <div key={i} style={{ position: "absolute", left: m.left, top: -2, bottom: -2, width: 1, background: m.state === "now" ? B_OLIVE_DEEP : (m.accent ? B_OCHRE : B_RULE), transform: "translateX(-0.5px)" }}>
                <div style={{ position: "absolute", top: 42, left: 0, transform: "translateX(-50%)", whiteSpace: "nowrap", fontFamily: b_mono, fontSize: 9.5, color: m.state === "now" ? B_OLIVE_DEEP : (m.accent ? B_OCHRE_DEEP : B_INK_50), letterSpacing: "0.04em" }}>
                  {m.label} <span style={{ opacity: 0.7 }}>· {m.sub}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Screen 2 — 5-day arc trend
// ─────────────────────────────────────────────────────────────────────────────

const B_Arc = () => {
  const cellFor = (mark) => {
    if (mark === "✓") return { bg: B_OLIVE, fg: B_PAPER };
    if (mark === "·") return { bg: "transparent", fg: B_TERRA, border: `1px solid ${B_TERRA}` };
    return { bg: "transparent", fg: B_INK_50, border: `1px dashed ${B_RULE}` };
  };

  return (
    <div style={{ width: 1280, height: 820, background: B_CREAM, color: B_INK, fontFamily: b_body, display: "flex" }}>
      <BSidebar active="arc" />
      <div style={{ flex: 1, padding: "28px 36px", position: "relative", overflow: "hidden" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 6 }}>
          <div>
            <div style={{ fontFamily: b_mono, fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", color: B_INK_50 }}>
              Arc view · five days · two prompts per day
            </div>
            <div style={{ marginTop: 4, fontFamily: b_display, fontSize: 32, fontWeight: 500, letterSpacing: "-0.015em" }}>
              The shape of <em style={{ color: B_OLIVE_DEEP, fontStyle: "italic" }}>this week.</em>
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontFamily: b_mono, fontSize: 9.5, letterSpacing: "0.12em", textTransform: "uppercase", color: B_INK_50 }}>Pod engagement</div>
            <div style={{ fontFamily: b_display, fontSize: 32, fontWeight: 500, color: B_OLIVE_DEEP, lineHeight: 1 }}>90<span style={{ fontSize: 18, color: B_INK_50 }}>%</span></div>
          </div>
        </div>

        <div style={{ marginTop: 18, background: B_PAPER, border: `1px solid ${B_RULE_SOFT}`, borderRadius: 4, padding: "22px 26px" }}>
          {/* day header strip */}
          <div style={{ display: "grid", gridTemplateColumns: "180px repeat(5, 1fr) 100px", gap: 12, paddingBottom: 14, borderBottom: `1px solid ${B_RULE_SOFT}` }}>
            <div></div>
            {GL_ARC.map((d, i) => (
              <div key={d.day} style={{ textAlign: "center" }}>
                <div style={{ fontFamily: b_mono, fontSize: 9, letterSpacing: "0.16em", color: B_INK_50, textTransform: "uppercase" }}>
                  Day {d.day}
                </div>
                <div style={{ marginTop: 4, fontFamily: b_display, fontSize: 17, fontWeight: 500, fontStyle: "italic", color: i === 2 ? B_OLIVE_DEEP : (i > 2 ? B_INK_50 : B_INK) }}>
                  {d.theme}
                </div>
                <div style={{ marginTop: 6, display: "flex", justifyContent: "center", gap: 6, fontFamily: b_mono, fontSize: 8.5, color: B_INK_50, letterSpacing: "0.08em" }}>
                  <span style={{ width: 18, textAlign: "center" }}>AM</span>
                  <span style={{ width: 18, textAlign: "center" }}>PM</span>
                </div>
              </div>
            ))}
            <div style={{ textAlign: "right", fontFamily: b_mono, fontSize: 9, letterSpacing: "0.14em", color: B_INK_50, textTransform: "uppercase" }}>Rate</div>
          </div>

          {/* rows */}
          {GL_DOCTORS.map((doc) => {
            const eng = GL_ENGAGEMENT[doc.id];
            const posted = eng.flatMap(d => [...d]).filter(c => c === "✓").length;
            const ratio = posted / 5;
            return (
              <div key={doc.id} style={{ display: "grid", gridTemplateColumns: "180px repeat(5, 1fr) 100px", gap: 12, padding: "14px 0", borderBottom: `1px solid ${B_RULE_SOFT}`, alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <BAvatar doc={doc} size={30} />
                  <div>
                    <div style={{ fontFamily: b_display, fontSize: 14, fontWeight: 500 }}>{doc.first} {doc.last}</div>
                    <div style={{ fontFamily: b_body, fontSize: 11, color: B_INK_50 }}>yr {doc.years}</div>
                  </div>
                </div>
                {eng.map((day, di) => {
                  const m = cellFor(day[0]);
                  const e = cellFor(day[1]);
                  return (
                    <div key={di} style={{ display: "flex", gap: 6, justifyContent: "center" }}>
                      <div style={{ width: 30, height: 30, borderRadius: 4, background: m.bg, color: m.fg, border: m.border || "none", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: b_mono, fontSize: 11, fontWeight: 500 }}>
                        {day[0] === "✓" ? "•" : day[0] === "·" ? "–" : ""}
                      </div>
                      <div style={{ width: 30, height: 30, borderRadius: 4, background: e.bg, color: e.fg, border: e.border || "none", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: b_mono, fontSize: 11, fontWeight: 500 }}>
                        {day[1] === "✓" ? "•" : day[1] === "·" ? "–" : ""}
                      </div>
                    </div>
                  );
                })}
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontFamily: b_display, fontSize: 18, fontWeight: 500, color: ratio < 0.6 ? B_TERRA : B_INK }}>
                    {posted}<span style={{ color: B_INK_50, fontSize: 12 }}>/5</span>
                  </div>
                  <div style={{ height: 3, background: B_RULE_SOFT, marginTop: 4, borderRadius: 2, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${ratio * 100}%`, background: ratio < 0.6 ? B_TERRA : B_OLIVE }}></div>
                  </div>
                </div>
              </div>
            );
          })}

          {/* legend + footer */}
          <div style={{ marginTop: 14, display: "flex", gap: 18, alignItems: "center", fontFamily: b_body, fontSize: 11.5, color: B_INK_70 }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 14, height: 14, borderRadius: 3, background: B_OLIVE }}></div> posted
            </span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 14, height: 14, borderRadius: 3, border: `1px solid ${B_TERRA}` }}></div> window closed without post
            </span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 14, height: 14, borderRadius: 3, border: `1px dashed ${B_RULE}` }}></div> future
            </span>
            <span style={{ marginLeft: "auto", fontFamily: b_mono, fontSize: 10, color: B_INK_50, letterSpacing: "0.08em" }}>
              POINTS · 1 PER POST · 0.5 PER REACTION TO TEAMMATE
            </span>
          </div>
        </div>

        {/* small KPIs */}
        <div style={{ marginTop: 20, display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14 }}>
          {[
            { num: "27", denom: "/30", label: "posts through Day 3 AM" },
            { num: "23", denom: "",    label: "reactions exchanged yesterday" },
            { num: "11", denom: "msg", label: "longest thread · Tuesday eve" },
            { num: "1",  denom: "/6",  label: "quiet doctor · radar →",  tone: "warn" },
          ].map((s, i) => (
            <div key={i} style={{ padding: "14px 16px", background: B_PAPER, border: `1px solid ${B_RULE_SOFT}`, borderRadius: 4 }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
                <div style={{ fontFamily: b_display, fontSize: 28, fontWeight: 500, color: s.tone === "warn" ? B_TERRA : B_INK, letterSpacing: "-0.01em" }}>{s.num}</div>
                <div style={{ fontFamily: b_mono, fontSize: 11, color: B_INK_50 }}>{s.denom}</div>
              </div>
              <div style={{ fontFamily: b_body, fontSize: 12, color: B_INK_70, marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Screen 3 — Quiet-doctor radar
// ─────────────────────────────────────────────────────────────────────────────

const B_Quiet = () => {
  const james = GL_DOCTORS.find(d => d.id === "jo");
  return (
    <div style={{ width: 1280, height: 820, background: B_CREAM, color: B_INK, fontFamily: b_body, display: "flex" }}>
      <BSidebar active="quiet" />
      <div style={{ flex: 1, padding: "28px 36px", position: "relative", overflow: "hidden" }}>
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontFamily: b_mono, fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", color: B_INK_50 }}>
            Radar · sensitivity: 2 missed windows · 1 flagged
          </div>
          <div style={{ marginTop: 4, fontFamily: b_display, fontSize: 32, fontWeight: 500, letterSpacing: "-0.015em" }}>
            One doctor needs a <em style={{ color: B_TERRA, fontStyle: "italic" }}>human voice.</em>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: 24 }}>
          {/* Left — profile */}
          <div style={{ background: B_PAPER, border: `1px solid ${B_RULE}`, borderRadius: 4, padding: "24px 26px" }}>
            <div style={{ display: "flex", gap: 18, alignItems: "center" }}>
              <BAvatar doc={james} size={68} ring={B_TERRA} />
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: b_display, fontSize: 26, fontWeight: 500, letterSpacing: "-0.01em" }}>{james.first} {james.last}</div>
                <div style={{ fontFamily: b_body, fontSize: 13, color: B_INK_70, marginTop: 2 }}>Hospitalist · Year 6 · Joined Pod 2 in Jan</div>
              </div>
              <BTag tone="quiet">Quiet · 2</BTag>
            </div>

            <div style={{ marginTop: 22 }}>
              <div style={{ fontFamily: b_mono, fontSize: 9.5, letterSpacing: "0.14em", textTransform: "uppercase", color: B_INK_50, marginBottom: 8 }}>His arc, so far</div>
              <div style={{ display: "flex", gap: 16 }}>
                {GL_ENGAGEMENT.jo.map((day, di) => (
                  <div key={di} style={{ flex: 1 }}>
                    <div style={{ fontFamily: b_mono, fontSize: 9, letterSpacing: "0.12em", color: B_INK_50, textAlign: "center" }}>Day {di + 1}</div>
                    <div style={{ marginTop: 6, display: "flex", justifyContent: "center", gap: 6 }}>
                      {[...day].map((c, ci) => (
                        <div key={ci} style={{
                          width: 32, height: 32, borderRadius: 4,
                          background: c === "✓" ? B_OLIVE : "transparent",
                          border: c === "✓" ? "none" : `1px ${c === "·" ? "solid" : "dashed"} ${c === "·" ? B_TERRA : B_RULE}`,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontFamily: b_mono, fontSize: 10, fontWeight: 500,
                          color: c === "✓" ? B_PAPER : (c === "·" ? B_TERRA : B_INK_50),
                        }}>
                          {c === "✓" ? "•" : c === "·" ? "–" : ""}
                        </div>
                      ))}
                    </div>
                    <div style={{ marginTop: 6, display: "flex", justifyContent: "center", gap: 6, fontFamily: b_mono, fontSize: 8, color: B_INK_50, letterSpacing: "0.08em" }}>
                      <span style={{ width: 32, textAlign: "center" }}>AM</span>
                      <span style={{ width: 32, textAlign: "center" }}>PM</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ marginTop: 24, padding: "16px 18px", background: B_CREAM_2, borderRadius: 4 }}>
              <div style={{ fontFamily: b_mono, fontSize: 9.5, letterSpacing: "0.14em", textTransform: "uppercase", color: B_INK_50 }}>Pattern</div>
              <div style={{ fontFamily: b_display, fontSize: 15.5, fontWeight: 400, color: B_INK_70, lineHeight: 1.55, marginTop: 6, fontStyle: "italic" }}>
                "Strong through Day 1. Reacted to Day 2 evening but didn't post. On call Tuesday overnight. Missed this morning's window — first morning he's missed in the arc."
              </div>
            </div>

            <div style={{ marginTop: 18, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, fontFamily: b_body, fontSize: 12.5, color: B_INK_70 }}>
              <div>
                <div style={{ fontFamily: b_mono, fontSize: 9.5, letterSpacing: "0.14em", color: B_INK_50, textTransform: "uppercase" }}>Last in thread</div>
                <div style={{ marginTop: 4, color: B_INK }}>Tue 7:14 PM — reacted 🙏 to Hannah</div>
              </div>
              <div>
                <div style={{ fontFamily: b_mono, fontSize: 9.5, letterSpacing: "0.14em", color: B_INK_50, textTransform: "uppercase" }}>Auto-nudges fired</div>
                <div style={{ marginTop: 4, color: B_INK }}>Reminder 9:45 · Social queued 11:00</div>
              </div>
            </div>
          </div>

          {/* Right — suggested action */}
          <div>
            <div style={{ fontFamily: b_mono, fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", color: B_INK_50, marginBottom: 8 }}>
              Suggested next move · 1:1 from you
            </div>
            <div style={{ background: B_PAPER, border: `1px solid ${B_RULE}`, borderRadius: 4, overflow: "hidden" }}>
              <div style={{ padding: "12px 18px", background: B_CREAM_2, borderBottom: `1px solid ${B_RULE_SOFT}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ fontFamily: b_mono, fontSize: 10, letterSpacing: "0.1em", color: B_INK_70 }}>1:1 WhatsApp · Sana → James</div>
                <BTag tone="later">Not sent</BTag>
              </div>
              <div style={{ padding: "22px 22px", fontFamily: b_display, fontSize: 16, lineHeight: 1.55, color: B_INK }}>
                Hey James — no need to respond to this. Just wanted to say I saw you were on call Tuesday and the morning prompts catch most of us on the worst days. The arc keeps moving with or without a post. Glad you're here either way. — Sana
              </div>
              <div style={{ padding: "14px 18px", borderTop: `1px solid ${B_RULE_SOFT}`, display: "flex", gap: 10 }}>
                <button style={{ flex: 1, padding: "10px 16px", background: B_OLIVE, color: B_PAPER, border: "none", borderRadius: 3, fontFamily: b_body, fontSize: 13.5, fontWeight: 500, cursor: "pointer" }}>
                  Send privately
                </button>
                <button style={{ padding: "10px 14px", background: "transparent", color: B_INK, border: `1px solid ${B_RULE}`, borderRadius: 3, fontFamily: b_body, fontSize: 13.5, cursor: "pointer" }}>
                  Edit
                </button>
                <button style={{ padding: "10px 14px", background: "transparent", color: B_INK_50, border: `1px solid ${B_RULE}`, borderRadius: 3, fontFamily: b_body, fontSize: 13.5, cursor: "pointer" }}>
                  Hold
                </button>
              </div>
            </div>

            <div style={{ marginTop: 20, padding: "16px 20px", background: B_PAPER, borderLeft: `3px solid ${B_OCHRE}`, borderRadius: 0 }}>
              <div style={{ fontFamily: b_mono, fontSize: 9.5, letterSpacing: "0.14em", color: B_OCHRE_DEEP, textTransform: "uppercase" }}>
                Why this, not another ping
              </div>
              <div style={{ fontFamily: b_body, fontSize: 13.5, color: B_INK_70, marginTop: 6, lineHeight: 1.55 }}>
                The reminder SMS already fired at 9:45. The social nudge is queued for 11:00. Both are automated and arrive without a name attached. After two missed windows, the data says: this needs a human voice, not another ping.
              </div>
            </div>

            <div style={{ marginTop: 18, padding: "14px 18px", background: B_PAPER, border: `1px dashed ${B_RULE}`, borderRadius: 4 }}>
              <div style={{ fontFamily: b_mono, fontSize: 9.5, letterSpacing: "0.14em", color: B_INK_50, textTransform: "uppercase" }}>
                Alternative · ask a peer to reach
              </div>
              <div style={{ fontFamily: b_body, fontSize: 13, color: B_INK_70, marginTop: 6, lineHeight: 1.5 }}>
                Sofía (lead) is closest to James on the floor. A peer voice may land better than a facilitator one.
                <span style={{ marginLeft: 8, color: B_OLIVE_DEEP, fontWeight: 500 }}>Draft to Sofía →</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Screen 4 — Celebration drafter
// ─────────────────────────────────────────────────────────────────────────────

const B_Celebration = () => {
  return (
    <div style={{ width: 1280, height: 820, background: B_CREAM, color: B_INK, fontFamily: b_body, display: "flex" }}>
      <BSidebar active="celebration" />
      <div style={{ flex: 1, padding: "28px 36px", position: "relative", overflow: "hidden" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 14 }}>
          <div>
            <div style={{ fontFamily: b_mono, fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", color: B_INK_50 }}>
              Tomorrow's opener · drafted at 5:30 AM · ships 6:00 with Day 4 prompt
            </div>
            <div style={{ marginTop: 4, fontFamily: b_display, fontSize: 30, fontWeight: 500, letterSpacing: "-0.015em" }}>
              Closing yesterday's loop. <em style={{ color: B_OLIVE_DEEP, fontStyle: "italic" }}>Opening today's.</em>
            </div>
          </div>
          <BTag tone="later">v2 · revised 5:42 AM</BTag>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1.15fr 1fr", gap: 24 }}>
          {/* Left — preview as it'll land in WhatsApp */}
          <div>
            <div style={{ fontFamily: b_mono, fontSize: 9.5, letterSpacing: "0.14em", color: B_INK_50, textTransform: "uppercase", marginBottom: 8 }}>
              How it lands in the group thread
            </div>
            <div style={{ background: "#EBE0D2", border: `1px solid ${B_RULE}`, borderRadius: 8, padding: 14 }}>
              <div style={{ background: B_PAPER, borderRadius: 8, padding: "16px 18px", boxShadow: "0 1px 0.5px rgba(0,0,0,0.06)" }}>
                <div style={{ fontFamily: b_display, fontSize: 13.5, fontWeight: 600, color: B_TERRA, marginBottom: 6 }}>Sana (facilitator) · 6:00 AM</div>
                <div style={{ fontFamily: b_display, fontSize: 15.5, lineHeight: 1.55, color: B_INK, whiteSpace: "pre-wrap" }}>
                  {GL_CELEBRATION_DRAFT}
                </div>
              </div>
            </div>

            <div style={{ marginTop: 16, display: "flex", gap: 10 }}>
              <button style={{ padding: "11px 20px", background: B_OLIVE, color: B_PAPER, border: "none", borderRadius: 3, fontFamily: b_body, fontSize: 13.5, fontWeight: 500 }}>
                Approve · ships in 18 min
              </button>
              <button style={{ padding: "11px 18px", background: "transparent", color: B_INK, border: `1px solid ${B_RULE}`, borderRadius: 3, fontFamily: b_body, fontSize: 13.5 }}>
                Edit text
              </button>
              <button style={{ padding: "11px 18px", background: "transparent", color: B_INK, border: `1px solid ${B_RULE}`, borderRadius: 3, fontFamily: b_body, fontSize: 13.5 }}>
                Regenerate
              </button>
              <button style={{ marginLeft: "auto", padding: "11px 16px", background: "transparent", color: B_INK_50, border: "none", fontFamily: b_body, fontSize: 13 }}>
                Skip today
              </button>
            </div>
          </div>

          {/* Right — source material */}
          <div>
            <div style={{ fontFamily: b_mono, fontSize: 9.5, letterSpacing: "0.14em", color: B_INK_50, textTransform: "uppercase", marginBottom: 8 }}>
              Yesterday, in numbers
            </div>
            <div style={{ background: B_PAPER, border: `1px solid ${B_RULE_SOFT}`, borderRadius: 4, padding: "18px 20px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px 20px" }}>
                {[
                  { num: "6/6",  label: "Morning posts"      },
                  { num: "5/6",  label: "Evening posts"      },
                  { num: "23",   label: "Reactions exchanged"},
                  { num: "11",   label: "Longest thread"     },
                ].map((s, i) => (
                  <div key={i}>
                    <div style={{ fontFamily: b_display, fontSize: 26, fontWeight: 500, color: B_OLIVE_DEEP, lineHeight: 1, letterSpacing: "-0.01em" }}>{s.num}</div>
                    <div style={{ fontFamily: b_body, fontSize: 12, color: B_INK_70, marginTop: 4 }}>{s.label}</div>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 18, paddingTop: 16, borderTop: `1px solid ${B_RULE_SOFT}` }}>
                <div style={{ fontFamily: b_mono, fontSize: 9.5, letterSpacing: "0.14em", color: B_OCHRE_DEEP, textTransform: "uppercase" }}>Standout the draft cites</div>
                <div style={{ fontFamily: b_display, fontSize: 14, fontStyle: "italic", color: B_INK_70, marginTop: 6, lineHeight: 1.5 }}>
                  {GL_YESTERDAY.standout}
                </div>
                <button style={{ marginTop: 10, padding: "4px 10px", background: "transparent", color: B_INK_50, border: `1px solid ${B_RULE}`, borderRadius: 3, fontFamily: b_mono, fontSize: 9.5, letterSpacing: "0.1em", textTransform: "uppercase" }}>
                  ask AI to remove name
                </button>
              </div>
            </div>

            <div style={{ marginTop: 18, background: B_PAPER, border: `1px solid ${B_RULE_SOFT}`, borderRadius: 4, padding: "16px 20px" }}>
              <div style={{ fontFamily: b_mono, fontSize: 9.5, letterSpacing: "0.14em", color: B_INK_50, textTransform: "uppercase", marginBottom: 10 }}>Tone check</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px 12px" }}>
                {[
                  ["Warm", true], ["Group-level", true],
                  ["No callouts", true], ["≤ 80 words", true],
                  ["Sana's voice", true], ["No clinical jargon", true],
                ].map(([label, ok]) => (
                  <div key={label} style={{ display: "flex", gap: 8, alignItems: "center", fontFamily: b_body, fontSize: 12.5, color: B_INK_70 }}>
                    <div style={{ width: 16, height: 16, borderRadius: 3, background: ok ? B_OLIVE : "transparent", border: ok ? "none" : `1px solid ${B_RULE}`, color: B_PAPER, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 600 }}>
                      {ok ? "✓" : ""}
                    </div>
                    {label}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Screen 5 — WhatsApp thread (phone, B styling)
// ─────────────────────────────────────────────────────────────────────────────

const B_WhatsApp = () => {
  const findDoc = (id) => GL_DOCTORS.find(d => d.id === id);

  const messages = [
    { kind: "system", text: "Day 3 · Reaching · morning window opens" },
    { kind: "fac", who: "Sana · facilitator", t: "6:00 AM",
      text: 'Good morning Pod 2. Yesterday you named things out loud that most of us carry silently — invisible weeks, weather we don\'t admit to.\n\nToday is Day 3 — Reaching.\n\n"Who on this team could use one sentence from you today? Commit to it here."\n\nOne sentence is plenty. Window closes at 10:00.' },
    { kind: "msg", who: "sr", t: "6:42 AM", text: "Going to tell Marcus I noticed how he handled the family in 412 yesterday. He stayed an hour past sign-out and never mentioned it." },
    { kind: "msg", who: "pr", t: "7:11 AM", text: "Reaching out to our overnight RN Talia. She caught the K+ on bed 7 and I never thanked her properly." },
    { kind: "react", who: ["pr","mc","hw","dp"], emoji: "🙏" },
    { kind: "msg", who: "mc", t: "7:48 AM", text: "I want to ask Sofía how she's actually doing. Not in the hallway, not between pages. Real ask." },
    { kind: "msg", who: "hw", t: "8:02 AM", text: "Going to text my co-resident from intern year. We're all in this and I haven't reached out in months." },
    { kind: "msg", who: "dp", t: "9:23 AM", text: "One sentence to the case manager I keep snapping at when I'm behind. She doesn't deserve the edge in my voice." },
  ];

  return (
    <div style={{ width: 390, height: 844, background: "#E6DCC4", fontFamily: b_body, position: "relative", overflow: "hidden" }}>
      <div style={{ height: 44, display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 22px", fontFamily: "system-ui", fontSize: 14, fontWeight: 600, color: B_INK }}>
        <span>9:23</span>
        <span style={{ fontFamily: b_mono, fontSize: 11 }}>•••</span>
        <span>94%</span>
      </div>

      <div style={{ background: B_OLIVE_DEEP, color: B_PAPER, padding: "8px 14px", display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ fontSize: 22, lineHeight: 1 }}>‹</div>
        <div style={{ width: 36, height: 36, borderRadius: "50%", background: B_OCHRE, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: b_display, fontSize: 14, fontWeight: 600, color: B_INK }}>GL</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: b_body, fontSize: 15, fontWeight: 600 }}>Growth Leap · Pod 2</div>
          <div style={{ fontFamily: b_body, fontSize: 11, opacity: 0.85 }}>6 hospitalists · 1 facilitator</div>
        </div>
        <div style={{ fontSize: 18 }}>⋮</div>
      </div>

      <div style={{ padding: "14px 12px 80px", display: "flex", flexDirection: "column", gap: 8, height: 642, overflow: "hidden" }}>
        {messages.map((m, i) => {
          if (m.kind === "system") {
            return (
              <div key={i} style={{ alignSelf: "center", padding: "4px 12px", background: "rgba(255,255,255,0.65)", borderRadius: 4, fontFamily: b_mono, fontSize: 9.5, letterSpacing: "0.08em", color: B_INK_50, textTransform: "uppercase" }}>
                {m.text}
              </div>
            );
          }
          if (m.kind === "react") {
            return (
              <div key={i} style={{ alignSelf: "flex-start", marginLeft: 12, marginTop: -4, fontFamily: b_body, fontSize: 11, color: B_INK_50, background: B_PAPER, padding: "2px 8px", borderRadius: 999, border: `1px solid ${B_RULE_SOFT}` }}>
                {m.emoji} {m.who.length}
              </div>
            );
          }
          const isFac = m.kind === "fac";
          const doc = !isFac && findDoc(m.who);
          const name = isFac ? m.who : `${doc.first} ${doc.last}`;
          const nameColor = isFac ? B_TERRA : doc.color;
          return (
            <div key={i} style={{ alignSelf: "flex-start", maxWidth: "85%", background: B_PAPER, borderRadius: 8, padding: "8px 12px 6px", boxShadow: "0 1px 0.5px rgba(0,0,0,0.08)" }}>
              <div style={{ fontFamily: b_display, fontSize: 13, color: nameColor, fontWeight: 600, marginBottom: 2 }}>{name}</div>
              <div style={{ fontFamily: b_body, fontSize: 14, lineHeight: 1.4, color: B_INK, whiteSpace: "pre-wrap" }}>{m.text}</div>
              <div style={{ fontFamily: b_mono, fontSize: 9.5, color: B_INK_50, textAlign: "right", marginTop: 2 }}>{m.t}</div>
            </div>
          );
        })}
      </div>

      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "10px 12px", background: B_CREAM_2, display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{ flex: 1, background: B_PAPER, borderRadius: 20, padding: "8px 14px", fontFamily: b_body, fontSize: 13.5, color: B_INK_50 }}>
          One sentence will do…
        </div>
        <div style={{ width: 36, height: 36, borderRadius: "50%", background: B_OLIVE_DEEP, color: B_PAPER, display: "flex", alignItems: "center", justifyContent: "center" }}>↑</div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Screen 6 — SMS nudges (phone, B styling)
// ─────────────────────────────────────────────────────────────────────────────

const B_SMS = () => {
  return (
    <div style={{ width: 390, height: 844, background: "#1d1c14", fontFamily: b_body, position: "relative", overflow: "hidden", color: "#fff" }}>
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(120% 60% at 50% 0%, rgba(107,122,72,0.22), transparent 60%)" }}></div>

      <div style={{ position: "relative", height: 44, display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 22px", fontFamily: "system-ui", fontSize: 14, fontWeight: 600 }}>
        <span>9:45</span>
        <span style={{ fontFamily: b_mono, fontSize: 11 }}>•••</span>
        <span>92%</span>
      </div>

      <div style={{ position: "relative", textAlign: "center", padding: "16px 0 8px" }}>
        <div style={{ fontFamily: b_body, fontSize: 14, opacity: 0.7 }}>Wednesday, May 22</div>
        <div style={{ fontFamily: b_display, fontSize: 78, fontWeight: 300, letterSpacing: "-0.025em", lineHeight: 1, marginTop: 6 }}>9:45</div>
      </div>

      <div style={{ position: "relative", padding: "20px 14px", display: "flex", flexDirection: "column", gap: 14 }}>
        <div>
          <div style={{ fontFamily: b_mono, fontSize: 9.5, letterSpacing: "0.16em", color: "rgba(255,255,255,0.55)", textTransform: "uppercase", margin: "0 4px 6px" }}>
            Just now · 15 min before window closes
          </div>
          <div style={{ background: "rgba(255,255,255,0.13)", backdropFilter: "blur(20px)", borderRadius: 16, padding: "12px 14px", border: "1px solid rgba(255,255,255,0.08)" }}>
            <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 6 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 22, height: 22, borderRadius: 5, background: B_OCHRE, color: B_INK, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: b_display, fontSize: 10, fontWeight: 600 }}>GL</div>
                <div style={{ fontFamily: b_body, fontSize: 13, fontWeight: 600 }}>Messages · Growth Leap</div>
              </div>
              <div style={{ fontFamily: b_body, fontSize: 11, opacity: 0.7 }}>now</div>
            </div>
            <div style={{ fontFamily: b_body, fontSize: 14.5, lineHeight: 1.5 }}>{GL_SMS_REMINDER}</div>
          </div>
        </div>

        <div>
          <div style={{ fontFamily: b_mono, fontSize: 9.5, letterSpacing: "0.16em", color: "rgba(255,255,255,0.55)", textTransform: "uppercase", margin: "0 4px 6px" }}>
            Queued · fires 11:00 · only if still quiet
          </div>
          <div style={{ background: "rgba(255,255,255,0.08)", backdropFilter: "blur(20px)", borderRadius: 16, padding: "12px 14px", border: "1px dashed rgba(255,255,255,0.22)", opacity: 0.78 }}>
            <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 6 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 22, height: 22, borderRadius: 5, background: B_OCHRE, color: B_INK, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: b_display, fontSize: 10, fontWeight: 600 }}>GL</div>
                <div style={{ fontFamily: b_body, fontSize: 13, fontWeight: 600 }}>Messages · Growth Leap</div>
              </div>
              <div style={{ fontFamily: b_body, fontSize: 11, opacity: 0.7 }}>in 1h 15m</div>
            </div>
            <div style={{ fontFamily: b_body, fontSize: 14.5, lineHeight: 1.5 }}>{GL_SMS_SOCIAL}</div>
          </div>
        </div>

        <div style={{ marginTop: 20, padding: "14px 16px", border: "1px solid rgba(255,255,255,0.14)", borderRadius: 10, background: "rgba(0,0,0,0.25)" }}>
          <div style={{ fontFamily: b_mono, fontSize: 9, letterSpacing: "0.16em", color: "rgba(255,255,255,0.6)", textTransform: "uppercase" }}>For James Okafor · Wed May 22</div>
          <div style={{ marginTop: 10, fontFamily: b_display, fontSize: 14, lineHeight: 1.55, color: "rgba(255,255,255,0.88)", fontStyle: "italic" }}>
            "The reminder removes the memory burden. The social nudge shifts the frame from 'you haven't done your task' to 'your team is here.'"
          </div>
          <div style={{ marginTop: 12, display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, fontFamily: b_mono, fontSize: 9.5, letterSpacing: "0.08em" }}>
            <div>
              <div style={{ opacity: 0.55, textTransform: "uppercase" }}>Channel</div>
              <div style={{ marginTop: 2 }}>SMS · 1:1</div>
            </div>
            <div>
              <div style={{ opacity: 0.55, textTransform: "uppercase" }}>Audience</div>
              <div style={{ marginTop: 2 }}>1 of 6 today</div>
            </div>
            <div>
              <div style={{ opacity: 0.55, textTransform: "uppercase" }}>Day</div>
              <div style={{ marginTop: 2 }}>3 of 5</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

Object.assign(window, { B_Today, B_Arc, B_Quiet, B_Celebration, B_WhatsApp, B_SMS });
