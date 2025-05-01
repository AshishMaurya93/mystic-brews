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
  DialogFooter,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Settings, Volume2, VolumeX, Sun, Moon, Trash2 } from "lucide-react"
import { useMobile } from "@/hooks/use-mobile"

interface SettingsMenuProps {
  resetGame: () => void
  resetTutorial: () => void
}

export function SettingsMenu({ resetGame, resetTutorial }: SettingsMenuProps) {
  const [open, setOpen] = useState(false)
  const [confirmReset, setConfirmReset] = useState(false)
  const [settings, setSettings] = useState({
    soundEnabled: true,
    musicEnabled: true,
    soundVolume: 80,
    musicVolume: 60,
    darkMode: true,
    highContrast: false,
    largeText: false,
    difficultyLevel: "normal",
  })
  const isMobile = useMobile()

  const handleSettingChange = (setting: string, value: any) => {
    setSettings((prev) => ({
      ...prev,
      [setting]: value,
    }))
  }

  const handleResetGame = () => {
    resetGame()
    setConfirmReset(false)
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 right-4 sm:top-6 sm:right-6 bg-purple-800/50 hover:bg-purple-700/50 text-white rounded-full z-20"
          aria-label="Settings"
        >
          <Settings className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-purple-900 text-white border-purple-700 max-w-[95vw] sm:max-w-lg max-h-[90vh] overflow-y-auto z-50">
        <DialogHeader>
          <DialogTitle className="text-xl">Game Settings</DialogTitle>
          <DialogDescription className="text-purple-300">Customize your Mystic Brews experience</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="general" className="mt-4">
          <TabsList className="grid grid-cols-3 bg-purple-800/50">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="audio">Audio</TabsTrigger>
            <TabsTrigger value="accessibility">Accessibility</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="mt-4 space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="difficulty" className="text-sm font-medium">
                  Difficulty Level
                </Label>
                <div className="flex gap-2">
                  <Button
                    variant={settings.difficultyLevel === "easy" ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleSettingChange("difficultyLevel", "easy")}
                    className="h-8 px-3"
                  >
                    Easy
                  </Button>
                  <Button
                    variant={settings.difficultyLevel === "normal" ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleSettingChange("difficultyLevel", "normal")}
                    className="h-8 px-3"
                  >
                    Normal
                  </Button>
                  <Button
                    variant={settings.difficultyLevel === "hard" ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleSettingChange("difficultyLevel", "hard")}
                    className="h-8 px-3"
                  >
                    Hard
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="theme" className="text-sm font-medium">
                  Theme
                </Label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleSettingChange("darkMode", !settings.darkMode)}
                  className="h-8 px-3"
                >
                  {settings.darkMode ? (
                    <>
                      <Moon className="h-4 w-4 mr-2" /> Dark
                    </>
                  ) : (
                    <>
                      <Sun className="h-4 w-4 mr-2" /> Light
                    </>
                  )}
                </Button>
              </div>

              <div className="pt-4 border-t border-purple-800">
                <Button variant="outline" onClick={() => resetTutorial()} className="w-full mb-2">
                  Restart Tutorial
                </Button>

                <Button variant="destructive" onClick={() => setConfirmReset(true)} className="w-full">
                  <Trash2 className="h-4 w-4 mr-2" /> Reset Game
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="audio" className="mt-4 space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  {settings.soundEnabled ? <Volume2 className="h-4 w-4 mr-2" /> : <VolumeX className="h-4 w-4 mr-2" />}
                  <Label htmlFor="sound-toggle" className="text-sm font-medium">
                    Sound Effects
                  </Label>
                </div>
                <Switch
                  id="sound-toggle"
                  checked={settings.soundEnabled}
                  onCheckedChange={(checked) => handleSettingChange("soundEnabled", checked)}
                />
              </div>

              {settings.soundEnabled && (
                <div className="space-y-2">
                  <Label htmlFor="sound-volume" className="text-sm font-medium">
                    Sound Volume
                  </Label>
                  <Slider
                    id="sound-volume"
                    min={0}
                    max={100}
                    step={1}
                    value={[settings.soundVolume]}
                    onValueChange={(value) => handleSettingChange("soundVolume", value[0])}
                    className="w-full"
                  />
                </div>
              )}

              <div className="flex items-center justify-between mt-6">
                <div className="flex items-center">
                  {settings.musicEnabled ? <Volume2 className="h-4 w-4 mr-2" /> : <VolumeX className="h-4 w-4 mr-2" />}
                  <Label htmlFor="music-toggle" className="text-sm font-medium">
                    Background Music
                  </Label>
                </div>
                <Switch
                  id="music-toggle"
                  checked={settings.musicEnabled}
                  onCheckedChange={(checked) => handleSettingChange("musicEnabled", checked)}
                />
              </div>

              {settings.musicEnabled && (
                <div className="space-y-2">
                  <Label htmlFor="music-volume" className="text-sm font-medium">
                    Music Volume
                  </Label>
                  <Slider
                    id="music-volume"
                    min={0}
                    max={100}
                    step={1}
                    value={[settings.musicVolume]}
                    onValueChange={(value) => handleSettingChange("musicVolume", value[0])}
                    className="w-full"
                  />
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="accessibility" className="mt-4 space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="high-contrast" className="text-sm font-medium">
                  High Contrast Mode
                </Label>
                <Switch
                  id="high-contrast"
                  checked={settings.highContrast}
                  onCheckedChange={(checked) => handleSettingChange("highContrast", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="large-text" className="text-sm font-medium">
                  Larger Text
                </Label>
                <Switch
                  id="large-text"
                  checked={settings.largeText}
                  onCheckedChange={(checked) => handleSettingChange("largeText", checked)}
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter className="mt-6">
          <Button onClick={() => setOpen(false)} className="bg-white text-purple-900 hover:bg-gray-200">
            Save Settings
          </Button>
        </DialogFooter>
      </DialogContent>

      {/* Confirmation Dialog for Reset Game */}
      {confirmReset && (
        <Dialog open={confirmReset} onOpenChange={setConfirmReset}>
          <DialogContent className="bg-purple-900 text-white border-purple-700 max-w-[90vw] sm:max-w-md z-50">
            <DialogHeader>
              <DialogTitle className="text-xl">Reset Game?</DialogTitle>
              <DialogDescription className="text-purple-300">
                This will delete all your progress and start a new game. This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0">
              <Button variant="destructive" onClick={handleResetGame} className="w-full sm:w-auto">
                Yes, Reset Game
              </Button>
              <Button
                variant="outline"
                onClick={() => setConfirmReset(false)}
                className="w-full sm:w-auto bg-purple-800 hover:bg-purple-700 text-white"
              >
                Cancel
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </Dialog>
  )
}
