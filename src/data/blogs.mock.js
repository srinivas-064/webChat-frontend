export const mockBlogs = [
  {
    id: "1",
    author: "Kgpian42",
    title: "How to survive endsems",
    excerpt:
      "Some small wins that helped me keep sane during the last exam week...",
    body: `
I broke my week into 90-minute sprints, then took 15-minute walks to reset. A few more tips that kept me afloat:

1) Swap notes with a buddy *before* the night of the exam.
2) Keep a 'question parking lot' so you don't derail yourself mid-revision.
3) Sleep. Seriously, the extra hour was worth more than one more derivation.

Drop your own hacks in the comments—might save someone else this semester.
`,
    tags: ["tips", "study"],
    imageUrl:
      "https://images.unsplash.com/photo-1503676382389-4809596d5290?auto=format&fit=crop&w=1200&q=80",
    createdAt: "2026-01-15T10:00:00Z",
    comments: [
      { id: "c1", author: "anon", text: "Pomodoro + chai = winning combo" },
      { id: "c2", author: "S", text: "Noise-cancelling at library basement helps" },
    ],
  },
  {
    id: "2",
    author: "anon",
    title: "Confession: I actually like 8 am labs",
    excerpt:
      "Turns out campus is gorgeous that early and the lab assistants are super chill.",
    body: `
Maybe I'm the odd one out, but the 8 am lab slot is underrated. Zero queues for equipment, TAs are surprisingly patient, and you get the whole afternoon free. The only trick: crash by midnight and grab a dosa on the way.
`,
    tags: ["confession"],
    imageUrl:
      "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1200&q=80",
    createdAt: "2026-01-20T08:30:00Z",
    comments: [{ id: "c3", author: "labmate", text: "Respect. I can never wake up" }],
  },
  {
    id: "3",
    author: "Saras",
    title: "Hidden food spots near Vikramshila",
    excerpt: "Three places that never fail: chai tapri, roll stall, juice corner.",
    body: `
1) The chai tapri behind the parking lot—ginger chai is ₹12 and glorious.
2) The roll stall next to cycle stand—ask for extra onions + lime.
3) Juice corner near the xerox shop—mosambi after a lab is bliss.
Add your finds, keep it KGP-only :)
`,
    tags: ["food", "campus"],
    imageUrl:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80",
    createdAt: "2026-01-25T18:10:00Z",
    comments: [
      { id: "c4", author: "KP", text: "Lassi shop near gymkhana too!" },
      { id: "c5", author: "anon", text: "Is roll stall open past 9?" },
    ],
  },
];
