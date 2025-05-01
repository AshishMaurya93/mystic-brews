"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { CheckCircle, Circle, Star } from "lucide-react"
import { useMobile } from "@/hooks/use-mobile"

export interface Task {
  id: string
  title: string
  description: string
  reward: number
  completed: boolean
  progress: number
  target: number
  type: "craft" | "harvest" | "sell" | "buy"
}

interface DailyTasksProps {
  daysPassed: number
  updateGold: (amount: number) => void
  completedTasks: Task[]
  updateCompletedTasks: (tasks: Task[]) => void
  onTaskProgressUpdate: (taskId: string, progress: number) => void
}

export default function DailyTasks({
  daysPassed,
  updateGold,
  completedTasks,
  updateCompletedTasks,
  onTaskProgressUpdate,
}: DailyTasksProps) {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [dailyTasks, setDailyTasks] = useState<Task[]>([])
  const isMobile = useMobile()

  // Generate daily tasks based on the day
  useEffect(() => {
    const taskTypes = ["craft", "harvest", "sell", "buy"]
    const newTasks: Task[] = []

    // Generate 3 random tasks for the day
    for (let i = 0; i < 3; i++) {
      const taskType = taskTypes[Math.floor(Math.random() * taskTypes.length)]
      const taskId = `task_${daysPassed}_${i}`

      // Check if this task was already completed today
      const existingTask = completedTasks.find((task) => task.id === taskId)

      if (existingTask) {
        newTasks.push(existingTask)
        continue
      }

      const task: Task = {
        id: taskId,
        title: "",
        description: "",
        reward: 0,
        completed: false,
        progress: 0,
        target: 0,
        type: taskType as any,
      }

      // Set task details based on type
      switch (taskType) {
        case "craft":
          task.title = "Master Brewer"
          task.description = `Craft ${3 + Math.floor(daysPassed / 5)} potions`
          task.target = 3 + Math.floor(daysPassed / 5)
          task.reward = 20 + daysPassed * 2
          break
        case "harvest":
          task.title = "Green Thumb"
          task.description = `Harvest ${4 + Math.floor(daysPassed / 4)} ingredients`
          task.target = 4 + Math.floor(daysPassed / 4)
          task.reward = 15 + daysPassed * 2
          break
        case "sell":
          task.title = "Merchant"
          task.description = `Sell items worth ${50 + daysPassed * 10} gold`
          task.target = 50 + daysPassed * 10
          task.reward = 25 + daysPassed * 3
          break
        case "buy":
          task.title = "Collector"
          task.description = `Buy ${2 + Math.floor(daysPassed / 6)} different items`
          task.target = 2 + Math.floor(daysPassed / 6)
          task.reward = 15 + daysPassed * 2
          break
      }

      newTasks.push(task)
    }

    setDailyTasks(newTasks)
  }, [daysPassed, completedTasks])

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task)
    if (isMobile) {
      setDialogOpen(true)
    }
  }

  const claimReward = (task: Task) => {
    if (!task.completed) return

    // Update gold
    updateGold(task.reward)

    // Mark as claimed
    const updatedTasks = completedTasks.map((t) => (t.id === task.id ? { ...t, claimed: true } : t))

    updateCompletedTasks(updatedTasks)

    // Close dialog on mobile
    if (isMobile) {
      setDialogOpen(false)
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-2">Daily Tasks</h2>
      <p className="text-purple-300 mb-4">Complete tasks to earn extra gold and rewards.</p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {dailyTasks.map((task) => (
          <Card
            key={task.id}
            className={`cursor-pointer hover:bg-purple-800/20 ${task.completed ? "border-green-500" : ""}`}
            onClick={() => handleTaskClick(task)}
          >
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{task.title}</CardTitle>
                {task.completed ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <Circle className="h-5 w-5 text-gray-500" />
                )}
              </div>
              <CardDescription>{task.description}</CardDescription>
            </CardHeader>
            <CardContent className="pb-2">
              <Progress value={(task.progress / task.target) * 100} className="h-2 mb-2" />
              <p className="text-xs text-right text-purple-300">
                {task.progress} / {task.target}
              </p>
            </CardContent>
            <CardFooter className="pt-0">
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center">
                  <Star className="h-4 w-4 text-yellow-500 mr-1" />
                  <span className="text-yellow-400">{task.reward} gold</span>
                </div>
                {task.completed && !task.claimed && (
                  <Badge className="bg-green-700 hover:bg-green-600">Ready to claim</Badge>
                )}
                {task.claimed && <Badge variant="outline">Claimed</Badge>}
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Mobile Dialog for Task Details */}
      {isMobile && (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="bg-purple-900 text-white border-purple-700 max-w-[90vw] sm:max-w-lg">
            {selectedTask && (
              <>
                <DialogHeader>
                  <DialogTitle>{selectedTask.title}</DialogTitle>
                  <DialogDescription className="text-purple-300">{selectedTask.description}</DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                  <div>
                    <Progress value={(selectedTask.progress / selectedTask.target) * 100} className="h-3 mb-2" />
                    <p className="text-sm text-center text-purple-200">
                      {selectedTask.progress} / {selectedTask.target}
                    </p>
                  </div>

                  <div className="bg-purple-800/30 p-3 rounded-md">
                    <h3 className="font-semibold text-sm mb-1">Reward</h3>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-500 mr-1" />
                      <span className="text-yellow-400">{selectedTask.reward} gold</span>
                    </div>
                  </div>

                  {selectedTask.completed && !selectedTask.claimed && (
                    <Button
                      onClick={() => claimReward(selectedTask)}
                      className="w-full bg-green-700 hover:bg-green-600"
                    >
                      Claim Reward
                    </Button>
                  )}

                  {selectedTask.claimed && <div className="text-center text-green-400">Reward already claimed</div>}

                  {!selectedTask.completed && (
                    <div className="text-center text-purple-300">Complete the task to claim your reward</div>
                  )}
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
