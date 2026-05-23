// Growth Leap prototype — 5-day arc view

const ArcView = () => {
  const { setDrawerDoc } = useApp();
  const [hover, setHover] = React.useState(null); // { docId, day, slot }

  const cellStyle = (mark) => {
    if (mark === "✓") return { bg: C.rust, fg: C.card, border: "none" };
    if (mark === "·") return { bg: "transparent", fg: C.rustInk, border: `1px solid ${C.rust}` };
    return { bg: "transparent", fg: C.ink50, border: `1px dashed ${C.rule}` };
  };

  const tipFor = (docId, day, slot) => {
    const mark = GL_ENGAGEMENT[docId][day][slot];
    const slotLabel = slot === 0 ? "morning" : "evening";
    if (mark === " ") return `Day ${day + 1} ${slotLabel} · not yet`;
    if (mark === "·") return `Day ${day + 1} ${slotLabel} · window closed without a post`;
    // Posted — try to find specific text for Day 3 morning
    if (day === 2 && slot === 0) {
      const post = GL_TODAY_POSTS.find(p => p.who === docId);
      if (post) return `Day ${day + 1} morning · ${post.t}\n"${post.text.slice(0, 90)}${post.text.length > 90 ? "…" : ""}"`;
    }
    const sample = {
      pr: { "0,0": "Day 1 AM · I felt most myself when I sat with Mrs. K and didn't rush.", "0,1": "Day 1 PM · Noticed how Sofía steadies the floor without saying much." },
      mc: { "0,0": "Day 1 AM · The walk-in with the panic attack — present, useful.", "0,1": "Day 1 PM · James held the line on bed 3 today. Steady." },
    }[docId] || {};
    return sample[`${day},${slot}`] || `Day ${day + 1} ${slotLabel} · posted`;
  };

  return (
    <div className="gl-fade-in">
      <TopBar
        eyebrow="Arc · five days · two prompts each"
        title="The shape of this week"
        right={
          <div style={{ display: "flex", alignItems: "baseline", gap: 16 }}>
            <div>
              <Eyebrow>Pod rate</Eyebrow>
              <div style={{ fontFamily: F.mono, fontSize: 22, color: C.ink, lineHeight: 1 }}>27 / 30</div>
            </div>
            <div style={{ width: 1, height: 32, background: C.rule }}></div>
            <div>
              <Eyebrow>Engagement</Eyebrow>
              <div style={{ fontFamily: F.mono, fontSize: 22, color: C.rust, lineHeight: 1 }}>90%</div>
            </div>
          </div>
        }
      />

      <div style={{ padding: "26px 36px 12px" }}>
        <div style={{ fontFamily: F.serif, fontSize: 15, color: C.ink70, lineHeight: 1.55, maxWidth: 760 }}>
          One row per doctor. Each day has a morning commitment (left) and an evening reflection (right). Hover any cell to see what was posted. Click a row for the full profile.
        </div>
      </div>

      {/* Grid */}
      <div style={{ padding: "16px 36px 0" }}>
        {/* Day headers */}
        <div style={{ display: "grid", gridTemplateColumns: "200px repeat(5, 1fr) 120px", gap: 16, paddingBottom: 14, borderBottom: `1px solid ${C.rule}` }}>
          <div></div>
          {GL_ARC.map((d, i) => (
            <div key={d.day} style={{ textAlign: "center" }}>
              <Eyebrow>Day {d.day}</Eyebrow>
              <div style={{ fontFamily: F.serif, fontSize: 17, fontStyle: "italic", marginTop: 4, color: i === 2 ? C.rustInk : (i > 2 ? C.ink50 : C.ink) }}>
                {d.theme}
              </div>
              <div style={{ marginTop: 6, display: "flex", justifyContent: "center", gap: 8, fontFamily: F.mono, fontSize: 9, color: C.ink50, letterSpacing: "0.1em" }}>
                <span style={{ width: 32, textAlign: "center" }}>AM</span>
                <span style={{ width: 32, textAlign: "center" }}>PM</span>
              </div>
            </div>
          ))}
          <div style={{ textAlign: "right" }}><Eyebrow>Arc rate</Eyebrow></div>
        </div>

        {/* Rows */}
        {GL_DOCTORS.map((doc) => {
          const eng = GL_ENGAGEMENT[doc.id];
          const posted = eng.flatMap(d => [...d]).filter(c => c === "✓").length;
          const ratio = posted / 5;
          return (
            <div
              key={doc.id}
              className="gl-row"
              onClick={() => setDrawerDoc(doc.id)}
              style={{
                display: "grid", gridTemplateColumns: "200px repeat(5, 1fr) 120px", gap: 16,
                padding: "14px 10px", borderBottom: `1px solid ${C.ruleSoft}`, alignItems: "center",
                cursor: "pointer", marginLeft: -10, marginRight: -10, borderRadius: 6,
                transition: "background .15s",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <Avatar doc={doc} size={34} />
                <div>
                  <div style={{ fontFamily: F.serif, fontSize: 15, color: C.ink }}>{doc.first} {doc.last}</div>
                  <div style={{ fontFamily: F.mono, fontSize: 10, color: C.ink50, letterSpacing: "0.04em" }}>yr {doc.years}</div>
                </div>
              </div>
              {eng.map((day, di) => {
                const mState = cellStyle(day[0]);
                const eState = cellStyle(day[1]);
                return (
                  <div key={di} style={{ display: "flex", gap: 8, justifyContent: "center" }}>
                    {[0, 1].map((slot) => {
                      const c = day[slot];
                      const s = cellStyle(c);
                      const isHover = hover && hover.docId === doc.id && hover.day === di && hover.slot === slot;
                      return (
                        <div
                          key={slot}
                          onMouseEnter={() => setHover({ docId: doc.id, day: di, slot })}
                          onMouseLeave={() => setHover(null)}
                          onClick={e => e.stopPropagation()}
                          className="gl-cell"
                          style={{
                            position: "relative",
                            width: 32, height: 32, borderRadius: 5,
                            background: s.bg, color: s.fg, border: s.border,
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontFamily: F.mono, fontSize: 10, cursor: "pointer",
                          }}
                        >
                          {c === "✓" ? (slot === 0 ? "AM" : "PM") : (c === "·" ? "—" : "")}
                          {isHover && (
                            <div className="gl-tip" style={{ opacity: 1, whiteSpace: "pre-wrap" }}>
                              {tipFor(doc.id, di, slot)}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                );
              })}
              <div style={{ textAlign: "right" }}>
                <div style={{ fontFamily: F.mono, fontSize: 20, color: ratio < 0.6 ? C.rust : C.ink, lineHeight: 1, letterSpacing: "-0.01em" }}>
                  {posted}<span style={{ color: C.ink50, fontSize: 13 }}> / 5</span>
                </div>
                <div style={{ height: 4, background: C.ruleSoft, marginTop: 6, borderRadius: 2, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${ratio * 100}%`, background: ratio < 0.6 ? C.rust : doc.color, transition: "width .3s" }}></div>
                </div>
              </div>
            </div>
          );
        })}

        {/* Legend */}
        <div style={{ marginTop: 18, display: "flex", gap: 22, alignItems: "center", fontFamily: F.serif, fontSize: 13, color: C.ink70 }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 14, height: 14, borderRadius: 4, background: C.rust }}></div> posted
          </span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 14, height: 14, borderRadius: 4, border: `1px solid ${C.rust}` }}></div> window closed without a post
          </span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 14, height: 14, borderRadius: 4, border: `1px dashed ${C.rule}` }}></div> future
          </span>
          <span style={{ marginLeft: "auto", fontFamily: F.mono, fontSize: 10, color: C.ink50, letterSpacing: "0.08em" }}>
            POINTS · 1 PER POST · 0.5 PER REACTION
          </span>
        </div>
      </div>

      {/* Footer KPIs */}
      <div style={{ padding: "26px 36px 36px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 24, paddingTop: 20, borderTop: `2px solid ${C.ink}` }}>
          {[
            { num: "27", denom: "/ 30", label: "Posts through Day 3 AM" },
            { num: "90%", denom: "",    label: "Pod engagement rate" },
            { num: "11", denom: "msg",  label: "Longest thread · Tue eve" },
            { num: "1",  denom: "of 6", label: "Quiet doctor needs a check-in", warn: true },
          ].map((s, i) => (
            <div key={i}>
              <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
                <div style={{ fontFamily: F.mono, fontSize: 30, color: s.warn ? C.rust : C.ink, letterSpacing: "-0.02em" }}>{s.num}</div>
                <div style={{ fontFamily: F.mono, fontSize: 12, color: C.ink50 }}>{s.denom}</div>
              </div>
              <div style={{ fontFamily: F.serif, fontSize: 13, color: C.ink70, marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

Object.assign(window, { ArcView });
