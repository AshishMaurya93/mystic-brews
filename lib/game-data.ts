import type { Ingredient, Potion, Tool, NPC, Recipe } from "./types"

export const initialIngredients: Ingredient[] = [
  {
    id: "herb_mint",
    name: "Mint Leaves",
    description: "Fresh, aromatic mint leaves with a cooling effect.",
    properties: "Cooling, refreshing, and calming properties.",
    growthTime: 2,
    basePrice: 5,
    quantity: 0,
  },
  {
    id: "herb_lavender",
    name: "Lavender",
    description: "Purple flowers with a soothing fragrance.",
    properties: "Calming, sleep-inducing, and stress-relieving.",
    growthTime: 3,
    basePrice: 8,
    quantity: 0,
  },
  {
    id: "herb_sage",
    name: "Sage",
    description: "Gray-green leaves with a strong, earthy aroma.",
    properties: "Cleansing, purifying, and wisdom-enhancing.",
    growthTime: 3,
    basePrice: 7,
    quantity: 0,
  },
  {
    id: "herb_rosemary",
    name: "Rosemary",
    description: "Needle-like leaves with a pine-like fragrance.",
    properties: "Memory-enhancing, focus-improving, and protective.",
    growthTime: 4,
    basePrice: 6,
    quantity: 0,
  },
  {
    id: "herb_thyme",
    name: "Thyme",
    description: "Small, aromatic leaves with a subtle flavor.",
    properties: "Courage-boosting, purifying, and healing.",
    growthTime: 2,
    basePrice: 5,
    quantity: 0,
  },
  {
    id: "mushroom_shiitake",
    name: "Shiitake Mushroom",
    description: "Brown, umbrella-shaped mushroom with a meaty texture.",
    properties: "Vitality-boosting, immune-strengthening, and longevity-promoting.",
    growthTime: 5,
    basePrice: 12,
    quantity: 0,
  },
  {
    id: "mushroom_reishi",
    name: "Reishi Mushroom",
    description: "Red-brown, kidney-shaped mushroom with a bitter taste.",
    properties: "Spiritual awakening, immortality-granting, and stress-reducing.",
    growthTime: 6,
    basePrice: 15,
    quantity: 0,
  },
  {
    id: "crystal_quartz",
    name: "Clear Quartz",
    description: "Transparent crystal with a hexagonal shape.",
    properties: "Energy-amplifying, clarity-bringing, and intention-setting.",
    growthTime: 7,
    basePrice: 20,
    quantity: 0,
  },
  {
    id: "crystal_amethyst",
    name: "Amethyst",
    description: "Purple crystal with a calming energy.",
    properties: "Intuition-enhancing, protection-providing, and stress-relieving.",
    growthTime: 8,
    basePrice: 25,
    quantity: 0,
  },
  {
    id: "flower_rose",
    name: "Rose Petals",
    description: "Soft, fragrant petals in various colors.",
    properties: "Love-attracting, heart-healing, and beauty-enhancing.",
    growthTime: 4,
    basePrice: 10,
    quantity: 0,
  },
  {
    id: "root_ginger",
    name: "Ginger Root",
    description: "Knobbly, aromatic root with a spicy flavor.",
    properties: "Warming, energizing, and circulation-improving.",
    growthTime: 5,
    basePrice: 8,
    quantity: 0,
  },
  {
    id: "berry_juniper",
    name: "Juniper Berries",
    description: "Small, blue-black berries with a pine-like flavor.",
    properties: "Purifying, protective, and cleansing.",
    growthTime: 4,
    basePrice: 9,
    quantity: 0,
  },
  {
    id: "flower_chamomile",
    name: "Chamomile Flowers",
    description: "Daisy-like flowers with a sweet, apple-like scent.",
    properties: "Soothing, calming, and sleep-promoting.",
    growthTime: 3,
    basePrice: 7,
    quantity: 0,
  },
  {
    id: "herb_basil",
    name: "Holy Basil",
    description: "Sacred herb with a spicy, peppery flavor.",
    properties: "Protective, purifying, and spiritually uplifting.",
    growthTime: 2,
    basePrice: 6,
    quantity: 0,
  },
  {
    id: "crystal_jade",
    name: "Green Jade",
    description: "Smooth, green stone with a cool touch.",
    properties: "Harmony-bringing, balance-restoring, and prosperity-attracting.",
    growthTime: 9,
    basePrice: 22,
    quantity: 0,
  },
  {
    id: "root_mandrake",
    name: "Mandrake Root",
    description: "Human-shaped root with mystical properties.",
    properties: "Protection, fertility, and magical amplification.",
    growthTime: 10,
    basePrice: 30,
    quantity: 0,
  },
  {
    id: "mushroom_morel",
    name: "Morel Mushroom",
    description: "Honeycomb-textured mushroom with earthy flavor.",
    properties: "Grounding, cleansing, and vision-enhancing.",
    growthTime: 7,
    basePrice: 18,
    quantity: 0,
  },
  {
    id: "berry_elderberry",
    name: "Elderberries",
    description: "Small, dark purple berries with potent properties.",
    properties: "Protection, healing, and spiritual awakening.",
    growthTime: 5,
    basePrice: 12,
    quantity: 0,
  },
  {
    id: "crystal_moonstone",
    name: "Moonstone",
    description: "Pearly white stone that seems to glow in moonlight.",
    properties: "Intuition-enhancing, feminine-energy-balancing, and dream-promoting.",
    growthTime: 8,
    basePrice: 28,
    quantity: 0,
  },
  {
    id: "herb_valerian",
    name: "Valerian Root",
    description: "Earthy-smelling root with powerful calming effects.",
    properties: "Sleep-inducing, anxiety-reducing, and peace-bringing.",
    growthTime: 6,
    basePrice: 14,
    quantity: 0,
  },
  {
    id: "flower_lotus",
    name: "Lotus Flower",
    description: "Sacred flower that blooms in muddy waters.",
    properties: "Spiritual-awakening, purity-symbolizing, and enlightenment-bringing.",
    growthTime: 7,
    basePrice: 20,
    quantity: 0,
  },
  {
    id: "mushroom_amanita",
    name: "Amanita Mushroom",
    description: "Red-capped mushroom with white spots, highly magical.",
    properties: "Vision-inducing, reality-altering, and consciousness-expanding.",
    growthTime: 9,
    basePrice: 35,
    quantity: 0,
  },
  {
    id: "crystal_obsidian",
    name: "Obsidian",
    description: "Black volcanic glass with protective properties.",
    properties: "Negativity-shielding, truth-revealing, and grounding.",
    growthTime: 10,
    basePrice: 32,
    quantity: 0,
  },
  {
    id: "herb_nettle",
    name: "Stinging Nettle",
    description: "Prickly herb with hidden healing properties.",
    properties: "Purifying, strengthening, and protection-offering.",
    growthTime: 3,
    basePrice: 9,
    quantity: 0,
  },
  // New ingredients for new potions
  {
    id: "crystal_ruby",
    name: "Ruby Crystal",
    description: "Deep red crystal that pulses with inner fire.",
    properties: "Energy-boosting, passion-igniting, and vitality-enhancing.",
    growthTime: 12,
    basePrice: 45,
    quantity: 0,
  },
  {
    id: "herb_nightshade",
    name: "Midnight Nightshade",
    description: "Rare herb that only blooms under the full moon.",
    properties: "Shadow-walking, illusion-creating, and stealth-enhancing.",
    growthTime: 8,
    basePrice: 30,
    quantity: 0,
  },
  {
    id: "flower_sunblossom",
    name: "Sunblossom",
    description: "Radiant golden flower that tracks the sun's movement.",
    properties: "Light-generating, warmth-providing, and clarity-bringing.",
    growthTime: 6,
    basePrice: 18,
    quantity: 0,
  },
  {
    id: "root_dreamroot",
    name: "Dreamroot",
    description: "Twisted root that glows faintly with a blue light.",
    properties: "Dream-walking, prophecy-revealing, and insight-granting.",
    growthTime: 9,
    basePrice: 27,
    quantity: 0,
  },
  {
    id: "crystal_emerald",
    name: "Emerald Shard",
    description: "Vibrant green crystal with growth-enhancing properties.",
    properties: "Nature-connecting, growth-accelerating, and prosperity-bringing.",
    growthTime: 11,
    basePrice: 40,
    quantity: 0,
  },
  {
    id: "mushroom_ghostcap",
    name: "Ghostcap Mushroom",
    description: "Translucent mushroom that's cool to the touch.",
    properties: "Spirit-seeing, ethereal-walking, and boundary-crossing.",
    growthTime: 7,
    basePrice: 25,
    quantity: 0,
  },
  {
    id: "berry_frostberry",
    name: "Frostberries",
    description: "Ice-blue berries that never melt and remain cold.",
    properties: "Cold-resistance, preservation, and winter-harnessing.",
    growthTime: 5,
    basePrice: 15,
    quantity: 0,
  },
  {
    id: "herb_dragonbreath",
    name: "Dragon's Breath Herb",
    description: "Fiery red leaves that feel warm even when dried.",
    properties: "Fire-breathing, heat-resistance, and courage-instilling.",
    growthTime: 8,
    basePrice: 22,
    quantity: 0,
  },
]

export const initialPotions: Potion[] = [
  {
    id: "potion_healing",
    name: "Healing Elixir",
    description: "A ruby-red liquid that mends wounds and restores vitality.",
    effect: "Heals minor injuries and provides a boost of energy.",
    basePrice: 25,
    quantity: 0,
  },
  {
    id: "potion_invisibility",
    name: "Invisibility Brew",
    description: "A transparent potion that bends light around the drinker.",
    effect: "Grants temporary invisibility for up to 10 minutes.",
    basePrice: 50,
    quantity: 0,
  },
  {
    id: "potion_strength",
    name: "Strength Tonic",
    description: "A dark, bubbling liquid that smells of iron and earth.",
    effect: "Temporarily increases physical strength and endurance.",
    basePrice: 35,
    quantity: 0,
  },
  {
    id: "potion_wisdom",
    name: "Wisdom Infusion",
    description: "A shimmering blue liquid with swirling patterns.",
    effect: "Enhances mental clarity and problem-solving abilities.",
    basePrice: 40,
    quantity: 0,
  },
  {
    id: "potion_love",
    name: "Love Philter",
    description: "A pink, sweet-smelling potion with heart-shaped bubbles.",
    effect: "Creates feelings of affection and attraction.",
    basePrice: 45,
    quantity: 0,
  },
  {
    id: "potion_luck",
    name: "Liquid Luck",
    description: "A golden potion that seems to dance in its vial.",
    effect: "Brings good fortune and favorable outcomes for a short time.",
    basePrice: 60,
    quantity: 0,
  },
  {
    id: "potion_sleep",
    name: "Dreamless Sleep",
    description: "A deep purple potion with a calming aroma.",
    effect: "Induces a peaceful, dreamless sleep for 8 hours.",
    basePrice: 30,
    quantity: 0,
  },
  {
    id: "potion_fire_resistance",
    name: "Fire Resistance",
    description: "An orange potion that feels cool to the touch.",
    effect: "Grants temporary immunity to fire and heat.",
    basePrice: 55,
    quantity: 0,
  },
  {
    id: "potion_water_breathing",
    name: "Water Breathing",
    description: "A blue-green potion with bubbles that never pop.",
    effect: "Allows breathing underwater for up to 1 hour.",
    basePrice: 65,
    quantity: 0,
  },
  {
    id: "potion_night_vision",
    name: "Night Vision",
    description: "A glowing green potion that smells of owl feathers.",
    effect: "Grants the ability to see clearly in darkness.",
    basePrice: 45,
    quantity: 0,
  },
  {
    id: "potion_levitation",
    name: "Levitation Elixir",
    description: "A silvery potion that seems weightless in its bottle.",
    effect: "Allows the drinker to float several feet above the ground.",
    basePrice: 70,
    quantity: 0,
  },
  {
    id: "potion_truth",
    name: "Truth Serum",
    description: "A clear potion with a single swirl of gold.",
    effect: "Compels the drinker to speak only truth for a short time.",
    basePrice: 80,
    quantity: 0,
  },
  {
    id: "potion_youth",
    name: "Youth Restoration",
    description: "A pearly white potion that smells of fresh morning dew.",
    effect: "Temporarily restores youthful appearance and energy.",
    basePrice: 100,
    quantity: 0,
  },
  {
    id: "potion_shapeshifting",
    name: "Shapeshifter's Brew",
    description: "A swirling potion that constantly changes color.",
    effect: "Allows limited transformation into a small animal.",
    basePrice: 120,
    quantity: 0,
  },
  {
    id: "potion_courage",
    name: "Liquid Courage",
    description: "A fiery red potion that pulses with inner light.",
    effect: "Banishes fear and instills bravery in the drinker.",
    basePrice: 40,
    quantity: 0,
  },
  {
    id: "potion_silence",
    name: "Veil of Silence",
    description: "A misty gray potion that makes no sound when shaken.",
    effect: "Creates a zone of silence around the drinker.",
    basePrice: 55,
    quantity: 0,
  },
  // New potions with unique gameplay benefits
  {
    id: "potion_growth_acceleration",
    name: "Growth Accelerator",
    description: "A vibrant green potion with swirling emerald particles.",
    effect: "Reduces garden growth time by 50% for one full day cycle.",
    basePrice: 85,
    quantity: 0,
  },
  {
    id: "potion_market_insight",
    name: "Market Insight",
    description: "A shimmering potion with floating golden coins inside.",
    effect: "Reveals optimal selling prices and increases all sales by 20% for one day.",
    basePrice: 95,
    quantity: 0,
  },
  {
    id: "potion_ingredient_duplication",
    name: "Ingredient Duplicator",
    description: "A bubbling purple mixture that seems to multiply within its container.",
    effect: "Has a 30% chance to duplicate any harvested ingredient for one day.",
    basePrice: 110,
    quantity: 0,
  },
  {
    id: "potion_crafting_mastery",
    name: "Crafting Mastery",
    description: "A deep blue potion with glowing runes that shift and change.",
    effect: "Reduces ingredient requirements for all potions by 1 (minimum 1) for one day.",
    basePrice: 130,
    quantity: 0,
  },
  {
    id: "potion_haggling",
    name: "Merchant's Tongue",
    description: "A honey-colored potion that tastes of silver and gold.",
    effect: "Improves buying prices by 15% and selling prices by 15% for one day.",
    basePrice: 90,
    quantity: 0,
  },
  {
    id: "potion_garden_expansion",
    name: "Garden's Blessing",
    description: "A rich, soil-scented potion with tiny flowers floating inside.",
    effect: "Temporarily unlocks one additional garden plot for three days.",
    basePrice: 150,
    quantity: 0,
  },
  {
    id: "potion_rare_ingredient_finder",
    name: "Ingredient Seeker",
    description: "A compass-shaped bottle with swirling mist that points in changing directions.",
    effect: "Guarantees one rare ingredient will appear in the shop on the next day.",
    basePrice: 100,
    quantity: 0,
  },
  {
    id: "potion_npc_attraction",
    name: "Trader's Call",
    description: "A bell-shaped bottle with a potion that chimes when shaken.",
    effect: "Attracts an additional rare trader with premium prices on the next day.",
    basePrice: 120,
    quantity: 0,
  },
  {
    id: "potion_quality_enhancer",
    name: "Quality Enhancer",
    description: "A crystal-clear potion with rainbow reflections.",
    effect: "Increases the quality and value of all crafted potions by 25% for one day.",
    basePrice: 105,
    quantity: 0,
  },
  {
    id: "potion_gold_transmutation",
    name: "Gold Transmuter",
    description: "A metallic potion that feels heavy and shifts like liquid gold.",
    effect: "Converts 5 of any ingredient into 50 gold. One-time use.",
    basePrice: 75,
    quantity: 0,
  },
]

export const initialTools: Tool[] = [
  {
    id: "tool_mortar",
    name: "Mortar and Pestle",
    description: "A stone bowl and grinding tool for crushing ingredients.",
    function: "Allows for more efficient ingredient preparation.",
    basePrice: 20,
    quantity: 0,
  },
  {
    id: "tool_cauldron",
    name: "Copper Cauldron",
    description: "A medium-sized cauldron made of polished copper.",
    function: "Required for brewing more advanced potions.",
    basePrice: 50,
    quantity: 0,
  },
  {
    id: "tool_scales",
    name: "Precision Scales",
    description: "Delicate scales for measuring ingredients accurately.",
    function: "Improves potion quality and success rate.",
    basePrice: 35,
    quantity: 0,
  },
  {
    id: "tool_gloves",
    name: "Dragon-Hide Gloves",
    description: "Protective gloves made from dragon scales.",
    function: "Protects hands when handling dangerous ingredients.",
    basePrice: 45,
    quantity: 0,
  },
  {
    id: "tool_knife",
    name: "Silver Cutting Knife",
    description: "A sharp knife with a silver blade and wooden handle.",
    function: "Perfect for precise cutting of magical ingredients.",
    basePrice: 30,
    quantity: 0,
  },
  {
    id: "tool_stirrer",
    name: "Enchanted Stirring Rod",
    description: "A glass rod that glows softly when stirring potions.",
    function: "Helps maintain consistent potion temperature and mixing.",
    basePrice: 40,
    quantity: 0,
  },
  {
    id: "tool_alembic",
    name: "Crystal Alembic",
    description: "A delicate distillation apparatus made of enchanted crystal.",
    function: "Allows for extraction of pure essences from ingredients.",
    basePrice: 75,
    quantity: 0,
  },
  {
    id: "tool_grimoire",
    name: "Alchemist's Grimoire",
    description: "An ancient book containing secret potion formulas.",
    function: "Provides hints for creating experimental potions.",
    basePrice: 100,
    quantity: 0,
  },
  {
    id: "tool_filter",
    name: "Moonsilk Filter",
    description: "A fine mesh filter woven from threads of moonlight.",
    function: "Removes impurities from potions, increasing potency.",
    basePrice: 60,
    quantity: 0,
  },
]

export const initialNpcs: NPC[] = [
  {
    id: "npc_alchemist",
    name: "Master Alchemist",
    description: "An elderly scholar with spectacles and a well-maintained beard.",
    tradingDialog: "I'm always in search of rare and powerful concoctions. Show me what you've brewed!",
    interest: "potion_wisdom", // Will be randomized
    priceModifier: 1.1, // Will be randomized
  },
  {
    id: "npc_witch",
    name: "Forest Witch",
    description: "A mysterious woman with wild hair and clothes adorned with feathers and bones.",
    tradingDialog: "The forest spirits whisper of your brewing talents. Perhaps we can make a trade?",
    interest: "potion_sleep", // Will be randomized
    priceModifier: 1.0, // Will be randomized
  },
  {
    id: "npc_knight",
    name: "Royal Knight",
    description: "A tall, armored warrior with the royal crest emblazoned on their shield.",
    tradingDialog: "By order of the crown, I seek potions to aid in our upcoming campaign.",
    interest: "potion_strength", // Will be randomized
    priceModifier: 0.9, // Will be randomized
  },
  {
    id: "npc_merchant",
    name: "Traveling Merchant",
    description: "A jovial trader with a colorful wagon full of exotic goods.",
    tradingDialog: "Ah, a fellow entrepreneur! Let's see if we can strike a deal that benefits us both.",
    interest: "potion_luck", // Will be randomized
    priceModifier: 1.2, // Will be randomized
  },
  {
    id: "npc_healer",
    name: "Village Healer",
    description: "A gentle soul with kind eyes and hands stained from years of working with herbs.",
    tradingDialog: "The village has many sick this season. I'm in desperate need of remedies.",
    interest: "potion_healing", // Will be randomized
    priceModifier: 1.0, // Will be randomized
  },
  {
    id: "npc_explorer",
    name: "Daring Explorer",
    description: "A rugged adventurer with weathered skin and tales of distant lands.",
    tradingDialog: "I need potions for my next expedition into uncharted territories. What do you have?",
    interest: "potion_fire_resistance", // Will be randomized
    priceModifier: 1.15, // Will be randomized
  },
  {
    id: "npc_noble",
    name: "Court Noble",
    description: "An elegantly dressed aristocrat with a haughty demeanor and expensive taste.",
    tradingDialog: "I require the finest potions for an upcoming royal gathering. I pay well for quality.",
    interest: "potion_love", // Will be randomized
    priceModifier: 1.3, // Will be randomized
  },
  {
    id: "npc_scholar",
    name: "Arcane Scholar",
    description: "A focused academic with ink-stained fingers and a book always at hand.",
    tradingDialog: "I'm researching the effects of various magical concoctions. Would you assist my studies?",
    interest: "potion_wisdom", // Will be randomized
    priceModifier: 1.1, // Will be randomized
  },
  {
    id: "npc_ranger",
    name: "Forest Ranger",
    description: "A quiet, observant guardian of the woods with keen eyes and a bow on their back.",
    tradingDialog: "The creatures of the forest grow restless. I need potions to help maintain peace.",
    interest: "potion_invisibility", // Will be randomized
    priceModifier: 1.05, // Will be randomized
  },
  {
    id: "npc_mystic",
    name: "Wandering Mystic",
    description: "A serene figure draped in flowing robes with symbols of celestial bodies.",
    tradingDialog: "The stars have guided me to your shop. I seek potions to commune with higher realms.",
    interest: "potion_sleep", // Will be randomized
    priceModifier: 1.2, // Will be randomized
  },
  {
    id: "npc_diver",
    name: "Deep Sea Diver",
    description: "A muscular individual with salt-crusted hair and a necklace of unusual shells.",
    tradingDialog: "The depths hold many secrets. I need special brews to explore the ocean floor.",
    interest: "potion_water_breathing", // Will be randomized
    priceModifier: 1.25, // Will be randomized
  },
  {
    id: "npc_thief",
    name: "Shadow Guild Thief",
    description: "A nimble figure dressed in dark clothing with a perpetual smirk.",
    tradingDialog: "I'm willing to pay handsomely for potions that aid in... discreet activities.",
    interest: "potion_invisibility", // Will be randomized
    priceModifier: 1.4, // Will be randomized
  },
  {
    id: "npc_bard",
    name: "Traveling Bard",
    description: "A charismatic performer with a lute strapped to their back and a voice like honey.",
    tradingDialog: "I seek potions to enhance my performances and captivate audiences across the realm.",
    interest: "potion_courage", // Will be randomized
    priceModifier: 1.1, // Will be randomized
  },
  {
    id: "npc_hermit",
    name: "Mountain Hermit",
    description: "An elderly recluse with a long white beard and eyes that have seen centuries.",
    tradingDialog: "In my solitude, I've gained wisdom. Now I seek potions to extend my meditation.",
    interest: "potion_youth", // Will be randomized
    priceModifier: 1.15, // Will be randomized
  },
  {
    id: "npc_hunter",
    name: "Night Hunter",
    description: "A mysterious hunter with unnaturally sharp teeth and pale skin.",
    tradingDialog: "The creatures I hunt only emerge in darkness. I need potions to aid my nocturnal pursuits.",
    interest: "potion_night_vision", // Will be randomized
    priceModifier: 1.3, // Will be randomized
  },
  // New NPCs interested in gameplay-enhancing potions
  {
    id: "npc_gardener",
    name: "Master Gardener",
    description: "A soil-stained expert with plants woven into their hair and clothes.",
    tradingDialog: "My gardens flourish, but I'm always seeking new ways to enhance growth and vitality.",
    interest: "potion_growth_acceleration", // Will be randomized
    priceModifier: 1.35, // Will be randomized
  },
  {
    id: "npc_economist",
    name: "Royal Economist",
    description: "A sharp-eyed individual with ink-stained fingers and a ledger always at hand.",
    tradingDialog: "The market fluctuates, but with the right potions, one can always stay ahead of trends.",
    interest: "potion_market_insight", // Will be randomized
    priceModifier: 1.4, // Will be randomized
  },
  {
    id: "npc_artificer",
    name: "Magical Artificer",
    description: "A creative inventor with glowing runes tattooed on their arms.",
    tradingDialog: "I create wonders through magical crafting, but certain potions could enhance my work.",
    interest: "potion_crafting_mastery", // Will be randomized
    priceModifier: 1.45, // Will be randomized
  },
]

export const potionRecipes: Recipe[] = [
  {
    id: "recipe_healing",
    potionId: "potion_healing",
    ingredients: [
      { id: "herb_sage", quantity: 2 },
      { id: "flower_rose", quantity: 1 },
      { id: "root_ginger", quantity: 1 },
    ],
  },
  {
    id: "recipe_invisibility",
    potionId: "potion_invisibility",
    ingredients: [
      { id: "mushroom_shiitake", quantity: 2 },
      { id: "crystal_quartz", quantity: 1 },
      { id: "herb_thyme", quantity: 2 },
    ],
  },
  {
    id: "recipe_strength",
    potionId: "potion_strength",
    ingredients: [
      { id: "root_ginger", quantity: 2 },
      { id: "herb_rosemary", quantity: 1 },
      { id: "mushroom_reishi", quantity: 1 },
    ],
  },
  {
    id: "recipe_wisdom",
    potionId: "potion_wisdom",
    ingredients: [
      { id: "herb_sage", quantity: 3 },
      { id: "crystal_amethyst", quantity: 1 },
      { id: "herb_rosemary", quantity: 1 },
    ],
  },
  {
    id: "recipe_love",
    potionId: "potion_love",
    ingredients: [
      { id: "flower_rose", quantity: 3 },
      { id: "herb_lavender", quantity: 2 },
      { id: "herb_mint", quantity: 1 },
    ],
  },
  {
    id: "recipe_luck",
    potionId: "potion_luck",
    ingredients: [
      { id: "crystal_amethyst", quantity: 1 },
      { id: "berry_juniper", quantity: 2 },
      { id: "mushroom_shiitake", quantity: 1 },
    ],
  },
  {
    id: "recipe_sleep",
    potionId: "potion_sleep",
    ingredients: [
      { id: "herb_lavender", quantity: 3 },
      { id: "herb_mint", quantity: 1 },
      { id: "crystal_amethyst", quantity: 1 },
    ],
  },
  {
    id: "recipe_fire_resistance",
    potionId: "potion_fire_resistance",
    ingredients: [
      { id: "crystal_quartz", quantity: 1 },
      { id: "root_ginger", quantity: 2 },
      { id: "berry_juniper", quantity: 2 },
    ],
  },
  {
    id: "recipe_water_breathing",
    potionId: "potion_water_breathing",
    ingredients: [
      { id: "crystal_moonstone", quantity: 1 },
      { id: "herb_nettle", quantity: 2 },
      { id: "flower_lotus", quantity: 1 },
    ],
  },
  {
    id: "recipe_night_vision",
    potionId: "potion_night_vision",
    ingredients: [
      { id: "mushroom_morel", quantity: 2 },
      { id: "crystal_obsidian", quantity: 1 },
      { id: "berry_elderberry", quantity: 2 },
    ],
  },
  {
    id: "recipe_levitation",
    potionId: "potion_levitation",
    ingredients: [
      { id: "flower_lotus", quantity: 2 },
      { id: "crystal_moonstone", quantity: 1 },
      { id: "mushroom_amanita", quantity: 1 },
    ],
  },
  {
    id: "recipe_truth",
    potionId: "potion_truth",
    ingredients: [
      { id: "herb_sage", quantity: 2 },
      { id: "crystal_quartz", quantity: 2 },
      { id: "flower_chamomile", quantity: 1 },
    ],
  },
  {
    id: "recipe_youth",
    potionId: "potion_youth",
    ingredients: [
      { id: "flower_rose", quantity: 2 },
      { id: "crystal_jade", quantity: 1 },
      { id: "root_mandrake", quantity: 1 },
    ],
  },
  {
    id: "recipe_shapeshifting",
    potionId: "potion_shapeshifting",
    ingredients: [
      { id: "mushroom_amanita", quantity: 2 },
      { id: "root_mandrake", quantity: 1 },
      { id: "crystal_moonstone", quantity: 1 },
    ],
  },
  {
    id: "recipe_courage",
    potionId: "potion_courage",
    ingredients: [
      { id: "herb_basil", quantity: 2 },
      { id: "root_ginger", quantity: 1 },
      { id: "berry_elderberry", quantity: 1 },
    ],
  },
  {
    id: "recipe_silence",
    potionId: "potion_silence",
    ingredients: [
      { id: "herb_valerian", quantity: 2 },
      { id: "crystal_obsidian", quantity: 1 },
      { id: "mushroom_morel", quantity: 1 },
    ],
  },
  // New recipes for gameplay-enhancing potions
  {
    id: "recipe_growth_acceleration",
    potionId: "potion_growth_acceleration",
    ingredients: [
      { id: "crystal_emerald", quantity: 1 },
      { id: "herb_basil", quantity: 2 },
      { id: "flower_sunblossom", quantity: 2 },
    ],
  },
  {
    id: "recipe_market_insight",
    potionId: "potion_market_insight",
    ingredients: [
      { id: "crystal_jade", quantity: 1 },
      { id: "herb_sage", quantity: 2 },
      { id: "crystal_ruby", quantity: 1 },
    ],
  },
  {
    id: "recipe_ingredient_duplication",
    potionId: "potion_ingredient_duplication",
    ingredients: [
      { id: "mushroom_ghostcap", quantity: 2 },
      { id: "crystal_moonstone", quantity: 1 },
      { id: "root_mandrake", quantity: 1 },
    ],
  },
  {
    id: "recipe_crafting_mastery",
    potionId: "potion_crafting_mastery",
    ingredients: [
      { id: "crystal_amethyst", quantity: 1 },
      { id: "root_dreamroot", quantity: 2 },
      { id: "mushroom_amanita", quantity: 1 },
    ],
  },
  {
    id: "recipe_haggling",
    potionId: "potion_haggling",
    ingredients: [
      { id: "herb_sage", quantity: 1 },
      { id: "crystal_jade", quantity: 1 },
      { id: "flower_lotus", quantity: 1 },
    ],
  },
  {
    id: "recipe_garden_expansion",
    potionId: "potion_garden_expansion",
    ingredients: [
      { id: "crystal_emerald", quantity: 1 },
      { id: "root_mandrake", quantity: 1 },
      { id: "flower_sunblossom", quantity: 2 },
    ],
  },
  {
    id: "recipe_rare_ingredient_finder",
    potionId: "potion_rare_ingredient_finder",
    ingredients: [
      { id: "crystal_quartz", quantity: 2 },
      { id: "herb_nightshade", quantity: 1 },
      { id: "mushroom_morel", quantity: 1 },
    ],
  },
  {
    id: "recipe_npc_attraction",
    potionId: "potion_npc_attraction",
    ingredients: [
      { id: "flower_rose", quantity: 2 },
      { id: "herb_lavender", quantity: 2 },
      { id: "crystal_ruby", quantity: 1 },
    ],
  },
  {
    id: "recipe_quality_enhancer",
    potionId: "potion_quality_enhancer",
    ingredients: [
      { id: "crystal_quartz", quantity: 2 },
      { id: "crystal_amethyst", quantity: 1 },
      { id: "flower_lotus", quantity: 1 },
    ],
  },
  {
    id: "recipe_gold_transmutation",
    potionId: "potion_gold_transmutation",
    ingredients: [
      { id: "crystal_ruby", quantity: 1 },
      { id: "herb_basil", quantity: 2 },
      { id: "root_ginger", quantity: 2 },
    ],
  },
]
