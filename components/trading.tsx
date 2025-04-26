"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import type { Inventory, NPC, Potion } from "@/lib/types"
import { initialPotions } from "@/lib/game-data"
import { useMobile } from "@/hooks/use-mobile"

interface TradingProps {
  npcs: NPC[]
  inventory: Inventory
  gold: number
  updateGold: (amount: number) => void
  removeFromInventory: (itemType: "ingredients" | "potions" | "tools", itemId: string, amount?: number) => void
  addToInventory: (item: any) => void
  marketDemand: Record<string, number>
  marketInsightActive?: boolean
  haggleActive?: boolean
  getModifiedPrice?: (basePrice: number, isBuying: boolean) => number
}

export default function Trading({
  npcs,
  inventory,
  gold,
  updateGold,
  removeFromInventory,
  addToInventory,
  marketDemand,
  marketInsightActive = false,
  haggleActive = false,
  getModifiedPrice,
}: TradingProps) {
  const [selectedNpc, setSelectedNpc] = useState<NPC | null>(null)
  const [selectedPotion, setSelectedPotion] = useState<Potion | null>(null)
  const [npcDialogOpen, setNpcDialogOpen] = useState(false)
  const [potionDialogOpen, setPotionDialogOpen] = useState(false)
  const isMobile = useMobile()

  const getNpcInterest = (npc: NPC) => {
    return initialPotions.find((p) => p.id === npc.interest)
  }

  const getPotionPrice = (potion: Potion, npc: NPC) => {
    const basePrice = potion.basePrice
    const demand = marketDemand[potion.id] || 1
    const npcModifier = npc.priceModifier

    // NPCs pay more for potions they're interested in
    const interestModifier = potion.id === npc.interest ? 1.5 : 1

    let price = Math.round(basePrice * demand * npcModifier * interestModifier)

    // Apply market insight effect (20% more when selling)
    if (marketInsightActive) {
      price = Math.round(price * 1.2)
    }

    // Apply haggling effect (15% more when selling)
    if (haggleActive) {
      price = Math.round(price * 1.15)
    }

    // Use getModifiedPrice if provided (this will apply both effects if active)
    if (getModifiedPrice) {
      return getModifiedPrice(Math.round(basePrice * demand * npcModifier * interestModifier), false)
    }

    return price
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

    if (isMobile) {
      setPotionDialogOpen(false)
    }
  }

  const handleNpcClick = (npc: NPC) => {
    setSelectedNpc(npc)
    if (isMobile) {
      setNpcDialogOpen(true)
    }
  }

  const handlePotionClick = (potion: Potion) => {
    setSelectedPotion(potion)
    if (isMobile) {
      setPotionDialogOpen(true)
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-2">Trading</h2>
      <p className="text-purple-300 mb-4">Trade with NPCs for better prices on your potions.</p>

      {(marketInsightActive || haggleActive) && (
        <div className="mb-4 p-2 bg-purple-700/30 rounded-lg">
          {marketInsightActive && (
            <p className="text-sm text-purple-200 mb-1">
              <span className="font-semibold">Market Insight Active:</span> Receive 20% more gold from all sales!
            </p>
          )}
          {haggleActive && (
            <p className="text-sm text-purple-200">
              <span className="font-semibold">Haggling Active:</span> Sell for 15% more gold!
            </p>
          )}
        </div>
      )}

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
                      onClick={() => handleNpcClick(npc)}
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
          {!isMobile && selectedNpc ? (
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
                          onClick={() => handlePotionClick(potion)}
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
                              {(marketInsightActive || haggleActive) && (
                                <span className="text-green-400 ml-1">
                                  {marketInsightActive && haggleActive
                                    ? "(+35%)"
                                    : marketInsightActive
                                      ? "(+20%)"
                                      : "(+15%)"}
                                </span>
                              )}
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
          ) : !isMobile ? (
            <div className="h-full flex items-center justify-center">
              <p className="text-purple-400">Select a trader to begin trading</p>
            </div>
          ) : null}
        </div>
      </div>

      {/* Mobile Dialog for NPC Details */}
      {isMobile && (
        <>
          <Dialog open={npcDialogOpen} onOpenChange={setNpcDialogOpen}>
            <DialogContent className="bg-purple-900 text-white border-purple-700 max-w-[90vw] sm:max-w-lg">
              {selectedNpc && (
                <>
                  <DialogHeader>
                    <DialogTitle>Trading with {selectedNpc.name}</DialogTitle>
                    <DialogDescription className="text-purple-300">
                      {selectedNpc.tradingDialog || "What do you have to offer?"}
                    </DialogDescription>
                  </DialogHeader>

                  <div className="space-y-4">
                    <div className="bg-purple-800/30 p-3 rounded-md">
                      <p className="text-sm text-purple-200 mb-2">{selectedNpc.description}</p>
                      <div className="flex items-center gap-2">
                        <span className="text-xs">Interested in:</span>
                        <Badge variant="outline" className="bg-purple-700/30 text-xs">
                          {getNpcInterest(selectedNpc)?.name || "Unknown"}
                        </Badge>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold text-sm mb-2">Your Potions:</h3>
                      {inventory.potions.length > 0 ? (
                        <div className="space-y-2 max-h-[200px] overflow-y-auto">
                          {inventory.potions.map((potion) => (
                            <div
                              key={potion.id}
                              className="p-2 rounded-md cursor-pointer border border-purple-700 hover:bg-purple-800/30"
                              onClick={() => {
                                setSelectedPotion(potion)
                                setNpcDialogOpen(false)
                                setPotionDialogOpen(true)
                              }}
                            >
                              <div className="flex justify-between items-center">
                                <span className="font-medium text-sm">{potion.name}</span>
                                <Badge variant="outline">{potion.quantity}</Badge>
                              </div>
                              <div className="flex justify-between items-center mt-1">
                                <span className="text-xs text-purple-300">
                                  {potion.id === selectedNpc.interest ? "(Interested!)" : ""}
                                </span>
                                <span className="text-xs">
                                  {getPotionPrice(potion, selectedNpc)} gold
                                  {(marketInsightActive || haggleActive) && (
                                    <span className="text-green-400 ml-1">
                                      {marketInsightActive && haggleActive
                                        ? "(+35%)"
                                        : marketInsightActive
                                          ? "(+20%)"
                                          : "(+15%)"}
                                    </span>
                                  )}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-center text-purple-400 p-2">You don't have any potions to trade</p>
                      )}
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm text-purple-300">Your gold: {gold}</span>
                      <Button
                        variant="secondary"
                        onClick={() => setNpcDialogOpen(false)}
                        size="sm"
                        className="bg-white text-purple-900 hover:bg-gray-200"
                      >
                        Close
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </DialogContent>
          </Dialog>

          <Dialog open={potionDialogOpen} onOpenChange={setPotionDialogOpen}>
            <DialogContent className="bg-purple-900 text-white border-purple-700 max-w-[90vw] sm:max-w-lg">
              {selectedPotion && selectedNpc && (
                <>
                  <DialogHeader>
                    <DialogTitle>{selectedPotion.name}</DialogTitle>
                    <DialogDescription className="text-purple-300">Trading with {selectedNpc.name}</DialogDescription>
                  </DialogHeader>

                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-purple-200 mb-2">{selectedPotion.description}</p>
                      <p className="text-sm text-purple-200">{selectedPotion.effect}</p>
                    </div>

                    <div className="bg-purple-800/30 p-3 rounded-md">
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-sm">Price:</span>
                        <Badge
                          className={selectedPotion.id === selectedNpc.interest ? "bg-green-700" : "bg-purple-700"}
                        >
                          {getPotionPrice(selectedPotion, selectedNpc)} gold
                        </Badge>
                      </div>
                      {selectedPotion.id === selectedNpc.interest && (
                        <p className="text-xs text-green-400 mt-1">{selectedNpc.name} is interested in this potion!</p>
                      )}
                      {(marketInsightActive || haggleActive) && (
                        <p className="text-xs text-green-400 mt-1">
                          {marketInsightActive && haggleActive
                            ? "Market Insight (+20%) and Haggling (+15%) active!"
                            : marketInsightActive
                              ? "Market Insight: +20% gold!"
                              : "Haggling: +15% gold!"}
                        </p>
                      )}
                    </div>

                    <DialogFooter className="flex flex-col gap-2">
                      <Button onClick={sellPotion} className="w-full">
                        Sell to {selectedNpc.name}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setPotionDialogOpen(false)
                          setNpcDialogOpen(true)
                        }}
                        className="w-full bg-white text-purple-900 hover:bg-gray-200"
                      >
                        Back to Trader
                      </Button>
                    </DialogFooter>
                  </div>
                </>
              )}
            </DialogContent>
          </Dialog>
        </>
      )}
    </div>
  )
}
