"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import type { Inventory, Recipe } from "@/lib/types"
import { initialPotions, potionRecipes, initialIngredients } from "@/lib/game-data"
import { useMobile } from "@/hooks/use-mobile"

interface PotionCraftingProps {
  inventory: Inventory
  addToInventory: (item: any) => void
  removeFromInventory: (itemType: "ingredients" | "potions" | "tools", itemId: string, amount?: number) => void
  toast: any
  craftingMasteryActive?: boolean
}

export default function PotionCrafting({
  inventory,
  addToInventory,
  removeFromInventory,
  toast,
  craftingMasteryActive = false,
}: PotionCraftingProps) {
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const isMobile = useMobile()

  const getAdjustedRecipe = (recipe: Recipe): Recipe => {
    if (!craftingMasteryActive) return recipe

    // Create a deep copy of the recipe
    const adjustedRecipe = {
      ...recipe,
      ingredients: [...recipe.ingredients].map((ing) => ({ ...ing })),
    }

    // Reduce each ingredient quantity by 1 (minimum 1)
    adjustedRecipe.ingredients = adjustedRecipe.ingredients.map((ing) => ({
      ...ing,
      quantity: Math.max(1, ing.quantity - 1),
    }))

    return adjustedRecipe
  }

  const canCraftPotion = (recipe: Recipe): boolean => {
    const adjustedRecipe = getAdjustedRecipe(recipe)

    return adjustedRecipe.ingredients.every((req) => {
      const ingredient = inventory.ingredients.find((i) => i.id === req.id)
      return ingredient && ingredient.quantity >= req.quantity
    })
  }

  const craftPotion = () => {
    if (!selectedRecipe) return

    // Get the adjusted recipe with crafting mastery if active
    const adjustedRecipe = getAdjustedRecipe(selectedRecipe)

    // Check if player has all required ingredients
    if (!canCraftPotion(selectedRecipe)) {
      toast({
        title: "Missing Ingredients",
        description: "You don't have all the required ingredients to craft this potion.",
        variant: "destructive",
      })
      return
    }

    // Remove ingredients from inventory
    adjustedRecipe.ingredients.forEach((req) => {
      removeFromInventory("ingredients", req.id, req.quantity)
    })

    // Add potion to inventory
    const potion = initialPotions.find((p) => p.id === selectedRecipe.potionId)
    if (potion) {
      addToInventory({
        ...potion,
        quantity: 1,
      })

      toast({
        title: "Potion Crafted",
        description: `You successfully crafted a ${potion.name}!`,
      })
    }

    if (isMobile) {
      setDialogOpen(false)
    }
  }

  const handleRecipeClick = (recipe: Recipe) => {
    setSelectedRecipe(recipe)
    if (isMobile) {
      setDialogOpen(true)
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-2">Potion Crafting</h2>
      <p className="text-purple-300 mb-4">Combine ingredients to create magical potions.</p>

      {craftingMasteryActive && (
        <div className="mb-4 p-2 bg-purple-700/30 rounded-lg">
          <p className="text-sm text-purple-200">
            <span className="font-semibold">Crafting Mastery Active:</span> All recipes require 1 fewer ingredient
            (minimum 1)!
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Recipes</CardTitle>
              <CardDescription>Select a recipe to craft</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="all" className="w-full">
                <TabsList className="grid grid-cols-3 mb-4 overflow-x-auto no-scrollbar">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="available">Available</TabsTrigger>
                  <TabsTrigger value="unavailable">Unavailable</TabsTrigger>
                </TabsList>

                <TabsContent value="all">
                  <div className="space-y-2">
                    {potionRecipes.map((recipe) => {
                      const potion = initialPotions.find((p) => p.id === recipe.potionId)
                      const canCraft = canCraftPotion(recipe)

                      return (
                        <Button
                          key={recipe.id}
                          variant={selectedRecipe?.id === recipe.id ? "default" : "outline"}
                          className="w-full justify-start text-sm sm:text-base py-2 px-3"
                          onClick={() => handleRecipeClick(recipe)}
                        >
                          <div className="flex justify-between w-full items-center">
                            <span className="truncate mr-2">{potion?.name}</span>
                            {canCraft ? (
                              <Badge variant="outline" className="bg-green-900/30 text-xs whitespace-nowrap">
                                Available
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="bg-red-900/30 text-xs whitespace-nowrap">
                                Missing
                              </Badge>
                            )}
                          </div>
                        </Button>
                      )
                    })}
                  </div>
                </TabsContent>

                <TabsContent value="available">
                  <div className="space-y-2">
                    {potionRecipes
                      .filter((recipe) => canCraftPotion(recipe))
                      .map((recipe) => {
                        const potion = initialPotions.find((p) => p.id === recipe.potionId)

                        return (
                          <Button
                            key={recipe.id}
                            variant={selectedRecipe?.id === recipe.id ? "default" : "outline"}
                            className="w-full justify-start text-sm sm:text-base py-2 px-3"
                            onClick={() => handleRecipeClick(recipe)}
                          >
                            <span className="truncate mr-2">{potion?.name}</span>
                          </Button>
                        )
                      })}
                  </div>
                </TabsContent>

                <TabsContent value="unavailable">
                  <div className="space-y-2">
                    {potionRecipes
                      .filter((recipe) => !canCraftPotion(recipe))
                      .map((recipe) => {
                        const potion = initialPotions.find((p) => p.id === recipe.potionId)

                        return (
                          <Button
                            key={recipe.id}
                            variant={selectedRecipe?.id === recipe.id ? "default" : "outline"}
                            className="w-full justify-start text-sm sm:text-base py-2 px-3"
                            onClick={() => handleRecipeClick(recipe)}
                          >
                            <span className="truncate mr-2">{potion?.name}</span>
                          </Button>
                        )
                      })}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2">
          {!isMobile && selectedRecipe ? (
            <Card>
              <CardHeader>
                <CardTitle>{initialPotions.find((p) => p.id === selectedRecipe.potionId)?.name}</CardTitle>
                <CardDescription>
                  {initialPotions.find((p) => p.id === selectedRecipe.potionId)?.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <h3 className="font-semibold mb-2">Required Ingredients:</h3>
                  <ul className="space-y-2">
                    {getAdjustedRecipe(selectedRecipe).ingredients.map((req) => {
                      const ingredient = inventory.ingredients.find((i) => i.id === req.id)
                      const hasEnough = ingredient && ingredient.quantity >= req.quantity
                      const originalReq = selectedRecipe.ingredients.find((i) => i.id === req.id)
                      const isReduced = craftingMasteryActive && originalReq && originalReq.quantity > req.quantity

                      return (
                        <li key={req.id} className="flex justify-between text-sm">
                          <span className="truncate mr-2">
                            {initialIngredients.find((i) => i.id === req.id)?.name} x{req.quantity}
                            {isReduced && (
                              <span className="text-green-400 ml-1">(reduced from {originalReq.quantity})</span>
                            )}
                          </span>
                          <span className={hasEnough ? "text-green-400" : "text-red-400"}>
                            {ingredient ? ingredient.quantity : 0}/{req.quantity}
                          </span>
                        </li>
                      )
                    })}
                  </ul>
                </div>

                <div className="mb-4">
                  <h3 className="font-semibold mb-2">Effect:</h3>
                  <p className="text-purple-300">
                    {initialPotions.find((p) => p.id === selectedRecipe.potionId)?.effect}
                  </p>
                </div>

                <Button className="w-full" disabled={!canCraftPotion(selectedRecipe)} onClick={craftPotion}>
                  Craft Potion
                </Button>
              </CardContent>
            </Card>
          ) : !isMobile ? (
            <div className="h-full flex items-center justify-center">
              <p className="text-purple-400">Select a recipe to view details</p>
            </div>
          ) : null}
        </div>
      </div>

      {/* Mobile Dialog for Recipe Details */}
      {isMobile && (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="bg-purple-900 text-white border-purple-700 max-w-[90vw] sm:max-w-lg">
            {selectedRecipe && (
              <>
                <DialogHeader>
                  <DialogTitle>{initialPotions.find((p) => p.id === selectedRecipe.potionId)?.name}</DialogTitle>
                  <DialogDescription className="text-purple-300">
                    {initialPotions.find((p) => p.id === selectedRecipe.potionId)?.description}
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-sm mb-2">Required Ingredients:</h3>
                    <ul className="space-y-2">
                      {getAdjustedRecipe(selectedRecipe).ingredients.map((req) => {
                        const ingredient = inventory.ingredients.find((i) => i.id === req.id)
                        const hasEnough = ingredient && ingredient.quantity >= req.quantity
                        const originalReq = selectedRecipe.ingredients.find((i) => i.id === req.id)
                        const isReduced = craftingMasteryActive && originalReq && originalReq.quantity > req.quantity

                        return (
                          <li key={req.id} className="flex justify-between text-sm">
                            <span className="truncate mr-2">
                              {initialIngredients.find((i) => i.id === req.id)?.name} x{req.quantity}
                              {isReduced && (
                                <span className="text-green-400 ml-1">(reduced from {originalReq.quantity})</span>
                              )}
                            </span>
                            <span className={hasEnough ? "text-green-400" : "text-red-400"}>
                              {ingredient ? ingredient.quantity : 0}/{req.quantity}
                            </span>
                          </li>
                        )
                      })}
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-semibold text-sm mb-2">Effect:</h3>
                    <p className="text-sm text-purple-200">
                      {initialPotions.find((p) => p.id === selectedRecipe.potionId)?.effect}
                    </p>
                  </div>

                  <DialogFooter>
                    <Button className="w-full" disabled={!canCraftPotion(selectedRecipe)} onClick={craftPotion}>
                      Craft Potion
                    </Button>
                  </DialogFooter>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
