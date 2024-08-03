import { useMemo, useState } from "react"
import { useQueryState, UseQueryStateOptions } from "next-usequerystate"

interface IUseSegmentTab<T> {
  paramName?: string
  defaultValue?: NonNullable<T>
}

const useSegmentTab = <T extends string>({
  paramName = "",
  defaultValue
}: IUseSegmentTab<T> = {}) => {
  const queryStateOptions: UseQueryStateOptions<T> & { defaultValue: T } = {
    defaultValue: defaultValue as T,
    clearOnDefault: true,
    parse: (value: string) => value as T,
    serialize: (value: T) => value as unknown as string
  }

  const [queryState, setQueryState] = paramName
    ? useQueryState<T>(paramName, queryStateOptions)
    : [defaultValue as T, (_: T) => {}]

  const [tabState, setTabState] = useState<T>(defaultValue as T)

  const onValueChange = (value: T) => {
    if (paramName) {
      setQueryState(value)
    }
    setTabState(value)
  }

  const activeTab: T = useMemo(() => {
    return paramName ? queryState : tabState
  }, [paramName, queryState, tabState])

  return { activeTab, onValueChange }
}

export { useSegmentTab }
