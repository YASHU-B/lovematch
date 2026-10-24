export interface Question {
  id: string;
  category: string;
  prompt: string;
  options: string[];
  acceptedEquivalents?: Record<string, string[]>;
  isActive: boolean;
}

export interface CategoryInfo {
  id: string;
  name: string;
  icon: string;
  description: string;
  badge?: string;
}

export const CATEGORIES: CategoryInfo[] = [
  {
    id: "favourite-things",
    name: "Favourite Things",
    icon: "Sparkles",
    description: "Favorites in food, music, seasons, and guilty pleasures.",
    badge: "Popular"
  },
  {
    id: "first-memories",
    name: "First Memories",
    icon: "Clock",
    description: "First impressions, first dates, and nostalgic moments.",
    badge: "Romantic"
  },
  {
    id: "romantic-moments",
    name: "Romantic Moments",
    icon: "Heart",
    description: "Love languages, dream dates, and sweet gestures.",
    badge: "Heartfelt"
  },
  {
    id: "daily-habits",
    name: "Daily Habits",
    icon: "Coffee",
    description: "Morning routines, sleep quirks, and phone habits.",
  },
  {
    id: "food-and-travel",
    name: "Food & Travel",
    icon: "Compass",
    description: "Dream destinations, snack cravings, and trip styles.",
  },
  {
    id: "funny-couple",
    name: "Funny Couple Quirks",
    icon: "Smile",
    description: "Playful arguments, funny habits, and who is clumsier.",
    badge: "Laughs"
  },
  {
    id: "long-distance",
    name: "Long-Distance Love",
    icon: "Send",
    description: "FaceTime rituals, countdowns, and airport reunions.",
  },
  {
    id: "anniversary-edition",
    name: "Anniversary Edition",
    icon: "Award",
    description: "Milestones, growth, future dreams, and promises.",
  },
  {
    id: "personality-preferences",
    name: "Personality & Mind",
    icon: "Brain",
    description: "Introvert vs extrovert, handling stress, and gut feelings.",
  },
  {
    id: "best-friends-mode",
    name: "Best Friends Mode",
    icon: "Users",
    description: "Inside jokes, secrets, loyalty tests, and bestie vibes.",
    badge: "Any Duo"
  }
];

export const INITIAL_QUESTIONS: Question[] = [
  // 1. Favourite Things (6 questions, including Seed 1)
  {
    id: "fav-1",
    category: "favourite-things",
    prompt: "What is your partner's favourite food?",
    options: ["Biryani", "Pizza & Pasta", "Street Food / Chaat", "Home-cooked Comfort Meal", "Sushi / Asian Cuisine", "Burgers & Fries"],
    isActive: true
  },
  {
    id: "fav-2",
    category: "favourite-things",
    prompt: "What is your partner's go-to comfort drink?",
    options: ["Chai / Milk Tea", "Filter Coffee / Cappuccino", "Fresh Fruit Juice / Smoothie", "Hot Chocolate", "Iced Cold Brew", "Sparkling Water / Soda"],
    isActive: true
  },
  {
    id: "fav-3",
    category: "favourite-things",
    prompt: "What movie or show genre could your partner rewatch endlessly?",
    options: ["Romantic Comedies", "Mind-bending Thrillers / Crime", "Feel-good Sitcoms (Friends, Office)", "Action & Sci-Fi", "Anime / Animation", "Dark Psychological Dramas"],
    isActive: true
  },
  {
    id: "fav-4",
    category: "favourite-things",
    prompt: "Which season does your partner love the most?",
    options: ["Cozy Rainy / Monsoon days", "Crisp Autumn / Fall", "Snowy Winter blankets", "Sunny Spring flowers", "Vibrant Summer beaches", "Any season with good weather!"],
    isActive: true
  },
  {
    id: "fav-5",
    category: "favourite-things",
    prompt: "What is your partner's guilty pleasure snack late at night?",
    options: ["Instant Noodles / Maggi", "Ice cream or chocolates", "Potato chips & dip", "Leftovers from dinner", "Dry fruits / nuts", "Cookies dipped in milk"],
    isActive: true
  },
  {
    id: "fav-6",
    category: "favourite-things",
    prompt: "What music vibe does your partner listen to when driving or relaxing?",
    options: ["Acoustic / Melodic Indie", "Lofi / Chill beats", "Upbeat Pop & Dance", "90s / 2000s Nostalgic Classics", "R&B / Soul / Romantic ballads", "High energy Hip-Hop / Rock"],
    isActive: true
  },

  // 2. First Memories (6 questions, including Seed 2)
  {
    id: "mem-1",
    category: "first-memories",
    prompt: "Who said “I love you” first?",
    options: ["Me", "My partner", "Both of us together", "It was unspoken at first", "Still waiting / Secret", "Neither yet"],
    isActive: true
  },
  {
    id: "mem-2",
    category: "first-memories",
    prompt: "What was your partner's exact first impression of you?",
    options: ["Cute and charming", "A bit shy and quiet", "Talkative and funny", "Mysterious and cool", "Sweet and polite", "Confidence that stood out"],
    isActive: true
  },
  {
    id: "mem-3",
    category: "first-memories",
    prompt: "Where did you both spend your memorable first date?",
    options: ["A cozy cafe or coffee shop", "A nice romantic dinner", "A stroll in a park or waterfront", "A movie or concert", "A spontaneous food stall crawl", "Over video call / online"],
    isActive: true
  },
  {
    id: "mem-4",
    category: "first-memories",
    prompt: "Who was more nervous on the first meeting?",
    options: ["Definitely me", "Definitely my partner", "Both of us equally", "Neither, felt like old friends immediately", "Tried hard to play it cool"],
    isActive: true
  },
  {
    id: "mem-5",
    category: "first-memories",
    prompt: "What was the first gift your partner ever gave you?",
    options: ["Chocolates or sweets", "A handwritten letter or card", "A cute souvenir / accessory", "Flowers or a plant", "Books or music playlist", "A heartfelt meal / coffee treat"],
    isActive: true
  },
  {
    id: "mem-6",
    category: "first-memories",
    prompt: "Who initiated the first conversation or text message?",
    options: ["Me, without hesitation", "My partner made the first move", "A mutual friend or circumstance", "A coincidental reply to a story", "Simultaneous text!"],
    isActive: true
  },

  // 3. Romantic Moments (6 questions, including Seed 3)
  {
    id: "rom-1",
    category: "romantic-moments",
    prompt: "What makes your partner happiest?",
    options: ["Undivided Quality Time", "Delicious Food together", "Thoughtful Surprises & Gifts", "Long Hugs & Cuddles", "Words of Affirmation & Praise", "Quiet Peace & Rest"],
    isActive: true
  },
  {
    id: "rom-2",
    category: "romantic-moments",
    prompt: "What is your partner's primary Love Language?",
    options: ["Physical Touch & Warmth", "Quality Time & Deep Talks", "Acts of Service / Caring gestures", "Words of Affirmation", "Receiving Thoughtful Gifts"],
    isActive: true
  },
  {
    id: "rom-3",
    category: "romantic-moments",
    prompt: "What is your partner's ideal romantic evening?",
    options: ["Cooking together at home with candlelight", "Fine dining restaurant with a view", "Stargazing and deep midnight talks", "Binge-watching shows under blankets", "Spontaneous late-night long drive"],
    isActive: true
  },
  {
    id: "rom-4",
    category: "romantic-moments",
    prompt: "How does your partner prefer to be comforted when having a bad day?",
    options: ["A warm tight hug in silence", "Venting while being actively listened to", "Their favorite food delivered", "Space and quiet time alone", "A distraction with laughter and funny videos"],
    isActive: true
  },
  {
    id: "rom-5",
    category: "romantic-moments",
    prompt: "What is the sweetest thing your partner does without realizing?",
    options: ["Checking if I've eaten or gotten home safe", "The way their eyes light up when excited", "Saving the best bite of food for me", "Subconsciously reaching for my hand", "Remembering tiny details I mentioned weeks ago"],
    isActive: true
  },
  {
    id: "rom-6",
    category: "romantic-moments",
    prompt: "If your partner wrote you a love note, what would it focus on?",
    options: ["Gratitude for being their rock", "Funny inside memories and adventures", "Poetic words about your future together", "Cute confessions of how much they miss you", "Simple everyday appreciations"],
    isActive: true
  },

  // 4. Daily Habits (6 questions)
  {
    id: "hab-1",
    category: "daily-habits",
    prompt: "How does your partner wake up in the morning?",
    options: ["Instantly up on the first alarm", "Hits snooze at least 3 times", "Needs 30 minutes in bed checking phone", "Grumpy until caffeinated", "Naturally early with the sunrise"],
    isActive: true
  },
  {
    id: "hab-2",
    category: "daily-habits",
    prompt: "How does your partner handle their phone battery?",
    options: ["Always charged between 80-100%", "Lives dangerously below 10%", "Charges only when it dies completely", "Carries a power bank everywhere", "Leaves it on charger overnight religiously"],
    isActive: true
  },
  {
    id: "hab-3",
    category: "daily-habits",
    prompt: "When shopping for groceries or clothes, how does your partner behave?",
    options: ["Strict list, in and out in 10 minutes", "Browses every single aisle slowly", "Impulse buys anything that looks cute/tasty", "Compares 5 options before choosing one", "Leaves it to me to pick!"],
    isActive: true
  },
  {
    id: "hab-4",
    category: "daily-habits",
    prompt: "What is your partner's texting style?",
    options: ["Fast replies with multiple short bubbles", "Replies in their head and forgets to send", "Voice notes enthusiast", "Paragraphs with emojis", "Stickers and reels instead of words"],
    isActive: true
  },
  {
    id: "hab-5",
    category: "daily-habits",
    prompt: "How organized is your partner's bedroom / wardrobe?",
    options: ["Impeccably neat and color-coordinated", "Organized chaos (they know where everything is)", "The 'Chair' holds all recent clothes", "Tidy on weekends, chaotic during weekdays", "Minimalist and uncluttered"],
    isActive: true
  },
  {
    id: "hab-6",
    category: "daily-habits",
    prompt: "What does your partner do right before falling asleep?",
    options: ["Scrolls reels / TikTok until eyes close", "Reads a book or listens to a podcast", "Recaps the day with pillow talk", "Falls asleep in 2 minutes flat", "Overthinks life decisions in the dark"],
    isActive: true
  },

  // 5. Food and Travel (6 questions, including Seed 5)
  {
    id: "food-1",
    category: "food-and-travel",
    prompt: "What is your partner's dream trip?",
    options: ["International historic cities (Europe/Japan)", "Cozy mountain cabin with misty views", "Tropical beach resort & sea breeze", "Backpacking road-trip adventure", "Luxury staycation with zero agenda", "Wildlife safari and nature trails"],
    isActive: true
  },
  {
    id: "food-2",
    category: "food-and-travel",
    prompt: "How adventurous is your partner with trying new foods?",
    options: ["Will try literally anything once", "Cautiously adventurous if recommended", "Sticks faithfully to familiar favourites", "Vegetarian/specific dietary loyalist", "Spicy food champion"],
    isActive: true
  },
  {
    id: "food-3",
    category: "food-and-travel",
    prompt: "On vacation, what kind of traveler is your partner?",
    options: ["Packed spreadsheet itinerary from 8 AM", "Wakes up at noon, goes with the flow", "Food crawl critic exploring every alley", "Photo and aesthetic spots documenter", "Relaxer by the pool with a book"],
    isActive: true
  },
  {
    id: "food-4",
    category: "food-and-travel",
    prompt: "When ordering food at a restaurant, what is their biggest dilemma?",
    options: ["Can't decide between two delicious items", "Asks 'What are you ordering so we can share?'", "Orders the exact same dish every single time", "Takes 15 minutes reading the entire menu", "Lets the other person order for them"],
    isActive: true
  },
  {
    id: "food-5",
    category: "food-and-travel",
    prompt: "Sweet tooth or Savory snacks: what is your partner's true addiction?",
    options: ["Chocolate desserts & bakery pastries", "Crispy, spicy & salty snacks", "Cheesy delights (Pizza, Nachos)", "Sour candies & tangy treats", "Equal balance of sweet and savory!"],
    isActive: true
  },
  {
    id: "food-6",
    category: "food-and-travel",
    prompt: "How does your partner pack for a 3-day weekend trip?",
    options: ["Carries 10 outfits 'just in case'", "Fits everything in a single tiny backpack", "Packs 2 hours before departure frantically", "Packs neatly 3 days in advance", "Forgets one essential item (like charger or toothbrush)"],
    isActive: true
  },

  // 6. Funny Couple Questions (6 questions, including Seed 4)
  {
    id: "fun-1",
    category: "funny-couple",
    prompt: "Who gets jealous more easily?",
    options: ["Me", "My partner", "Both of us equally (playfully)", "Neither, totally unbothered", "Depends on the situation!"],
    isActive: true
  },
  {
    id: "fun-2",
    category: "funny-couple",
    prompt: "Who is more dramatic when catching a common cold or headache?",
    options: ["Me, absolute theatrics", "My partner acts like it's a crisis", "Both of us need maximum pampering", "Neither, powers through silently"],
    isActive: true
  },
  {
    id: "fun-3",
    category: "funny-couple",
    prompt: "Who is more likely to lose their keys, wallet, or sunglasses?",
    options: ["Me, without a doubt", "My partner loses them daily", "Both of us constantly search the sofa", "Neither, super careful with belongings"],
    isActive: true
  },
  {
    id: "fun-4",
    category: "funny-couple",
    prompt: "Who takes longer to get ready to head out the door?",
    options: ["Me, outfit choices take time", "My partner, always 'almost ready' for 20 mins", "Both take equal time", "Whoever is driving takes longer"],
    isActive: true
  },
  {
    id: "fun-5",
    category: "funny-couple",
    prompt: "Who is the GPS navigator and who actually gets lost?",
    options: ["Partner navigates, I trust them blindly", "I navigate because partner holds phone upside down", "Both get lost and discover fun detours", "Google Maps is the only reason we survive"],
    isActive: true
  },
  {
    id: "fun-6",
    category: "funny-couple",
    prompt: "Who is more likely to accidentally start a silly debate over trivial things?",
    options: ["Me, over movie plots or food opinions", "My partner, defends funny hot takes", "Both love a passionate mock-debate", "Neither, we agree on almost everything"],
    isActive: true
  },

  // 7. Long-Distance Love (6 questions)
  {
    id: "ld-1",
    category: "long-distance",
    prompt: "What is your partner's favorite way to stay connected from afar?",
    options: ["Long nightly video calls while doing chores", "Sending 20 reels / memes throughout the day", "Quick voice notes sharing every tiny update", "Virtual watch parties & playing games online", "Good morning & good night texts without fail"],
    isActive: true
  },
  {
    id: "ld-2",
    category: "long-distance",
    prompt: "What is the hardest part of distance for your partner?",
    options: ["Not being able to give a spontaneous hug", "Eating meals alone instead of sharing", "Missing out on everyday mundane errands together", "Time zone differences / conflicting work hours", "Seeing other couples holding hands"],
    isActive: true
  },
  {
    id: "ld-3",
    category: "long-distance",
    prompt: "What is the first thing your partner wants to do at the airport / station reunion?",
    options: ["A never-ending, breathtaking tight hug", "Go straight to get our favorite meal together", "Take a cute selfie or video together", "Head home and collapse on the couch cuddled up", "Hold hands and just smile at each other"],
    isActive: true
  },
  {
    id: "ld-4",
    category: "long-distance",
    prompt: "How does your partner count down the days until seeing each other?",
    options: ["A countdown app / calendar widget", "Marks the days mentally every morning", "Focuses on getting work finished to fly sooner", "Sends 'X days left!' reminders constantly"],
    isActive: true
  },
  {
    id: "ld-5",
    category: "long-distance",
    prompt: "What item of yours does your partner cherish having with them?",
    options: ["A hoodie, t-shirt or jacket with your scent", "A physical framed photo or photostrip", "A piece of jewelry / bracelet", "A handwritten letter or note", "A plushie or gift given on the last visit"],
    isActive: true
  },
  {
    id: "ld-6",
    category: "long-distance",
    prompt: "When you have a disagreement over call, how is it best resolved?",
    options: ["A video call so you can see each other's warm eyes", "Cooling off for 15 minutes, then texting gently", "Reassuring each other of love before talking logic", "Sending an apology meme or peace-offering food"],
    isActive: true
  },

  // 8. Anniversary Edition (6 questions)
  {
    id: "anniv-1",
    category: "anniversary-edition",
    prompt: "What has been the biggest milestone or victory in your relationship so far?",
    options: ["Moving in together / setting up our space", "Supporting each other through big career changes", "Navigating family introductions", "Traveling together to an unforgettable place", "Growing emotionally and communicating deeper"],
    isActive: true
  },
  {
    id: "anniv-2",
    category: "anniversary-edition",
    prompt: "How has your partner grown the most since you first met?",
    options: ["More confident and outspoken", "More patient and calm during stress", "More open and expressive with feelings", "More ambitious in pursuing passions", "Better at cooking or domestic life!"],
    isActive: true
  },
  {
    id: "anniv-3",
    category: "anniversary-edition",
    prompt: "What future dream excites your partner the most?",
    options: ["Building / decorating our dream home", "Adopting pets together (puppy/kitty)", "Taking a year-long world tour together", "Building a business or creative project together", "Starting a cozy family life"],
    isActive: true
  },
  {
    id: "anniv-4",
    category: "anniversary-edition",
    prompt: "What is your partner's favorite anniversary celebration style?",
    options: ["Private intimate getaway out of town", "Fancy dinner and dressing up glamorously", "Relaxing spa day and pampering", "Recreating our very first date exactly", "A cozy home celebration with favorite takeout"],
    isActive: true
  },
  {
    id: "anniv-5",
    category: "anniversary-edition",
    prompt: "Which shared memory always makes your partner tear up or smile widest?",
    options: ["The moment we made our relationship official", "A trip where everything went wrong but we laughed", "Surprise birthday party or anniversary gesture", "Late-night confessions of future dreams", "A quiet moment during a sunset together"],
    isActive: true
  },
  {
    id: "anniv-6",
    category: "anniversary-edition",
    prompt: "What promise does your partner hold most sacred in love?",
    options: ["Always being honest and transparent", "Never going to sleep angry without resolving it", "Cheering for each other's individual dreams", "Being the safest emotional haven in tough times", "Keeping the spark and silliness alive forever"],
    isActive: true
  },

  // 9. Personality & Preferences (6 questions)
  {
    id: "pers-1",
    category: "personality-preferences",
    prompt: "In a crowded social party, what is your partner's energy pattern?",
    options: ["Social butterfly chatting with everyone", "Sticks closely to 1 or 2 close friends", "Finds the host's pet and stays with it", "Ready to go home after 90 minutes", "Enjoys people-watching with a drink"],
    isActive: true
  },
  {
    id: "pers-2",
    category: "personality-preferences",
    prompt: "When faced with an unexpected problem or crisis, how does your partner react?",
    options: ["Instant practical problem-solving mode", "Needs a moment to vent emotion first", "Researches everything deeply online", "Stays calm and reassures everyone", "Asks for advice from trusted people"],
    isActive: true
  },
  {
    id: "pers-3",
    category: "personality-preferences",
    prompt: "Is your partner more governed by Head (logic) or Heart (emotion)?",
    options: ["Heart: deeply empathetic, intuition first", "Head: rational, analytical, data-driven", "Balanced: logical on work, heart on people", "Tries to be logical but soft-hearted inside"],
    isActive: true
  },
  {
    id: "pers-4",
    category: "personality-preferences",
    prompt: "What is your partner's biggest pet peeve?",
    options: ["People who are chronically late", "Chewing loudly or bad table manners", "Slow walkers blocking the path", "Passive-aggressive attitudes", "People constantly staring at phones during dinner"],
    isActive: true
  },
  {
    id: "pers-5",
    category: "personality-preferences",
    prompt: "How does your partner handle compliments?",
    options: ["Graciously accepts with a blush", "Playfully boasts 'I know right!'", "Deflects or downplays it immediately", "Returns a compliment right back", "Gets adorably flustered"],
    isActive: true
  },
  {
    id: "pers-6",
    category: "personality-preferences",
    prompt: "What gives your partner the greatest sense of peace?",
    options: ["A clean room and finished to-do list", "A quiet rainy afternoon with a book or game", "Spending relaxed hours with their favorite person", "Taking a walk in nature / by the beach", "A long warm shower and clean sheets"],
    isActive: true
  },

  // 10. Best Friends Mode (6 questions)
  {
    id: "bf-1",
    category: "best-friends-mode",
    prompt: "What is your duo's most iconic shared habit?",
    options: ["Communicating with just eye contact and telepathy", "Laughing uncontrollably at jokes only you two understand", "Roasting each other with pure affection", "Sharing screenshots and gossip within seconds", "Ordering food for each other without asking"],
    isActive: true
  },
  {
    id: "bf-2",
    category: "best-friends-mode",
    prompt: "If your friend won 10 million rupees/dollars today, what would they buy first?",
    options: ["A lavish holiday and tickets for both of us", "Pay off all loans / buy a family house", "A luxury car or dream gadget", "Invest it wisely into stocks and property", "Throw a massive celebration party"],
    isActive: true
  },
  {
    id: "bf-3",
    category: "best-friends-mode",
    prompt: "Who is more likely to give brutally honest outfit or relationship advice?",
    options: ["Me, I keep it 100% real", "My best friend, holds back nothing", "Both of us give reality checks lovingly", "Neither, we hype each other up unconditionally"],
    isActive: true
  },
  {
    id: "bf-4",
    category: "best-friends-mode",
    prompt: "If you both got arrested in a hilarious misunderstanding, who caused it?",
    options: ["My friend's crazy spontaneous idea", "My bad judgment and daring spirit", "Both of us egging each other on", "A series of absurd coincidences"],
    isActive: true
  },
  {
    id: "bf-5",
    category: "best-friends-mode",
    prompt: "What is your best friend's signature karaoke / shower song vibe?",
    options: ["Passionate heart-wrenching anthems", "Fast rap they only know 40% of the lyrics to", "90s boyband / pop royalty throwbacks", "Disney or movie theme songs", "Refuses to sing unless bribed"],
    isActive: true
  },
  {
    id: "bf-6",
    category: "best-friends-mode",
    prompt: "What makes your friendship unbreakable?",
    options: ["We can go weeks without talking and pick up instantly", "Zero judgment, we know each other's secrets", "Showing up without question whenever needed", "Years of memories and shared growth", "All of the above, lifelong duo!"],
    isActive: true
  }
];

export function getQuestionsByCategory(categoryId: string): Question[] {
  if (categoryId === "all" || !categoryId) {
    return INITIAL_QUESTIONS.filter(q => q.isActive);
  }
  return INITIAL_QUESTIONS.filter(q => q.category === categoryId && q.isActive);
}

export function getRandomQuestions(count: number = 5, categoryId?: string): Question[] {
  const pool = categoryId && categoryId !== "all" 
    ? getQuestionsByCategory(categoryId) 
    : INITIAL_QUESTIONS.filter(q => q.isActive);

  // Fisher-Yates shuffle
  const shuffled = [...pool];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  // If pool has fewer than requested, return all
  return shuffled.slice(0, Math.min(count, shuffled.length));
}
