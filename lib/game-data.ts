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
]

