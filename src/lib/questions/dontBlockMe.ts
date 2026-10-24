export interface DontBlockMeQuestion {
  id: string;
  text: string;
  emoji: string;
  category: "habits" | "spicy" | "lifestyle" | "reactions" | "favorites" | "drama" | "phone";
  options: string[];
}

export const DONT_BLOCK_ME_QUESTIONS: DontBlockMeQuestion[] = [
  // 1-5: Classic Favorites & Core Vibe
  {
    id: "dbm_1",
    text: "What is my absolute favorite food to eat?",
    emoji: "🍕",
    category: "favorites",
    options: ["Biryani / Spicy Curry", "Pizza & Burgers", "Sushi & Asian food", "Desserts, Cake & Ice Cream"]
  },
  {
    id: "dbm_2",
    text: "What do I do when I am totally bored at home?",
    emoji: "📱",
    category: "habits",
    options: ["Doomscroll Reels & TikTok for hours", "Take a random 3-hour nap", "Send 15 unhinged memes in the chat", "Binge-watch an entire series"]
  },
  {
    id: "dbm_3",
    text: "What would I do if you actually blocked me right now?",
    emoji: "🚫",
    category: "reactions",
    options: ["Block you back on every single app", "Call you 20 times in a panic", "Send an essay demanding an explanation", "Not even notice for three weeks"]
  },
  {
    id: "dbm_4",
    text: "Am I a morning person or a night owl?",
    emoji: "🦉",
    category: "lifestyle",
    options: ["100% Night Owl (Peak energy at 2 AM)", "Early Bird up before the sun", "Always exhausted regardless of time", "Sleeps 12 hours on weekends"]
  },
  {
    id: "dbm_5",
    text: "Where is my dream vacation destination?",
    emoji: "✈️",
    category: "favorites",
    options: ["Tropical Beach & Bali resorts", "Europe (Paris, Rome, Switzerland)", "Tokyo & Kyoto, Japan", "Cozy wooden cabin in snowy mountains"]
  },

  // 6-10: Spicy Pet Peeves & Quirks
  {
    id: "dbm_6",
    text: "What is my biggest everyday pet peeve?",
    emoji: "😤",
    category: "spicy",
    options: ["Being left on read or ignored", "Slow walkers & slow internet", "Loud chewers & mouth-breathers", "People being fake or flaky with plans"]
  },
  {
    id: "dbm_7",
    text: "What's my go-to comfort drink order?",
    emoji: "🧋",
    category: "favorites",
    options: ["Iced Coffee / Cold Brew", "Boba Milk Tea", "Hot Chai or Matcha", "Ice cold Soda or Energy Drink"]
  },
  {
    id: "dbm_8",
    text: "How do I handle a bad mood or frustration?",
    emoji: "😡",
    category: "reactions",
    options: ["Vent to you for 2 hours straight", "Go completely silent and isolate", "Eat all the junk food in sight", "Listen to sad music in the dark"]
  },
  {
    id: "dbm_9",
    text: "If we were in a horror movie, what happens to me?",
    emoji: "👻",
    category: "spicy",
    options: ["Survives till the very end through logic", "Dies in the first 5 minutes investigate a noise", "I'm secretly the killer all along", "Trips over flat ground while running"]
  },
  {
    id: "dbm_10",
    text: "Can you trust me with a top-secret juicy gossip?",
    emoji: "🤫",
    category: "drama",
    options: ["I take it to my grave (Steel trap)", "I tell only my other best friend", "I accidentally spill it in 15 minutes", "I say 'I knew it!' and ask for receipts"]
  },

  // 11-15: Real-Life Daily Scenarios
  {
    id: "dbm_11",
    text: "When my morning alarm rings, what do I actually do?",
    emoji: "⏰",
    category: "habits",
    options: ["Hit snooze at least 5 times", "Jump out of bed instantly", "Turn it off and accidentally fall back asleep", "Stare at the ceiling questioning my life"]
  },
  {
    id: "dbm_12",
    text: "What is my real texting & replying style?",
    emoji: "💬",
    category: "phone",
    options: ["Replies within 3 seconds flat", "Replies 4 business days later in my head", "Sends 8 short texts in rapid fire", "Communicates 90% via voice notes"]
  },
  {
    id: "dbm_13",
    text: "If we order food together, what is my toxic habit?",
    emoji: "🍟",
    category: "habits",
    options: ["Says 'I'm not hungry' then steals your fries", "Takes 45 minutes to pick what to eat", "Orders way too much food and can't finish", "Customizes every single ingredient on the menu"]
  },
  {
    id: "dbm_14",
    text: "What would someone find the most of in my phone camera roll?",
    emoji: "📸",
    category: "phone",
    options: ["Screenshots of random drama & memes", "Pictures of my pet or cute animals", "50 selfies from the exact same angle", "Aesthetic photos of food & sky"]
  },
  {
    id: "dbm_15",
    text: "If someone cancels plans with me last minute, how do I react?",
    emoji: "🛋️",
    category: "reactions",
    options: ["Secretly relieved because I wanted to stay home", "Mildly annoyed but act totally fine", "Never make plans with them again", "Already had pajamas on anyway"]
  },

  // 16-20: Social Life & Drama
  {
    id: "dbm_16",
    text: "What would I do if you texted me: 'We need to talk urgently'?",
    emoji: "🚨",
    category: "drama",
    options: ["Call you in 0.5 seconds panicking", "Assume I did something wrong and overthink", "Reply with 'Who died or who cheated?!'", "Leave it on delivered out of fear"]
  },
  {
    id: "dbm_17",
    text: "If we get into a disagreement, who usually breaks the silence first?",
    emoji: "🤝",
    category: "drama",
    options: ["I apologize or send a meme to break tension", "I stay stubborn until you reach out", "We act like nothing happened 10 mins later", "I write a thoughtful paragraph explaining my side"]
  },
  {
    id: "dbm_18",
    text: "If we went to a party where I don't know anyone, what am I doing?",
    emoji: "🎉",
    category: "lifestyle",
    options: ["Stuck to you like glue the entire night", "Making friends with the host's dog or cat", "In the kitchen near the food table", "Already planning an excuse to leave early"]
  },
  {
    id: "dbm_19",
    text: "What is my biggest red flag according to you?",
    emoji: "🚩",
    category: "spicy",
    options: ["Horrible at replying to messages", "Chronic overthinker who creates fake scenarios", "Zero patience when hungry (Hangry)", "Impulsive shopping when stressed"]
  },
  {
    id: "dbm_20",
    text: "If I get pulled over or arrested, what is it most likely for?",
    emoji: "🚓",
    category: "spicy",
    options: ["Speeding while singing passionately to music", "Being in the wrong place at the wrong time", "Stealing someone's food from the fridge", "Arguing with someone over something petty"]
  },

  // 21-25: Shopping, Money & Impulses
  {
    id: "dbm_21",
    text: "What am I most likely to impulsively blow my money on?",
    emoji: "💸",
    category: "lifestyle",
    options: ["Late night food delivery & treats", "Clothes and shoes I will wear once", "Random viral TikTok gadgets on Amazon", "Concert or festival tickets"]
  },
  {
    id: "dbm_22",
    text: "If we are shopping and see something way too expensive, what do I say?",
    emoji: "🏷️",
    category: "habits",
    options: ["'It's cute, but not for that price!'", "'You only live once, I'm buying it'", "'I could make this myself at home'", "Quietly put it back and walk away fast"]
  },
  {
    id: "dbm_23",
    text: "How do I pack my suitcase for a 3-day weekend trip?",
    emoji: "🧳",
    category: "habits",
    options: ["Packs 14 outfits just in case I become a new person", "Packs 20 minutes before leaving for the airport", "Neatly organized with packing cubes & checklist", "Forgets essentials like toothpaste or phone charger"]
  },
  {
    id: "dbm_24",
    text: "How long does it realistically take me to get ready to leave?",
    emoji: "💄",
    category: "lifestyle",
    options: ["10 minutes flat (Ready instantly)", "Takes a solid 1 to 2 hours of perfection", "Says 'I'm 5 minutes away' when still in towel", "Ready on time only when pressured"]
  },
  {
    id: "dbm_25",
    text: "What is my screen time secretly looking like right now?",
    emoji: "⏳",
    category: "phone",
    options: ["Over 7+ hours a day (Chronically online)", "Reasonable 3 to 4 hours", "I refuse to look at the weekly report", "Most of it is YouTube or podcast background noise"]
  },

  // 26-30: Real Emotion & Comfort
  {
    id: "dbm_26",
    text: "When I'm having a rough day, what is the #1 way to cheer me up?",
    emoji: "🥺",
    category: "reactions",
    options: ["Bring me my favorite food or sweet treat", "Let me rant without giving unsolicited advice", "Send me hilarious memes and funny TikToks", "Distract me with an adventure outside"]
  },
  {
    id: "dbm_27",
    text: "What is my phone battery percentage usually sitting at?",
    emoji: "🔋",
    category: "phone",
    options: ["Stressing at 8% with low power mode on", "Always charged at 80% to 100%", "Lives on a charger 24/7", "Randomly dies in the middle of important calls"]
  },
  {
    id: "dbm_28",
    text: "What is my car or passenger personality?",
    emoji: "🚗",
    category: "lifestyle",
    options: ["Aux DJ in charge of the playlist & vibes", "Passenger princess who naps within 10 minutes", "Backseat driver giving unwanted directions", "Road rages at every person who doesn't use a turn signal"]
  },
  {
    id: "dbm_29",
    text: "What is my biggest irrational fear?",
    emoji: "😱",
    category: "spicy",
    options: ["Creepy spiders, bugs or cockroaches", "Sending a screenshot to the person it's about", "Calling someone on the phone instead of texting", "Checking my bank account balance"]
  },
  {
    id: "dbm_30",
    text: "What would I do if you cooked me something and it tasted terrible?",
    emoji: "🍲",
    category: "reactions",
    options: ["Politely eat it and say it's 'interesting'", "Honest feedback: 'This is awful, let's order pizza'", "Douse it in hot sauce or ketchup to swallow it", "Hide food in a napkin like a cartoon"]
  },

  // 31-35: Personality & Habits
  {
    id: "dbm_31",
    text: "Do I check someone's Instagram story right away or leave it?",
    emoji: "👀",
    category: "phone",
    options: ["Watches it within 60 seconds (Always on phone)", "Leaves it for 20 hours so I don't look desperate", "Only watches stories when I'm bored in bed", "Doesn't care at all"]
  },
  {
    id: "dbm_32",
    text: "What do I complain about the most on a daily basis?",
    emoji: "🗣️",
    category: "habits",
    options: ["Being tired and needing more sleep", "How bad the weather or traffic is", "School or work stressing me out", "My back or neck hurting randomly"]
  },
  {
    id: "dbm_33",
    text: "If I won $10,000 cash tomorrow, what's my realistic first move?",
    emoji: "💵",
    category: "lifestyle",
    options: ["Book a luxury flight and vacation immediately", "Put it all in savings or pay off debts", "Go on an expensive shopping spree", "Treat my closest friends and family to dinner"]
  },
  {
    id: "dbm_34",
    text: "What is the one food I will NEVER touch, even if I'm starving?",
    emoji: "🤢",
    category: "favorites",
    options: ["Seafood / Oysters / Fishy food", "Mushrooms / Slimy vegetables", "Extremely spicy peppers", "Olives or Blue Cheese"]
  },
  {
    id: "dbm_35",
    text: "Would I share the very last bite of my favorite dessert with you?",
    emoji: "🍰",
    category: "favorites",
    options: ["Yes, of course, because I love you!", "Reluctantly, but I'll glare at you while you eat it", "Absolutely not, Joey doesn't share food!", "I'll offer, secretly praying you say 'no'"]
  },

  // 36-40: Deep Friendship Reality
  {
    id: "dbm_36",
    text: "If someone is talking trash behind my back, what will I do?",
    emoji: "🔥",
    category: "drama",
    options: ["Confront them directly with screenshots", "Cut them off silently without giving closure", "Pretend I don't know and laugh at their audacity", "Talk trash about them right back"]
  },
  {
    id: "dbm_37",
    text: "How do I make difficult life decisions?",
    emoji: "🎲",
    category: "habits",
    options: ["Ask 5 friends for advice, then do the opposite", "Trust my gut instinct instantly", "Make a pro/con list and still overthink", "Flip a coin or sleep on it for 2 weeks"]
  },
  {
    id: "dbm_38",
    text: "What's my secret guilty pleasure TV show or movie genre?",
    emoji: "🍿",
    category: "favorites",
    options: ["Trashy reality dating shows (Love is Blind / Too Hot)", "Cringe teen dramas from 2012", "Dark true-crime serial killer documentaries", "Cheesy Christmas Hallmark movies"]
  },
  {
    id: "dbm_39",
    text: "If I have to make a phone call to a stranger (doctor/restaurant), how do I feel?",
    emoji: "📞",
    category: "phone",
    options: ["Rehearse what I'm going to say 5 times in my head", "Totally normal, I just dial without thinking", "Look for an online booking form first at all costs", "Make someone else do it for me"]
  },
  {
    id: "dbm_40",
    text: "Are we going to still be close friends 10 years from now?",
    emoji: "♾️",
    category: "drama",
    options: ["100% yes, we're stuck with each other for life!", "Depends on whether you get blocked on this test! 🚫", "Yes, even if we go weeks without talking", "We'll be causing chaos in the nursing home together"]
  }
];

export function getRandomQuizQuestions(count = 10): DontBlockMeQuestion[] {
  const shuffled = [...DONT_BLOCK_ME_QUESTIONS].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}
