export interface DontBlockMeQuestion {
  id: string;
  text: string;
  emoji: string;
  category: "habits" | "spicy" | "lifestyle" | "reactions" | "favorites";
  options: string[];
}

export const DONT_BLOCK_ME_QUESTIONS: DontBlockMeQuestion[] = [
  {
    id: "dbm_1",
    text: "What is my absolute favorite food to eat?",
    emoji: "🍕",
    category: "favorites",
    options: ["Biryani", "Pizza / Burgers", "Sushi / Ramen", "Chocolates & Desserts"]
  },
  {
    id: "dbm_2",
    text: "What do I do when I am totally bored?",
    emoji: "📱",
    category: "habits",
    options: ["Doomscroll Reels & TikTok", "Take a 3-hour nap", "Text everyone random memes", "Binge an entire series"]
  },
  {
    id: "dbm_3",
    text: "What would I do if you actually blocked me?",
    emoji: "🚫",
    category: "reactions",
    options: ["Block you back instantly", "Call you 20 times in a row", "Cry dramatically into a pillow", "Not even notice for 3 weeks"]
  },
  {
    id: "dbm_4",
    text: "Am I a morning person or a night owl?",
    emoji: "🦉",
    category: "lifestyle",
    options: ["100% Night Owl (Awake at 3 AM)", "Early Bird catching worms", "Always tired regardless of time", "Sleeps 12 hours a day"]
  },
  {
    id: "dbm_5",
    text: "Where is my dream vacation spot?",
    emoji: "✈️",
    category: "favorites",
    options: ["Tropical Beach & Bali", "Paris & Switzerland", "Tokyo, Japan", "Cozy cabin in snowy mountains"]
  },
  {
    id: "dbm_6",
    text: "What is my biggest pet peeve?",
    emoji: "😤",
    category: "spicy",
    options: ["Being left on read / ignored", "Slow walkers & slow internet", "Loud chewers", "Fake & flaky people"]
  },
  {
    id: "dbm_7",
    text: "What's my go-to comfort drink?",
    emoji: "🧋",
    category: "favorites",
    options: ["Iced Coffee / Latte", "Boba Milk Tea", "Hot Chai / Tea", "Cold Soda / Energy Drink"]
  },
  {
    id: "dbm_8",
    text: "How do I handle a bad mood or frustration?",
    emoji: "😡",
    category: "reactions",
    options: ["Vent for 2 hours straight", "Silent treatment & isolation", "Eat all the junk food", "Listen to sad music in the dark"]
  },
  {
    id: "dbm_9",
    text: "If we were in a horror movie, what happens to me?",
    emoji: "👻",
    category: "spicy",
    options: ["Survives till the very end", "Dies in the first 5 minutes", "I'm the secret villain", "Trips over nothing while running"]
  },
  {
    id: "dbm_10",
    text: "Can you trust me with a top-secret tea/gossip?",
    emoji: "🤫",
    category: "habits",
    options: ["I take it to my grave", "I only tell my other best friend", "I accidentally spill it in 10 minutes", "I ask 50 follow-up questions first"]
  },
  {
    id: "dbm_11",
    text: "What would I buy first if I won $10,000,000?",
    emoji: "💰",
    category: "lifestyle",
    options: ["Luxury house & penthouse", "Travel the whole world forever", "Buy sports cars & designer clothes", "Save & invest it secretly"]
  },
  {
    id: "dbm_12",
    text: "What is my texting / replying style?",
    emoji: "💬",
    category: "lifestyle",
    options: ["Replies within 3 seconds", "Replies 8 business days later", "Sends 10 short texts in a row", "Answers with voice notes only"]
  },
  {
    id: "dbm_13",
    text: "If I get arrested, what is it most likely for?",
    emoji: "🚓",
    category: "spicy",
    options: ["Road rage / speeding", "Being in the wrong place at the wrong time", "Stealing someone's food", "Arguing with an authority figure"]
  },
  {
    id: "dbm_14",
    text: "What kind of movie or show is my guilty pleasure?",
    emoji: "🎬",
    category: "favorites",
    options: ["Cheesy romantic comedies", "True crime documentaries", "Mind-bending Sci-Fi & Anime", "Reality TV drama"]
  },
  {
    id: "dbm_15",
    text: "Am I an introvert or an extrovert?",
    emoji: "🎭",
    category: "lifestyle",
    options: ["Introvert (Love staying home)", "Extrovert (Life of the party)", "Ambivert (Depends on the vibe)", "Social battery dies in 30 mins"]
  }
];

export function getRandomQuizQuestions(count = 10): DontBlockMeQuestion[] {
  const shuffled = [...DONT_BLOCK_ME_QUESTIONS].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}
