"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import type { Inventory } from "@/lib/types"
import { initialIngredients, initialTools, potionRecipes } from "@/lib/game-data"
import { ChevronLeft, ChevronRight, Plus, Minus } from "lucide-react"
import { useMobile } from "@/hooks/use-mobile"

interface ShopProps {
  gold: number
  updateGold: (amount: number) => void
  inventory: Inventory
  addToInventory: (item: any) => void
  marketDemand: Record<string, number>
  daysPassed: number
  haggleActive?: boolean
  rareIngredientActive?: boolean
  getModifiedPrice?: (basePrice: number, isBuying: boolean) => number
}

export default function Shop({
  gold,
  updateGold,
  inventory,
  addToInventory,
  marketDemand,
  daysPassed,
  haggleActive = false,
  rareIngredientActive = false,
  getModifiedPrice,
}: ShopProps) {
  const [selectedItem, setSelectedItem] = useState<any>(null)
  const [buyQuantity, setBuyQuantity] = useState(1)
  const [sellQuantity, setSellQuantity] = useState(1)
  const [activeTab, setActiveTab] = useState("buy")
  const [activeSubTab, setActiveSubTab] = useState("ingredients")
  const [dialogOpen, setDialogOpen] = useState(false)
  const tabsListRef = useRef<HTMLDivElement>(null)
  const subTabsListRef = useRef<HTMLDivElement>(null)
  const isMobile = useMobile()

  // Reset quantities when selected item changes
  useEffect(() => {
    setBuyQuantity(1)
    setSellQuantity(1)
  }, [selectedItem])

  // Get all required ingredients from recipes
  const getAllRequiredIngredients = () => {
    const requiredIngredientIds = new Set<string>()
    potionRecipes.forEach((recipe) => {
      recipe.ingredients.forEach((ingredient) => {
        requiredIngredientIds.add(ingredient.id)
      })
    })
    return requiredIngredientIds
  }

  // Ensure shop always has all required ingredients
  const getShopStock = () => {
    const requiredIngredientIds = getAllRequiredIngredients()

    // Filter ingredients to ensure all required ones are available
    const ingredientsStock = initialIngredients.filter((ingredient) => {
      // Always include required ingredients
      if (requiredIngredientIds.has(ingredient.id)) {
        return true
      }
      // For non-required ingredients, use the original rotation logic
      return (ingredient.id.charCodeAt(0) + daysPassed) % 3 !== 0
    })

    // Add a rare ingredient if the effect is active
    if (rareIngredientActive) {
      // Find a rare ingredient that's not already in the shop
      const rareIngredients = initialIngredients.filter(
        (ing) => ing.basePrice > 25 && !ingredientsStock.some((i) => i.id === ing.id),
      )

      if (rareIngredients.length > 0) {
        // Add a random rare ingredient
        const rareIngredient = rareIngredients[Math.floor(Math.random() * rareIngredients.length)]
        ingredientsStock.push(rareIngredient)
      }
    }

    // Filter tools with original rotation logic
    const toolsStock = initialTools.filter((_, index) => (index + daysPassed) % 4 !== 0)

    return {
      ingredients: ingredientsStock,
      tools: toolsStock,
    }
  }

  // Shop stock with all required ingredients
  const shopStock = getShopStock()

  const getMarketValue = (item: any, isBuying = true) => {
    // Apply markup for buying, discount for selling
    const modifier = isBuying ? 1.2 : 0.8

    let price = 0
    if ("effect" in item) {
      // It's a potion
      const basePrice = item.basePrice
      const demand = marketDemand[item.id] || 1
      price = Math.round(basePrice * demand * modifier)
    } else {
      price = Math.round(item.basePrice * modifier)
    }

    // Apply haggling effect if active and getModifiedPrice is provided
    if (getModifiedPrice) {
      return getModifiedPrice(price, isBuying)
    }

    return price
  }

  // Increment quantity
  const incrementQuantity = (isBuying = true) => {
    if (isBuying) {
      setBuyQuantity((prev) => prev + 1)
    } else {
      const maxSell = selectedItem ? selectedItem.quantity : 1
      setSellQuantity((prev) => Math.min(prev + 1, maxSell))
    }
  }

  // Decrement quantity
  const decrementQuantity = (isBuying = true) => {
    if (isBuying) {
      setBuyQuantity((prev) => Math.max(prev - 1, 1))
    } else {
      setSellQuantity((prev) => Math.max(prev - 1, 1))
    }
  }

  // Update the buyItem function to ensure it's using the correct quantity
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

    if (isMobile) {
      setDialogOpen(false)
    }
  }

  // Update the sellItem function to ensure it's using the correct quantity
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

    if (isMobile) {
      setDialogOpen(false)
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

  const handleItemClick = (item: any) => {
    setSelectedItem(item)
    setBuyQuantity(1)
    setSellQuantity(1)

    if (isMobile) {
      setDialogOpen(true)
    }
  }

  // Check if an item is rare (for highlighting)
  const isRareItem = (item: any) => {
    return item.basePrice > 25
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-2">Shop</h2>
      <p className="text-purple-300 mb-4">Buy ingredients and tools, or sell your items.</p>

      {haggleActive && (
        <div className="mb-4 p-2 bg-purple-700/30 rounded-lg">
          <p className="text-sm text-purple-200">
            <span className="font-semibold">Haggling Active:</span> Buy for 15% less and sell for 15% more!
          </p>
        </div>
      )}

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
                            className={`p-2 rounded-md cursor-pointer flex justify-between items-center shop-item ${selectedItem?.id === item.id ? "bg-purple-700" : "hover:bg-purple-800/50"}`}
                            onClick={() => handleItemClick(item)}
                          >
                            <span className="flex items-center">
                              {item.name}
                              {isRareItem(item) && (
                                <Badge variant="outline" className="ml-2 bg-amber-800/30 text-xs">
                                  Rare
                                </Badge>
                              )}
                            </span>
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
                            className={`p-2 rounded-md cursor-pointer flex justify-between items-center shop-item ${selectedItem?.id === item.id ? "bg-purple-700" : "hover:bg-purple-800/50"}`}
                            onClick={() => handleItemClick(item)}
                          >
                            <span className="flex items-center">
                              {item.name}
                              {isRareItem(item) && (
                                <Badge variant="outline" className="ml-2 bg-amber-800/30 text-xs">
                                  Rare
                                </Badge>
                              )}
                            </span>
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
              {!isMobile && selectedItem ? (
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
                        {haggleActive && <p className="text-xs text-green-400 mt-1">15% haggling discount applied!</p>}
                      </div>

                      <div className="bg-purple-800/30 p-3 rounded-md">
                        <h3 className="font-semibold mb-1">Your Gold</h3>
                        <p>{gold} gold</p>
                      </div>
                    </div>

                    <div className="mt-4 flex flex-col sm:flex-row items-center gap-3">
                      <div className="w-full sm:w-auto flex items-center">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => decrementQuantity(true)}
                          disabled={buyQuantity <= 1}
                          className="h-8 w-8"
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <Input
                          type="number"
                          min="1"
                          value={buyQuantity}
                          onChange={(e) => {
                            const value = Math.max(1, Number.parseInt(e.target.value) || 1)
                            setBuyQuantity(value)
                          }}
                          className="bg-purple-900 text-white border-purple-700 w-16 mx-2 text-center"
                        />
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => incrementQuantity(true)}
                          className="h-8 w-8"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
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
              ) : !isMobile ? (
                <div className="h-full flex items-center justify-center">
                  <p className="text-purple-400">Select an item to purchase</p>
                </div>
              ) : null}
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
                              className={`p-2 rounded-md cursor-pointer flex justify-between items-center shop-item ${selectedItem?.id === item.id && activeTab === "sell" ? "bg-purple-700" : "hover:bg-purple-800/50"}`}
                              onClick={() => handleItemClick(item)}
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
                              className={`p-2 rounded-md cursor-pointer flex justify-between items-center shop-item ${selectedItem?.id === item.id && activeTab === "sell" ? "bg-purple-700" : "hover:bg-purple-800/50"}`}
                              onClick={() => handleItemClick(item)}
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
                              className={`p-2 rounded-md cursor-pointer flex justify-between items-center shop-item ${selectedItem?.id === item.id && activeTab === "sell" ? "bg-purple-700" : "hover:bg-purple-800/50"}`}
                              onClick={() => handleItemClick(item)}
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
              {!isMobile && selectedItem ? (
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
                        {haggleActive && <p className="text-xs text-green-400 mt-1">15% haggling bonus applied!</p>}
                      </div>

                      <div className="bg-purple-800/30 p-3 rounded-md">
                        <h3 className="font-semibold mb-1">Your Quantity</h3>
                        <p>{selectedItem.quantity} available</p>
                      </div>
                    </div>

                    <div className="mt-4 flex flex-col sm:flex-row items-center gap-3">
                      <div className="w-full sm:w-auto flex items-center">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => decrementQuantity(false)}
                          disabled={sellQuantity <= 1}
                          className="h-8 w-8"
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <Input
                          type="number"
                          min="1"
                          max={selectedItem.quantity}
                          value={sellQuantity}
                          onChange={(e) => {
                            const value = Math.min(
                              selectedItem.quantity,
                              Math.max(1, Number.parseInt(e.target.value) || 1),
                            )
                            setSellQuantity(value)
                          }}
                          className="bg-purple-900 text-white border-purple-700 w-16 mx-2 text-center"
                        />
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => incrementQuantity(false)}
                          disabled={sellQuantity >= selectedItem.quantity}
                          className="h-8 w-8"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
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
              ) : !isMobile ? (
                <div className="h-full flex items-center justify-center">
                  <p className="text-purple-400">Select an item to sell</p>
                </div>
              ) : null}
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Mobile Dialog for Item Details */}
      {isMobile && (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="bg-purple-900 text-white border-purple-700 max-w-[90vw] sm:max-w-lg z-50">
            {selectedItem && (
              <>
                <DialogHeader>
                  <DialogTitle>{selectedItem.name}</DialogTitle>
                  <DialogDescription className="text-purple-300">{selectedItem.description}</DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                  <p className="text-sm text-purple-200">
                    {"effect" in selectedItem
                      ? selectedItem.effect
                      : "growthTime" in selectedItem
                        ? `Growth time: ${selectedItem.growthTime} days - ${selectedItem.properties}`
                        : selectedItem.function}
                  </p>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-purple-800/30 p-3 rounded-md">
                      <h3 className="font-semibold text-sm mb-1">{activeTab === "buy" ? "Price" : "Sell Price"}</h3>
                      <p className="text-sm">{getMarketValue(selectedItem, activeTab === "buy")} gold each</p>
                      {haggleActive && (
                        <p className="text-xs text-green-400 mt-1">
                          {activeTab === "buy" ? "15% discount applied!" : "15% bonus applied!"}
                        </p>
                      )}
                    </div>

                    <div className="bg-purple-800/30 p-3 rounded-md">
                      <h3 className="font-semibold text-sm mb-1">
                        {activeTab === "buy" ? "Your Gold" : "Your Quantity"}
                      </h3>
                      <p className="text-sm">
                        {activeTab === "buy" ? `${gold} gold` : `${selectedItem.quantity} available`}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => decrementQuantity(activeTab === "buy")}
                        disabled={activeTab === "buy" ? buyQuantity <= 1 : sellQuantity <= 1}
                        className="h-8 w-8"
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <Input
                        type="number"
                        min="1"
                        max={activeTab === "sell" ? selectedItem.quantity : undefined}
                        value={activeTab === "buy" ? buyQuantity : sellQuantity}
                        onChange={(e) => {
                          const value = Math.max(1, Number.parseInt(e.target.value) || 1)
                          if (activeTab === "buy") {
                            setBuyQuantity(value)
                          } else {
                            setSellQuantity(Math.min(selectedItem.quantity, value))
                          }
                        }}
                        className="bg-purple-800 text-white border-purple-600 w-16 mx-2 text-center"
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => incrementQuantity(activeTab === "buy")}
                        disabled={activeTab === "sell" && sellQuantity >= selectedItem.quantity}
                        className="h-8 w-8"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    {activeTab === "buy" ? (
                      <Button
                        onClick={buyItem}
                        disabled={gold < getMarketValue(selectedItem) * buyQuantity}
                        className="flex-1 ml-4"
                      >
                        Buy for {getMarketValue(selectedItem) * buyQuantity} gold
                      </Button>
                    ) : (
                      <Button
                        onClick={sellItem}
                        disabled={sellQuantity > selectedItem.quantity}
                        className="flex-1 ml-4"
                      >
                        Sell for {getMarketValue(selectedItem, false) * sellQuantity} gold
                      </Button>
                    )}
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
