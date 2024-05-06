import { useEffect, useState } from "react"

const useCountdown = () => {
  const [secondsLeft, setSecondsLeft] = useState<number>(0)

  const startCountdown = (seconds: number) => {
    setSecondsLeft(seconds)
  }

  useEffect(() => {
    if (secondsLeft <= 0) return

    const timeout = setTimeout(() => {
      setSecondsLeft(secondsLeft - 1)
    }, 1000)

    return () => clearTimeout(timeout)
  }, [secondsLeft])

  return { secondsLeft, startCountdown }
}

export default useCountdown
