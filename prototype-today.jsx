// Growth Leap prototype — Today snapshot view

const TodayView = () => {
  const { setDrawerDoc, setRoute } = useApp();
  const [filter, setFilter] = React.useState("all"); // all | in | quiet

  const stateMap = { pr: "in", mc: "in", sr: "in", jo: "quiet", hw: "in", dp: "in" };
  const visible = GL_DOCTORS.filter(d => filter === "all" ? true : stateMap[d.id] === filter);
  const findDoc = (id) => GL_DOCTORS.find(d => d.id === id);

  const FilterPill = ({ k, label, count }) => (
    <button
      onClick={() => setFilter(k)}
      style={{
        padding: "6px 12px", background: filter === k ? C.ink : "transparent",
        color: filter === k ? C.paper : C.ink70,
        border: `1px solid ${filter === k ? C.ink : C.rule}`,
        borderRadius: 999, fontFamily: F.mono, fontSize: 10,
        letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer",
        display: "inline-flex", gap: 6, alignItems: "center",
      }}
    >
      {label}
      <span style={{ opacity: 0.7 }}>{count}</span>
    </button>
  );

  return (
    <div className="gl-fade-in">
      <TopBar
        eyebrow={`${GL_TODAY} · ${GL_NOW} · Day 3 of 5 · Reaching`}
        title="Today"
        right={
          <div style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
            <Eyebrow>Morning</Eyebrow>
            <div style={{ fontFamily: F.mono, fontSize: 22, color: C.rust, lineHeight: 1 }}>5<span style={{ color: C.ink50, fontSize: 14 }}> / 6</span></div>
          </div>
        }
      />

      {/* Prompt hero */}
      <div style={{ padding: "30px 36px 18px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 24, alignItems: "end" }}>
          <div>
            <Eyebrow>Morning prompt · commitment · closed 10:00 AM</Eyebrow>
            <div style={{ marginTop: 12, fontFamily: F.serif, fontSize: 32, lineHeight: 1.2, letterSpacing: "-0.015em", maxWidth: 820, color: C.ink }}>
              "Who on this team could use <em style={{ color: C.rustInk }}>one sentence</em> from you today? Commit to it here."
            </div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <FilterPill k="all"   label="All"    count={6} />
            <FilterPill k="in"    label="In"     count={5} />
            <FilterPill k="quiet" label="Quiet"  count={1} />
          </div>
        </div>
      </div>

      {/* Main grid */}
      <div style={{ padding: "8px 36px 40px", display: "grid", gridTemplateColumns: "380px 1fr", gap: 36 }}>
        {/* Roster */}
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 10 }}>
            <Eyebrow>The pod, this morning</Eyebrow>
            <span style={{ fontFamily: F.mono, fontSize: 10, color: C.ink50 }}>click a row →</span>
          </div>
          <Rule color={C.ruleSoft} />
          {visible.map((d) => {
            const state = stateMap[d.id];
            const post = GL_TODAY_POSTS.find(p => p.who === d.id);
            return (
              <div
                key={d.id}
                className="gl-row"
                onClick={() => setDrawerDoc(d.id)}
                style={{
                  padding: "14px 10px", borderBottom: `1px solid ${C.ruleSoft}`,
                  display: "flex", alignItems: "center", gap: 14, cursor: "pointer", marginLeft: -10, marginRight: -10,
                  borderRadius: 6, transition: "background .15s",
                }}
              >
                <Avatar doc={d} size={36} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: F.serif, fontSize: 15, color: C.ink }}>{d.first} {d.last}</div>
                  <div style={{ fontFamily: F.mono, fontSize: 10, color: C.ink50, letterSpacing: "0.04em", marginTop: 2 }}>
                    {d.role} · yr {d.years}{post ? ` · posted ${post.t}` : (state === "quiet" ? " · no response" : "")}
                  </div>
                </div>
                <Chip tone={state === "in" ? "in" : "quiet"}>{state === "in" ? "in" : "quiet"}</Chip>
              </div>
            );
          })}
          {visible.length === 0 && (
            <div style={{ padding: "32px 0", textAlign: "center", color: C.ink50, fontFamily: F.serif, fontSize: 14 }}>
              No doctors in this filter.
            </div>
          )}
        </div>

        {/* Feed */}
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 10 }}>
            <Eyebrow>What they committed to</Eyebrow>
            <Eyebrow color={C.ink50}>WhatsApp · Pod 2 · read-only mirror</Eyebrow>
          </div>
          <Rule color={C.ruleSoft} />
          {GL_TODAY_POSTS.map((p, i) => {
            const d = findDoc(p.who);
            const reactCount = [2, 4, 3, 5, 1][i];
            return (
              <div
                key={p.t}
                className="gl-row"
                onClick={() => setDrawerDoc(d.id)}
                style={{
                  padding: "18px 10px", borderBottom: `1px solid ${C.ruleSoft}`,
                  display: "grid", gridTemplateColumns: "40px 1fr 80px", gap: 14, alignItems: "start",
                  cursor: "pointer", marginLeft: -10, marginRight: -10, borderRadius: 6,
                  transition: "background .15s",
                }}
              >
                <Avatar doc={d} size={36} />
                <div>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
                    <div style={{ fontFamily: F.serif, fontSize: 14, fontWeight: 600, color: C.ink }}>{d.first} {d.last}</div>
                    <div style={{ fontFamily: F.mono, fontSize: 10, color: C.ink50, letterSpacing: "0.04em" }}>{p.t}</div>
                  </div>
                  <div style={{ fontFamily: F.serif, fontSize: 15.5, lineHeight: 1.5, marginTop: 4, color: C.ink70 }}>
                    "{p.text}"
                  </div>
                </div>
                <div style={{ textAlign: "right", fontFamily: F.mono, fontSize: 10, color: C.ink50, paddingTop: 6, letterSpacing: "0.04em" }}>
                  {reactCount} react
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom — nudge schedule */}
      <div style={{ padding: "0 36px 32px" }}>
        <Eyebrow style={{ marginBottom: 12 }}>Today's nudges · 1 doctor affected</Eyebrow>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 24, paddingTop: 20, borderTop: `1px solid ${C.rule}` }}>
          {[
            { time: "06:00", label: "Prompt opened",                       state: "past",   sub: "automated"},
            { time: "09:45", label: "Reminder SMS · sent to J. Okafor",     state: "past",   accent: true, sub: "fired 1h 57m ago"},
            { time: "11:00", label: "Social nudge SMS · queued for J.O.",   state: "live",   accent: true, sub: "queued · check radar"},
            { time: "18:00", label: "Evening prompt opens",                 state: "future", sub: "in 6h 18m"},
          ].map((s, i) => (
            <div key={i} style={{ paddingRight: 12 }}>
              <div style={{
                fontFamily: F.mono, fontSize: 11, letterSpacing: "0.1em",
                color: s.state === "live" ? C.rust : (s.state === "future" ? C.ink50 : C.ink),
              }}>{s.time}{s.state === "live" && <span className="gl-pulse"> · NOW</span>}</div>
              <div style={{ fontFamily: F.serif, fontSize: 14, color: s.state === "future" ? C.ink50 : C.ink, marginTop: 4 }}>{s.label}</div>
              <div style={{ fontFamily: F.mono, fontSize: 9.5, color: C.ink50, letterSpacing: "0.04em", marginTop: 4 }}>{s.sub}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

Object.assign(window, { TodayView });
