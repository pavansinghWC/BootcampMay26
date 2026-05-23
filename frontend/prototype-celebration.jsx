// Growth Leap prototype — Celebration drafter

const ALT_DRAFTS = [
  `Good morning, Pod 2.

Yesterday you named things out loud that most of us carry silently — invisible weeks, weather we don't admit to. Six of you showed up in the morning. Five of you came back in the evening. The longest thread we've had this arc happened last night.

Today is Day 3 — Reaching. The morning prompt asks for one sentence to one person. That's the whole assignment. See you in here.

— Sana`,
  `Pod 2 — quick note before today's prompt.

What you did yesterday was hard. Five of you stayed in the evening when you didn't have to. The thread that came out of it was the longest of the week.

Today is lighter on the page — one sentence, one person. We're past halfway. Glad we're doing this together.

— Sana`,
];

const CelebrationView = () => {
  const { celStatus, setCelStatus, celText, setCelText, celEditing, setCelEditing, showToast } = useApp();
  const [draftIdx, setDraftIdx] = React.useState(0);
  const [shippedAt, setShippedAt] = React.useState(null);

  const handleApprove = () => {
    setCelStatus("scheduled");
    const t = new Date();
    setShippedAt(`Tomorrow 6:00 AM · in ${Math.round((24 - 11.7) + 6 - 0.05)}h 18m`);
    showToast("Approved · ships tomorrow at 6:00 with Day 4 prompt");
  };

  const handleRegenerate = () => {
    setCelStatus("regenerating");
    setTimeout(() => {
      const next = (draftIdx + 1) % ALT_DRAFTS.length;
      setDraftIdx(next);
      setCelText(ALT_DRAFTS[next]);
      setCelStatus("drafted");
      showToast("Regenerated · v" + (next + 2));
    }, 1100);
  };

  const handleUnschedule = () => {
    setCelStatus("drafted");
    showToast("Unscheduled · back to draft");
  };

  // word count for tone check
  const wordCount = celText.trim().split(/\s+/).length;

  const statusChip = () => {
    if (celStatus === "scheduled")    return <Chip tone="scheduled">Scheduled · 6:00 AM</Chip>;
    if (celStatus === "regenerating") return <Chip tone="in">Regenerating…</Chip>;
    return <Chip tone="held">v{draftIdx + 2} · drafted 5:42 AM</Chip>;
  };

  return (
    <div className="gl-fade-in">
      <TopBar
        eyebrow="Tomorrow's opener · drafted at 5:30 AM · ships 6:00 AM with Day 4 prompt"
        title={celStatus === "scheduled" ? "Scheduled. See you at six." : "Yesterday they named the invisible."}
        right={statusChip()}
      />

      <div style={{ padding: "28px 36px 36px", display: "grid", gridTemplateColumns: "1.15fr 1fr", gap: 36 }}>
        {/* Left — draft */}
        <div>
          <Eyebrow style={{ marginBottom: 10 }}>AI draft · review and approve</Eyebrow>
          <div style={{ background: C.card, border: `1px solid ${C.rule}`, borderRadius: 6, minHeight: 380, padding: 0, position: "relative" }}>
            {celStatus === "regenerating" && (
              <div style={{
                position: "absolute", inset: 0, background: "rgba(251,248,241,0.85)",
                display: "flex", alignItems: "center", justifyContent: "center", zIndex: 4,
                animation: "gl-fade-in .2s ease-out",
              }}>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontFamily: F.serif, fontSize: 17, color: C.ink70, fontStyle: "italic" }} className="gl-pulse">
                    Re-reading yesterday's thread…
                  </div>
                  <div style={{ fontFamily: F.mono, fontSize: 10, color: C.ink50, letterSpacing: "0.1em", textTransform: "uppercase", marginTop: 8 }}>
                    Constraints applied: ≤ 80 words · group-level · no callouts
                  </div>
                </div>
              </div>
            )}
            {celEditing ? (
              <textarea
                value={celText}
                onChange={e => setCelText(e.target.value)}
                style={{
                  width: "100%", padding: "28px 32px",
                  background: C.card, color: C.ink, border: "none", outline: "none",
                  fontFamily: F.serif, fontSize: 17, lineHeight: 1.65,
                  resize: "vertical", minHeight: 360, borderRadius: 6,
                }}
              />
            ) : (
              <div style={{
                padding: "28px 32px", fontFamily: F.serif, fontSize: 17, lineHeight: 1.65,
                whiteSpace: "pre-wrap", color: celStatus === "scheduled" ? C.ink50 : C.ink,
                minHeight: 380,
              }}>
                {celText}
              </div>
            )}
          </div>

          {/* Action row */}
          <div style={{ marginTop: 18, display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
            {celStatus === "scheduled" ? (
              <>
                <Btn kind="secondary" onClick={handleUnschedule}>Unschedule</Btn>
                <div style={{ display: "flex", alignItems: "center", gap: 8, color: C.sage, fontFamily: F.serif, fontSize: 14 }}>
                  <span style={{ width: 7, height: 7, borderRadius: "50%", background: C.sage }}></span>
                  Will ship tomorrow at 6:00 AM with Day 4 prompt
                </div>
              </>
            ) : celEditing ? (
              <>
                <Btn kind="primary" onClick={() => setCelEditing(false)}>Save edits</Btn>
                <Btn kind="secondary" onClick={() => { setCelText(ALT_DRAFTS[draftIdx]); setCelEditing(false); }}>Discard</Btn>
              </>
            ) : (
              <>
                <Btn kind="primary" onClick={handleApprove} disabled={celStatus === "regenerating"}>
                  Approve · ships tomorrow 6:00
                </Btn>
                <Btn kind="secondary" onClick={() => setCelEditing(true)} disabled={celStatus === "regenerating"}>Edit</Btn>
                <Btn kind="secondary" onClick={handleRegenerate} disabled={celStatus === "regenerating"}>Regenerate</Btn>
                <Btn kind="ghost" onClick={() => showToast("Skipped today · no celebration message will ship")} style={{ marginLeft: "auto" }}>Skip today</Btn>
              </>
            )}
          </div>

          <div style={{ marginTop: 16, fontFamily: F.mono, fontSize: 10, letterSpacing: "0.08em", color: C.ink50 }}>
            CONSTRAINTS · GROUP-LEVEL · NO INDIVIDUAL CALLOUTS · ≤ 80 WORDS · ENDS WITH FACILITATOR INITIAL
          </div>
        </div>

        {/* Right — source + tone */}
        <div>
          <Eyebrow style={{ marginBottom: 10 }}>Yesterday, in numbers</Eyebrow>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {[
              { num: "6 / 6", label: "Morning posts" },
              { num: "5 / 6", label: "Evening posts" },
              { num: "23",     label: "Reactions exchanged" },
              { num: "11",     label: "Longest thread" },
            ].map((s, i) => (
              <div key={i} style={{ padding: "14px 16px", background: C.card, border: `1px solid ${C.ruleSoft}`, borderRadius: 4 }}>
                <div style={{ fontFamily: F.mono, fontSize: 22, color: C.ink }}>{s.num}</div>
                <div style={{ fontFamily: F.serif, fontSize: 12.5, color: C.ink50, marginTop: 4 }}>{s.label}</div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 22, padding: "18px 20px", borderLeft: `2px solid ${C.rust}` }}>
            <Eyebrow color={C.rustInk}>Standout the draft could cite</Eyebrow>
            <div style={{ fontFamily: F.serif, fontSize: 15.5, color: C.ink70, marginTop: 6, lineHeight: 1.5 }}>
              {GL_YESTERDAY.standout}
            </div>
            <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
              <button
                onClick={() => showToast("Draft updated · Sofía's name removed")}
                style={{ padding: "5px 10px", background: "transparent", color: C.ink50, border: `1px solid ${C.rule}`, borderRadius: 4, fontFamily: F.mono, fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase", cursor: "pointer" }}
              >
                Remove name from draft
              </button>
              <button
                onClick={() => showToast("Will cite at group level instead")}
                style={{ padding: "5px 10px", background: "transparent", color: C.ink50, border: `1px solid ${C.rule}`, borderRadius: 4, fontFamily: F.mono, fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase", cursor: "pointer" }}
              >
                Cite at group level
              </button>
            </div>
          </div>

          <div style={{ marginTop: 26 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <Eyebrow>Tone check</Eyebrow>
              <Eyebrow color={wordCount > 80 ? C.rust : C.sage}>{wordCount} / 80 words</Eyebrow>
            </div>
            <div style={{ marginTop: 12, display: "grid", gridTemplateColumns: "auto 1fr", gap: "10px 14px", fontFamily: F.serif, fontSize: 14 }}>
              {[
                ["Warm", true],
                ["Group-level", true],
                ["No individual callouts", !celText.includes("Sofía")],
                ["Under 80 words", wordCount <= 80],
                ["Ends with Sana's voice", celText.trim().endsWith("Sana")],
                ["No clinical jargon", true],
              ].map(([label, ok]) => (
                <React.Fragment key={label}>
                  <div style={{
                    fontFamily: F.mono, fontSize: 12,
                    color: ok ? C.sage : C.rust, letterSpacing: "0.06em",
                    width: 16,
                  }}>{ok ? "✓" : "!"}</div>
                  <div style={{ color: C.ink70 }}>{label}</div>
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

Object.assign(window, { CelebrationView });
