"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

type TutorialStep =
  | "welcome"
  | "garden-intro"
  | "garden-plant"
  | "garden-wait"
  | "garden-harvest"
  | "crafting-intro"
  | "crafting-select"
  | "crafting-create"
  | "inventory-intro"
  | "inventory-view"
  | "shop-intro"
  | "shop-buy"
  | "trading-intro"
  | "complete"
  | null

interface TutorialContextType {
  tutorialActive: boolean
  currentStep: TutorialStep
  startTutorial: () => void
  skipTutorial: () => void
  nextStep: () => void
  setStep: (step: TutorialStep) => void
  completeTutorial: () => void
  resetTutorial: () => void
}

const TutorialContext = createContext<TutorialContextType | undefined>(undefined)

export function TutorialProvider({ children }: { children: React.ReactNode }) {
  const [tutorialActive, setTutorialActive] = useState(false)
  const [currentStep, setCurrentStep] = useState<TutorialStep>(null)

  // Check if this is a first-time player
  useEffect(() => {
    const tutorialCompleted = localStorage.getItem("tutorialCompleted")
    const savedGameExists = localStorage.getItem("potionGameSave")

    // Auto-start tutorial for new players who haven't completed it
    if (!tutorialCompleted && !savedGameExists) {
      startTutorial()
    }
  }, [])

  const startTutorial = () => {
    setTutorialActive(true)
    setCurrentStep("welcome")
  }

  const skipTutorial = () => {
    setTutorialActive(false)
    setCurrentStep(null)
    localStorage.setItem("tutorialCompleted", "true")
  }

  const nextStep = () => {
    switch (currentStep) {
      case "welcome":
        setCurrentStep("garden-intro")
        break
      case "garden-intro":
        setCurrentStep("garden-plant")
        break
      case "garden-plant":
        setCurrentStep("garden-wait")
        break
      case "garden-wait":
        setCurrentStep("garden-harvest")
        break
      case "garden-harvest":
        setCurrentStep("crafting-intro")
        break
      case "crafting-intro":
        setCurrentStep("crafting-select")
        break
      case "crafting-select":
        setCurrentStep("crafting-create")
        break
      case "crafting-create":
        setCurrentStep("inventory-intro")
        break
      case "inventory-intro":
        setCurrentStep("inventory-view")
        break
      case "inventory-view":
        setCurrentStep("shop-intro")
        break
      case "shop-intro":
        setCurrentStep("shop-buy")
        break
      case "shop-buy":
        setCurrentStep("trading-intro")
        break
      case "trading-intro":
        setCurrentStep("complete")
        break
      case "complete":
        completeTutorial()
        break
      default:
        break
    }
  }

  const setStep = (step: TutorialStep) => {
    setCurrentStep(step)
  }

  const completeTutorial = () => {
    setTutorialActive(false)
    setCurrentStep(null)
    localStorage.setItem("tutorialCompleted", "true")
  }

  const resetTutorial = () => {
    localStorage.removeItem("tutorialCompleted")
    startTutorial()
  }

  return (
    <TutorialContext.Provider
      value={{
        tutorialActive,
        currentStep,
        startTutorial,
        skipTutorial,
        nextStep,
        setStep,
        completeTutorial,
        resetTutorial,
      }}
    >
      {children}
    </TutorialContext.Provider>
  )
}

export function useTutorial() {
  const context = useContext(TutorialContext)
  if (context === undefined) {
    throw new Error("useTutorial must be used within a TutorialProvider")
  }
  return context
}
