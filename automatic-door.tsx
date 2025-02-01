"use client"

import { useState, useEffect } from "react"
import { MoveIcon as Motion, DoorClosed, DoorOpen, AlertTriangle } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export default function AutomaticDoor() {
  const [isOpen, setIsOpen] = useState(false)
  const [motionDetected, setMotionDetected] = useState(false)
  const [isError, setIsError] = useState(false)
  const [isManualOverride, setIsManualOverride] = useState(false)

  // Simulate motion detection
  useEffect(() => {
    if (isManualOverride) return

    const interval = setInterval(() => {
      // Random motion detection simulation
      const randomMotion = Math.random() > 0.7
      setMotionDetected(randomMotion)
    }, 2000)

    return () => clearInterval(interval)
  }, [isManualOverride])

  // Door control logic
  useEffect(() => {
    if (isManualOverride) return

    if (motionDetected && !isError) {
      setIsOpen(true)
      // Auto close after 3 seconds if no motion
      const timeout = setTimeout(() => {
        if (!motionDetected) {
          setIsOpen(false)
        }
      }, 3000)
      return () => clearTimeout(timeout)
    } else if (!motionDetected && !isError) {
      setIsOpen(false)
    }
  }, [motionDetected, isError, isManualOverride])

  // Simulate random errors
  useEffect(() => {
    const interval = setInterval(() => {
      const randomError = Math.random() > 0.9
      setIsError(randomError)
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-gray-100 p-8 flex items-center justify-center">
      <Card className="w-full max-w-2xl p-6 space-y-8">
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold">Automatic Door System</h2>
            <p className="text-muted-foreground">Real-time door status and controls</p>
          </div>
          <div className="flex gap-2">
            <Badge variant={isError ? "destructive" : "secondary"}>{isError ? "System Error" : "System OK"}</Badge>
            <Badge variant={motionDetected ? "default" : "secondary"}>
              {motionDetected ? "Motion Detected" : "No Motion"}
            </Badge>
          </div>
        </div>

        <div className="relative h-64 border-2 rounded-lg overflow-hidden">
          {/* Door Frame */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className={`w-1/2 h-full bg-gray-200 transition-transform duration-1000 transform origin-left
                ${isOpen ? "scale-x-0" : "scale-x-100"}
                ${isError ? "bg-red-100" : ""}`}
            >
              {isOpen ? (
                <DoorOpen className="w-12 h-12 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-gray-500" />
              ) : (
                <DoorClosed className="w-12 h-12 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-gray-500" />
              )}
            </div>
          </div>

          {/* Motion Sensors */}
          <div className="absolute top-4 left-4 animate-pulse">
            <Motion className={`w-6 h-6 ${motionDetected ? "text-green-500" : "text-gray-400"}`} />
          </div>
          <div className="absolute top-4 right-4 animate-pulse">
            <Motion className={`w-6 h-6 ${motionDetected ? "text-green-500" : "text-gray-400"}`} />
          </div>

          {/* Error Indicator */}
          {isError && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
              <AlertTriangle className="w-8 h-8 text-red-500 animate-bounce" />
            </div>
          )}
        </div>

        <div className="flex justify-between items-center">
          <div className="space-y-1">
            <p className="font-medium">Door Status</p>
            <p className="text-sm text-muted-foreground">
              {isOpen ? "Open" : "Closed"} •{isManualOverride ? " Manual Control" : " Automatic Control"}
            </p>
          </div>
          <div className="space-x-2">
            <Button variant="outline" onClick={() => setIsManualOverride(!isManualOverride)}>
              {isManualOverride ? "Enable Auto" : "Manual Override"}
            </Button>
            <Button onClick={() => isManualOverride && setIsOpen(!isOpen)} disabled={!isManualOverride}>
              {isOpen ? "Close Door" : "Open Door"}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}

