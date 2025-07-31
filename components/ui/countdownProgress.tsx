"use client"
import React, { useEffect, useRef, useState } from "react"
import { Progress } from "@/components/ui/progress"

type CountdownProgressProps = {
  duration: number
  onComplete: () => void
  canPlay: boolean
}

export default function CountdownProgress({
  duration,
  onComplete,
  canPlay = true,
}: CountdownProgressProps) {
  const [value, setValue] = useState(100)
  const startTimeRef = useRef<number | null>(null)
  const animationFrameRef = useRef<number | null>(null)

  useEffect(() => {
    if (!canPlay) {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
        animationFrameRef.current = null
      }
      return
    }
    const animate = (timestamp: number) => {
      if (!startTimeRef.current) {
        startTimeRef.current = timestamp
      }

      const elapsed = timestamp - startTimeRef.current
      const progress = Math.min(elapsed / duration, 1)
      const newValue = 100 - progress * 99

      setValue(newValue)

      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(animate)
      } else {
        setValue(1)
        onComplete()
      }
    }

    animationFrameRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [canPlay, duration, onComplete])

  return <Progress value={value} />
}
