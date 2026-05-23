// Growth Leap prototype — Phone preview content (WhatsApp + SMS)

const PhoneWhatsApp = () => {
  const findDoc = (id) => GL_DOCTORS.find(d => d.id === id);

  const messages = [
    { kind: "system", text: "Day 3 of 5 — Reaching · Morning prompt opens" },
    { kind: "fac", who: "Sana (facilitator)", t: "6:00 AM",
      text: 'Good morning Pod 2. Yesterday you named things out loud that most of us carry silently — invisible weeks, weather we don\'t admit to. Six in this morning, five in the evening.\n\nToday is Day 3 — Reaching.\n\n"Who on this team could use one sentence from you today? Commit to it here."\n\nOne sentence is plenty. Window closes at 10:00.' },
    { kind: "msg", who: "sr", t: "6:42 AM", text: "Going to tell Marcus I noticed how he handled the family in 412 yesterday. He stayed an hour past sign-out and never mentioned it." },
    { kind: "msg", who: "pr", t: "7:11 AM", text: "Reaching out to our overnight RN Talia. She caught the K+ on bed 7 and I never thanked her properly." },
    { kind: "react", who: ["pr","mc","hw","dp"], emoji: "🙏" },
    { kind: "msg", who: "mc", t: "7:48 AM", text: "I want to ask Sofía how she's actually doing. Not in the hallway, not between pages. Real ask." },
    { kind: "msg", who: "hw", t: "8:02 AM", text: "Going to text my co-resident from intern year. We're all in this and I haven't reached out in months." },
    { kind: "msg", who: "dp", t: "9:23 AM", text: "One sentence to the case manager I keep snapping at when I'm behind. She doesn't deserve the edge in my voice." },
  ];

  return (
    <div style={{ width: "100%", height: "100%", background: "#EBE0D2", fontFamily: F.serif, position: "relative", overflow: "hidden", display: "flex", flexDirection: "column" }}>
      <div style={{ height: 40, display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 22px", fontFamily: F.sys, fontSize: 14, fontWeight: 600, color: C.ink, flexShrink: 0 }}>
        <span>11:42</span>
        <span style={{ fontFamily: F.mono, fontSize: 11 }}>•••</span>
        <span>92%</span>
      </div>

      <div style={{ background: "#075E54", color: "#fff", padding: "8px 14px", display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
        <div style={{ fontSize: 22, lineHeight: 1 }}>‹</div>
        <div style={{ width: 36, height: 36, borderRadius: "50%", background: C.rust, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: F.serif, fontSize: 14, fontWeight: 600 }}>GL</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: F.sys, fontSize: 15, fontWeight: 600 }}>Growth Leap · Pod 2</div>
          <div style={{ fontFamily: F.sys, fontSize: 11, opacity: 0.85 }}>6 hospitalists · 1 facilitator</div>
        </div>
        <div style={{ fontSize: 18 }}>⋮</div>
      </div>

      <div style={{ flex: 1, padding: "14px 12px", display: "flex", flexDirection: "column", gap: 8, overflowY: "auto" }}>
        {messages.map((m, i) => {
          if (m.kind === "system") {
            return (
              <div key={i} style={{ alignSelf: "center", padding: "5px 12px", background: "rgba(255,255,255,0.7)", borderRadius: 6, fontFamily: F.mono, fontSize: 10, letterSpacing: "0.06em", color: C.ink50 }}>
                {m.text}
              </div>
            );
          }
          if (m.kind === "react") {
            return (
              <div key={i} style={{ alignSelf: "flex-start", marginLeft: 12, marginTop: -4, fontFamily: F.sys, fontSize: 11, color: C.ink50, background: "#FBF8F1", padding: "2px 8px", borderRadius: 999, border: "1px solid rgba(0,0,0,0.05)" }}>
                {m.emoji} {m.who.length}
              </div>
            );
          }
          const isFac = m.kind === "fac";
          const doc = !isFac && findDoc(m.who);
          const name = isFac ? m.who : `${doc.first} ${doc.last}`;
          const nameColor = isFac ? C.rustInk : doc.color;
          return (
            <div key={i} style={{ alignSelf: "flex-start", maxWidth: "85%", background: "#FBF8F1", borderRadius: 8, padding: "8px 12px 6px", boxShadow: "0 1px 0.5px rgba(0,0,0,0.08)" }}>
              <div style={{ fontFamily: F.sys, fontSize: 12.5, color: nameColor, fontWeight: 600, marginBottom: 2 }}>{name}</div>
              <div style={{ fontFamily: F.serif, fontSize: 14.5, lineHeight: 1.4, color: C.ink, whiteSpace: "pre-wrap" }}>{m.text}</div>
              <div style={{ fontFamily: F.sys, fontSize: 10, color: C.ink50, textAlign: "right", marginTop: 2 }}>{m.t}</div>
            </div>
          );
        })}
      </div>

      <div style={{ padding: "10px 12px", background: "#F0E5D6", display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
        <div style={{ flex: 1, background: "#fff", borderRadius: 20, padding: "8px 14px", fontFamily: F.serif, fontSize: 14, color: C.ink50 }}>
          One sentence will do…
        </div>
        <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#075E54", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>↑</div>
      </div>
    </div>
  );
};

const PhoneSMS = () => {
  return (
    <div style={{ width: "100%", height: "100%", background: "#1a1612", fontFamily: F.serif, position: "relative", overflow: "hidden", color: "#fff" }}>
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(120% 60% at 50% 0%, rgba(181,115,63,0.18), transparent 60%)" }}></div>

      <div style={{ position: "relative", height: 40, display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 22px", fontFamily: F.sys, fontSize: 14, fontWeight: 600 }}>
        <span>9:45</span>
        <span style={{ fontFamily: F.mono, fontSize: 11 }}>•••</span>
        <span>92%</span>
      </div>

      <div style={{ position: "relative", textAlign: "center", padding: "10px 0 4px" }}>
        <div style={{ fontFamily: F.serif, fontSize: 14, opacity: 0.7 }}>Wednesday, May 22</div>
        <div style={{ fontFamily: F.serif, fontSize: 76, fontWeight: 300, letterSpacing: "-0.02em", lineHeight: 1, marginTop: 4 }}>9:45</div>
      </div>

      <div style={{ position: "relative", padding: "16px 14px", display: "flex", flexDirection: "column", gap: 14 }}>
        <div>
          <div style={{ fontFamily: F.sys, fontSize: 10, letterSpacing: "0.16em", color: "rgba(255,255,255,0.55)", textTransform: "uppercase", margin: "0 4px 6px" }}>
            Just now · Reminder nudge · 15 min before close
          </div>
          <div style={{ background: "rgba(255,255,255,0.12)", backdropFilter: "blur(20px)", borderRadius: 14, padding: "11px 14px", border: "1px solid rgba(255,255,255,0.08)" }}>
            <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 5 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 20, height: 20, borderRadius: 5, background: C.rust, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: F.serif, fontSize: 9.5, fontWeight: 600 }}>GL</div>
                <div style={{ fontFamily: F.sys, fontSize: 12.5, fontWeight: 600 }}>Messages · Growth Leap</div>
              </div>
              <div style={{ fontFamily: F.sys, fontSize: 11, opacity: 0.7 }}>now</div>
            </div>
            <div style={{ fontFamily: F.serif, fontSize: 14.5, lineHeight: 1.45 }}>{GL_SMS_REMINDER}</div>
          </div>
        </div>

        <div>
          <div style={{ fontFamily: F.sys, fontSize: 10, letterSpacing: "0.16em", color: "rgba(255,255,255,0.55)", textTransform: "uppercase", margin: "0 4px 6px" }}>
            Queued · 11:00 AM · Social nudge
          </div>
          <div style={{ background: "rgba(255,255,255,0.08)", backdropFilter: "blur(20px)", borderRadius: 14, padding: "11px 14px", border: "1px dashed rgba(255,255,255,0.2)", opacity: 0.75 }}>
            <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 5 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 20, height: 20, borderRadius: 5, background: C.rust, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: F.serif, fontSize: 9.5, fontWeight: 600 }}>GL</div>
                <div style={{ fontFamily: F.sys, fontSize: 12.5, fontWeight: 600 }}>Messages · Growth Leap</div>
              </div>
              <div style={{ fontFamily: F.sys, fontSize: 11, opacity: 0.7 }}>in 1h 15m</div>
            </div>
            <div style={{ fontFamily: F.serif, fontSize: 14.5, lineHeight: 1.45 }}>{GL_SMS_SOCIAL}</div>
          </div>
        </div>

        <div style={{ marginTop: 14, padding: "12px 14px", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 10, background: "rgba(0,0,0,0.2)" }}>
          <div style={{ fontFamily: F.sys, fontSize: 9, letterSpacing: "0.16em", color: "rgba(255,255,255,0.6)", textTransform: "uppercase" }}>For James Okafor — Wed</div>
          <div style={{ marginTop: 8, fontFamily: F.serif, fontSize: 12.5, lineHeight: 1.5, color: "rgba(255,255,255,0.85)" }}>
            Reminder fires 15 min before the window closes. Social nudge fires ~1 hr after — only if he still hasn't posted or reacted.
          </div>
        </div>
      </div>
    </div>
  );
};

Object.assign(window, { PhoneWhatsApp, PhoneSMS });
