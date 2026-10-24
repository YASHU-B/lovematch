export interface DontBlockMeQuestion {
  id: string;
  text: string;
  emoji: string;
  category: "habits" | "spicy" | "lifestyle" | "reactions" | "favorites" | "drama" | "phone";
  options: string[];
}

export const DONT_BLOCK_ME_QUESTIONS: DontBlockMeQuestion[] = [
  // 1: Personality / Character (as requested: "what is his charac funny, rude")
  {
    id: "dbm_1",
    text: "What is my character?",
    emoji: "🎭",
    category: "lifestyle",
    options: ["Funny 😂", "Rude 😒", "Sweet 😇", "Crazy 🤪"]
  },

  // 2: Favorite Food (as requested: "what is fav food")
  {
    id: "dbm_2",
    text: "What's my favorite food?",
    emoji: "🍕",
    category: "favorites",
    options: ["Biryani 🍛", "Pizza 🍕", "Burger 🍔", "Maggi 🍜"]
  },

  // 3: Favorite Cartoon
  {
    id: "dbm_3",
    text: "What's my favorite cartoon?",
    emoji: "📺",
    category: "favorites",
    options: ["Shinchan 🖍️", "Doraemon 🔔", "Tom & Jerry 🐱", "Ninja Hattori 🥷"]
  },

  // 4: What do I spend most money on?
  {
    id: "dbm_4",
    text: "What do I spend most money on?",
    emoji: "💸",
    category: "lifestyle",
    options: ["Food 🍔", "Clothes 👟", "Games 🎮", "Tech ⌚"]
  },

  // 5: Mood mostly
  {
    id: "dbm_5",
    text: "What's my mood mostly?",
    emoji: "👀",
    category: "habits",
    options: ["Happy 🥳", "Lazy 🥱", "Annoyed 🙄", "Confused 😵‍💫"]
  },

  // 6: Favorite Drink
  {
    id: "dbm_6",
    text: "What's my favorite drink?",
    emoji: "🧋",
    category: "favorites",
    options: ["Chai ☕", "Coffee ☕", "Cold Drink 🥤", "Juice 🧃"]
  },

  // 7: When I'm bored
  {
    id: "dbm_7",
    text: "What do I do when bored?",
    emoji: "📱",
    category: "habits",
    options: ["Sleep 😴", "Scroll Reels 📱", "Eat snacks 🍿", "Call friends 📞"]
  },

  // 8: Relationship Status
  {
    id: "dbm_8",
    text: "What's my relationship status?",
    emoji: "💘",
    category: "spicy",
    options: ["Single 🥲", "Committed 💖", "Crushing 😍", "Complicated 😵‍💫"]
  },

  // 9: If you block me
  {
    id: "dbm_9",
    text: "If you block me, what will I do?",
    emoji: "🚫",
    category: "reactions",
    options: ["Block back 🚫", "Call you 📞", "Cry 😭", "Don't care 💅"]
  },

  // 10: Toxic trait / Red flag
  {
    id: "dbm_10",
    text: "What is my toxic trait?",
    emoji: "🚩",
    category: "spicy",
    options: ["Late reply 📱", "Mood swings 😡", "Overthinking 🧠", "Lazy 🦥"]
  },

  // 11: How do I wake up?
  {
    id: "dbm_11",
    text: "How do I wake up?",
    emoji: "⏰",
    category: "habits",
    options: ["10 alarms ⏰", "First alarm 🌅", "Mom wakes me 📢", "After 12 PM 🛌"]
  },

  // 12: Vibe / Nature
  {
    id: "dbm_12",
    text: "What is my social vibe?",
    emoji: "🗣️",
    category: "lifestyle",
    options: ["Introvert 🤫", "Extrovert 🗣️", "Ambivert 🎭", "Depends on person 🤷"]
  },

  // 13: Anger level
  {
    id: "dbm_13",
    text: "What is my anger level?",
    emoji: "😡",
    category: "reactions",
    options: ["Zero chill 🤬", "Calm 🧘", "Silent anger 🤫", "Cries when angry 🥺"]
  },

  // 14: Dressing style
  {
    id: "dbm_14",
    text: "What is my dressing style?",
    emoji: "👕",
    category: "lifestyle",
    options: ["Oversized 👕", "Trendy ✨", "Simple 👟", "Traditional 🥻"]
  },

  // 15: Dream trip
  {
    id: "dbm_15",
    text: "What is my dream trip?",
    emoji: "✈️",
    category: "favorites",
    options: ["Goa 🏖️", "Paris 🗼", "Japan 🌸", "Mountains 🏔️"]
  },

  // 16: Favorite Sweet
  {
    id: "dbm_16",
    text: "What's my favorite sweet?",
    emoji: "🍫",
    category: "favorites",
    options: ["Ice Cream 🍦", "Chocolates 🍫", "Gulab Jamun 🍯", "Pastries 🍰"]
  },

  // 17: Phone Battery
  {
    id: "dbm_17",
    text: "What's my phone battery mostly at?",
    emoji: "🪫",
    category: "phone",
    options: ["1% 🪫", "100% ⚡", "50% 🔋", "Always on charge 🔌"]
  },

  // 18: Texting reply speed
  {
    id: "dbm_18",
    text: "How fast do I text back?",
    emoji: "💬",
    category: "phone",
    options: ["Instantly ⚡", "After 5 hours ⏳", "In my head 💭", "Only memes 🤣"]
  },

  // 19: Biggest Fear
  {
    id: "dbm_19",
    text: "What's my biggest fear?",
    emoji: "👻",
    category: "spicy",
    options: ["Ghosts 👻", "Cockroaches 🪳", "Failing exams 📚", "Being left alone 🥺"]
  },

  // 20: Music taste
  {
    id: "dbm_20",
    text: "What's my favorite music vibe?",
    emoji: "🎧",
    category: "favorites",
    options: ["Pop songs 🎵", "Hip Hop 🎤", "Romantic ❤️", "Sad Songs 🌧️"]
  },

  // 21: Morning or Night
  {
    id: "dbm_21",
    text: "Am I a morning or night person?",
    emoji: "🦉",
    category: "lifestyle",
    options: ["Night owl 🦉", "Early bird 🌅", "Always sleepy 😴", "24/7 awake ⚡"]
  },

  // 22: Hidden Talent
  {
    id: "dbm_22",
    text: "What is my hidden talent?",
    emoji: "✨",
    category: "lifestyle",
    options: ["Sleeping 😴", "Drama 🎭", "Stalking 🕵️", "Cooking 🍳"]
  },

  // 23: Favorite Season
  {
    id: "dbm_23",
    text: "What's my favorite season?",
    emoji: "❄️",
    category: "favorites",
    options: ["Winter ❄️", "Rainy 🌧️", "Summer ☀️", "Spring 🌸"]
  },

  // 24: Movie Genre
  {
    id: "dbm_24",
    text: "What's my favorite movie genre?",
    emoji: "🍿",
    category: "favorites",
    options: ["Horror 🧟", "Comedy 😂", "Action 💥", "Romantic 💕"]
  },

  // 25: Secret Keeper
  {
    id: "dbm_25",
    text: "Can I keep a big secret?",
    emoji: "🤫",
    category: "drama",
    options: ["Vault 🔒", "Tells bestie 🗣️", "Zero secrets 😅", "Forgets it 🤷"]
  },

  // 26: Eating habit
  {
    id: "dbm_26",
    text: "What is my eating habit?",
    emoji: "🍟",
    category: "habits",
    options: ["Fast eater ⚡", "Picky eater 🥗", "Midnight eater 🌙", "Shares zero food 🚫"]
  },

  // 27: At parties
  {
    id: "dbm_27",
    text: "What do I do at parties?",
    emoji: "🎉",
    category: "lifestyle",
    options: ["Dance floor 💃", "Near the food 🍕", "In a corner 📱", "Leaves early 🏃"]
  },

  // 28: School / College type
  {
    id: "dbm_28",
    text: "What type of student am I?",
    emoji: "📚",
    category: "lifestyle",
    options: ["Topper 🤓", "Backbencher 😎", "Last-night study 📖", "Bunker 🏃"]
  },

  // 29: Bill Splitting
  {
    id: "dbm_29",
    text: "How do I split the bill?",
    emoji: "💳",
    category: "habits",
    options: ["Google Pay 📱", "Always pays 💸", "Forgot wallet 🏃", "Exact cents 🧮"]
  },

  // 30: When mad at someone
  {
    id: "dbm_30",
    text: "What do I do when mad at someone?",
    emoji: "😤",
    category: "reactions",
    options: ["Silent treatment 🤫", "Direct fight 🥊", "Sarcasm 🙃", "Vents to others 🗣️"]
  },

  // 31: Driving / Rider style
  {
    id: "dbm_31",
    text: "What is my driving vibe?",
    emoji: "🚗",
    category: "habits",
    options: ["Speed racer 🏎️", "Honks a lot 📢", "DJ in car 🎶", "Scared driver 🫣"]
  },

  // 32: Favorite Sport / Game
  {
    id: "dbm_32",
    text: "What's my favorite game?",
    emoji: "🎮",
    category: "favorites",
    options: ["Cricket 🏏", "Football ⚽", "BGMI / Free Fire 📱", "Ludo / Cards 🎲"]
  },

  // 33: Voice Notes
  {
    id: "dbm_33",
    text: "How do I send voice notes?",
    emoji: "🎙️",
    category: "phone",
    options: ["5 min podcasts 🎙️", "Never voice note 🚫", "Listens to self 🎧", "Only laughing 🤣"]
  },

  // 34: Cancelling plans
  {
    id: "dbm_34",
    text: "Why do I cancel plans?",
    emoji: "🛌",
    category: "habits",
    options: ["Cozy in bed 🛌", "No clothes to wear 👗", "No money 💸", "Never cancel 😇"]
  },

  // 35: Shopping style
  {
    id: "dbm_35",
    text: "What is my shopping style?",
    emoji: "🛍️",
    category: "lifestyle",
    options: ["Buys everything 🛍️", "Window shopping 👀", "Wait for sales 🏷️", "Only online 📦"]
  },

  // 36: When sad
  {
    id: "dbm_36",
    text: "What do I do when sad?",
    emoji: "🥺",
    category: "reactions",
    options: ["Sad songs 🎧", "Sleep 🛌", "Eat junk food 🍟", "Talk for hours 📞"]
  },

  // 37: Cooking skills
  {
    id: "dbm_37",
    text: "What are my cooking skills?",
    emoji: "🍳",
    category: "habits",
    options: ["Masterchef 👨‍🍳", "Only Maggi & Chai 🍜", "Burns water 🔥", "Orders Zomato 🛵"]
  },

  // 38: Social Media addiction
  {
    id: "dbm_38",
    text: "What's my favorite app?",
    emoji: "📲",
    category: "phone",
    options: ["Instagram 📸", "Snapchat 👻", "YouTube 🔴", "WhatsApp 💬"]
  },

  // 39: Pet lover
  {
    id: "dbm_39",
    text: "What is my favorite pet?",
    emoji: "🐾",
    category: "favorites",
    options: ["Dogs 🐶", "Cats 🐱", "Birds 🦜", "No pets 🚫"]
  },

  // 40: Friendship forever
  {
    id: "dbm_40",
    text: "Will we stay friends forever?",
    emoji: "♾️",
    category: "drama",
    options: ["Yes forever 💖", "Depends on quiz 😈", "Best friends 🤞", "Chaos forever 🤪"]
  }
];

export function getRandomQuizQuestions(count = 10): DontBlockMeQuestion[] {
  const shuffled = [...DONT_BLOCK_ME_QUESTIONS].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}
