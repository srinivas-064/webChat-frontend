export const mockConfessions = [
  {
    id: "cf1",
    author: "Anonymous",
    title: "I switched majors without telling anyone",
    excerpt:
      "Spent a semester pretending to study META while secretly moving to EE. Felt like a spy, but I finally feel relieved.",
    body: `
I kept going to the META lab just to keep the cover alive, but every night I was grinding EE assignments.
If you're stuck in the wrong place, it's okay to pivot. Just wish I'd been honest sooner.
`,
    tags: ["confession", "academics"],
    createdAt: "2026-01-12T07:00:00Z",
    comments: [
      { id: "cf1-c1", author: "kgp_confessor", text: "Proud of you for choosing yourself." },
      { id: "cf1-c2", author: "EEbuddy", text: "Welcome to the circuit circus!" },
    ],
  },
  {
    id: "cf2",
    author: "Sleepless",
    title: "Skipped a viva to help a friend",
    excerpt:
      "Lost 10 marks, but I don't regret covering for a friend who froze. Still, guilt hits whenever grades come up.",
    body: `
The TA wasn't amused and I had to take the blame. My friend got through, but I tanked my score.
Would you do it again knowing it hurts your GPA? I think I still would.
`,
    tags: ["friendship", "confession"],
    createdAt: "2026-01-22T14:30:00Z",
    comments: [{ id: "cf2-c1", author: "Anon", text: "You chose kindness over marks. Respect." }],
  },
  {
    id: "cf3",
    author: "LateRunner",
    title: "Stole someone's cycle during a downpour",
    excerpt:
      "Panicked before an exam, grabbed an unlocked Atlas near Vikramshila. Returned it after, but the guilt lingers.",
    body: `
I was soaked, late, and desperate. Found an unlocked cycle and rode straight to the exam hall.
I parked it back with an apology note and a pack of munchies. Still feel awful.
`,
    tags: ["ethics", "rainyday"],
    createdAt: "2026-01-28T05:10:00Z",
    comments: [],
  },
];
