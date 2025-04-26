"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { useTutorial } from "@/contexts/tutorial-context"
import { X } from "lucide-react"
import { useMobile } from "@/hooks/use-mobile"

export function TutorialOverlay() {
  const { tutorialActive, currentStep, nextStep, skipTutorial } = useTutorial()
  const [position, setPosition] = useState({ top: "50%", left: "50%", transform: "translate(-50%, -50%)" })
  const [highlight, setHighlight] = useState<string | null>(null)
  const isMobile = useMobile()

  useEffect(() => {
    if (!tutorialActive) return

    // Position the tutorial box based on the current step
    switch (currentStep) {
      case "welcome":
        setPosition({ top: "50%", left: "50%", transform: "translate(-50%, -50%)" })
        setHighlight(null)
        break
      case "garden-intro":
        setPosition({ top: "120px", left: "50%", transform: "translateX(-50%)" })
        setHighlight('[data-value="garden"]')
        break
      case "garden-plant":
        setPosition({ top: "200px", left: isMobile ? "50%" : "30%", transform: isMobile ? "translateX(-50%)" : "none" })
        setHighlight(".garden-plot-empty")
        break
      case "garden-wait":
        setPosition({ top: "120px", left: "85%", transform: "translateX(-50%)" })
        setHighlight(".next-day-button")
        break
      case "garden-harvest":
        setPosition({ top: "200px", left: isMobile ? "50%" : "30%", transform: isMobile ? "translateX(-50%)" : "none" })
        setHighlight(".garden-plot-ready")
        break
      case "crafting-intro":
        setPosition({ top: "120px", left: "50%", transform: "translateX(-50%)" })
        setHighlight('[data-value="crafting"]')
        break
      case "crafting-select":
        setPosition({ top: "200px", left: isMobile ? "50%" : "30%", transform: isMobile ? "translateX(-50%)" : "none" })
        setHighlight(".recipe-list")
        break
      case "crafting-create":
        setPosition({ top: "300px", left: isMobile ? "50%" : "70%", transform: isMobile ? "translateX(-50%)" : "none" })
        setHighlight(".craft-button")
        break
      case "inventory-intro":
        setPosition({ top: "120px", left: "50%", transform: "translateX(-50%)" })
        setHighlight('[data-value="inventory"]')
        break
      case "inventory-view":
        setPosition({ top: "200px", left: isMobile ? "50%" : "30%", transform: isMobile ? "translateX(-50%)" : "none" })
        setHighlight(".inventory-item")
        break
      case "shop-intro":
        setPosition({ top: "120px", left: "50%", transform: "translateX(-50%)" })
        setHighlight('[data-value="shop"]')
        break
      case "shop-buy":
        setPosition({ top: "200px", left: isMobile ? "50%" : "30%", transform: isMobile ? "translateX(-50%)" : "none" })
        setHighlight(".shop-item")
        break
      case "trading-intro":
        setPosition({ top: "120px", left: "50%", transform: "translateX(-50%)" })
        setHighlight('[data-value="trading"]')
        break
      case "complete":
        setPosition({ top: "50%", left: "50%", transform: "translate(-50%, -50%)" })
        setHighlight(null)
        break
      default:
        setPosition({ top: "50%", left: "50%", transform: "translate(-50%, -50%)" })
        setHighlight(null)
        break
    }

    // Add highlight class to the target element
    if (highlight) {
      const elements = document.querySelectorAll(highlight)
      elements.forEach((el) => {
        el.classList.add("tutorial-highlight")
      })
    }

    // Cleanup function to remove highlight
    return () => {
      if (highlight) {
        const elements = document.querySelectorAll(highlight)
        elements.forEach((el) => {
          el.classList.remove("tutorial-highlight")
        })
      }
    }
  }, [currentStep, tutorialActive, isMobile, highlight])

  if (!tutorialActive || !currentStep) return null

  const getTutorialContent = () => {
    switch (currentStep) {
      case "welcome":
        return (
          <>
            <h3 className="text-xl font-bold mb-2">Welcome to Mystic Brews!</h3>
            <p className="mb-4">
              This tutorial will guide you through the basics of potion-making. Follow along to learn how to grow
              ingredients, craft potions, and build your magical business!
            </p>
            <div className="flex justify-between">
              <Button variant="outline" onClick={skipTutorial} className="bg-purple-800 text-white">
                Skip Tutorial
              </Button>
              <Button onClick={nextStep}>Start Learning</Button>
            </div>
          </>
        )
      case "garden-intro":
        return (
          <>
            <h3 className="text-lg font-bold mb-2">The Garden</h3>
            <p className="mb-4">
              Your garden is where you'll grow magical ingredients. You start with 4 plots, and can unlock more later.
            </p>
            <Button onClick={nextStep} className="w-full">
              Next
            </Button>
          </>
        )
      case "garden-plant":
        return (
          <>
            <h3 className="text-lg font-bold mb-2">Planting Seeds</h3>
            <p className="mb-4">
              Click on an empty plot to plant a seed. You already have some starter ingredients in your inventory.
            </p>
            <p className="text-sm text-purple-300 mb-4">
              <strong>Task:</strong> Plant a seed in an empty plot.
            </p>
            <Button onClick={nextStep} className="w-full">
              I've Planted a Seed
            </Button>
          </>
        )
      case "garden-wait":
        return (
          <>
            <h3 className="text-lg font-bold mb-2">Growing Ingredients</h3>
            <p className="mb-4">
              Plants need time to grow. Click the "Next Day" button to advance time and grow your plants.
            </p>
            <p className="text-sm text-purple-300 mb-4">
              <strong>Task:</strong> Click "Next Day" a few times until your plant is fully grown.
            </p>
            <Button onClick={nextStep} className="w-full">
              I've Advanced Time
            </Button>
          </>
        )
      case "garden-harvest":
        return (
          <>
            <h3 className="text-lg font-bold mb-2">Harvesting</h3>
            <p className="mb-4">
              When a plant is fully grown, you can harvest it to collect ingredients. Each harvest gives you 2-4
              ingredients.
            </p>
            <p className="text-sm text-purple-300 mb-4">
              <strong>Task:</strong> Harvest your fully grown plant.
            </p>
            <Button onClick={nextStep} className="w-full">
              I've Harvested My Plant
            </Button>
          </>
        )
      case "crafting-intro":
        return (
          <>
            <h3 className="text-lg font-bold mb-2">Potion Crafting</h3>
            <p className="mb-4">
              Now let's learn how to craft potions! Click on the "Crafting" tab to access your potion recipes.
            </p>
            <Button onClick={nextStep} className="w-full">
              Next
            </Button>
          </>
        )
      case "crafting-select":
        return (
          <>
            <h3 className="text-lg font-bold mb-2">Selecting a Recipe</h3>
            <p className="mb-4">
              Browse the available recipes and select one that you have the ingredients for. Recipes with a green
              "Available" tag can be crafted right now.
            </p>
            <p className="text-sm text-purple-300 mb-4">
              <strong>Task:</strong> Select a recipe from the list.
            </p>
            <Button onClick={nextStep} className="w-full">
              I've Selected a Recipe
            </Button>
          </>
        )
      case "crafting-create":
        return (
          <>
            <h3 className="text-lg font-bold mb-2">Crafting a Potion</h3>
            <p className="mb-4">
              If you have all the required ingredients, you can craft the potion by clicking the "Craft Potion" button.
            </p>
            <p className="text-sm text-purple-300 mb-4">
              <strong>Note:</strong> If you don't have the ingredients yet, you may need to grow more or buy some from
              the shop.
            </p>
            <Button onClick={nextStep} className="w-full">
              Next
            </Button>
          </>
        )
      case "inventory-intro":
        return (
          <>
            <h3 className="text-lg font-bold mb-2">Your Inventory</h3>
            <p className="mb-4">
              The Inventory tab shows all your ingredients, potions, and tools. Click on it to see what you have.
            </p>
            <Button onClick={nextStep} className="w-full">
              Next
            </Button>
          </>
        )
      case "inventory-view":
        return (
          <>
            <h3 className="text-lg font-bold mb-2">Managing Items</h3>
            <p className="mb-4">
              Click on any item to view its details. Some potions have special effects that can be activated from here.
            </p>
            <p className="text-sm text-purple-300 mb-4">
              <strong>Task:</strong> Select an item to view its details.
            </p>
            <Button onClick={nextStep} className="w-full">
              I've Viewed an Item
            </Button>
          </>
        )
      case "shop-intro":
        return (
          <>
            <h3 className="text-lg font-bold mb-2">The Shop</h3>
            <p className="mb-4">
              The Shop is where you can buy ingredients and tools, or sell your items for gold. Click on the "Shop" tab.
            </p>
            <Button onClick={nextStep} className="w-full">
              Next
            </Button>
          </>
        )
      case "shop-buy":
        return (
          <>
            <h3 className="text-lg font-bold mb-2">Buying and Selling</h3>
            <p className="mb-4">
              Click on an item to select it, then set the quantity and click "Buy" or "Sell". The shop inventory changes
              over time.
            </p>
            <p className="text-sm text-purple-300 mb-4">
              <strong>Task:</strong> Try selecting an item from the shop.
            </p>
            <Button onClick={nextStep} className="w-full">
              I Understand
            </Button>
          </>
        )
      case "trading-intro":
        return (
          <>
            <h3 className="text-lg font-bold mb-2">Trading with NPCs</h3>
            <p className="mb-4">
              The Trading tab lets you sell potions to NPCs. Each NPC has a specific potion they're interested in and
              will pay more for.
            </p>
            <p className="text-sm text-purple-300 mb-4">
              NPCs refresh every 3 days, so check back often for the best deals!
            </p>
            <Button onClick={nextStep} className="w-full">
              Next
            </Button>
          </>
        )
      case "complete":
        return (
          <>
            <h3 className="text-xl font-bold mb-2">Tutorial Complete!</h3>
            <p className="mb-4">
              Congratulations! You now know the basics of Mystic Brews. Continue exploring, crafting potions, and
              building your magical business!
            </p>
            <p className="text-sm text-purple-300 mb-4">
              Remember, you can access the help menu anytime by clicking the "?" icon in the top right corner.
            </p>
            <Button onClick={nextStep} className="w-full">
              Start Playing
            </Button>
          </>
        )
      default:
        return null
    }
  }

  return (
    <div className="fixed inset-0 z-50 pointer-events-none">
      {/* Semi-transparent overlay */}
      <div className="absolute inset-0 bg-black/50 pointer-events-auto" />

      {/* Tutorial box */}
      <div
        className="absolute bg-purple-900 border border-purple-500 rounded-lg p-4 shadow-lg max-w-md pointer-events-auto"
        style={{
          top: position.top,
          left: position.left,
          transform: position.transform,
          width: isMobile ? "90%" : "400px",
        }}
      >
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-2 top-2 text-purple-300 hover:text-white hover:bg-purple-800"
          onClick={skipTutorial}
        >
          <X className="h-4 w-4" />
        </Button>
        {getTutorialContent()}
      </div>
    </div>
  )
}
