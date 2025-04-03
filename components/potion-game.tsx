"use client"

import { useEffect, useState, useRef } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Toaster } from "@/components/ui/toaster"
import { useToast } from "@/hooks/use-toast"
import Inventory from "@/components/inventory"
import Garden from "@/components/garden"
import PotionCrafting from "@/components/potion-crafting"
import Shop from "@/components/shop"
import Trading from "@/components/trading"
import type { GameState, Ingredient, Potion, Tool } from "@/lib/types"
import { initialIngredients, initialPotions, initialTools, initialNpcs } from "@/lib/game-data"
import { ChevronLeft, ChevronRight } from "lucide-react"

export default function PotionGame() {
  const { toast } = useToast()
  const [gameState, setGameState] = useState<GameState>({
    gold: 100,
    inventory: {
      ingredients: [],
      potions: [],
      tools: [],
    },
    garden: {
      plots: Array(9).fill(null),
      unlocked: 4,
    },
    daysPassed: 0,
    marketDemand: {},
    npcs: [],
  })

  const [activeTab, setActiveTab] = useState("garden")
  const tabsListRef = useRef<HTMLDivElement>(null)

  // Scroll to active tab when it changes
  useEffect(() => {
    if (tabsListRef.current) {
      const activeTabElement = tabsListRef.current.querySelector(`[data-state="active"]`)
      if (activeTabElement) {
        const tabsList = tabsListRef.current
        const tabsListRect = tabsList.getBoundingClientRect()
        const activeTabRect = activeTabElement.getBoundingClientRect()

        // Calculate the scroll position to center the active tab
        const scrollLeft = activeTabRect.left - tabsListRect.left - tabsListRect.width / 2 + activeTabRect.width / 2

        tabsList.scrollTo({
          left: scrollLeft,
          behavior: "smooth",
        })
      }
    }
  }, [activeTab])

  // Scroll tabs left
  const scrollTabsLeft = () => {
    if (tabsListRef.current) {
      tabsListRef.current.scrollBy({
        left: -100,
        behavior: "smooth",
      })
    }
  }

  // Scroll tabs right
  const scrollTabsRight = () => {
    if (tabsListRef.current) {
      tabsListRef.current.scrollBy({
        left: 100,
        behavior: "smooth",
      })
    }
  }

  // Load game on first render
  useEffect(() => {
    const savedGame = localStorage.getItem("potionGameSave")
    if (savedGame) {
      try {
        setGameState(JSON.parse(savedGame))
        toast({
          title: "Game Loaded",
          description: "Your saved game has been loaded successfully!",
        })
      } catch (e) {
        console.error("Failed to load saved game:", e)
        initializeNewGame()
      }
    } else {
      initializeNewGame()
    }
  }, [])

  // Save game whenever state changes
  useEffect(() => {
    if (gameState.daysPassed > 0) {
      // Don't save initial state
      localStorage.setItem("potionGameSave", JSON.stringify(gameState))
    }
  }, [gameState])

  const initializeNewGame = () => {
    // Give player some starter ingredients
    const starterIngredients = initialIngredients.slice(0, 3).map((ing) => ({
      ...ing,
      quantity: 3,
    }))

    // Give player basic tools
    const starterTools = [initialTools[0]].map((tool) => ({
      ...tool,
      quantity: 1,
    }))

    // Initialize market demand
    const demand = {}
    initialPotions.forEach((potion) => {
      demand[potion.id] = Math.random() * 0.5 + 0.75 // Random demand between 0.75 and 1.25
    })

    // Initialize NPCs
    const gameNpcs = initialNpcs.map((npc) => ({
      ...npc,
      interest: initialPotions[Math.floor(Math.random() * initialPotions.length)].id,
      priceModifier: Math.random() * 0.4 + 0.8, // 0.8 to 1.2
    }))

    setGameState({
      gold: 100,
      inventory: {
        ingredients: starterIngredients,
        potions: [],
        tools: starterTools,
      },
      garden: {
        plots: Array(9).fill(null),
        unlocked: 4,
      },
      daysPassed: 1,
      marketDemand: demand,
      npcs: gameNpcs,
    })

    toast({
      title: "New Game Started",
      description: "Welcome to your potion shop! Start by growing some ingredients.",
    })
  }

  const advanceDay = () => {
    setGameState((prev) => {
      // Grow plants in garden
      const updatedPlots = [...prev.garden.plots].map((plot) => {
        if (!plot) return null

        if (plot.growthStage < plot.ingredient.growthTime) {
          return {
            ...plot,
            growthStage: plot.growthStage + 1,
          }
        }
        return plot
      })

      // Update market demand
      const newDemand = { ...prev.marketDemand }
      Object.keys(newDemand).forEach((potionId) => {
        // Random fluctuation between -0.2 and +0.2
        const change = Math.random() * 0.4 - 0.2
        newDemand[potionId] = Math.max(0.5, Math.min(1.5, newDemand[potionId] + change))
      })

      // Refresh NPCs every 3 days
      const updatedNpcs =
        prev.daysPassed % 3 === 0
          ? initialNpcs.map((npc) => ({
              ...npc,
              interest: initialPotions[Math.floor(Math.random() * initialPotions.length)].id,
              priceModifier: Math.random() * 0.4 + 0.8,
            }))
          : prev.npcs

      return {
        ...prev,
        garden: {
          ...prev.garden,
          plots: updatedPlots,
        },
        daysPassed: prev.daysPassed + 1,
        marketDemand: newDemand,
        npcs: updatedNpcs,
      }
    })

    toast({
      title: "Day Advanced",
      description: `Day ${gameState.daysPassed + 1} has begun.`,
    })
  }

  const addToInventory = (item: Ingredient | Potion | Tool) => {
    setGameState((prev) => {
      const newState = { ...prev }

      if ("growthTime" in item) {
        // It's an ingredient
        const existingItem = newState.inventory.ingredients.find((i) => i.id === item.id)
        if (existingItem) {
          existingItem.quantity += item.quantity || 1
        } else {
          newState.inventory.ingredients.push({ ...item, quantity: item.quantity || 1 })
        }
      } else if ("effect" in item) {
        // It's a potion
        const existingItem = newState.inventory.potions.find((i) => i.id === item.id)
        if (existingItem) {
          existingItem.quantity += item.quantity || 1
        } else {
          newState.inventory.potions.push({ ...item, quantity: item.quantity || 1 })
        }
      } else {
        // It's a tool
        const existingItem = newState.inventory.tools.find((i) => i.id === item.id)
        if (existingItem) {
          existingItem.quantity += item.quantity || 1
        } else {
          newState.inventory.tools.push({ ...item, quantity: item.quantity || 1 })
        }
      }

      return newState
    })
  }

  const removeFromInventory = (itemType: "ingredients" | "potions" | "tools", itemId: string, amount = 1) => {
    setGameState((prev) => {
      const newState = { ...prev }
      const itemIndex = newState.inventory[itemType].findIndex((i) => i.id === itemId)

      if (itemIndex >= 0) {
        const item = newState.inventory[itemType][itemIndex]
        if (item.quantity <= amount) {
          newState.inventory[itemType].splice(itemIndex, 1)
        } else {
          item.quantity -= amount
        }
      }

      return newState
    })
  }

  const updateGold = (amount: number) => {
    setGameState((prev) => ({
      ...prev,
      gold: prev.gold + amount,
    }))

    if (amount > 0) {
      toast({
        title: "Gold Received",
        description: `+${amount} gold added to your purse.`,
      })
    } else {
      toast({
        title: "Gold Spent",
        description: `${amount} gold spent.`,
      })
    }
  }

  return (
    <div className="container mx-auto px-2 sm:px-4 py-4 max-w-6xl">
      <header className="mb-4 sm:mb-6 text-center">
        <h1 className="text-3xl sm:text-4xl font-bold mb-1 sm:mb-2 text-purple-200">Mystic Brews</h1>
        <p className="text-purple-300">Master the art of potion-making</p>
      </header>

      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 sm:mb-6 bg-purple-800/50 p-2 sm:p-3 rounded-lg">
        <div className="flex gap-2 sm:gap-4 mb-2 sm:mb-0 w-full sm:w-auto justify-between sm:justify-start">
          <div className="bg-yellow-900/50 px-3 py-1 sm:px-4 sm:py-2 rounded-md">
            <span className="font-bold text-yellow-400">{gameState.gold}</span> Gold
          </div>
          <div className="bg-purple-700/50 px-3 py-1 sm:px-4 sm:py-2 rounded-md">Day {gameState.daysPassed}</div>
        </div>
        <Button onClick={advanceDay} variant="outline" className="bg-purple-700 hover:bg-purple-600 w-full sm:w-auto">
          Next Day
        </Button>
      </div>

      <Tabs defaultValue="garden" className="w-full" value={activeTab} onValueChange={setActiveTab}>
        <div className="relative mb-4">
          {/* Mobile scroll buttons */}
          <div className="sm:hidden flex items-center justify-between absolute inset-y-0 w-full pointer-events-none z-10">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full bg-purple-900/80 text-white pointer-events-auto"
              onClick={scrollTabsLeft}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full bg-purple-900/80 text-white pointer-events-auto"
              onClick={scrollTabsRight}
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>

          {/* Horizontally scrollable tabs for mobile */}
          <TabsList
            ref={tabsListRef}
            className="sm:grid sm:grid-cols-5 mb-4 w-full overflow-x-auto flex no-scrollbar"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            <TabsTrigger value="garden" className="text-sm sm:text-base whitespace-nowrap">
              Garden
            </TabsTrigger>
            <TabsTrigger value="crafting" className="text-sm sm:text-base whitespace-nowrap">
              Crafting
            </TabsTrigger>
            <TabsTrigger value="inventory" className="text-sm sm:text-base whitespace-nowrap">
              Inventory
            </TabsTrigger>
            <TabsTrigger value="shop" className="text-sm sm:text-base whitespace-nowrap">
              Shop
            </TabsTrigger>
            <TabsTrigger value="trading" className="text-sm sm:text-base whitespace-nowrap">
              Trading
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="garden" className="bg-purple-800/30 p-4 rounded-lg">
          <Garden
            garden={gameState.garden}
            inventory={gameState.inventory}
            setGameState={setGameState}
            addToInventory={addToInventory}
            removeFromInventory={removeFromInventory}
          />
        </TabsContent>

        <TabsContent value="crafting" className="bg-purple-800/30 p-4 rounded-lg">
          <PotionCrafting
            inventory={gameState.inventory}
            addToInventory={addToInventory}
            removeFromInventory={removeFromInventory}
            toast={toast}
          />
        </TabsContent>

        <TabsContent value="inventory" className="bg-purple-800/30 p-4 rounded-lg">
          <Inventory inventory={gameState.inventory} marketDemand={gameState.marketDemand} />
        </TabsContent>

        <TabsContent value="shop" className="bg-purple-800/30 p-4 rounded-lg">
          <Shop
            gold={gameState.gold}
            updateGold={updateGold}
            inventory={gameState.inventory}
            addToInventory={addToInventory}
            marketDemand={gameState.marketDemand}
            daysPassed={gameState.daysPassed}
          />
        </TabsContent>

        <TabsContent value="trading" className="bg-purple-800/30 p-4 rounded-lg">
          <Trading
            npcs={gameState.npcs}
            inventory={gameState.inventory}
            gold={gameState.gold}
            updateGold={updateGold}
            removeFromInventory={removeFromInventory}
            addToInventory={addToInventory}
            marketDemand={gameState.marketDemand}
          />
        </TabsContent>
      </Tabs>

      <Toaster />
    </div>
  )
}

