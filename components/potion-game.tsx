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
import { ChevronLeft, ChevronRight, BookOpen } from "lucide-react"
import { TutorialProvider } from "@/contexts/tutorial-context"
import { TutorialOverlay } from "@/components/tutorial-overlay"
import { useTutorial } from "@/contexts/tutorial-context"

function TutorialButton() {
  const { resetTutorial } = useTutorial()

  return (
    <Button
      variant="ghost"
      size="icon"
      className="absolute top-4 right-16 sm:top-6 sm:right-20 bg-purple-800/50 hover:bg-purple-700/50 text-white rounded-full"
      onClick={resetTutorial}
      aria-label="Restart Tutorial"
    >
      <BookOpen className="h-5 w-5" />
    </Button>
  )
}

function PotionGameContent() {
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
    // New gameplay effect states
    activeEffects: {
      growthAcceleration: 0, // Days remaining
      marketInsight: 0,
      ingredientDuplication: 0,
      craftingMastery: 0,
      haggling: 0,
      gardenExpansion: 0,
      qualityEnhancer: 0,
      rareIngredientNextDay: false,
      rareTraderNextDay: false,
    },
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
    if (gameState?.daysPassed > 0) {
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
    const demand: Record<string, number> = {}
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
      activeEffects: {
        growthAcceleration: 0,
        marketInsight: 0,
        ingredientDuplication: 0,
        craftingMastery: 0,
        haggling: 0,
        gardenExpansion: 0,
        qualityEnhancer: 0,
        rareIngredientNextDay: false,
        rareTraderNextDay: false,
      },
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

        // Apply growth acceleration effect if active
        const growthBoost = prev.activeEffects?.growthAcceleration > 0 ? 2 : 1 // Double growth if effect is active

        if (plot.growthStage < plot.ingredient.growthTime) {
          return {
            ...plot,
            growthStage: Math.min(plot.growthStage + growthBoost, plot.ingredient.growthTime),
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

      // Refresh NPCs every 3 days or if rare trader effect is active
      let updatedNpcs = prev.npcs
      if (prev.daysPassed % 3 === 0 || prev.activeEffects?.rareTraderNextDay) {
        updatedNpcs = initialNpcs.map((npc) => ({
          ...npc,
          interest: initialPotions[Math.floor(Math.random() * initialPotions.length)].id,
          priceModifier: Math.random() * 0.4 + 0.8,
        }))

        // Add a rare trader if the effect is active
        if (prev.activeEffects?.rareTraderNextDay) {
          // Add one of the special NPCs interested in gameplay potions
          const specialNpcs = initialNpcs.slice(-3) // Last 3 NPCs are the special ones
          const rareTrader = specialNpcs[Math.floor(Math.random() * specialNpcs.length)]

          updatedNpcs.push({
            ...rareTrader,
            interest: initialPotions[Math.floor(Math.random() * initialPotions.length)].id,
            priceModifier: 1.5, // Premium prices
          })

          toast({
            title: "Rare Trader Arrived",
            description: `${rareTrader.name} has heard of your shop and arrived to trade!`,
          })
        }
      }

      // Update active effects (decrement days remaining)
      const updatedEffects = {
        growthAcceleration: Math.max(0, prev.activeEffects?.growthAcceleration - 1),
        marketInsight: Math.max(0, prev.activeEffects?.marketInsight - 1),
        ingredientDuplication: Math.max(0, prev.activeEffects?.ingredientDuplication - 1),
        craftingMastery: Math.max(0, prev.activeEffects?.craftingMastery - 1),
        haggling: Math.max(0, prev.activeEffects?.haggling - 1),
        gardenExpansion: Math.max(0, prev.activeEffects?.gardenExpansion - 1),
        qualityEnhancer: Math.max(0, prev.activeEffects?.qualityEnhancer - 1),
        rareIngredientNextDay: false, // Reset after day advances
        rareTraderNextDay: false, // Reset after day advances
      }

      // Notify when effects expire
      Object.entries(prev.activeEffects).forEach(([effect, value]) => {
        if (value === 1 && typeof value === "number") {
          // Will expire this day
          const effectName = effect
            .replace(/([A-Z])/g, " $1") // Add spaces before capital letters
            .replace(/^./, (str) => str.toUpperCase()) // Capitalize first letter

          toast({
            title: `${effectName} Expired`,
            description: `The ${effectName} effect has worn off.`,
          })
        }
      })

      // Handle garden expansion effect expiring
      if (prev.activeEffects?.gardenExpansion === 1) {
        toast({
          title: "Garden Plot Returned",
          description: "The temporary garden plot has returned to nature.",
        })
      }

      return {
        ...prev,
        garden: {
          ...prev.garden,
          plots: updatedPlots,
          // Reduce unlocked plots if garden expansion is expiring
          unlocked:
            prev.activeEffects?.gardenExpansion === 1 ? Math.min(prev.garden.unlocked - 1, 9) : prev.garden.unlocked,
        },
        daysPassed: prev.daysPassed + 1,
        marketDemand: newDemand,
        npcs: updatedNpcs,
        activeEffects: updatedEffects,
      }
    })

    toast({
      title: "Day Advanced",
      description: `Day ${gameState?.daysPassed + 1} has begun.`,
    })
  }

  const addToInventory = (item: Ingredient | Potion | Tool) => {
    setGameState((prev) => {
      const newState = { ...prev }

      if ("growthTime" in item) {
        // It's an ingredient
        const existingItem = newState.inventory.ingredients.find((i) => i.id === item.id)

        // Check for ingredient duplication effect (30% chance)
        const duplicateChance = prev.activeEffects?.ingredientDuplication > 0 ? 0.3 : 0
        const isDuplicated = Math.random() < duplicateChance

        const quantity = isDuplicated ? (item.quantity || 1) * 2 : item.quantity || 1

        if (isDuplicated) {
          toast({
            title: "Ingredient Duplicated!",
            description: `Your Ingredient Duplicator potion doubled your ${item.name} harvest!`,
          })
        }

        if (existingItem) {
          existingItem.quantity += quantity
        } else {
          newState.inventory.ingredients.push({ ...item, quantity })
        }
      } else if ("effect" in item) {
        // It's a potion
        const existingItem = newState.inventory.potions.find((i) => i.id === item.id)

        // Apply quality enhancer effect if active
        const enhancedItem = { ...item }
        if (prev.activeEffects?.qualityEnhancer > 0) {
          enhancedItem.basePrice = Math.round(item.basePrice * 1.25) // 25% increase in value
        }

        if (existingItem) {
          existingItem.quantity += enhancedItem.quantity || 1
          // Update the base price if it was enhanced
          if (prev.activeEffects?.qualityEnhancer > 0) {
            existingItem.basePrice = enhancedItem.basePrice
          }
        } else {
          newState.inventory.potions.push({ ...enhancedItem, quantity: enhancedItem.quantity || 1 })
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

  // Function to activate potion effects
  const activatePotionEffect = (potionId: string) => {
    setGameState((prev) => {
      const newState = { ...prev }

      // Remove the potion from inventory
      const potionIndex = newState.inventory.potions.findIndex((p) => p.id === potionId)
      if (potionIndex === -1) return prev // Potion not found

      if (newState.inventory.potions[potionIndex].quantity > 1) {
        newState.inventory.potions[potionIndex].quantity -= 1
      } else {
        newState.inventory.potions.splice(potionIndex, 1)
      }

      // Apply the effect based on potion type
      switch (potionId) {
        case "potion_growth_acceleration":
          newState.activeEffects.growthAcceleration = 1 // 1 day
          toast({
            title: "Growth Acceleration Activated",
            description: "Your garden plants will grow twice as fast for 1 day.",
          })
          break

        case "potion_market_insight":
          newState.activeEffects.marketInsight = 1 // 1 day
          toast({
            title: "Market Insight Activated",
            description: "You'll receive 20% more gold from all sales for 1 day.",
          })
          break

        case "potion_ingredient_duplication":
          newState.activeEffects.ingredientDuplication = 1 // 1 day
          toast({
            title: "Ingredient Duplicator Activated",
            description: "You have a 30% chance to double harvested ingredients for 1 day.",
          })
          break

        case "potion_crafting_mastery":
          newState.activeEffects.craftingMastery = 1 // 1 day
          toast({
            title: "Crafting Mastery Activated",
            description: "Potion recipes require 1 fewer ingredient (minimum 1) for 1 day.",
          })
          break

        case "potion_haggling":
          newState.activeEffects.haggling = 1 // 1 day
          toast({
            title: "Merchant's Tongue Activated",
            description: "Buy for 15% less and sell for 15% more for 1 day.",
          })
          break

        case "potion_garden_expansion":
          // Only add a plot if we're not at max
          if (newState.garden.unlocked < 9) {
            newState.activeEffects.gardenExpansion = 3 // 3 days
            newState.garden.unlocked += 1
            toast({
              title: "Garden's Blessing Activated",
              description: "You've temporarily unlocked an additional garden plot for 3 days.",
            })
          } else {
            toast({
              title: "Garden Already Full",
              description: "Your garden already has the maximum number of plots.",
              variant: "destructive",
            })
            // Return the potion to inventory
            if (potionIndex !== -1) {
              if (newState.inventory.potions[potionIndex]) {
                newState.inventory.potions[potionIndex].quantity += 1
              } else {
                const potion = initialPotions.find((p) => p.id === potionId)
                if (potion) {
                  newState.inventory.potions.push({ ...potion, quantity: 1 })
                }
              }
            }
          }
          break

        case "potion_rare_ingredient_finder":
          newState.activeEffects.rareIngredientNextDay = true
          toast({
            title: "Ingredient Seeker Activated",
            description: "A rare ingredient will appear in the shop tomorrow.",
          })
          break

        case "potion_npc_attraction":
          newState.activeEffects.rareTraderNextDay = true
          toast({
            title: "Trader's Call Activated",
            description: "A rare trader will visit your shop tomorrow.",
          })
          break

        case "potion_quality_enhancer":
          newState.activeEffects.qualityEnhancer = 1 // 1 day
          toast({
            title: "Quality Enhancer Activated",
            description: "All potions you craft today will be 25% more valuable.",
          })
          break

        case "potion_gold_transmutation":
          // Find an ingredient to transmute (prioritize common ingredients)
          const ingredients = [...newState.inventory.ingredients].sort((a, b) => b.quantity - a.quantity)
          if (ingredients.length > 0 && ingredients[0].quantity >= 5) {
            const ingredient = ingredients[0]
            // Remove 5 of the ingredient
            const ingredientIndex = newState.inventory.ingredients.findIndex((i) => i.id === ingredient.id)
            if (newState.inventory.ingredients[ingredientIndex].quantity > 5) {
              newState.inventory.ingredients[ingredientIndex].quantity -= 5
            } else {
              newState.inventory.ingredients.splice(ingredientIndex, 1)
            }
            // Add 50 gold
            newState.gold += 50
            toast({
              title: "Gold Transmutation Successful",
              description: `Transmuted 5 ${ingredient.name} into 50 gold!`,
            })
          } else {
            toast({
              title: "Transmutation Failed",
              description: "You need at least 5 of an ingredient to transmute into gold.",
              variant: "destructive",
            })
            // Return the potion to inventory
            if (potionIndex !== -1) {
              if (newState.inventory.potions[potionIndex]) {
                newState.inventory.potions[potionIndex].quantity += 1
              } else {
                const potion = initialPotions.find((p) => p.id === potionId)
                if (potion) {
                  newState.inventory.potions.push({ ...potion, quantity: 1 })
                }
              }
            }
          }
          break

        default:
          // Not a gameplay effect potion
          toast({
            title: "Cannot Activate",
            description: "This potion cannot be activated for gameplay effects.",
            variant: "destructive",
          })
          // Return the potion to inventory
          if (potionIndex !== -1) {
            if (newState.inventory.potions[potionIndex]) {
              newState.inventory.potions[potionIndex].quantity += 1
            } else {
              const potion = initialPotions.find((p) => p.id === potionId)
              if (potion) {
                newState.inventory.potions.push({ ...potion, quantity: 1 })
              }
            }
          }
      }

      return newState
    })
  }

  // Get modified prices based on active effects
  const getModifiedPrice = (basePrice: number, isBuying: boolean) => {
    let price = basePrice

    // Apply market insight effect (20% more when selling)
    if (!isBuying && gameState?.activeEffects?.marketInsight > 0) {
      price = Math.round(price * 1.2)
    }

    // Apply haggling effect (15% discount when buying, 15% more when selling)
    if (gameState?.activeEffects?.haggling > 0) {
      price = isBuying
        ? Math.round(price * 0.85) // 15% discount when buying
        : Math.round(price * 1.15) // 15% more when selling
    }

    return price
  }

  // Get active effects for display
  const getActiveEffects = () => {
    const effects = []

    if (gameState?.activeEffects?.growthAcceleration > 0) {
      effects.push(
        `Growth Acceleration (${gameState?.activeEffects?.growthAcceleration} day${gameState?.activeEffects?.growthAcceleration > 1 ? "s" : ""})`,
      )
    }

    if (gameState?.activeEffects?.marketInsight > 0) {
      effects.push(
        `Market Insight (${gameState?.activeEffects?.marketInsight} day${gameState?.activeEffects?.marketInsight > 1 ? "s" : ""})`,
      )
    }

    if (gameState?.activeEffects?.ingredientDuplication > 0) {
      effects.push(
        `Ingredient Duplication (${gameState?.activeEffects?.ingredientDuplication} day${gameState?.activeEffects?.ingredientDuplication > 1 ? "s" : ""})`,
      )
    }

    if (gameState?.activeEffects?.craftingMastery > 0) {
      effects.push(
        `Crafting Mastery (${gameState?.activeEffects?.craftingMastery} day${gameState?.activeEffects?.craftingMastery > 1 ? "s" : ""})`,
      )
    }

    if (gameState?.activeEffects?.haggling > 0) {
      effects.push(
        `Haggling (${gameState?.activeEffects?.haggling} day${gameState?.activeEffects?.haggling > 1 ? "s" : ""})`,
      )
    }

    if (gameState?.activeEffects?.gardenExpansion > 0) {
      effects.push(
        `Garden Expansion (${gameState?.activeEffects?.gardenExpansion} day${gameState?.activeEffects?.gardenExpansion > 1 ? "s" : ""})`,
      )
    }

    if (gameState?.activeEffects?.qualityEnhancer > 0) {
      effects.push(
        `Quality Enhancer (${gameState?.activeEffects?.qualityEnhancer} day${gameState?.activeEffects?.qualityEnhancer > 1 ? "s" : ""})`,
      )
    }

    if (gameState?.activeEffects?.rareIngredientNextDay) {
      effects.push("Rare Ingredient (next day)")
    }

    if (gameState?.activeEffects?.rareTraderNextDay) {
      effects.push("Rare Trader (next day)")
    }

    return effects
  }

  return (
    <div className="container mx-auto px-2 sm:px-4 py-4 max-w-6xl relative">
      <TutorialButton />
      <TutorialOverlay />

      <header className="mb-4 sm:mb-6 text-center">
        <h1 className="text-3xl sm:text-4xl font-bold mb-1 sm:mb-2 text-purple-200">Mystic Brews</h1>
        <p className="text-purple-300">Master the art of potion-making</p>
      </header>

      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 sm:mb-6 bg-purple-800/50 p-2 sm:p-3 rounded-lg">
        <div className="flex gap-2 sm:gap-4 mb-2 sm:mb-0 w-full sm:w-auto justify-between sm:justify-start">
          <div className="bg-yellow-900/50 px-3 py-1 sm:px-4 sm:py-2 rounded-md">
            <span className="font-bold text-yellow-400">{gameState?.gold}</span> Gold
          </div>
          <div className="bg-purple-700/50 px-3 py-1 sm:px-4 sm:py-2 rounded-md">Day {gameState?.daysPassed}</div>
        </div>
        <Button
          onClick={advanceDay}
          variant="outline"
          className="bg-purple-700 hover:bg-purple-600 w-full sm:w-auto next-day-button"
        >
          Next Day
        </Button>
      </div>

      {/* Active Effects Display */}
      {getActiveEffects().length > 0 && (
        <div className="mb-4 p-2 bg-purple-800/30 rounded-lg">
          <h3 className="text-sm font-semibold mb-1 text-purple-200">Active Effects:</h3>
          <div className="flex flex-wrap gap-2">
            {getActiveEffects().map((effect, index) => (
              <span key={index} className="text-xs bg-purple-700/50 px-2 py-1 rounded-md text-purple-100">
                {effect}
              </span>
            ))}
          </div>
        </div>
      )}

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
            garden={gameState?.garden}
            inventory={gameState?.inventory}
            setGameState={setGameState}
            addToInventory={addToInventory}
            removeFromInventory={removeFromInventory}
          />
        </TabsContent>

        <TabsContent value="crafting" className="bg-purple-800/30 p-4 rounded-lg">
          <PotionCrafting
            inventory={gameState?.inventory}
            addToInventory={addToInventory}
            removeFromInventory={removeFromInventory}
            toast={toast}
            craftingMasteryActive={gameState?.activeEffects?.craftingMastery > 0}
          />
        </TabsContent>

        <TabsContent value="inventory" className="bg-purple-800/30 p-4 rounded-lg">
          <Inventory
            inventory={gameState?.inventory}
            marketDemand={gameState?.marketDemand}
            activatePotionEffect={activatePotionEffect}
          />
        </TabsContent>

        <TabsContent value="shop" className="bg-purple-800/30 p-4 rounded-lg">
          <Shop
            gold={gameState?.gold}
            updateGold={updateGold}
            inventory={gameState?.inventory}
            addToInventory={addToInventory}
            marketDemand={gameState?.marketDemand}
            daysPassed={gameState?.daysPassed}
            haggleActive={gameState?.activeEffects?.haggling > 0}
            rareIngredientActive={gameState?.activeEffects?.rareIngredientNextDay}
            getModifiedPrice={getModifiedPrice}
          />
        </TabsContent>

        <TabsContent value="trading" className="bg-purple-800/30 p-4 rounded-lg">
          <Trading
            npcs={gameState?.npcs}
            inventory={gameState?.inventory}
            gold={gameState?.gold}
            updateGold={updateGold}
            removeFromInventory={removeFromInventory}
            addToInventory={addToInventory}
            marketDemand={gameState?.marketDemand}
            marketInsightActive={gameState?.activeEffects?.marketInsight > 0}
            haggleActive={gameState?.activeEffects?.haggling > 0}
            getModifiedPrice={getModifiedPrice}
          />
        </TabsContent>
      </Tabs>

      <Toaster />
    </div>
  )
}

export default function PotionGame() {
  return (
    <TutorialProvider>
      <PotionGameContent />
    </TutorialProvider>
  )
}
