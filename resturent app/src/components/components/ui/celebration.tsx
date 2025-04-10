"use client"

import { useEffect } from "react"
import { Button } from "./button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./dialog"
import "../style/celebration.css"

interface CelebrationDialogProps {
  showCelebration: boolean
  setShowCelebration: (show: boolean) => void
}

export function CelebrationDialog({ showCelebration, setShowCelebration }: CelebrationDialogProps) {
  // Reset animation when dialog opens
  useEffect(() => {
    if (showCelebration) {
      const confettiElements = document.querySelectorAll(".confetti")
      confettiElements.forEach((element: any) => {
        // Force a reflow to restart the animation
        element.classList.remove("confetti")
        void element.offsetWidth
        element.classList.add("confetti")
      })
    }
  }, [showCelebration])

  // Generate random positions for confetti
  const generateConfetti = () => {
    return [...Array(50)].map((_, i) => {
      const left = `${Math.random() * 100}%`
      const animationDelay = `${Math.random() * 2}s`
      const animationDuration = `${2 + Math.random() * 2}s`

      return (
        <div
          key={i}
          className={`confetti confetti-${i % 10}`}
          style={{
            left,
            animationDelay,
            animationDuration,
          }}
        />
      )
    })
  }

  return (
    <Dialog open={showCelebration} onOpenChange={setShowCelebration}>
      <DialogContent className="sm:max-w-[500px] text-center">
        <div className="celebration-animation">
          <div className="confetti-container">{generateConfetti()}</div>
        </div>
        <DialogHeader className="pt-8">
          <DialogTitle className="text-2xl">Congratulations!</DialogTitle>
          <DialogDescription className="text-lg pt-2">
            You've made an excellent choice! Your order is on its way.
          </DialogDescription>
        </DialogHeader>
        <div className="py-6">
          <p className="text-muted-foreground">Thank you for your order. We hope you enjoy your meal!</p>
        </div>
        <DialogFooter>
          <Button onClick={() => setShowCelebration(false)} className="w-full">
            Continue Shopping
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
