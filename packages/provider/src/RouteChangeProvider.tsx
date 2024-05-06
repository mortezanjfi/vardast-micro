"use client"

import {
  createContext,
  Suspense,
  useCallback,
  useContext,
  useEffect,
  useState
} from "react"
import { usePathname, useSearchParams } from "next/navigation"

/** Types */
type RouteChangeContextProps = {
  routeChangeStartCallbacks: Function[]
  routeChangeCompleteCallbacks: Function[]
  onRouteChangeStart: () => void
  onRouteChangeComplete: () => void
}

type CallbackOptions = {
  onRouteChangeStart?: Function
  onRouteChangeComplete?: Function
}

type RouteChangeProviderProps = {
  children: React.ReactNode
}

/** Logic */

const RouteChangeContext = createContext<RouteChangeContextProps>(
  {} as RouteChangeContextProps
)

export const useRouteChangeContext = () => useContext(RouteChangeContext)

function RouteChangeComplete() {
  const { onRouteChangeComplete } = useRouteChangeContext()

  const pathname = usePathname()
  const searchParams = useSearchParams()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => onRouteChangeComplete(), [pathname, searchParams])

  return null
}

export const useRouteChange = (options: CallbackOptions) => {
  const { routeChangeStartCallbacks, routeChangeCompleteCallbacks } =
    useRouteChangeContext()

  useEffect(() => {
    // add callback to the list of callbacks and persist it
    if (options.onRouteChangeStart) {
      routeChangeStartCallbacks.push(options.onRouteChangeStart)
    }
    if (options.onRouteChangeComplete) {
      routeChangeCompleteCallbacks.push(options.onRouteChangeComplete)
    }

    return () => {
      // Find the callback in the array and remove it.
      if (options.onRouteChangeStart) {
        const index = routeChangeStartCallbacks.indexOf(
          options.onRouteChangeStart
        )
        if (index > -1) {
          routeChangeStartCallbacks.splice(index, 1)
        }
      }
      if (options.onRouteChangeComplete) {
        const index = routeChangeCompleteCallbacks.indexOf(
          options.onRouteChangeComplete
        )
        if (index > -1) {
          routeChangeCompleteCallbacks.splice(index, 1)
        }
      }
    }
  }, [options, routeChangeStartCallbacks, routeChangeCompleteCallbacks])
}

export const RouteChangeProvider: React.FC<RouteChangeProviderProps> = ({
  children
}: RouteChangeProviderProps) => {
  const [routeChangeStartCallbacks] = useState<Function[]>([])
  const [routeChangeCompleteCallbacks] = useState<Function[]>([])

  const onRouteChangeStart = useCallback(() => {
    routeChangeStartCallbacks.forEach((callback) => callback())
  }, [routeChangeStartCallbacks])

  const onRouteChangeComplete = useCallback(() => {
    routeChangeCompleteCallbacks.forEach((callback) => callback())
  }, [routeChangeCompleteCallbacks])

  return (
    <RouteChangeContext.Provider
      value={{
        routeChangeStartCallbacks,
        routeChangeCompleteCallbacks,
        onRouteChangeStart,
        onRouteChangeComplete
      }}
    >
      {children}
      <Suspense>
        <RouteChangeComplete />
      </Suspense>
    </RouteChangeContext.Provider>
  )
}
