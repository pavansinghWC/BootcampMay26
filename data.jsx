// Shared mock data for Growth Leap facilitator dashboard
// Cohort: 6 hospitalists, Day 3 of 5 ("Reaching" arc)

const GL_TODAY = "Wed, May 22";
const GL_NOW = "11:42 AM";

const GL_COHORT_NAME = "Pacific Mercy · Hospitalist Pod 2";
const GL_FACILITATOR = "Sana Ahmadi";

const GL_DOCTORS = [
  { id: "pr", first: "Priya", last: "Raghavan", role: "Hospitalist",        initials: "PR", years: 9,  color: "#B5733F" },
  { id: "mc", first: "Marcus", last: "Chen",     role: "Hospitalist",        initials: "MC", years: 12, color: "#7A8B5B" },
  { id: "sr", first: "Sofía",  last: "Restrepo", role: "Hospitalist · Lead", initials: "SR", years: 14, color: "#9B6B4A" },
  { id: "jo", first: "James",  last: "Okafor",   role: "Hospitalist",        initials: "JO", years: 6,  color: "#5C6E8A" },
  { id: "hw", first: "Hannah", last: "Weiss",    role: "Hospitalist",        initials: "HW", years: 8,  color: "#A8845C" },
  { id: "dp", first: "Daniel", last: "Park",     role: "Hospitalist",        initials: "DP", years: 11, color: "#6B7E6B" },
];

// 5-day arc — psychological progression
const GL_ARC = [
  { day: 1, theme: "Noticing",       morning: "Where did you feel most yourself at work yesterday?",            evening: "What did you notice in someone else today that they might not have noticed themselves?" },
  { day: 2, theme: "Naming",         morning: "When did you feel invisible last week — and who, if anyone, saw it?", evening: "If your day had a weather forecast, what was it?" },
  { day: 3, theme: "Reaching",       morning: "Who on this team could use one sentence from you today? Commit to it here.", evening: "Did you reach? What happened — or what got in the way?" },
  { day: 4, theme: "Returning",      morning: "What's one thing this group has done for you that you haven't said out loud?", evening: "Where did you almost give up today — and what kept you in?" },
  { day: 5, theme: "Carrying it",    morning: "What's the one practice from this week you want to keep?",         evening: "What will you protect for yourself, starting Monday?" },
];

// Per-doctor engagement across the arc (M = morning, E = evening, ' ' = not yet, '·' = quiet/skipped)
// Day 3 morning is the active window — most have responded, James hasn't.
// Today = Day 3, evening hasn't happened yet.
const GL_ENGAGEMENT = {
  pr: ["✓✓","✓✓","✓ ", " "], // strong
  mc: ["✓✓","✓✓","✓ ", " "], // strong
  sr: ["✓✓","✓✓","✓ ", " "], // strong, lead
  jo: ["✓✓","✓·","· ", " "], // QUIET — missed evening D2, missed morning D3
  hw: ["✓✓","✓✓","✓ ", " "], // strong
  dp: ["✓·","✓✓","✓ ", " "], // missed one
};

// Actual posts in today's morning window
const GL_TODAY_POSTS = [
  { who: "sr", t: "6:42 AM", text: "Going to tell Dr. Chen I noticed how he handled the family in 412 yesterday. He stayed an hour past sign-out and never mentioned it." },
  { who: "pr", t: "7:11 AM", text: "Reaching out to our overnight RN Talia. She caught the K+ on bed 7 and I never thanked her properly." },
  { who: "mc", t: "7:48 AM", text: "I want to ask Sofía how she's actually doing. Not in the hallway, not between pages. Real ask." },
  { who: "hw", t: "8:02 AM", text: "Going to text my co-resident from intern year. We're all in this and I haven't reached out in months." },
  { who: "dp", t: "9:23 AM", text: "One sentence to the case manager I keep snapping at when I'm behind. She doesn't deserve the edge in my voice." },
];

// Quiet signals
const GL_QUIET = [
  { who: "jo", since: "Yesterday evening", missed: 2, lastSeen: "Tue 7:14 PM (reacted only)", note: "On call Tue overnight. Didn't post Tue evening. Didn't post Wed morning." },
];

// Yesterday's collective stats for the celebration drafter
const GL_YESTERDAY = {
  date: "Tue, May 21",
  theme: "Naming",
  morningParticipation: "6 of 6",
  eveningParticipation: "5 of 6",
  reactions: 23,
  longestThread: "11 messages",
  standout: "Sofía's evening post drew 5 replies — the most this week.",
};

// AI-drafted celebration message (pending facilitator approval)
const GL_CELEBRATION_DRAFT = `Good morning, Pod 2.

Yesterday you named things out loud that most of us carry silently — invisible weeks, weather we don't admit to. Six of you showed up in the morning. Five of you came back in the evening. Sofía's post about the Tuesday she almost called out drew the longest thread we've had this arc.

Today is Day 3 — Reaching. The morning prompt asks for one sentence to one person. That's the whole assignment. See you in here.

— Sana`;

// SMS nudge copy
const GL_SMS_REMINDER = "Growth Leap: Day 3 morning prompt closes in 15 min. One sentence is plenty. Open WhatsApp →";
const GL_SMS_SOCIAL   = "Two of your teammates have shared something this morning. Take a look when you get a minute. — Sana";

Object.assign(window, {
  GL_TODAY, GL_NOW, GL_COHORT_NAME, GL_FACILITATOR,
  GL_DOCTORS, GL_ARC, GL_ENGAGEMENT, GL_TODAY_POSTS, GL_QUIET,
  GL_YESTERDAY, GL_CELEBRATION_DRAFT, GL_SMS_REMINDER, GL_SMS_SOCIAL,
});
