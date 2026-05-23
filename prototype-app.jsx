// Growth Leap prototype — app shell, sidebar, doctor drawer, phone drawer, toast

const SidebarItem = ({ label, sub, routeKey, active, badge }) => {
  const { setRoute } = useApp();
  return (
    <div
      onClick={() => setRoute(routeKey)}
      style={{
        padding: "12px 24px 12px 24px",
        borderLeft: active ? `2px solid ${C.rust}` : "2px solid transparent",
        background: active ? C.card : "transparent",
        cursor: "pointer",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        transition: "background .15s",
      }}
      onMouseEnter={e => { if (!active) e.currentTarget.style.background = "rgba(0,0,0,0.025)"; }}
      onMouseLeave={e => { if (!active) e.currentTarget.style.background = "transparent"; }}
    >
      <div>
        <div style={{ fontFamily: F.serif, fontSize: 17, color: active ? C.ink : C.ink70, letterSpacing: "-0.005em" }}>{label}</div>
        {sub && <div style={{ fontFamily: F.mono, fontSize: 9.5, letterSpacing: "0.1em", color: C.ink50, textTransform: "uppercase", marginTop: 2 }}>{sub}</div>}
      </div>
      {badge && (
        <span style={{
          fontFamily: F.mono, fontSize: 10, letterSpacing: "0.08em",
          color: C.rustInk, background: C.rustSoft,
          padding: "2px 7px", borderRadius: 999,
        }}>{badge}</span>
      )}
    </div>
  );
};

const Sidebar = () => {
  const { route, jamesStatus } = useApp();
  const jamesBadge = jamesStatus === "drafted" ? "1" : null;
  return (
    <div style={{
      width: 232, background: C.paper2, borderRight: `1px solid ${C.rule}`,
      display: "flex", flexDirection: "column", height: "100vh", position: "sticky", top: 0, flexShrink: 0,
    }}>
      <div style={{ padding: "26px 24px 22px", borderBottom: `1px solid ${C.ruleSoft}` }}>
        <div style={{ fontFamily: F.serif, fontSize: 24, fontStyle: "italic", letterSpacing: "-0.01em", color: C.ink, lineHeight: 1 }}>
          Growth Leap
        </div>
        <div style={{ marginTop: 8, fontFamily: F.mono, fontSize: 9.5, letterSpacing: "0.14em", textTransform: "uppercase", color: C.ink50 }}>
          Facilitator console · v0.1
        </div>
      </div>

      <div style={{ padding: "14px 0", flex: 1 }}>
        <SidebarItem label="Today"        sub="snapshot"       routeKey="today"       active={route === "today"} />
        <SidebarItem label="Arc"          sub="5-day trend"    routeKey="arc"         active={route === "arc"} />
        <SidebarItem label="Quiet radar"  sub="who needs you"  routeKey="quiet"       active={route === "quiet"} badge={jamesBadge} />
        <SidebarItem label="Celebration"  sub="tomorrow's draft" routeKey="celebration" active={route === "celebration"} />
      </div>

      <div style={{ padding: "16px 24px", borderTop: `1px solid ${C.ruleSoft}` }}>
        <Eyebrow style={{ fontSize: 9 }}>Cohort</Eyebrow>
        <div style={{ fontFamily: F.serif, fontSize: 14, color: C.ink, marginTop: 4 }}>Pacific Mercy</div>
        <div style={{ fontFamily: F.serif, fontSize: 13, color: C.ink70 }}>Hospitalist Pod 2</div>
        <div style={{ marginTop: 12, display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 7, height: 7, borderRadius: "50%", background: C.sage }}></div>
          <span style={{ fontFamily: F.serif, fontSize: 13, color: C.ink70 }}>{GL_FACILITATOR}</span>
        </div>
      </div>
    </div>
  );
};

// ─── Top bar above each view ────────────────────────────────────────────────
const TopBar = ({ title, eyebrow, right }) => {
  const { setPhoneOpen } = useApp();
  return (
    <div style={{
      padding: "20px 36px 18px", borderBottom: `1px solid ${C.ruleSoft}`,
      display: "flex", justifyContent: "space-between", alignItems: "center",
      background: C.paper, position: "sticky", top: 0, zIndex: 10,
    }}>
      <div>
        {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
        {title && <div style={{ fontFamily: F.serif, fontSize: 22, marginTop: 4, letterSpacing: "-0.01em" }}>{title}</div>}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
        {right}
        <button
          onClick={() => setPhoneOpen(true)}
          style={{
            padding: "8px 14px", background: "transparent", border: `1px solid ${C.rule}`,
            borderRadius: 4, fontFamily: F.mono, fontSize: 10, letterSpacing: "0.1em",
            color: C.ink70, textTransform: "uppercase", cursor: "pointer",
            display: "inline-flex", alignItems: "center", gap: 8,
          }}
        >
          <span style={{ width: 10, height: 14, border: `1.4px solid ${C.ink70}`, borderRadius: 2, position: "relative" }}>
            <span style={{ position: "absolute", bottom: 1, left: "50%", transform: "translateX(-50%)", width: 3, height: 3, borderRadius: "50%", background: C.ink70 }}></span>
          </span>
          What doctors see
        </button>
      </div>
    </div>
  );
};

// ─── Doctor Drawer ──────────────────────────────────────────────────────────
const DoctorDrawer = () => {
  const { drawerDoc, setDrawerDoc, setRoute } = useApp();
  if (!drawerDoc) return null;
  const doc = GL_DOCTORS.find(d => d.id === drawerDoc);
  const post = GL_TODAY_POSTS.find(p => p.who === doc.id);
  const eng = GL_ENGAGEMENT[doc.id];
  const posted = eng.flatMap(d => [...d]).filter(c => c === "✓").length;

  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(31,26,20,0.32)",
      zIndex: 50, display: "flex", justifyContent: "flex-end",
    }} onClick={() => setDrawerDoc(null)}>
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: 480, height: "100%", background: C.paper, padding: "30px 34px",
          overflowY: "auto", animation: "gl-slide-in .24s cubic-bezier(.2,.7,.3,1) both",
          boxShadow: "-12px 0 40px rgba(0,0,0,0.16)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 22 }}>
          <Eyebrow>Doctor detail</Eyebrow>
          <button onClick={() => setDrawerDoc(null)} style={{ background: "transparent", border: "none", fontFamily: F.serif, fontSize: 22, color: C.ink50, cursor: "pointer" }}>×</button>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <Avatar doc={doc} size={68} />
          <div>
            <div style={{ fontFamily: F.serif, fontSize: 26, letterSpacing: "-0.01em" }}>{doc.first} {doc.last}</div>
            <div style={{ fontFamily: F.mono, fontSize: 10, color: C.ink50, letterSpacing: "0.08em", marginTop: 4, textTransform: "uppercase" }}>
              {doc.role} · Year {doc.years}
            </div>
          </div>
        </div>

        <div style={{ marginTop: 28 }}>
          <Eyebrow>Their arc</Eyebrow>
          <div style={{ marginTop: 10, display: "flex", gap: 10 }}>
            {eng.map((day, di) => (
              <div key={di} style={{ flex: 1, textAlign: "center" }}>
                <div style={{ fontFamily: F.mono, fontSize: 9, color: C.ink50, letterSpacing: "0.1em" }}>D{di + 1}</div>
                <div style={{ marginTop: 6, display: "flex", justifyContent: "center", gap: 4 }}>
                  {[...day].map((c, ci) => (
                    <div key={ci} style={{
                      width: 26, height: 26, borderRadius: 4,
                      background: c === "✓" ? C.rust : "transparent",
                      border: c === "✓" ? "none" : `1px ${c === "·" ? "solid" : "dashed"} ${c === "·" ? C.rust : C.rule}`,
                    }}></div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 14, fontFamily: F.serif, fontSize: 14, color: C.ink70 }}>
            <span style={{ fontFamily: F.mono, fontSize: 18, color: posted < 3 ? C.rust : C.ink }}>{posted}</span>
            <span style={{ color: C.ink50 }}> / 5 posts</span>
          </div>
        </div>

        {post && (
          <div style={{ marginTop: 28, padding: "18px 20px", background: C.card, border: `1px solid ${C.ruleSoft}`, borderRadius: 4 }}>
            <Eyebrow>Posted this morning · {post.t}</Eyebrow>
            <div style={{ fontFamily: F.serif, fontSize: 16, lineHeight: 1.5, color: C.ink, marginTop: 8, fontStyle: "italic" }}>
              "{post.text}"
            </div>
          </div>
        )}

        {!post && doc.id === "jo" && (
          <div style={{ marginTop: 28, padding: "18px 20px", borderLeft: `2px solid ${C.rust}`, background: C.rustSoft + "55" }}>
            <Eyebrow color={C.rustInk}>Quiet · 2 windows</Eyebrow>
            <div style={{ fontFamily: F.serif, fontSize: 15, color: C.ink70, marginTop: 6, lineHeight: 1.5 }}>
              On call Tuesday overnight. Missed last night's evening and this morning. The Quiet Radar has a drafted 1:1 ready.
            </div>
            <button
              onClick={() => { setRoute("quiet"); setDrawerDoc(null); }}
              style={{ marginTop: 12, padding: "6px 12px", background: C.rust, color: C.card, border: "none", borderRadius: 4, fontFamily: F.serif, fontSize: 13, cursor: "pointer" }}
            >
              Open Radar →
            </button>
          </div>
        )}

        <div style={{ marginTop: 28 }}>
          <Eyebrow>This week's reactions</Eyebrow>
          <div style={{ marginTop: 10, display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
            {[
              { num: posted, label: "posts" },
              { num: doc.id === "jo" ? 3 : doc.id === "sr" ? 12 : 8, label: "reactions given" },
              { num: doc.id === "sr" ? 11 : 4 + (doc.id.charCodeAt(0) % 4), label: "reactions received" },
            ].map((s, i) => (
              <div key={i} style={{ padding: "14px 14px", background: C.card, border: `1px solid ${C.ruleSoft}`, borderRadius: 4 }}>
                <div style={{ fontFamily: F.mono, fontSize: 22, color: C.ink }}>{s.num}</div>
                <div style={{ fontFamily: F.serif, fontSize: 12.5, color: C.ink50, marginTop: 2 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Phone Drawer ──────────────────────────────────────────────────────────
const PhoneDrawer = () => {
  const { phoneOpen, setPhoneOpen, phoneTab, setPhoneTab } = useApp();
  if (!phoneOpen) return null;

  const Tab = ({ k, label }) => (
    <button
      onClick={() => setPhoneTab(k)}
      style={{
        padding: "8px 16px", background: "transparent",
        border: "none", borderBottom: phoneTab === k ? `2px solid ${C.rust}` : "2px solid transparent",
        fontFamily: F.serif, fontSize: 14, color: phoneTab === k ? C.ink : C.ink50,
        cursor: "pointer",
      }}
    >{label}</button>
  );

  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(31,26,20,0.32)",
      zIndex: 60, display: "flex", justifyContent: "flex-end",
    }} onClick={() => setPhoneOpen(false)}>
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: 540, height: "100%", background: C.paper, padding: "26px 32px",
          overflowY: "auto", animation: "gl-slide-in .24s cubic-bezier(.2,.7,.3,1) both",
          boxShadow: "-12px 0 40px rgba(0,0,0,0.16)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
          <Eyebrow>What doctors see · live mirror</Eyebrow>
          <button onClick={() => setPhoneOpen(false)} style={{ background: "transparent", border: "none", fontFamily: F.serif, fontSize: 22, color: C.ink50, cursor: "pointer" }}>×</button>
        </div>
        <div style={{ fontFamily: F.serif, fontSize: 22, letterSpacing: "-0.01em" }}>
          The group thread, the nudges.
        </div>
        <div style={{ marginTop: 4, fontFamily: F.serif, fontSize: 14, color: C.ink70 }}>
          Two-way mirror of WhatsApp Pod 2 and the SMS nudges. You can't post from here — these are read-only previews.
        </div>

        <div style={{ marginTop: 18, display: "flex", gap: 4, borderBottom: `1px solid ${C.ruleSoft}` }}>
          <Tab k="whatsapp" label="WhatsApp · Pod 2" />
          <Tab k="sms" label="SMS · James's lock screen" />
        </div>

        <div style={{ marginTop: 24, display: "flex", justifyContent: "center" }}>
          <div style={{
            width: 390, height: 760, borderRadius: 38,
            boxShadow: "0 18px 48px rgba(0,0,0,0.22), inset 0 0 0 8px #0c0a08, inset 0 0 0 9px #2b2620",
            overflow: "hidden", position: "relative", background: "#000",
          }}>
            <div style={{ position: "absolute", inset: 8, borderRadius: 30, overflow: "hidden" }}>
              {phoneTab === "whatsapp" && <PhoneWhatsApp />}
              {phoneTab === "sms" && <PhoneSMS />}
            </div>
            {/* notch */}
            <div style={{ position: "absolute", top: 8, left: "50%", transform: "translateX(-50%)", width: 100, height: 24, background: "#000", borderRadius: 14, zIndex: 5 }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Toast ──────────────────────────────────────────────────────────────────
const Toast = () => {
  const { toast } = useApp();
  if (!toast) return null;
  return (
    <div style={{
      position: "fixed", bottom: 28, left: "50%", transform: "translateX(-50%)",
      padding: "12px 22px", background: C.black, color: C.card,
      borderRadius: 8, fontFamily: F.serif, fontSize: 14,
      boxShadow: "0 10px 28px rgba(0,0,0,0.25)", zIndex: 200,
      animation: "gl-fade-in .2s ease-out",
    }}>{toast}</div>
  );
};

// ─── App ────────────────────────────────────────────────────────────────────
const App = () => {
  return (
    <AppProvider>
      <AppInner />
    </AppProvider>
  );
};

const AppInner = () => {
  const { route } = useApp();
  return (
    <div style={{ display: "flex", minHeight: "100vh", background: C.paper, color: C.ink, fontFamily: F.serif }}>
      <Sidebar />
      <div style={{ flex: 1, minWidth: 0 }}>
        {route === "today" && <TodayView />}
        {route === "arc" && <ArcView />}
        {route === "quiet" && <QuietView />}
        {route === "celebration" && <CelebrationView />}
      </div>
      <DoctorDrawer />
      <PhoneDrawer />
      <Toast />
    </div>
  );
};

Object.assign(window, { App, AppInner, Sidebar, TopBar, DoctorDrawer, PhoneDrawer, Toast });
