// Growth Leap prototype — Quiet doctor radar

const QuietView = () => {
  const {
    jamesStatus, setJamesStatus, jamesMessage, setJamesMessage,
    setDrawerDoc, showToast,
  } = useApp();
  const [editing, setEditing] = React.useState(false);
  const [confirm, setConfirm] = React.useState(false); // confirmation modal

  const james = GL_DOCTORS.find(d => d.id === "jo");

  const handleSend = () => {
    setConfirm(false);
    setJamesStatus("sending");
    setTimeout(() => {
      setJamesStatus("sent");
      showToast("Sent to James privately · 1:1 WhatsApp");
    }, 900);
  };

  const handleHold = () => {
    setJamesStatus("held");
    showToast("Held off · radar will keep watching");
  };

  const handleUnhold = () => {
    setJamesStatus("drafted");
  };

  // Header status chip
  const statusChip = () => {
    if (jamesStatus === "sent")    return <Chip tone="sent">Sent · just now</Chip>;
    if (jamesStatus === "sending") return <Chip tone="in">Sending…</Chip>;
    if (jamesStatus === "held")    return <Chip tone="held">Held off</Chip>;
    return <Chip tone="quiet">Not sent</Chip>;
  };

  return (
    <div className="gl-fade-in">
      <TopBar
        eyebrow="Quiet doctor radar · sensitivity 2 missed windows"
        title={jamesStatus === "sent" ? "One reach is on its way." : "One doctor needs a human voice."}
        right={
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <Eyebrow>Flagged</Eyebrow>
            <div style={{ fontFamily: F.mono, fontSize: 22, color: C.rust, lineHeight: 1 }}>1<span style={{ color: C.ink50, fontSize: 14 }}> / 6</span></div>
          </div>
        }
      />

      <div style={{ padding: "30px 36px 0", display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: 40 }}>
        {/* Left — doctor profile */}
        <div>
          <div
            className="gl-row"
            onClick={() => setDrawerDoc("jo")}
            style={{
              padding: "18px 18px", border: `1px solid ${C.rule}`, borderRadius: 6,
              background: C.card, cursor: "pointer",
              display: "flex", gap: 18, alignItems: "center",
            }}
          >
            <Avatar doc={james} size={72} ring={jamesStatus === "sent" ? C.sage : C.rust} />
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: F.serif, fontSize: 28, letterSpacing: "-0.01em" }}>{james.first} {james.last}</div>
              <div style={{ fontFamily: F.mono, fontSize: 10, color: C.ink50, letterSpacing: "0.08em", marginTop: 4, textTransform: "uppercase" }}>
                Hospitalist · Year 6 · On call Tue overnight
              </div>
            </div>
            <span style={{ fontFamily: F.mono, fontSize: 10, color: C.ink50, letterSpacing: "0.08em" }}>profile →</span>
          </div>

          <div style={{ marginTop: 24, padding: "22px 24px", background: C.card, border: `1px solid ${C.ruleSoft}`, borderRadius: 6 }}>
            <Eyebrow>Pattern</Eyebrow>
            <div style={{ fontFamily: F.serif, fontSize: 17, color: C.ink70, lineHeight: 1.55, marginTop: 8 }}>
              Strong through Day 1. Reacted to Day 2 evening but didn't post. On call Tuesday overnight. Missed this morning's prompt — first morning he's missed in the arc.
            </div>

            <div style={{ marginTop: 22 }}>
              <Eyebrow>His arc, so far</Eyebrow>
              <div style={{ marginTop: 10, display: "flex", gap: 14 }}>
                {GL_ENGAGEMENT.jo.map((day, di) => (
                  <div key={di} style={{ flex: 1, textAlign: "center" }}>
                    <div style={{ fontFamily: F.mono, fontSize: 9, color: C.ink50, letterSpacing: "0.1em" }}>D{di + 1}</div>
                    <div style={{ marginTop: 6, display: "flex", justifyContent: "center", gap: 4 }}>
                      {[...day].map((c, ci) => (
                        <div key={ci} style={{
                          width: 28, height: 28, borderRadius: 4,
                          background: c === "✓" ? C.rust : "transparent",
                          border: c === "✓" ? "none" : `1px ${c === "·" ? "solid" : "dashed"} ${c === "·" ? C.rust : C.rule}`,
                        }}></div>
                      ))}
                    </div>
                    <div style={{ marginTop: 6, display: "flex", justifyContent: "center", gap: 4, fontFamily: F.mono, fontSize: 8, color: C.ink50, letterSpacing: "0.08em" }}>
                      <span style={{ width: 28, textAlign: "center" }}>AM</span>
                      <span style={{ width: 28, textAlign: "center" }}>PM</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div style={{ marginTop: 22, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <div style={{ padding: "14px 18px", background: C.card, border: `1px solid ${C.ruleSoft}`, borderRadius: 4 }}>
              <Eyebrow>Last in thread</Eyebrow>
              <div style={{ fontFamily: F.serif, fontSize: 14, color: C.ink, marginTop: 4 }}>
                Tue 7:14 PM
              </div>
              <div style={{ fontFamily: F.serif, fontSize: 13, color: C.ink70 }}>
                reacted 🙏 to Hannah
              </div>
            </div>
            <div style={{ padding: "14px 18px", background: C.card, border: `1px solid ${C.ruleSoft}`, borderRadius: 4 }}>
              <Eyebrow>Auto-nudges fired</Eyebrow>
              <div style={{ fontFamily: F.serif, fontSize: 14, color: C.ink, marginTop: 4 }}>
                Reminder 9:45
              </div>
              <div style={{ fontFamily: F.serif, fontSize: 13, color: C.ink70 }}>
                Social queued 11:00
              </div>
            </div>
          </div>
        </div>

        {/* Right — drafted action */}
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8 }}>
            <Eyebrow>Suggested action · drafted for you</Eyebrow>
            {statusChip()}
          </div>

          <div style={{ background: C.card, border: `1px solid ${C.rule}`, borderRadius: 6, overflow: "hidden" }}>
            <div style={{ padding: "12px 18px", borderBottom: `1px solid ${C.ruleSoft}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ fontFamily: F.mono, fontSize: 10, letterSpacing: "0.1em", color: C.ink50 }}>
                1:1 WHATSAPP · FROM SANA → JAMES
              </div>
              <div style={{ fontFamily: F.mono, fontSize: 10, color: C.ink50 }}>
                {jamesMessage.length} chars
              </div>
            </div>
            {editing ? (
              <textarea
                value={jamesMessage}
                onChange={e => setJamesMessage(e.target.value)}
                style={{
                  width: "100%", padding: "22px 24px",
                  background: C.card, color: C.ink,
                  border: "none", outline: "none",
                  fontFamily: F.serif, fontSize: 17, lineHeight: 1.55,
                  resize: "none", height: 160,
                }}
              />
            ) : (
              <div style={{
                padding: "22px 24px", fontFamily: F.serif, fontSize: 17, lineHeight: 1.55, color: C.ink,
                opacity: jamesStatus === "sent" ? 0.6 : 1,
              }}>
                {jamesMessage}
              </div>
            )}

            <div style={{ padding: "14px 18px", borderTop: `1px solid ${C.ruleSoft}`, display: "flex", gap: 10, alignItems: "center" }}>
              {jamesStatus === "sent" ? (
                <>
                  <Btn kind="secondary" onClick={() => { setJamesStatus("drafted"); setEditing(false); }}>Undo</Btn>
                  <div style={{ marginLeft: "auto", fontFamily: F.serif, fontSize: 13, color: C.sage, display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ width: 7, height: 7, borderRadius: "50%", background: C.sage }}></span>
                    Delivered · awaiting read
                  </div>
                </>
              ) : jamesStatus === "held" ? (
                <>
                  <Btn kind="secondary" onClick={handleUnhold}>Resume draft</Btn>
                  <div style={{ marginLeft: "auto", fontFamily: F.serif, fontSize: 13, color: C.ink50 }}>
                    Will re-check when next window closes (18:00)
                  </div>
                </>
              ) : editing ? (
                <>
                  <Btn kind="primary" onClick={() => setEditing(false)}>Save edits</Btn>
                  <Btn kind="secondary" onClick={() => setEditing(false)}>Cancel</Btn>
                </>
              ) : (
                <>
                  <Btn kind="primary" onClick={() => setConfirm(true)} disabled={jamesStatus === "sending"}>
                    {jamesStatus === "sending" ? "Sending…" : "Send privately"}
                  </Btn>
                  <Btn kind="secondary" onClick={() => setEditing(true)}>Edit</Btn>
                  <Btn kind="ghost" onClick={handleHold}>Hold off</Btn>
                </>
              )}
            </div>
          </div>

          <div style={{ marginTop: 26, padding: "16px 20px", borderLeft: `2px solid ${C.rust}` }}>
            <Eyebrow color={C.rustInk}>Why this, not another ping</Eyebrow>
            <div style={{ fontFamily: F.serif, fontSize: 15, color: C.ink70, lineHeight: 1.55, marginTop: 6 }}>
              The reminder SMS fired at 9:45. The social nudge is queued for 11:00. Both are automated and arrive without a name. After two missed windows the data says: this needs a human voice, not another ping.
            </div>
          </div>

          <div style={{ marginTop: 22, padding: "14px 18px", background: C.card, border: `1px dashed ${C.rule}`, borderRadius: 4 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <Eyebrow>Alternative · ask a peer to reach</Eyebrow>
              <Chip tone="held">Held</Chip>
            </div>
            <div style={{ fontFamily: F.serif, fontSize: 14, color: C.ink70, marginTop: 8, lineHeight: 1.5 }}>
              Sofía Restrepo (lead) is closest to James on the floor. A peer voice may land better than a facilitator one. <span className="gl-link">Draft to Sofía →</span>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation modal */}
      {confirm && (
        <div
          onClick={() => setConfirm(false)}
          style={{ position: "fixed", inset: 0, background: "rgba(31,26,20,0.45)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }}
        >
          <div
            onClick={e => e.stopPropagation()}
            className="gl-fade-in"
            style={{ width: 460, background: C.paper, border: `1px solid ${C.rule}`, borderRadius: 8, padding: "28px 30px", boxShadow: "0 30px 80px rgba(0,0,0,0.28)" }}
          >
            <Eyebrow>Confirm · sending privately</Eyebrow>
            <div style={{ fontFamily: F.serif, fontSize: 22, lineHeight: 1.3, marginTop: 8, letterSpacing: "-0.01em" }}>
              This goes to James only.
            </div>
            <div style={{ fontFamily: F.serif, fontSize: 14.5, color: C.ink70, marginTop: 12, lineHeight: 1.55 }}>
              The group thread won't see it. James won't see this came from a dashboard — it arrives as a 1:1 WhatsApp from Sana. He can reply or not.
            </div>
            <div style={{ marginTop: 22, display: "flex", gap: 10 }}>
              <Btn kind="primary" onClick={handleSend}>Send to James</Btn>
              <Btn kind="secondary" onClick={() => setConfirm(false)}>Cancel</Btn>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

Object.assign(window, { QuietView });
