export const PRODUCTS = [
  {
    id: "doraemon-pocket",
    name: "Doraemon's Pocket",
    emoji: "🔵",
    basePrice: 999999,
    description:
      "The legendary 4D pocket from the 22nd century. Infinite storage. Pull out any gadget you imagine.",
    rarity: "Legendary",
    category: "Anime Artifact",
    origin: "Doraemon",
    perks: ["Infinite storage", "Time-travel gadgets", "4D technology"],
  },
  {
    id: "boom-pencil",
    name: "Shaka Laka Boom Boom Pencil",
    emoji: "✏️",
    basePrice: 750000,
    description:
      "Draw anything and it comes to life. The magic pencil that made Sanju the most powerful kid in India.",
    rarity: "Epic",
    category: "Magic Item",
    origin: "Shaka Laka Boom Boom",
    perks: [
      "Reality manifestation",
      "Unlimited uses",
      "Eraser reverses creations",
    ],
  },
  {
    id: "nimbus-2000",
    name: "Nimbus 2000 Broomstick",
    emoji: "🧹",
    basePrice: 500000,
    description:
      "The fastest racing broomstick of the wizarding world. Harry Potter's original ride.",
    rarity: "Rare",
    category: "Wizarding Item",
    origin: "Harry Potter",
    perks: [
      "150mph speed",
      "Perfect maneuverability",
      "Anti-gravity enchantment",
    ],
  },
  {
    id: "omnitrix",
    name: "Ben 10 Omnitrix",
    emoji: "⌚",
    basePrice: 1200000,
    description:
      "The most powerful watch in the universe. Transform into 10,000+ alien species at will.",
    rarity: "Legendary",
    category: "Alien Tech",
    origin: "Ben 10",
    perks: [
      "10,000+ alien transformations",
      "Self-repair mode",
      "Plumber network access",
    ],
  },
  {
    id: "pikachu",
    name: "Pikachu (Trained)",
    emoji: "⚡",
    basePrice: 800000,
    description:
      "Ash's original Pikachu. Level 100. Knows Thunderbolt, Thunder, Volt Tackle, Iron Tail.",
    rarity: "Epic",
    category: "Pokemon",
    origin: "Pokemon",
    perks: [
      "Level 100",
      "Certified Elite",
      "Loyal companion",
      "Tournament legal",
    ],
  },
  {
    id: "dragon-balls",
    name: "Dragon Balls (Complete Set)",
    emoji: "🔮",
    basePrice: 2000000,
    description:
      "All 7 Dragon Balls. Summon Shenron for any wish. Annual reset. Warning: may attract Vegeta.",
    rarity: "Legendary",
    category: "Ancient Artifact",
    origin: "Dragon Ball Z",
    perks: ["3 wishes per summon", "Annual reset", "Unlimited potential"],
  },
  {
    id: "invisible-clock",
    name: "Invisible Clock",
    emoji: "⏰",
    basePrice: 300000,
    description:
      "Press the button, become completely invisible to all senses. Works anywhere, anytime.",
    rarity: "Rare",
    category: "Stealth Tech",
    origin: "Various",
    perks: [
      "True invisibility",
      "Unlimited duration",
      "Undetectable by sensors",
    ],
  },
  {
    id: "magic-wand",
    name: "Hermione's Magic Wand",
    emoji: "🪄",
    basePrice: 450000,
    description:
      "Hermione Granger's personal vine wood wand. Dragon heartstring core. 1000+ pre-learned spells.",
    rarity: "Epic",
    category: "Wizarding Item",
    origin: "Harry Potter",
    perks: ["Dragon heartstring core", "Vine wood", "Pre-learned 1000+ spells"],
  },
  {
    id: "iron-man-suit",
    name: "Iron Man Suit (Mark L)",
    emoji: "🦾",
    basePrice: 10000000,
    description:
      "Tony Stark's nanotech Mark L suit. Full JARVIS integration. Repulsor beams, missiles, Mach 5.",
    rarity: "Legendary",
    category: "Advanced Tech",
    origin: "Marvel",
    perks: [
      "Nanotech construction",
      "JARVIS AI",
      "Mach 5 speed",
      "Arc reactor powered",
    ],
  },
];

export const SELLERS = [
  {
    id: "merchant",
    name: "The Merchant",
    title: "Black Market Dealer",
    origin: "Resident Evil 4",
    greeting: "What are ya buyin', stranger?",
    accentColor: "#d4830a",
    difficulty: "Hard",
    difficultyColor: "#ef4444",
    avatar: "🏪",
    soundFile: "merchant-welcome.mp3",
    bgClass: "from-amber-950/30 to-transparent",
    borderColor: "#d4830a40",
    description:
      "Gruff, mysterious, and stubborn. Only budges for those who truly need it. Rare discounts.",
    tags: ["Tough Negotiator", "RE4 Style", "Rare Deals"],
  },
  {
    id: "modi",
    name: "Narendra Modi",
    title: "Pradhan Mantri of Deals",
    origin: "Prime Minister of India",
    greeting: "Mitron! Ek Black Market, Shreshtha Market!",
    accentColor: "#ff9933",
    difficulty: "Medium",
    difficultyColor: "#f59e0b",
    avatar: "🇮🇳",
    soundFile: "modi-welcome.mp3",
    bgClass: "from-orange-950/30 to-transparent",
    borderColor: "#ff993340",
    description:
      "Passionate, motivational, speaks in Hinglish. Responds to logical arguments and patriotism.",
    tags: ["Medium Difficulty", "Hinglish", "Passionate"],
  },
  {
    id: "jethalal",
    name: "Jetha Lal Gada",
    title: "GADA Electronics & Black Market",
    origin: "Taarak Mehta Ka Ooltah Chashmah",
    greeting: "Kem cho! GADA Electronics mein aapka swagat hai!",
    accentColor: "#22c55e",
    difficulty: "Easy",
    difficultyColor: "#22c55e",
    avatar: "📺",
    soundFile: "jethalal-welcome.mp3",
    bgClass: "from-green-950/30 to-transparent",
    borderColor: "#22c55e40",
    description:
      "Funny, emotional, easily flustered. Mention Babita ji for instant discounts. Best for beginners.",
    tags: ["Easy Mode", "TMKOC Fan", "Emotional"],
  },
];

export const RARITY_STYLES = {
  Legendary: {
    class: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20",
    glow: "#eab30840",
  },
  Epic: {
    class: "text-purple-400 bg-purple-400/10 border-purple-400/20",
    glow: "#a855f740",
  },
  Rare: {
    class: "text-blue-400   bg-blue-400/10   border-blue-400/20",
    glow: "#3b82f640",
  },
};

export const RANK_INFO = {
  "Street Rat": { color: "#888", icon: "🐀", min: 0 },
  Hustler: { color: "#60a5fa", icon: "🃏", min: 3 },
  Dealer: { color: "#a78bfa", icon: "💼", min: 10 },
  Kingpin: { color: "#f4a261", icon: "👑", min: 20 },
  "Black Market Legend": { color: "#e63946", icon: "💀", min: 50 },
};

export const formatPrice = (n) =>
  n >= 1_000_000 ? `$${(n / 1_000_000).toFixed(2)}M` : `$${n.toLocaleString()}`;
