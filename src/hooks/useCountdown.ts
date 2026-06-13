import { useEffect, useState } from 'react'

export interface CountdownValues {
  days: number
  hours: number
  minutes: number
  seconds: number
  expired: boolean
}

export function useCountdown(targetIso: string): CountdownValues {
  const [values, setValues] = useState<CountdownValues>(() => compute(targetIso))

  useEffect(() => {
    const tick = () => setValues(compute(targetIso))
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [targetIso])

  return values
}

function compute(targetIso: string): CountdownValues {
  const diff = Math.max(0, new Date(targetIso).getTime() - Date.now())
  const totalSeconds = Math.floor(diff / 1000)
  return {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
    expired: diff === 0,
  }
}

export function pad(n: number): string {
  return String(n).padStart(2, '0')
}
