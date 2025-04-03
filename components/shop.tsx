"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import type { Inventory } from "@/lib/types"
import { initialIngredients, initialTools } from "@/lib/game-data"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface ShopProps {
  gold: number
  updateGold: (amount: number) => void
  inventory: Inventory
  addToInventory: (item: any) => void
  marketDemand: Record<string, number>
  daysPassed: number
}

export default function Shop({ gold, updateGold, inventory, addToInventory, marketDemand, daysPassed }: ShopProps) {
  const [selectedItem, setSelectedItem] = useState<any>(null)
  const [buyQuantity, setBuyQuantity] = useState(1)
  const [sellQuantity, setSellQuantity] = useState(1)
  const [activeTab, setActiveTab] = useState("buy")
  const [activeSubTab, setActiveSubTab] = useState("ingredients")
  const tabsListRef = useRef<HTMLDivElement>(null)
  const subTabsListRef = useRef<HTMLDivElement>(null)

  // Shop stock changes every 3 days
  const shopStock = {
    ingredients: initialIngredients.filter((_, index) => (index + daysPassed) % 3 !== 0),
    tools: initialTools.filter((_, index) => (index + daysPassed) % 4 !== 0),
  }

  const getMarketValue = (item: any, isBuying = true) => {
    // Apply markup for buying, discount for selling
    const modifier = isBuying ? 1.2 : 0.8

    if ("effect" in item) {
      // It's a potion
      const basePrice = item.basePrice
      const demand = marketDemand[item.id] || 1
      return Math.round(basePrice * demand * modifier)
    }
    return Math.round(item.basePrice * modifier)
  }

  const buyItem = () => {
    if (!selectedItem) return

    const totalCost = getMarketValue(selectedItem) * buyQuantity

    if (gold < totalCost) return

    // Deduct gold
    updateGold(-totalCost)

    // Add item to inventory
    addToInventory({
      ...selectedItem,
      quantity: buyQuantity,
    })

    // Reset quantity
    setBuyQuantity(1)
  }

  const sellItem = () => {
    if (!selectedItem) return

    const totalValue = getMarketValue(selectedItem, false) * sellQuantity

    // Add gold
    updateGold(totalValue)

    // Remove from inventory based on type
    let itemType: "ingredients" | "potions" | "tools"

    if ("growthTime" in selectedItem) {
      itemType = "ingredients"
    } else if ("effect" in selectedItem) {
      itemType = "potions"
    } else {
      itemType = "tools"
    }

    // This function is defined in the parent component
    inventory[itemType] = inventory[itemType]
      .map((item) => {
        if (item.id === selectedItem.id) {
          return {
            ...item,
            quantity: item.quantity - sellQuantity,
          }
        }
        return item
      })
      .filter((item) => item.quantity > 0)

    // Reset quantity and selected item if sold all
    setSellQuantity(1)
    const remainingItem = inventory[itemType].find((item) => item.id === selectedItem.id)
    if (!remainingItem) {
      setSelectedItem(null)
    }
  }

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

  // Scroll sub-tabs left
  const scrollSubTabsLeft = () => {
    if (subTabsListRef.current) {
      subTabsListRef.current.scrollBy({
        left: -100,
        behavior: "smooth",
      })
    }
  }

  // Scroll sub-tabs right
  const scrollSubTabsRight = () => {
    if (subTabsListRef.current) {
      subTabsListRef.current.scrollBy({
        left: 100,
        behavior: "smooth",
      })
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-2">Shop</h2>
      <p className="text-purple-300 mb-4">Buy ingredients and tools, or sell your items.</p>

      <Tabs defaultValue="buy" className="w-full" value={activeTab} onValueChange={setActiveTab}>
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

          <TabsList ref={tabsListRef} className="sm:grid sm:grid-cols-2 mb-4 w-full overflow-x-auto flex no-scrollbar">
            <TabsTrigger value="buy">Buy</TabsTrigger>
            <TabsTrigger value="sell">Sell</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="buy">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            <div className="md:col-span-1">
              <Tabs defaultValue="ingredients" className="w-full" value={activeSubTab} onValueChange={setActiveSubTab}>
                <div className="relative mb-4">
                  {/* Mobile scroll buttons */}
                  <div className="sm:hidden flex items-center justify-between absolute inset-y-0 w-full pointer-events-none z-10">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-full bg-purple-900/80 text-white pointer-events-auto"
                      onClick={scrollSubTabsLeft}
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-full bg-purple-900/80 text-white pointer-events-auto"
                      onClick={scrollSubTabsRight}
                    >
                      <ChevronRight className="h-5 w-5" />
                    </Button>
                  </div>

                  <TabsList
                    ref={subTabsListRef}
                    className="sm:grid sm:grid-cols-2 mb-4 w-full overflow-x-auto flex no-scrollbar"
                  >
                    <TabsTrigger value="ingredients">Ingredients</TabsTrigger>
                    <TabsTrigger value="tools">Tools</TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value="ingredients">
                  <Card className="h-[400px] overflow-y-auto">
                    <CardHeader>
                      <CardTitle>Shop Ingredients</CardTitle>
                      <CardDescription>Seeds and materials for sale</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {shopStock.ingredients.map((item) => (
                          <div
                            key={item.id}
                            className={`p-2 rounded-md cursor-pointer flex justify-between items-center ${selectedItem?.id === item.id ? "bg-purple-700" : "hover:bg-purple-800/50"}`}
                            onClick={() => {
                              setSelectedItem(item)
                              setBuyQuantity(1)
                            }}
                          >
                            <span>{item.name}</span>
                            <Badge variant="outline">{getMarketValue(item)} gold</Badge>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="tools">
                  <Card className="h-[400px] overflow-y-auto">
                    <CardHeader>
                      <CardTitle>Shop Tools</CardTitle>
                      <CardDescription>Equipment for your potion making</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {shopStock.tools.map((item) => (
                          <div
                            key={item.id}
                            className={`p-2 rounded-md cursor-pointer flex justify-between items-center ${selectedItem?.id === item.id ? "bg-purple-700" : "hover:bg-purple-800/50"}`}
                            onClick={() => {
                              setSelectedItem(item)
                              setBuyQuantity(1)
                            }}
                          >
                            <span>{item.name}</span>
                            <Badge variant="outline">{getMarketValue(item)} gold</Badge>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>

            <div className="md:col-span-2">
              {selectedItem ? (
                <Card>
                  <CardHeader>
                    <CardTitle>{selectedItem.name}</CardTitle>
                    <CardDescription>{selectedItem.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-4">
                      <p className="text-purple-300">
                        {"growthTime" in selectedItem
                          ? `Growth time: ${selectedItem.growthTime} days`
                          : selectedItem.function}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <div className="bg-purple-800/30 p-3 rounded-md">
                        <h3 className="font-semibold mb-1">Price</h3>
                        <p>{getMarketValue(selectedItem)} gold each</p>
                      </div>

                      <div className="bg-purple-800/30 p-3 rounded-md">
                        <h3 className="font-semibold mb-1">Your Gold</h3>
                        <p>{gold} gold</p>
                      </div>
                    </div>

                    <div className="mt-4 flex flex-col sm:flex-row items-center gap-3">
                      <div className="w-full sm:w-24">
                        <Input
                          type="number"
                          min="1"
                          value={buyQuantity}
                          onChange={(e) => setBuyQuantity(Math.max(1, Number.parseInt(e.target.value) || 1))}
                          className="bg-purple-900 text-white border-purple-700"
                        />
                      </div>
                      <Button
                        onClick={buyItem}
                        disabled={gold < getMarketValue(selectedItem) * buyQuantity}
                        className="w-full sm:flex-1"
                      >
                        Buy for {getMarketValue(selectedItem) * buyQuantity} gold
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <div className="h-full flex items-center justify-center">
                  <p className="text-purple-400">Select an item to purchase</p>
                </div>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="sell">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            <div className="md:col-span-1">
              <Tabs defaultValue="ingredients" className="w-full" value={activeSubTab} onValueChange={setActiveSubTab}>
                <div className="relative mb-4">
                  {/* Mobile scroll buttons */}
                  <div className="sm:hidden flex items-center justify-between absolute inset-y-0 w-full pointer-events-none z-10">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-full bg-purple-900/80 text-white pointer-events-auto"
                      onClick={scrollSubTabsLeft}
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-full bg-purple-900/80 text-white pointer-events-auto"
                      onClick={scrollSubTabsRight}
                    >
                      <ChevronRight className="h-5 w-5" />
                    </Button>
                  </div>

                  <TabsList
                    ref={subTabsListRef}
                    className="sm:grid sm:grid-cols-3 mb-4 w-full overflow-x-auto flex no-scrollbar"
                  >
                    <TabsTrigger value="ingredients">Ingredients</TabsTrigger>
                    <TabsTrigger value="potions">Potions</TabsTrigger>
                    <TabsTrigger value="tools">Tools</TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value="ingredients">
                  <Card className="h-[400px] overflow-y-auto">
                    <CardHeader>
                      <CardTitle>Your Ingredients</CardTitle>
                      <CardDescription>Sell your extra ingredients</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {inventory.ingredients.length > 0 ? (
                        <div className="space-y-2">
                          {inventory.ingredients.map((item) => (
                            <div
                              key={item.id}
                              className={`p-2 rounded-md cursor-pointer flex justify-between items-center ${selectedItem?.id === item.id && activeTab === "sell" ? "bg-purple-700" : "hover:bg-purple-800/50"}`}
                              onClick={() => {
                                setSelectedItem(item)
                                setSellQuantity(1)
                              }}
                            >
                              <div className="flex justify-between w-full">
                                <span>{item.name}</span>
                                <div className="flex gap-2 items-center">
                                  <Badge variant="outline">{item.quantity}</Badge>
                                  <Badge variant="secondary">{getMarketValue(item, false)} gold</Badge>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-center text-purple-400">No ingredients to sell</p>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="potions">
                  <Card className="h-[400px] overflow-y-auto">
                    <CardHeader>
                      <CardTitle>Your Potions</CardTitle>
                      <CardDescription>Sell your crafted potions</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {inventory.potions.length > 0 ? (
                        <div className="space-y-2">
                          {inventory.potions.map((item) => (
                            <div
                              key={item.id}
                              className={`p-2 rounded-md cursor-pointer flex justify-between items-center ${selectedItem?.id === item.id && activeTab === "sell" ? "bg-purple-700" : "hover:bg-purple-800/50"}`}
                              onClick={() => {
                                setSelectedItem(item)
                                setSellQuantity(1)
                              }}
                            >
                              <div className="flex justify-between w-full">
                                <span>{item.name}</span>
                                <div className="flex gap-2 items-center">
                                  <Badge variant="outline">{item.quantity}</Badge>
                                  <Badge variant="secondary">{getMarketValue(item, false)} gold</Badge>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-center text-purple-400">No potions to sell</p>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="tools">
                  <Card className="h-[400px] overflow-y-auto">
                    <CardHeader>
                      <CardTitle>Your Tools</CardTitle>
                      <CardDescription>Sell your extra tools</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {inventory.tools.length > 0 ? (
                        <div className="space-y-2">
                          {inventory.tools.map((item) => (
                            <div
                              key={item.id}
                              className={`p-2 rounded-md cursor-pointer flex justify-between items-center ${selectedItem?.id === item.id && activeTab === "sell" ? "bg-purple-700" : "hover:bg-purple-800/50"}`}
                              onClick={() => {
                                setSelectedItem(item)
                                setSellQuantity(1)
                              }}
                            >
                              <div className="flex justify-between w-full">
                                <span>{item.name}</span>
                                <div className="flex gap-2 items-center">
                                  <Badge variant="outline">{item.quantity}</Badge>
                                  <Badge variant="secondary">{getMarketValue(item, false)} gold</Badge>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-center text-purple-400">No tools to sell</p>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>

            <div className="md:col-span-2">
              {selectedItem ? (
                <Card>
                  <CardHeader>
                    <CardTitle>{selectedItem.name}</CardTitle>
                    <CardDescription>{selectedItem.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-4">
                      <p className="text-purple-300">
                        {"effect" in selectedItem
                          ? selectedItem.effect
                          : "growthTime" in selectedItem
                            ? selectedItem.properties
                            : selectedItem.function}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <div className="bg-purple-800/30 p-3 rounded-md">
                        <h3 className="font-semibold mb-1">Sell Price</h3>
                        <p>{getMarketValue(selectedItem, false)} gold each</p>
                      </div>

                      <div className="bg-purple-800/30 p-3 rounded-md">
                        <h3 className="font-semibold mb-1">Your Quantity</h3>
                        <p>{selectedItem.quantity} available</p>
                      </div>
                    </div>

                    <div className="mt-4 flex flex-col sm:flex-row items-center gap-3">
                      <div className="w-full sm:w-24">
                        <Input
                          type="number"
                          min="1"
                          max={selectedItem.quantity}
                          value={sellQuantity}
                          onChange={(e) =>
                            setSellQuantity(
                              Math.min(selectedItem.quantity, Math.max(1, Number.parseInt(e.target.value) || 1)),
                            )
                          }
                          className="bg-purple-900 text-white border-purple-700"
                        />
                      </div>
                      <Button
                        onClick={sellItem}
                        disabled={sellQuantity > selectedItem.quantity}
                        className="w-full sm:flex-1"
                      >
                        Sell for {getMarketValue(selectedItem, false) * sellQuantity} gold
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <div className="h-full flex items-center justify-center">
                  <p className="text-purple-400">Select an item to sell</p>
                </div>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

