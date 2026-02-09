export const mockConfessions = [
  {
    id: "c1",
    title: "I switched majors without telling anyone",
    author: "Anonymous",
    tags: ["academics", "confession"],
    mood: "🥲",
    createdAt: "2026-01-12T07:00:00Z",
    reactions: { relatable: 10, support: 6, funny: 1 },
    allowDMs: true,
    content:
      "Kept going to the old lab as cover while secretly grinding EE assignments. Relieved but also embarrassed it took this long.",
    comments: [
      { id: "cm1", author: "kgp_confessor", text: "Proud of you for choosing yourself." },
    ],
  },
  {
    id: "c2",
    title: "Skipped a viva to help a friend",
    author: "Sleepless",
    tags: ["friendship"],
    mood: "😍",
    createdAt: "2026-01-22T14:30:00Z",
    reactions: { relatable: 4, support: 8, funny: 0 },
    allowDMs: false,
    content:
      "Lost 10 marks covering for a friend who froze. I'd still do it, but the guilt hits whenever grades come up.",
    comments: [],
  },
];
