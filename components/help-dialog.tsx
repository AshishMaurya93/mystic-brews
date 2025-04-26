"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { HelpCircle } from "lucide-react"
import { useMobile } from "@/hooks/use-mobile"

export function HelpDialog() {
  const [open, setOpen] = useState(false)
  const isMobile = useMobile()

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 right-4 sm:top-6 sm:right-6 bg-purple-800/50 hover:bg-purple-700/50 text-white rounded-full"
          aria-label="Help"
        >
          <HelpCircle className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-purple-900 text-white border-purple-700 max-w-[95vw] sm:max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl sm:text-2xl">Mystic Brews - Game Guide</DialogTitle>
          <DialogDescription className="text-purple-300">
            Learn how to play and master the art of potion-making
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="basics" className="mt-4">
          <TabsList className="grid grid-cols-5 bg-purple-800/50">
            <TabsTrigger value="basics">Basics</TabsTrigger>
            <TabsTrigger value="garden">Garden</TabsTrigger>
            <TabsTrigger value="crafting">Crafting</TabsTrigger>
            <TabsTrigger value="trading">Trading</TabsTrigger>
            <TabsTrigger value="effects">Effects</TabsTrigger>
          </TabsList>

          <TabsContent value="basics" className="mt-4 space-y-4">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Game Overview</h3>
              <p className="text-sm sm:text-base">
                Mystic Brews is a potion-making simulation game where you grow magical ingredients, craft potions, and
                trade with NPCs to build your potion business.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Game Cycle</h3>
              <ol className="list-decimal list-inside space-y-1 text-sm sm:text-base">
                <li>Grow ingredients in your garden</li>
                <li>Craft potions using your harvested ingredients</li>
                <li>Sell potions to NPCs or in the shop</li>
                <li>Buy new ingredients and tools</li>
                <li>Advance days to progress growth and refresh traders</li>
              </ol>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Game Tabs</h3>
              <ul className="list-disc list-inside space-y-1 text-sm sm:text-base">
                <li>
                  <span className="font-medium">Garden:</span> Plant and harvest magical ingredients
                </li>
                <li>
                  <span className="font-medium">Crafting:</span> Create potions using recipes and ingredients
                </li>
                <li>
                  <span className="font-medium">Inventory:</span> View and manage your items
                </li>
                <li>
                  <span className="font-medium">Shop:</span> Buy ingredients and tools, or sell your items
                </li>
                <li>
                  <span className="font-medium">Trading:</span> Trade with NPCs for better prices
                </li>
              </ul>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Day Cycle</h3>
              <p className="text-sm sm:text-base">Click the "Next Day" button to advance time. This will:</p>
              <ul className="list-disc list-inside space-y-1 text-sm sm:text-base">
                <li>Grow your planted ingredients</li>
                <li>Change market demand for potions</li>
                <li>Refresh NPCs every 3 days</li>
                <li>Update active potion effects</li>
              </ul>
            </div>
          </TabsContent>

          <TabsContent value="garden" className="mt-4 space-y-4">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Garden Basics</h3>
              <p className="text-sm sm:text-base">
                Your garden is where you grow magical ingredients for your potions.
              </p>
              <ul className="list-disc list-inside space-y-1 text-sm sm:text-base">
                <li>Start with 4 plots, unlock more with gold</li>
                <li>Plant ingredients from your inventory</li>
                <li>Wait for ingredients to grow (advance days)</li>
                <li>Harvest fully grown ingredients</li>
              </ul>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Growth Time</h3>
              <p className="text-sm sm:text-base">
                Each ingredient has a specific growth time (in days). More valuable ingredients typically take longer to
                grow.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Harvesting</h3>
              <p className="text-sm sm:text-base">
                When an ingredient is fully grown, you can harvest it to receive 2-4 of that ingredient. The plot will
                then be empty and ready for a new plant.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Unlocking Plots</h3>
              <p className="text-sm sm:text-base">
                You can unlock additional garden plots for 50 gold each. More plots mean more ingredients you can grow
                simultaneously.
              </p>
            </div>
          </TabsContent>

          <TabsContent value="crafting" className="mt-4 space-y-4">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Potion Crafting</h3>
              <p className="text-sm sm:text-base">
                Combine ingredients according to recipes to create magical potions.
              </p>
              <ol className="list-decimal list-inside space-y-1 text-sm sm:text-base">
                <li>Select a recipe from the list</li>
                <li>Ensure you have all required ingredients</li>
                <li>Click "Craft Potion" to create it</li>
              </ol>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Potion Types</h3>
              <p className="text-sm sm:text-base">There are two main types of potions:</p>
              <ul className="list-disc list-inside space-y-1 text-sm sm:text-base">
                <li>
                  <span className="font-medium">Standard Potions:</span> These can be sold to NPCs or in the shop
                </li>
                <li>
                  <span className="font-medium">Effect Potions:</span> These provide gameplay benefits when activated
                </li>
              </ul>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Recipe Filters</h3>
              <p className="text-sm sm:text-base">Use the tabs to filter recipes:</p>
              <ul className="list-disc list-inside space-y-1 text-sm sm:text-base">
                <li>
                  <span className="font-medium">All:</span> Shows all recipes
                </li>
                <li>
                  <span className="font-medium">Available:</span> Shows only recipes you can currently craft
                </li>
                <li>
                  <span className="font-medium">Unavailable:</span> Shows recipes you're missing ingredients for
                </li>
              </ul>
            </div>
          </TabsContent>

          <TabsContent value="trading" className="mt-4 space-y-4">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Shop</h3>
              <p className="text-sm sm:text-base">
                The shop allows you to buy ingredients and tools, or sell your items.
              </p>
              <ul className="list-disc list-inside space-y-1 text-sm sm:text-base">
                <li>Buy tab: Purchase ingredients and tools</li>
                <li>Sell tab: Sell your ingredients, potions, and tools</li>
                <li>Shop inventory changes over time</li>
                <li>Rare ingredients may appear occasionally</li>
              </ul>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-semibold">NPC Trading</h3>
              <p className="text-sm sm:text-base">
                Trading with NPCs often provides better prices than the shop, especially for potions.
              </p>
              <ul className="list-disc list-inside space-y-1 text-sm sm:text-base">
                <li>Each NPC has a specific potion they're interested in</li>
                <li>NPCs pay 50% more for potions they're interested in</li>
                <li>NPCs refresh every 3 days with new interests</li>
                <li>Special traders may appear with unique interests</li>
              </ul>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Market Demand</h3>
              <p className="text-sm sm:text-base">
                Potion prices fluctuate based on market demand, which changes daily. Higher demand means better selling
                prices.
              </p>
            </div>
          </TabsContent>

          <TabsContent value="effects" className="mt-4 space-y-4">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Effect Potions</h3>
              <p className="text-sm sm:text-base">
                Special potions that provide gameplay benefits when activated from your inventory.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Available Effects</h3>
              <ul className="list-disc list-inside space-y-1 text-sm sm:text-base">
                <li>
                  <span className="font-medium">Growth Accelerator:</span> Reduces garden growth time by 50% for one day
                </li>
                <li>
                  <span className="font-medium">Market Insight:</span> Increases all sales by 20% for one day
                </li>
                <li>
                  <span className="font-medium">Ingredient Duplicator:</span> 30% chance to duplicate harvested
                  ingredients for one day
                </li>
                <li>
                  <span className="font-medium">Crafting Mastery:</span> Reduces ingredient requirements for potions by
                  1 for one day
                </li>
                <li>
                  <span className="font-medium">Merchant's Tongue:</span> Improves buying and selling prices by 15% for
                  one day
                </li>
                <li>
                  <span className="font-medium">Garden's Blessing:</span> Temporarily unlocks an additional garden plot
                  for three days
                </li>
                <li>
                  <span className="font-medium">Ingredient Seeker:</span> Guarantees a rare ingredient in the shop on
                  the next day
                </li>
                <li>
                  <span className="font-medium">Trader's Call:</span> Attracts an additional rare trader on the next day
                </li>
                <li>
                  <span className="font-medium">Quality Enhancer:</span> Increases crafted potion value by 25% for one
                  day
                </li>
                <li>
                  <span className="font-medium">Gold Transmuter:</span> Converts 5 of any ingredient into 50 gold
                  (one-time use)
                </li>
              </ul>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Using Effect Potions</h3>
              <ol className="list-decimal list-inside space-y-1 text-sm sm:text-base">
                <li>Craft the effect potion you want</li>
                <li>Go to your Inventory tab</li>
                <li>Select the effect potion</li>
                <li>Click "Activate Potion Effect"</li>
                <li>The effect will be applied immediately</li>
              </ol>
              <p className="text-sm sm:text-base mt-2">
                Active effects are displayed below the gold and day counter at the top of the screen.
              </p>
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-6 flex justify-end">
          <Button onClick={() => setOpen(false)} className="bg-white text-purple-900 hover:bg-gray-200">
            Close Guide
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
