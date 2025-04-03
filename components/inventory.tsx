"use client"

import { useState, useRef } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Inventory as InventoryType } from "@/lib/types"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface InventoryProps {
  inventory: InventoryType
  marketDemand: Record<string, number>
}

export default function Inventory({ inventory, marketDemand }: InventoryProps) {
  const [selectedItem, setSelectedItem] = useState<any>(null)
  const [activeTab, setActiveTab] = useState("ingredients")
  const tabsListRef = useRef<HTMLDivElement>(null)

  const getMarketValue = (item: any) => {
    if ("effect" in item) {
      // It's a potion
      const basePrice = item.basePrice
      const demand = marketDemand[item.id] || 1
      return Math.round(basePrice * demand)
    }
    return item.basePrice
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

  return (
    <div>
      <h2 className="text-2xl font-bold mb-2">Inventory</h2>
      <p className="text-purple-300 mb-4">Manage your ingredients, potions, and tools.</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        <div className="md:col-span-1">
          <Tabs defaultValue="ingredients" className="w-full" value={activeTab} onValueChange={setActiveTab}>
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

              <TabsList
                ref={tabsListRef}
                className="sm:grid sm:grid-cols-3 mb-4 w-full overflow-x-auto flex no-scrollbar"
              >
                <TabsTrigger value="ingredients">Ingredients</TabsTrigger>
                <TabsTrigger value="potions">Potions</TabsTrigger>
                <TabsTrigger value="tools">Tools</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="ingredients">
              <Card className="h-[300px] sm:h-[400px] overflow-y-auto">
                <CardHeader>
                  <CardTitle>Ingredients</CardTitle>
                  <CardDescription>Your collected herbs and materials</CardDescription>
                </CardHeader>
                <CardContent>
                  {inventory.ingredients.length > 0 ? (
                    <div className="space-y-2">
                      {inventory.ingredients.map((item) => (
                        <div
                          key={item.id}
                          className={`p-2 rounded-md cursor-pointer flex justify-between items-center ${selectedItem?.id === item.id && selectedItem?.type === "ingredient" ? "bg-purple-700" : "hover:bg-purple-800/50"}`}
                          onClick={() => setSelectedItem({ ...item, type: "ingredient" })}
                        >
                          <span>{item.name}</span>
                          <Badge variant="outline">{item.quantity}</Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-purple-400">No ingredients in inventory</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="potions">
              <Card className="h-[300px] sm:h-[400px] overflow-y-auto">
                <CardHeader>
                  <CardTitle>Potions</CardTitle>
                  <CardDescription>Your crafted magical brews</CardDescription>
                </CardHeader>
                <CardContent>
                  {inventory.potions.length > 0 ? (
                    <div className="space-y-2">
                      {inventory.potions.map((item) => (
                        <div
                          key={item.id}
                          className={`p-2 rounded-md cursor-pointer flex justify-between items-center ${selectedItem?.id === item.id && selectedItem?.type === "potion" ? "bg-purple-700" : "hover:bg-purple-800/50"}`}
                          onClick={() => setSelectedItem({ ...item, type: "potion" })}
                        >
                          <span>{item.name}</span>
                          <Badge variant="outline">{item.quantity}</Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-purple-400">No potions in inventory</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="tools">
              <Card className="h-[300px] sm:h-[400px] overflow-y-auto">
                <CardHeader>
                  <CardTitle>Tools</CardTitle>
                  <CardDescription>Your equipment and tools</CardDescription>
                </CardHeader>
                <CardContent>
                  {inventory.tools.length > 0 ? (
                    <div className="space-y-2">
                      {inventory.tools.map((item) => (
                        <div
                          key={item.id}
                          className={`p-2 rounded-md cursor-pointer flex justify-between items-center ${selectedItem?.id === item.id && selectedItem?.type === "tool" ? "bg-purple-700" : "hover:bg-purple-800/50"}`}
                          onClick={() => setSelectedItem({ ...item, type: "tool" })}
                        >
                          <span>{item.name}</span>
                          <Badge variant="outline">{item.quantity}</Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-purple-400">No tools in inventory</p>
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
                <CardDescription>
                  {selectedItem.type === "ingredient" && "Growth time: " + selectedItem.growthTime + " days"}
                  {selectedItem.type === "potion" && "Magical potion"}
                  {selectedItem.type === "tool" && "Useful tool"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <p className="text-purple-300">{selectedItem.description}</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mt-4">
                  <div className="bg-purple-800/30 p-3 rounded-md">
                    <h3 className="font-semibold mb-1">Quantity</h3>
                    <p>{selectedItem.quantity}</p>
                  </div>

                  <div className="bg-purple-800/30 p-3 rounded-md">
                    <h3 className="font-semibold mb-1">Market Value</h3>
                    <p>{getMarketValue(selectedItem)} gold</p>
                  </div>

                  {selectedItem.type === "potion" && (
                    <div className="col-span-2 bg-purple-800/30 p-3 rounded-md">
                      <h3 className="font-semibold mb-1">Effect</h3>
                      <p>{selectedItem.effect}</p>
                    </div>
                  )}

                  {selectedItem.type === "ingredient" && (
                    <div className="col-span-2 bg-purple-800/30 p-3 rounded-md">
                      <h3 className="font-semibold mb-1">Properties</h3>
                      <p>{selectedItem.properties}</p>
                    </div>
                  )}

                  {selectedItem.type === "tool" && (
                    <div className="col-span-2 bg-purple-800/30 p-3 rounded-md">
                      <h3 className="font-semibold mb-1">Function</h3>
                      <p>{selectedItem.function}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="h-full flex items-center justify-center">
              <p className="text-purple-400">Select an item to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

