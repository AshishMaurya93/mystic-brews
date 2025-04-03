export interface Ingredient {
  id: string
  name: string
  description: string
  properties: string
  growthTime: number
  basePrice: number
  quantity: number
}

export interface Potion {
  id: string
  name: string
  description: string
  effect: string
  basePrice: number
  quantity: number
}

export interface Tool {
  id: string
  name: string
  description: string
  function: string
  basePrice: number
  quantity: number
}

export interface NPC {
  id: string
  name: string
  description: string
  tradingDialog?: string
  interest: string // potion id
  priceModifier: number
}

export interface PlotState {
  ingredient: Ingredient
  growthStage: number
  planted: number // day planted
}

export interface Garden {
  plots: (PlotState | null)[]
  unlocked: number
}

export interface Inventory {
  ingredients: Ingredient[]
  potions: Potion[]
  tools: Tool[]
}

export interface Recipe {
  id: string
  potionId: string
  ingredients: {
    id: string
    quantity: number
  }[]
}

export interface GameState {
  gold: number
  inventory: Inventory
  garden: Garden
  daysPassed: number
  marketDemand: Record<string, number>
  npcs: NPC[]
}

