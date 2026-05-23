// Direction A — "Editorial"
// Warm paper off-white, Source Serif 4 display + body, JetBrains Mono for data,
// single rust accent. Magazine-like restraint and generous whitespace.

const A_PAPER   = "#F6F1E8";
const A_CARD    = "#FBF8F1";
const A_INK     = "#1F1A14";
const A_INK_70  = "#4A4036";
const A_INK_50  = "#7A6E5E";
const A_RULE    = "#D8CDB5";
const A_RULE_SOFT = "#E8DFC9";
const A_RUST    = "#B5733F";
const A_RUST_INK = "#7A4823";
const A_SAGE    = "#8A9376";
const A_BLUSH   = "#D4A689";

const a_serif = `'Source Serif 4', 'Source Serif Pro', Georgia, serif`;
const a_mono  = `'JetBrains Mono', 'IBM Plex Mono', ui-monospace, monospace`;

// ─────────────────────────────────────────────────────────────────────────────
// Shared chrome — small caps eyebrow, rules, doctor avatar disks
// ─────────────────────────────────────────────────────────────────────────────

const AEyebrow = ({ children, style }) => (
  <div style={{
    fontFamily: a_mono, fontSize: 10, letterSpacing: "0.18em",
    textTransform: "uppercase", color: A_INK_50, ...style,
  }}>{children}</div>
);

const ARule = ({ color = A_RULE, style }) => (
  <div style={{ height: 1, background: color, ...style }}></div>
);

const AAvatar = ({ doc, size = 32 }) => (
  <div style={{
    width: size, height: size, borderRadius: "50%",
    background: doc.color, color: "#FBF8F1",
    fontFamily: a_serif, fontSize: size * 0.42, fontWeight: 500,
    display: "flex", alignItems: "center", justifyContent: "center",
    flexShrink: 0, letterSpacing: "-0.01em",
  }}>{doc.initials}</div>
);

const AStateChip = ({ state }) => {
  // state: 'done' | 'open' | 'quiet' | 'pending'
  const map = {
    done:    { bg: A_RUST, fg: "#FBF8F1", label: "in" },
    open:    { bg: "transparent", fg: A_INK_50, label: "open", border: `1px solid ${A_RULE}` },
    quiet:   { bg: "transparent", fg: A_RUST_INK, label: "quiet", border: `1px solid ${A_RUST}` },
    pending: { bg: "transparent", fg: A_INK_50, label: "later", border: `1px dashed ${A_RULE}` },
  };
  const m = map[state];
  return (
    <span style={{
      display: "inline-flex", alignItems: "center",
      padding: "2px 8px", borderRadius: 999,
      background: m.bg, color: m.fg, border: m.border || "none",
      fontFamily: a_mono, fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase",
    }}>{m.label}</span>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Screen 1 — Today snapshot
// ─────────────────────────────────────────────────────────────────────────────

const A_Today = () => {
  const day3 = GL_ARC[2];
  const findDoc = (id) => GL_DOCTORS.find(d => d.id === id);

  return (
    <div style={{
      width: 1280, height: 820, background: A_PAPER, color: A_INK,
      fontFamily: a_serif, position: "relative", overflow: "hidden",
    }}>
      {/* Top bar */}
      <div style={{ padding: "28px 56px 0", display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 24 }}>
          <div style={{ fontFamily: a_serif, fontSize: 22, fontStyle: "italic", letterSpacing: "-0.01em" }}>
            Growth Leap
          </div>
          <AEyebrow>{GL_COHORT_NAME}</AEyebrow>
        </div>
        <AEyebrow>{GL_TODAY} · {GL_NOW} · Facilitator: {GL_FACILITATOR}</AEyebrow>
      </div>

      {/* Nav strip */}
      <div style={{ padding: "20px 56px 16px", display: "flex", gap: 28, alignItems: "center" }}>
        {[
          { label: "Today", active: true },
          { label: "Arc" },
          { label: "Quiet" },
          { label: "Celebration" },
          { label: "Settings" },
        ].map(n => (
          <div key={n.label} style={{
            fontFamily: a_serif, fontSize: 15,
            color: n.active ? A_INK : A_INK_50,
            paddingBottom: 6,
            borderBottom: n.active ? `2px solid ${A_RUST}` : "2px solid transparent",
          }}>{n.label}</div>
        ))}
      </div>
      <ARule style={{ margin: "0 56px" }} />

      {/* Hero — today's prompt */}
      <div style={{ padding: "32px 56px 24px", display: "grid", gridTemplateColumns: "1fr auto", gap: 40, alignItems: "end" }}>
        <div>
          <AEyebrow>Day 3 of 5 · Reaching · Morning prompt · closed 10:00 AM</AEyebrow>
          <div style={{ marginTop: 14, fontFamily: a_serif, fontSize: 38, lineHeight: 1.15, letterSpacing: "-0.015em", maxWidth: 780 }}>
            "Who on this team could use <em style={{ color: A_RUST_INK }}>one sentence</em> from you today? Commit to it here."
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontFamily: a_mono, fontSize: 48, color: A_RUST, letterSpacing: "-0.02em", lineHeight: 1 }}>5<span style={{ color: A_INK_50, fontSize: 24 }}> / 6</span></div>
          <AEyebrow style={{ marginTop: 6 }}>responded this morning</AEyebrow>
        </div>
      </div>

      {/* Main grid — roster left, feed right */}
      <div style={{ padding: "8px 56px 0", display: "grid", gridTemplateColumns: "380px 1fr", gap: 48 }}>
        {/* Roster */}
        <div>
          <AEyebrow style={{ marginBottom: 12 }}>Pod roster · this morning</AEyebrow>
          <ARule color={A_RULE_SOFT} />
          {GL_DOCTORS.map((d, i) => {
            const stateMap = { pr: "done", mc: "done", sr: "done", jo: "quiet", hw: "done", dp: "done" };
            const post = GL_TODAY_POSTS.find(p => p.who === d.id);
            return (
              <div key={d.id} style={{ padding: "14px 0", borderBottom: `1px solid ${A_RULE_SOFT}`, display: "flex", alignItems: "center", gap: 14 }}>
                <AAvatar doc={d} size={36} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: a_serif, fontSize: 15, color: A_INK }}>
                    {d.first} {d.last}
                  </div>
                  <div style={{ fontFamily: a_mono, fontSize: 10, color: A_INK_50, letterSpacing: "0.04em", marginTop: 2 }}>
                    {d.role} · yr {d.years}{post ? ` · posted ${post.t}` : (stateMap[d.id] === "quiet" ? " · no response" : "")}
                  </div>
                </div>
                <AStateChip state={stateMap[d.id]} />
              </div>
            );
          })}
        </div>

        {/* Feed */}
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 12 }}>
            <AEyebrow>What they committed to</AEyebrow>
            <AEyebrow style={{ color: A_INK_50 }}>WhatsApp · Pacific Mercy Pod 2 · read-only mirror</AEyebrow>
          </div>
          <ARule color={A_RULE_SOFT} />
          {GL_TODAY_POSTS.map((p) => {
            const d = findDoc(p.who);
            return (
              <div key={p.t} style={{ padding: "18px 0", borderBottom: `1px solid ${A_RULE_SOFT}`, display: "grid", gridTemplateColumns: "40px 1fr 60px", gap: 14, alignItems: "start" }}>
                <AAvatar doc={d} size={36} />
                <div>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
                    <div style={{ fontFamily: a_serif, fontSize: 14, fontWeight: 600 }}>{d.first} {d.last}</div>
                    <div style={{ fontFamily: a_mono, fontSize: 10, color: A_INK_50, letterSpacing: "0.04em" }}>{p.t}</div>
                  </div>
                  <div style={{ fontFamily: a_serif, fontSize: 15.5, lineHeight: 1.5, marginTop: 4, color: A_INK_70 }}>
                    "{p.text}"
                  </div>
                </div>
                <div style={{ textAlign: "right", fontFamily: a_mono, fontSize: 10, color: A_INK_50, paddingTop: 4 }}>
                  {[2, 4, 3, 5, 1][GL_TODAY_POSTS.indexOf(p)]} react
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom strip — nudge schedule */}
      <div style={{ position: "absolute", left: 56, right: 56, bottom: 24, display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 24, paddingTop: 20, borderTop: `1px solid ${A_RULE}` }}>
        {[
          { time: "06:00", label: "Prompt opened", state: "past" },
          { time: "09:45", label: "Reminder SMS · sent to J. Okafor", state: "past", accent: true },
          { time: "11:00", label: "Social nudge SMS · queued for J. Okafor", state: "live", accent: true },
          { time: "18:00", label: "Evening prompt opens", state: "future" },
        ].map((s, i) => (
          <div key={i}>
            <div style={{ fontFamily: a_mono, fontSize: 11, letterSpacing: "0.1em", color: s.state === "live" ? A_RUST : A_INK_50 }}>{s.time}</div>
            <div style={{ fontFamily: a_serif, fontSize: 14, color: s.state === "future" ? A_INK_50 : A_INK, marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Screen 2 — 5-day arc trend
// ─────────────────────────────────────────────────────────────────────────────

const A_Arc = () => {
  // engagement key: '✓' = posted, '·' = quiet/missed, ' ' = future
  const cellFor = (mark) => {
    if (mark === "✓") return { bg: A_RUST, fg: "#FBF8F1", label: "" };
    if (mark === "·") return { bg: "transparent", fg: A_RUST_INK, label: "—", border: `1px solid ${A_RUST}` };
    return { bg: "transparent", fg: A_INK_50, label: "", border: `1px dashed ${A_RULE}` };
  };

  return (
    <div style={{
      width: 1280, height: 820, background: A_PAPER, color: A_INK,
      fontFamily: a_serif, position: "relative", overflow: "hidden",
    }}>
      <div style={{ padding: "28px 56px 0" }}>
        <AEyebrow>Growth Leap · {GL_COHORT_NAME} · Arc view</AEyebrow>
        <div style={{ marginTop: 12, fontFamily: a_serif, fontSize: 36, letterSpacing: "-0.015em" }}>
          Five days of reaching, naming, returning.
        </div>
        <div style={{ marginTop: 8, fontFamily: a_serif, fontSize: 16, color: A_INK_50, maxWidth: 760, lineHeight: 1.5 }}>
          One row per doctor. Each day has a morning commitment (left half) and an evening reflection (right half). A filled cell means they posted. An outlined cell means the window closed without a post.
        </div>
      </div>

      <div style={{ padding: "32px 56px 0" }}>
        {/* Day headers */}
        <div style={{ display: "grid", gridTemplateColumns: "200px repeat(5, 1fr) 120px", gap: 16, paddingBottom: 12, borderBottom: `1px solid ${A_RULE}` }}>
          <div></div>
          {GL_ARC.map((d, i) => (
            <div key={d.day} style={{ textAlign: "center" }}>
              <AEyebrow>Day {d.day}</AEyebrow>
              <div style={{ fontFamily: a_serif, fontSize: 18, fontStyle: "italic", marginTop: 4, color: i === 2 ? A_RUST_INK : A_INK }}>
                {d.theme}
              </div>
            </div>
          ))}
          <div style={{ textAlign: "right" }}><AEyebrow>Arc rate</AEyebrow></div>
        </div>

        {/* Rows */}
        {GL_DOCTORS.map((doc, ri) => {
          const eng = GL_ENGAGEMENT[doc.id];
          const total = eng.reduce((acc, day) => acc + [...day].filter(c => c === "✓").length, 0);
          const possible = 5; // 3 mornings posted/possible, etc — show 'so far'
          // Count cells through Day 3 morning = 5 cells total
          const seen = 5;
          return (
            <div key={doc.id} style={{ display: "grid", gridTemplateColumns: "200px repeat(5, 1fr) 120px", gap: 16, padding: "16px 0", borderBottom: `1px solid ${A_RULE_SOFT}`, alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <AAvatar doc={doc} size={32} />
                <div>
                  <div style={{ fontFamily: a_serif, fontSize: 15 }}>{doc.first} {doc.last}</div>
                  <div style={{ fontFamily: a_mono, fontSize: 10, color: A_INK_50 }}>yr {doc.years}</div>
                </div>
              </div>
              {eng.map((day, di) => {
                const m = cellFor(day[0]);
                const e = cellFor(day[1]);
                return (
                  <div key={di} style={{ display: "flex", gap: 6, justifyContent: "center" }}>
                    <div style={{
                      width: 42, height: 42, borderRadius: 6,
                      background: m.bg, color: m.fg, border: m.border || "none",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontFamily: a_mono, fontSize: 14,
                    }}>{m.label || (day[0] === "✓" ? "AM" : "")}</div>
                    <div style={{
                      width: 42, height: 42, borderRadius: 6,
                      background: e.bg, color: e.fg, border: e.border || "none",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontFamily: a_mono, fontSize: 14,
                    }}>{e.label || (day[1] === "✓" ? "PM" : "")}</div>
                  </div>
                );
              })}
              {/* Arc rate */}
              {(() => {
                const posted = eng.flatMap(d => [...d]).filter(c => c === "✓").length;
                const ratio = posted / 5;
                return (
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontFamily: a_mono, fontSize: 22, color: ratio < 0.6 ? A_RUST : A_INK }}>
                      {posted}<span style={{ color: A_INK_50, fontSize: 14 }}> / 5</span>
                    </div>
                    <div style={{ height: 4, background: A_RULE_SOFT, marginTop: 6, borderRadius: 2, overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${ratio * 100}%`, background: ratio < 0.6 ? A_RUST : doc.color }}></div>
                    </div>
                  </div>
                );
              })()}
            </div>
          );
        })}
      </div>

      {/* Footer — collective */}
      <div style={{ position: "absolute", left: 56, right: 56, bottom: 32, paddingTop: 20, borderTop: `2px solid ${A_INK}`, display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 32 }}>
        {[
          { num: "27", denom: "/ 30", label: "Posts so far (M+E through Day 3 AM)" },
          { num: "90%", denom: "", label: "Pod engagement rate" },
          { num: "11", denom: "msg", label: "Longest thread · Tuesday evening" },
          { num: "1", denom: "of 6", label: "Quiet doctor needs a check-in" },
        ].map((s, i) => (
          <div key={i}>
            <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
              <div style={{ fontFamily: a_mono, fontSize: 32, color: i === 3 ? A_RUST : A_INK, letterSpacing: "-0.02em" }}>{s.num}</div>
              <div style={{ fontFamily: a_mono, fontSize: 13, color: A_INK_50 }}>{s.denom}</div>
            </div>
            <div style={{ fontFamily: a_serif, fontSize: 13, color: A_INK_70, marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Screen 3 — Quiet-doctor radar
// ─────────────────────────────────────────────────────────────────────────────

const A_Quiet = () => {
  const james = GL_DOCTORS.find(d => d.id === "jo");
  return (
    <div style={{
      width: 1280, height: 820, background: A_PAPER, color: A_INK,
      fontFamily: a_serif, position: "relative", overflow: "hidden",
    }}>
      <div style={{ padding: "28px 56px 0" }}>
        <AEyebrow>Growth Leap · Pod 2 · Quiet doctor radar</AEyebrow>
        <div style={{ marginTop: 12, fontFamily: a_serif, fontSize: 36, letterSpacing: "-0.015em" }}>
          One doctor needs a personal check-in.
        </div>
        <div style={{ marginTop: 6, fontFamily: a_serif, fontSize: 15, color: A_INK_50, maxWidth: 720 }}>
          A missed prompt is a shift. Two missed prompts is a signal. Reach before the third.
        </div>
      </div>

      <div style={{ padding: "32px 56px 0", display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: 48 }}>
        {/* Left — the doctor */}
        <div>
          <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
            <AAvatar doc={james} size={88} />
            <div>
              <div style={{ fontFamily: a_serif, fontSize: 32, letterSpacing: "-0.01em" }}>{james.first} {james.last}</div>
              <div style={{ fontFamily: a_mono, fontSize: 11, color: A_INK_50, letterSpacing: "0.08em", marginTop: 6 }}>
                HOSPITALIST · YEAR 6 · ON CALL TUE OVERNIGHT
              </div>
            </div>
          </div>

          <div style={{ marginTop: 28, padding: "20px 24px", background: A_CARD, border: `1px solid ${A_RULE_SOFT}`, borderRadius: 4 }}>
            <AEyebrow>Pattern</AEyebrow>
            <div style={{ fontFamily: a_serif, fontSize: 17, color: A_INK_70, lineHeight: 1.5, marginTop: 8 }}>
              Strong through Day 1. Reacted to Day 2 evening but didn't post.
              On call Tuesday overnight. Missed this morning's prompt — first morning he's missed.
            </div>
            <div style={{ marginTop: 18, fontFamily: a_mono, fontSize: 10, letterSpacing: "0.08em", color: A_INK_50 }}>HIS ARC</div>
            <div style={{ marginTop: 8, display: "flex", gap: 6 }}>
              {GL_ENGAGEMENT.jo.map((day, di) => (
                <div key={di} style={{ display: "flex", gap: 4 }}>
                  {[...day].map((c, ci) => (
                    <div key={ci} style={{
                      width: 28, height: 28, borderRadius: 4,
                      background: c === "✓" ? A_RUST : "transparent",
                      border: c === "✓" ? "none" : `1px ${c === "·" ? "solid" : "dashed"} ${c === "·" ? A_RUST : A_RULE}`,
                    }}></div>
                  ))}
                  {di < 4 && <div style={{ width: 6 }}></div>}
                </div>
              ))}
            </div>
            <div style={{ marginTop: 8, display: "flex", gap: 6, fontFamily: a_mono, fontSize: 9, color: A_INK_50, letterSpacing: "0.06em" }}>
              {["D1","D2","D3","D4","D5"].map(l => <div key={l} style={{ width: 62, textAlign: "center" }}>{l}</div>)}
            </div>
          </div>

          <div style={{ marginTop: 24 }}>
            <AEyebrow>Last seen in thread</AEyebrow>
            <div style={{ fontFamily: a_serif, fontSize: 16, marginTop: 6 }}>
              Tuesday <span style={{ color: A_INK_50 }}>at</span> 7:14 PM — reacted with 🙏 to Hannah's evening post.
            </div>
          </div>
        </div>

        {/* Right — what to do */}
        <div>
          <AEyebrow>Suggested action · drafted for you</AEyebrow>
          <div style={{ marginTop: 14, background: A_CARD, border: `1px solid ${A_RULE}`, borderRadius: 6, overflow: "hidden" }}>
            <div style={{ padding: "14px 20px", borderBottom: `1px solid ${A_RULE_SOFT}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ fontFamily: a_mono, fontSize: 10, letterSpacing: "0.1em", color: A_INK_50 }}>
                1:1 WHATSAPP · FROM SANA → JAMES
              </div>
              <div style={{ fontFamily: a_mono, fontSize: 10, color: A_RUST_INK }}>NOT SENT</div>
            </div>
            <div style={{ padding: "22px 24px", fontFamily: a_serif, fontSize: 17, lineHeight: 1.55, color: A_INK }}>
              Hey James — no need to respond to this. Just wanted to say I saw you were on call Tuesday and the morning prompts catch most of us on the worst days. The arc keeps moving with or without a post. Glad you're here either way. — Sana
            </div>
            <div style={{ padding: "14px 20px", borderTop: `1px solid ${A_RULE_SOFT}`, display: "flex", gap: 10 }}>
              <button style={{ flex: 1, padding: "10px 16px", background: A_RUST, color: "#FBF8F1", border: "none", borderRadius: 4, fontFamily: a_serif, fontSize: 14, cursor: "pointer" }}>
                Send privately
              </button>
              <button style={{ padding: "10px 16px", background: "transparent", color: A_INK, border: `1px solid ${A_RULE}`, borderRadius: 4, fontFamily: a_serif, fontSize: 14, cursor: "pointer" }}>
                Edit
              </button>
              <button style={{ padding: "10px 16px", background: "transparent", color: A_INK_50, border: `1px solid ${A_RULE}`, borderRadius: 4, fontFamily: a_serif, fontSize: 14, cursor: "pointer" }}>
                Hold off
              </button>
            </div>
          </div>

          <div style={{ marginTop: 28 }}>
            <AEyebrow>Why this, not a system nudge</AEyebrow>
            <div style={{ fontFamily: a_serif, fontSize: 15, lineHeight: 1.55, color: A_INK_70, marginTop: 8 }}>
              The reminder SMS already fired at 9:45. The social nudge is queued for 11:00. Both are automated and arrive without a name attached. After two missed windows the data says: this needs a human voice, not another ping.
            </div>
          </div>

          <div style={{ marginTop: 28, padding: "16px 20px", borderLeft: `2px solid ${A_RUST}` }}>
            <AEyebrow style={{ color: A_RUST_INK }}>Quiet threshold</AEyebrow>
            <div style={{ fontFamily: a_serif, fontSize: 14, color: A_INK_70, marginTop: 6, lineHeight: 1.5 }}>
              Flags appear after 2 consecutive missed windows. Adjust per cohort in Settings.
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

const A_Celebration = () => {
  return (
    <div style={{
      width: 1280, height: 820, background: A_PAPER, color: A_INK,
      fontFamily: a_serif, position: "relative", overflow: "hidden",
    }}>
      <div style={{ padding: "28px 56px 0" }}>
        <AEyebrow>Growth Leap · Pod 2 · Celebration · Drafted at 5:30 AM · Ships at 6:00 AM with Day 3 prompt</AEyebrow>
        <div style={{ marginTop: 12, fontFamily: a_serif, fontSize: 36, letterSpacing: "-0.015em" }}>
          Yesterday they named the invisible.
        </div>
      </div>

      <div style={{ padding: "28px 56px 0", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48 }}>
        {/* Left — the draft */}
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 10 }}>
            <AEyebrow>AI draft · review and approve</AEyebrow>
            <AEyebrow style={{ color: A_INK_50 }}>v2 · revised 5:42 AM</AEyebrow>
          </div>
          <div style={{ background: A_CARD, border: `1px solid ${A_RULE}`, borderRadius: 6, padding: "28px 32px", fontFamily: a_serif, fontSize: 17, lineHeight: 1.65, whiteSpace: "pre-wrap", color: A_INK, minHeight: 360 }}>
            {GL_CELEBRATION_DRAFT}
          </div>
          <div style={{ marginTop: 18, display: "flex", gap: 10 }}>
            <button style={{ padding: "12px 22px", background: A_RUST, color: "#FBF8F1", border: "none", borderRadius: 4, fontFamily: a_serif, fontSize: 15 }}>
              Approve · ships in 18 min
            </button>
            <button style={{ padding: "12px 22px", background: "transparent", color: A_INK, border: `1px solid ${A_RULE}`, borderRadius: 4, fontFamily: a_serif, fontSize: 15 }}>
              Edit
            </button>
            <button style={{ padding: "12px 22px", background: "transparent", color: A_INK, border: `1px solid ${A_RULE}`, borderRadius: 4, fontFamily: a_serif, fontSize: 15 }}>
              Regenerate
            </button>
            <button style={{ marginLeft: "auto", padding: "12px 16px", background: "transparent", color: A_INK_50, border: "none", fontFamily: a_serif, fontSize: 14 }}>
              Skip today
            </button>
          </div>
          <div style={{ marginTop: 14, fontFamily: a_mono, fontSize: 10, letterSpacing: "0.08em", color: A_INK_50 }}>
            CONSTRAINTS: GROUP-LEVEL · NO INDIVIDUAL CALLOUTS · ≤ 80 WORDS · ENDS WITH FACILITATOR INITIAL
          </div>
        </div>

        {/* Right — what it's drawn from */}
        <div>
          <AEyebrow>Drawn from yesterday</AEyebrow>
          <div style={{ marginTop: 14, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            {[
              { num: GL_YESTERDAY.morningParticipation, label: "Morning posts" },
              { num: GL_YESTERDAY.eveningParticipation, label: "Evening posts" },
              { num: GL_YESTERDAY.reactions,            label: "Reactions exchanged" },
              { num: GL_YESTERDAY.longestThread,        label: "Longest thread" },
            ].map((s, i) => (
              <div key={i} style={{ padding: "16px 18px", background: A_CARD, border: `1px solid ${A_RULE_SOFT}`, borderRadius: 4 }}>
                <div style={{ fontFamily: a_mono, fontSize: 22, color: A_INK }}>{s.num}</div>
                <div style={{ fontFamily: a_serif, fontSize: 13, color: A_INK_50, marginTop: 4 }}>{s.label}</div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 24, padding: "18px 20px", borderLeft: `2px solid ${A_RUST}` }}>
            <AEyebrow style={{ color: A_RUST_INK }}>Standout the draft cites</AEyebrow>
            <div style={{ fontFamily: a_serif, fontSize: 16, color: A_INK_70, marginTop: 6, lineHeight: 1.55 }}>
              {GL_YESTERDAY.standout}
            </div>
            <div style={{ marginTop: 14 }}>
              <button style={{ padding: "6px 12px", background: "transparent", color: A_INK_50, border: `1px solid ${A_RULE}`, borderRadius: 4, fontFamily: a_mono, fontSize: 10, letterSpacing: "0.08em" }}>
                ASK AI TO REMOVE NAME
              </button>
            </div>
          </div>

          <div style={{ marginTop: 28 }}>
            <AEyebrow>Tone check</AEyebrow>
            <div style={{ marginTop: 12, display: "grid", gridTemplateColumns: "auto 1fr", gap: "10px 16px", fontFamily: a_serif, fontSize: 14 }}>
              {[
                ["Warm", true], ["Group-level", true], ["No callouts", true], ["Under 80 words", true], ["Ends with Sana's voice", true], ["No clinical jargon", true],
              ].map(([label, ok]) => (
                <React.Fragment key={label}>
                  <div style={{ fontFamily: a_mono, fontSize: 11, color: ok ? A_RUST : A_INK_50, letterSpacing: "0.06em" }}>{ok ? "✓" : "—"}</div>
                  <div style={{ color: A_INK_70 }}>{label}</div>
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Screen 5 — WhatsApp thread (phone)
// ─────────────────────────────────────────────────────────────────────────────

const A_WhatsApp = () => {
  const findDoc = (id) => GL_DOCTORS.find(d => d.id === id);

  const messages = [
    { kind: "system", text: "Day 3 of 5 — Reaching · Morning prompt opens" },
    { kind: "fac", who: "Sana (facilitator)", t: "6:00 AM", text: 'Good morning Pod 2. Yesterday you named things out loud that most of us carry silently — invisible weeks, weather we don\'t admit to. Six in this morning, five in the evening.\n\nToday is Day 3 — Reaching.\n\n"Who on this team could use one sentence from you today? Commit to it here."\n\nOne sentence is plenty. Window closes at 10:00.' },
    { kind: "msg", who: "sr", t: "6:42 AM", text: "Going to tell Marcus I noticed how he handled the family in 412 yesterday. He stayed an hour past sign-out and never mentioned it." },
    { kind: "msg", who: "pr", t: "7:11 AM", text: "Reaching out to our overnight RN Talia. She caught the K+ on bed 7 and I never thanked her properly." },
    { kind: "react", on: "sr", who: ["pr","mc","hw","dp"], emoji: "🙏", t: "7:13 AM" },
    { kind: "msg", who: "mc", t: "7:48 AM", text: "I want to ask Sofía how she's actually doing. Not in the hallway, not between pages. Real ask." },
    { kind: "msg", who: "hw", t: "8:02 AM", text: "Going to text my co-resident from intern year. We're all in this and I haven't reached out in months." },
    { kind: "msg", who: "dp", t: "9:23 AM", text: "One sentence to the case manager I keep snapping at when I'm behind. She doesn't deserve the edge in my voice." },
  ];

  return (
    <div style={{ width: 390, height: 844, background: "#EBE0D2", fontFamily: a_serif, position: "relative", overflow: "hidden" }}>
      {/* status bar */}
      <div style={{ height: 44, display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 22px", fontFamily: "system-ui", fontSize: 14, fontWeight: 600, color: A_INK }}>
        <span>9:23</span>
        <span style={{ fontFamily: a_mono, fontSize: 11 }}>•••</span>
        <span>94%</span>
      </div>
      {/* whatsapp header */}
      <div style={{ background: "#075E54", color: "#fff", padding: "8px 14px", display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ fontSize: 22, lineHeight: 1 }}>‹</div>
        <div style={{ width: 36, height: 36, borderRadius: "50%", background: A_RUST, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: a_serif, fontSize: 14, fontWeight: 600 }}>GL</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: "system-ui", fontSize: 15, fontWeight: 600 }}>Growth Leap · Pod 2</div>
          <div style={{ fontFamily: "system-ui", fontSize: 11, opacity: 0.85 }}>6 hospitalists · 1 facilitator</div>
        </div>
        <div style={{ fontSize: 18 }}>⋮</div>
      </div>

      {/* messages */}
      <div style={{ padding: "14px 12px 80px", display: "flex", flexDirection: "column", gap: 8, height: 642, overflow: "hidden" }}>
        {messages.map((m, i) => {
          if (m.kind === "system") {
            return (
              <div key={i} style={{ alignSelf: "center", padding: "5px 12px", background: "rgba(255,255,255,0.7)", borderRadius: 6, fontFamily: a_mono, fontSize: 10, letterSpacing: "0.06em", color: A_INK_50 }}>
                {m.text}
              </div>
            );
          }
          if (m.kind === "react") {
            return (
              <div key={i} style={{ alignSelf: "flex-start", marginLeft: 44, marginTop: -4, fontFamily: "system-ui", fontSize: 11, color: A_INK_50 }}>
                {m.emoji} · {m.who.length}
              </div>
            );
          }
          const isFac = m.kind === "fac";
          const doc = !isFac && findDoc(m.who);
          const name = isFac ? m.who : `${doc.first} ${doc.last}`;
          const nameColor = isFac ? A_RUST_INK : doc.color;
          return (
            <div key={i} style={{ alignSelf: "flex-start", maxWidth: "85%", background: "#FBF8F1", borderRadius: 8, padding: "8px 12px 6px", boxShadow: "0 1px 0.5px rgba(0,0,0,0.08)" }}>
              <div style={{ fontFamily: "system-ui", fontSize: 12.5, color: nameColor, fontWeight: 600, marginBottom: 2 }}>{name}</div>
              <div style={{ fontFamily: a_serif, fontSize: 14.5, lineHeight: 1.4, color: A_INK, whiteSpace: "pre-wrap" }}>{m.text}</div>
              <div style={{ fontFamily: "system-ui", fontSize: 10, color: A_INK_50, textAlign: "right", marginTop: 2 }}>{m.t}</div>
            </div>
          );
        })}
      </div>

      {/* input */}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "10px 12px", background: "#F0E5D6", display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{ flex: 1, background: "#fff", borderRadius: 20, padding: "8px 14px", fontFamily: a_serif, fontSize: 14, color: A_INK_50 }}>
          One sentence will do…
        </div>
        <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#075E54", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>↑</div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Screen 6 — SMS nudges (phone, lock-screen style with two nudges)
// ─────────────────────────────────────────────────────────────────────────────

const A_SMS = () => {
  return (
    <div style={{ width: 390, height: 844, background: "#1a1612", fontFamily: a_serif, position: "relative", overflow: "hidden", color: "#fff" }}>
      {/* faint paper texture wash */}
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(120% 60% at 50% 0%, rgba(181,115,63,0.18), transparent 60%)" }}></div>

      {/* status bar */}
      <div style={{ position: "relative", height: 44, display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 22px", fontFamily: "system-ui", fontSize: 14, fontWeight: 600 }}>
        <span>9:45</span>
        <span style={{ fontFamily: a_mono, fontSize: 11 }}>•••</span>
        <span>92%</span>
      </div>

      {/* lock screen clock */}
      <div style={{ position: "relative", textAlign: "center", padding: "16px 0 8px" }}>
        <div style={{ fontFamily: a_serif, fontSize: 16, opacity: 0.7 }}>Wednesday, May 22</div>
        <div style={{ fontFamily: a_serif, fontSize: 80, fontWeight: 300, letterSpacing: "-0.02em", lineHeight: 1, marginTop: 4 }}>9:45</div>
      </div>

      <div style={{ position: "relative", padding: "18px 14px", display: "flex", flexDirection: "column", gap: 14 }}>
        {/* Reminder nudge */}
        <div>
          <div style={{ fontFamily: "system-ui", fontSize: 10, letterSpacing: "0.16em", color: "rgba(255,255,255,0.55)", textTransform: "uppercase", margin: "0 4px 6px" }}>
            Just now · Reminder nudge
          </div>
          <div style={{ background: "rgba(255,255,255,0.12)", backdropFilter: "blur(20px)", borderRadius: 14, padding: "12px 14px", border: "1px solid rgba(255,255,255,0.08)" }}>
            <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 6 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 22, height: 22, borderRadius: 5, background: A_RUST, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: a_serif, fontSize: 10, fontWeight: 600 }}>GL</div>
                <div style={{ fontFamily: "system-ui", fontSize: 13, fontWeight: 600 }}>Messages · Growth Leap</div>
              </div>
              <div style={{ fontFamily: "system-ui", fontSize: 11, opacity: 0.7 }}>now</div>
            </div>
            <div style={{ fontFamily: a_serif, fontSize: 15, lineHeight: 1.45 }}>{GL_SMS_REMINDER}</div>
          </div>
        </div>

        {/* Social nudge — preview of the 11:00 send */}
        <div>
          <div style={{ fontFamily: "system-ui", fontSize: 10, letterSpacing: "0.16em", color: "rgba(255,255,255,0.55)", textTransform: "uppercase", margin: "0 4px 6px" }}>
            Queued · 11:00 AM · Social nudge
          </div>
          <div style={{ background: "rgba(255,255,255,0.08)", backdropFilter: "blur(20px)", borderRadius: 14, padding: "12px 14px", border: "1px dashed rgba(255,255,255,0.2)", opacity: 0.75 }}>
            <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 6 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 22, height: 22, borderRadius: 5, background: A_RUST, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: a_serif, fontSize: 10, fontWeight: 600 }}>GL</div>
                <div style={{ fontFamily: "system-ui", fontSize: 13, fontWeight: 600 }}>Messages · Growth Leap</div>
              </div>
              <div style={{ fontFamily: "system-ui", fontSize: 11, opacity: 0.7 }}>in 1h 15m</div>
            </div>
            <div style={{ fontFamily: a_serif, fontSize: 15, lineHeight: 1.45 }}>{GL_SMS_SOCIAL}</div>
          </div>
        </div>

        {/* Spec annotation */}
        <div style={{ marginTop: 20, padding: "14px 16px", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 10, background: "rgba(0,0,0,0.2)" }}>
          <div style={{ fontFamily: "system-ui", fontSize: 9, letterSpacing: "0.16em", color: "rgba(255,255,255,0.6)", textTransform: "uppercase" }}>For James Okafor — Wed</div>
          <div style={{ marginTop: 10, fontFamily: a_serif, fontSize: 13, lineHeight: 1.55, color: "rgba(255,255,255,0.85)" }}>
            Reminder fires 15 min before the window closes. Social nudge fires ~1 hr after — only if he still hasn't posted or reacted.
          </div>
          <div style={{ marginTop: 12, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, fontFamily: a_mono, fontSize: 10, letterSpacing: "0.06em" }}>
            <div>
              <div style={{ opacity: 0.55 }}>CHANNEL</div>
              <div style={{ marginTop: 2 }}>SMS · 1:1</div>
            </div>
            <div>
              <div style={{ opacity: 0.55 }}>SENT TO</div>
              <div style={{ marginTop: 2 }}>1 of 6 today</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Export for cross-script use
Object.assign(window, { A_Today, A_Arc, A_Quiet, A_Celebration, A_WhatsApp, A_SMS });
