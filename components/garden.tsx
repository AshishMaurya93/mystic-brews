"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import type { Inventory, Garden as GardenType } from "@/lib/types"
import { initialIngredients } from "@/lib/game-data"
import { useMobile } from "@/hooks/use-mobile"

interface GardenProps {
  garden: GardenType
  inventory: Inventory
  setGameState: React.Dispatch<React.SetStateAction<any>>
  addToInventory: (item: any) => void
  removeFromInventory: (itemType: "ingredients" | "potions" | "tools", itemId: string, amount?: number) => void
}

export default function Garden({ garden, inventory, setGameState, addToInventory, removeFromInventory }: GardenProps) {
  const [selectedIngredient, setSelectedIngredient] = useState("")
  const [selectedPlot, setSelectedPlot] = useState<number | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedPlotDetails, setSelectedPlotDetails] = useState<any>(null)
  const isMobile = useMobile()

  const plantIngredient = (plotIndex: number) => {
    if (!selectedIngredient) return

    const ingredient = initialIngredients.find((i) => i.id === selectedIngredient)
    if (!ingredient) return

    // Check if player has the ingredient in inventory
    const inventoryItem = inventory.ingredients.find((i) => i.id === selectedIngredient)
    if (!inventoryItem || inventoryItem.quantity < 1) return

    // Remove one seed from inventory
    removeFromInventory("ingredients", selectedIngredient, 1)

    // Plant the seed
    setGameState((prev) => {
      const newPlots = [...prev.garden.plots]
      newPlots[plotIndex] = {
        ingredient,
        growthStage: 0,
        planted: prev.daysPassed,
      }
      return {
        ...prev,
        garden: {
          ...prev.garden,
          plots: newPlots,
        },
      }
    })

    setSelectedIngredient("")
    setSelectedPlot(null)
    if (isMobile) {
      setDialogOpen(false)
    }
  }

  const harvestPlot = (plotIndex: number) => {
    const plot = garden.plots[plotIndex]
    if (!plot || plot.growthStage < plot.ingredient.growthTime) return

    // Add harvested ingredient to inventory (2-4 per harvest)
    const harvestAmount = Math.floor(Math.random() * 3) + 2
    addToInventory({
      ...plot.ingredient,
      quantity: harvestAmount,
    })

    // Clear the plot
    setGameState((prev) => {
      const newPlots = [...prev.garden.plots]
      newPlots[plotIndex] = null
      return {
        ...prev,
        garden: {
          ...prev.garden,
          plots: newPlots,
        },
      }
    })

    if (isMobile) {
      setDialogOpen(false)
    }
  }

  const unlockPlot = () => {
    if (garden.unlocked >= garden.plots.length) return

    setGameState((prev) => ({
      ...prev,
      gold: prev.gold - 50,
      garden: {
        ...prev.garden,
        unlocked: prev.garden.unlocked + 1,
      },
    }))

    if (isMobile) {
      setDialogOpen(false)
    }
  }

  // Get the selected ingredient details for display
  const getSelectedIngredientDetails = () => {
    if (!selectedIngredient) return null
    return initialIngredients.find((i) => i.id === selectedIngredient)
  }

  const selectedIngredientDetails = getSelectedIngredientDetails()

  const handlePlotClick = (index: number, plot: any) => {
    if (isMobile) {
      setSelectedPlotDetails({ index, plot })
      setDialogOpen(true)
    } else {
      if (index >= garden.unlocked) {
        // Locked plot
        return
      } else if (plot) {
        // Existing plant
        return
      } else {
        // Empty plot
        setSelectedPlot(index)
      }
    }
  }

  const renderPlotContent = (plot: any, index: number) => {
    if (index >= garden.unlocked) {
      return (
        <div className="h-full flex flex-col items-center justify-center py-3">
          <p className="text-gray-400 mb-2 text-sm sm:text-base">Locked Plot</p>
          <Button variant="outline" size="sm" onClick={() => unlockPlot()} className="text-xs sm:text-sm">
            Unlock (50 Gold)
          </Button>
        </div>
      )
    } else if (plot) {
      const isReady = plot.growthStage >= plot.ingredient.growthTime
      return (
        <div className={`h-full flex flex-col justify-between ${isReady ? "garden-plot-ready" : ""}`}>
          <div>
            <h3 className="font-semibold text-sm sm:text-base">{plot.ingredient.name}</h3>
            <p className="text-xs text-purple-300">
              {isReady ? "Ready to harvest!" : `Growing: ${plot.growthStage}/${plot.ingredient.growthTime} days`}
            </p>
            <Progress value={(plot.growthStage / plot.ingredient.growthTime) * 100} className="h-2 mt-2" />
          </div>

          {isReady ? (
            <Button
              variant="secondary"
              size="sm"
              className="mt-2 bg-green-700 hover:bg-green-600 text-xs sm:text-sm w-full sm:w-auto"
              onClick={() => harvestPlot(index)}
            >
              Harvest
            </Button>
          ) : (
            <p className="text-xs italic text-purple-400 mt-2">Planted on day {plot.planted}</p>
          )}
        </div>
      )
    } else {
      return (
        <div className="h-full flex flex-col items-center justify-center py-3 garden-plot-empty">
          <p className="text-purple-400 mb-2 text-sm sm:text-base">Empty Plot</p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              if (isMobile) {
                setSelectedPlot(index)
              } else {
                setSelectedPlot(index)
              }
            }}
            className="text-xs sm:text-sm"
          >
            Plant
          </Button>
        </div>
      )
    }
  }

  return (
    <div>
      <div className="mb-4">
        <h2 className="text-2xl font-bold mb-2">Your Garden</h2>
        <p className="text-purple-300 mb-4">Plant ingredients and harvest them when they're ready.</p>

        {!isMobile && selectedPlot !== null && (
          <div className="mb-4 p-3 bg-purple-700/50 rounded-lg">
            <h3 className="font-semibold mb-2">Planting in Plot {selectedPlot + 1}</h3>

            <div className="flex flex-col sm:flex-row gap-2">
              <Select value={selectedIngredient} onValueChange={setSelectedIngredient}>
                <SelectTrigger className="w-full sm:w-[200px] text-white bg-purple-900">
                  <SelectValue placeholder="Select seed" />
                </SelectTrigger>
                <SelectContent className="bg-purple-900 text-white border-purple-700">
                  {inventory.ingredients.length > 0 ? (
                    inventory.ingredients.map((ingredient) => (
                      <SelectItem
                        key={ingredient.id}
                        value={ingredient.id}
                        className="text-white focus:bg-purple-800 focus:text-white"
                      >
                        {ingredient.name} (x{ingredient.quantity})
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="none" disabled className="text-gray-400">
                      No seeds available
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>

              <div className="flex gap-2 mt-2 sm:mt-0">
                <Button
                  onClick={() => plantIngredient(selectedPlot)}
                  disabled={!selectedIngredient}
                  variant="secondary"
                  className="flex-1 sm:flex-none"
                >
                  Plant
                </Button>
                <Button
                  onClick={() => setSelectedPlot(null)}
                  variant="outline"
                  className="flex-1 sm:flex-none bg-purple-800 hover:bg-purple-700 text-white border-purple-600"
                >
                  Cancel
                </Button>
              </div>
            </div>

            {selectedIngredientDetails && (
              <div className="mt-3 p-2 bg-purple-800/30 rounded-md text-sm">
                <p className="font-medium">{selectedIngredientDetails.name}</p>
                <p className="text-purple-200 text-xs mt-1">{selectedIngredientDetails.description}</p>
                <div className="flex justify-between mt-2 text-xs">
                  <span>Growth time: {selectedIngredientDetails.growthTime} days</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
        {garden.plots.map((plot, index) => (
          <Card
            key={index}
            className={`h-auto sm:h-40 ${index >= garden.unlocked ? "bg-gray-800/50 border-gray-700" : "bg-purple-900/30 hover:bg-purple-900/50 transition-colors"} cursor-pointer`}
            onClick={() => handlePlotClick(index, plot)}
          >
            <CardContent className="p-3 sm:p-4 h-full flex flex-col justify-between">
              {renderPlotContent(plot, index)}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Mobile Dialog for Plot Details */}
      {isMobile && (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="bg-purple-900 text-white border-purple-700 max-w-[90vw] sm:max-w-lg">
            {selectedPlotDetails && selectedPlotDetails.plot ? (
              <>
                <DialogHeader>
                  <DialogTitle>
                    {selectedPlotDetails.plot.ingredient.name} - Plot {selectedPlotDetails.index + 1}
                  </DialogTitle>
                  <DialogDescription className="text-purple-300">
                    {selectedPlotDetails.plot.growthStage >= selectedPlotDetails.plot.ingredient.growthTime
                      ? "Ready to harvest!"
                      : `Growing: ${selectedPlotDetails.plot.growthStage}/${selectedPlotDetails.plot.ingredient.growthTime} days`}
                  </DialogDescription>
                </DialogHeader>
              </>
            ) : selectedPlotDetails && selectedPlotDetails.index >= garden.unlocked ? (
              <>
                <DialogHeader>
                  <DialogTitle>Locked Plot {selectedPlotDetails.index + 1}</DialogTitle>
                  <DialogDescription className="text-purple-300">
                    This plot needs to be unlocked before you can plant here.
                  </DialogDescription>
                </DialogHeader>
              </>
            ) : selectedPlot !== null ? (
              <>
                <DialogHeader>
                  <DialogTitle>Planting in Plot {selectedPlot + 1}</DialogTitle>
                  <DialogDescription className="text-purple-300">
                    Select a seed to plant in this plot.
                  </DialogDescription>
                </DialogHeader>
              </>
            ) : (
              <>
                <DialogHeader>
                  <DialogTitle>Empty Plot {selectedPlotDetails?.index + 1}</DialogTitle>
                  <DialogDescription className="text-purple-300">
                    Would you like to plant something here?
                  </DialogDescription>
                </DialogHeader>
              </>
            )}

            {selectedPlotDetails && selectedPlotDetails.plot ? (
              // Existing plant details
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-purple-200 mb-2">{selectedPlotDetails.plot.ingredient.description}</p>
                  <Progress
                    value={
                      (selectedPlotDetails.plot.growthStage / selectedPlotDetails.plot.ingredient.growthTime) * 100
                    }
                    className="h-3 mb-2"
                  />
                  <p className="text-xs text-purple-300">Planted on day {selectedPlotDetails.plot.planted}</p>
                </div>

                {selectedPlotDetails.plot.growthStage >= selectedPlotDetails.plot.ingredient.growthTime && (
                  <Button
                    variant="secondary"
                    className="w-full bg-green-700 hover:bg-green-600"
                    onClick={() => harvestPlot(selectedPlotDetails.index)}
                  >
                    Harvest
                  </Button>
                )}
              </div>
            ) : selectedPlotDetails && selectedPlotDetails.index >= garden.unlocked ? (
              // Locked plot
              <div className="space-y-4">
                <p className="text-sm text-purple-300">
                  Unlock this plot to expand your garden and grow more ingredients.
                </p>
                <Button variant="secondary" className="w-full" onClick={unlockPlot}>
                  Unlock for 50 Gold
                </Button>
              </div>
            ) : selectedPlot !== null ? (
              // Planting interface
              <div className="space-y-4">
                <Select value={selectedIngredient} onValueChange={setSelectedIngredient}>
                  <SelectTrigger className="w-full text-white bg-purple-800 border-purple-600">
                    <SelectValue placeholder="Select seed" />
                  </SelectTrigger>
                  <SelectContent className="bg-purple-900 text-white border-purple-700">
                    {inventory.ingredients.length > 0 ? (
                      inventory.ingredients.map((ingredient) => (
                        <SelectItem
                          key={ingredient.id}
                          value={ingredient.id}
                          className="text-white focus:bg-purple-800 focus:text-white"
                        >
                          {ingredient.name} (x{ingredient.quantity})
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="none" disabled className="text-gray-400">
                        No seeds available
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>

                {selectedIngredientDetails && (
                  <div className="p-3 bg-purple-800/30 rounded-md">
                    <p className="font-medium">{selectedIngredientDetails.name}</p>
                    <p className="text-purple-200 text-sm mt-1">{selectedIngredientDetails.description}</p>
                    <div className="mt-2 text-sm">
                      <span>Growth time: {selectedIngredientDetails.growthTime} days</span>
                    </div>
                  </div>
                )}

                <div className="flex gap-2">
                  <Button
                    onClick={() => plantIngredient(selectedPlot)}
                    disabled={!selectedIngredient}
                    variant="secondary"
                    className="flex-1"
                  >
                    Plant
                  </Button>
                  <Button
                    onClick={() => {
                      setSelectedPlot(null)
                      setDialogOpen(false)
                    }}
                    variant="outline"
                    className="flex-1 bg-purple-800 hover:bg-purple-700 text-white border-purple-600"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              // Empty plot
              <div className="space-y-4">
                <p className="text-sm text-purple-300">
                  This plot is ready for planting. Would you like to plant something here?
                </p>
                <Button
                  variant="secondary"
                  className="w-full"
                  onClick={() => {
                    if (selectedPlotDetails) {
                      setSelectedPlot(selectedPlotDetails.index)
                    }
                  }}
                >
                  Plant Something
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
