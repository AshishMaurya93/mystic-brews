"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Inventory, NPC, Potion } from "@/lib/types"
import { initialPotions } from "@/lib/game-data"

interface TradingProps {
  npcs: NPC[]
  inventory: Inventory
  gold: number
  updateGold: (amount: number) => void
  removeFromInventory: (itemType: "ingredients" | "potions" | "tools", itemId: string, amount?: number) => void
  addToInventory: (item: any) => void
  marketDemand: Record<string, number>
}

export default function Trading({
  npcs,
  inventory,
  gold,
  updateGold,
  removeFromInventory,
  addToInventory,
  marketDemand,
}: TradingProps) {
  const [selectedNpc, setSelectedNpc] = useState<NPC | null>(null)
  const [selectedPotion, setSelectedPotion] = useState<Potion | null>(null)

  const getNpcInterest = (npc: NPC) => {
    return initialPotions.find((p) => p.id === npc.interest)
  }

  const getPotionPrice = (potion: Potion, npc: NPC) => {
    const basePrice = potion.basePrice
    const demand = marketDemand[potion.id] || 1
    const npcModifier = npc.priceModifier

    // NPCs pay more for potions they're interested in
    const interestModifier = potion.id === npc.interest ? 1.5 : 1

    return Math.round(basePrice * demand * npcModifier * interestModifier)
  }

  const sellPotion = () => {
    if (!selectedNpc || !selectedPotion) return

    const price = getPotionPrice(selectedPotion, selectedNpc)

    // Add gold
    updateGold(price)

    // Remove potion from inventory
    removeFromInventory("potions", selectedPotion.id, 1)

    // Reset selection if no more of this potion
    const remainingPotion = inventory.potions.find((p) => p.id === selectedPotion.id && p.quantity > 1)
    if (!remainingPotion) {
      setSelectedPotion(null)
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-2">Trading</h2>
      <p className="text-purple-300 mb-4">Trade with NPCs for better prices on your potions.</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        <div className="md:col-span-1">
          <Card className="h-[500px] overflow-y-auto">
            <CardHeader>
              <CardTitle>Visiting Traders</CardTitle>
              <CardDescription>NPCs looking to buy potions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {npcs.map((npc) => {
                  const interest = getNpcInterest(npc)

                  return (
                    <Card
                      key={npc.id}
                      className={`cursor-pointer hover:bg-purple-800/20 ${selectedNpc?.id === npc.id ? "border-purple-500" : ""}`}
                      onClick={() => setSelectedNpc(npc)}
                    >
                      <CardHeader className="p-2 sm:p-3 pb-0">
                        <CardTitle className="text-base sm:text-lg">{npc.name}</CardTitle>
                        <CardDescription className="text-xs sm:text-sm">{npc.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="p-2 sm:p-3 pt-1 sm:pt-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs sm:text-sm">Interested in:</span>
                          <Badge variant="outline" className="bg-purple-700/30 text-xs">
                            {interest?.name || "Unknown"}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2">
          {selectedNpc ? (
            <Card>
              <CardHeader>
                <CardTitle>Trading with {selectedNpc.name}</CardTitle>
                <CardDescription>{selectedNpc.tradingDialog || "What do you have to offer?"}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <h3 className="font-semibold mb-2">Your Potions:</h3>

                  {inventory.potions.length > 0 ? (
                    <div className="grid grid-cols-1 gap-2">
                      {inventory.potions.map((potion) => (
                        <div
                          key={potion.id}
                          className={`p-2 sm:p-3 rounded-md cursor-pointer border ${selectedPotion?.id === potion.id ? "border-purple-500 bg-purple-800/30" : "border-transparent hover:bg-purple-800/20"}`}
                          onClick={() => setSelectedPotion(potion)}
                        >
                          <div className="flex justify-between items-center mb-1">
                            <span className="font-medium text-sm sm:text-base">{potion.name}</span>
                            <Badge variant="outline">{potion.quantity}</Badge>
                          </div>
                          <div className="text-xs sm:text-sm text-purple-300 mb-2 line-clamp-1">{potion.effect}</div>
                          <div className="flex justify-between items-center">
                            <span className="text-xs">
                              Market: {Math.round(potion.basePrice * (marketDemand[potion.id] || 1))} gold
                            </span>
                            <span
                              className={`text-xs sm:text-sm font-medium ${potion.id === selectedNpc.interest ? "text-green-400" : ""}`}
                            >
                              {getPotionPrice(potion, selectedNpc)} gold
                              {potion.id === selectedNpc.interest && " (Interested!)"}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-purple-400 p-4">You don't have any potions to trade</p>
                  )}
                </div>

                {selectedPotion && (
                  <div className="mt-6 p-4 bg-purple-800/20 rounded-lg">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-bold text-lg">{selectedPotion.name}</h3>
                        <p className="text-sm text-purple-300">{selectedPotion.description}</p>
                      </div>
                      <Badge className={selectedPotion.id === selectedNpc.interest ? "bg-green-700" : "bg-purple-700"}>
                        {getPotionPrice(selectedPotion, selectedNpc)} gold
                      </Badge>
                    </div>

                    <p className="mb-4 text-sm">{selectedPotion.effect}</p>

                    <div className="flex justify-end">
                      <Button onClick={sellPotion}>Sell to {selectedNpc.name}</Button>
                    </div>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex flex-col sm:flex-row justify-between border-t border-purple-800/30 pt-4 gap-3">
                <div>
                  <span className="text-sm text-purple-300">Your gold: {gold}</span>
                </div>
                <Button variant="outline" onClick={() => setSelectedNpc(null)} className="w-full sm:w-auto">
                  Find Another Trader
                </Button>
              </CardFooter>
            </Card>
          ) : (
            <div className="h-full flex items-center justify-center">
              <p className="text-purple-400">Select a trader to begin trading</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

