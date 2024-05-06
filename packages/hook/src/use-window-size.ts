import { useEffect, useState } from "react"

type WindowSize = {
  width?: number
  height?: number
}

// Hook
const useWindowSize = () => {
  // Initialize state with undefined width/height so server and client renders match
  // Learn more here: https://joshwcomeau.com/react/the-perils-of-rehydration/
  const [windowSize, setWindowSize] = useState<WindowSize>({
    width: undefined,
    height: undefined
  })

  useEffect(() => {
    // only execute all the code below in client side
    // Handler to call on window resize
    function handleResize() {
      // Check if window is defined (for server-side rendering)
      if (typeof window !== "undefined") {
        // Set window width/height to state
        setWindowSize({
          width: window.innerWidth,
          height: window.innerHeight
        })
      }
    }

    // Add event listener
    if (typeof window !== "undefined") {
      window.addEventListener("resize", handleResize)

      // Call handler right away so state gets updated with initial window size
      handleResize()

      // Remove event listener on cleanup
      return () => window.removeEventListener("resize", handleResize)
    }
  }, []) // Empty array ensures that effect is only run on mount

  return {
    width: windowSize.width ? windowSize.width : 100,
    height: windowSize.height ? windowSize.height : 100
  }
}

export default useWindowSize
