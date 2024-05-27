"use client"

import useIsCurrentPath from "@vardast/hook/use-is-current-path"

import Search from "../Search"

interface MobileSearchBarProps {
  isMobileView: boolean
}

export const MobileSearchBar: React.FC<MobileSearchBarProps> = ({
  isMobileView
}) => {
  const isCurrentPath = useIsCurrentPath([
    { path: "", forceEqual: false },
    { path: "profile", forceEqual: false }
  ])

  if (isCurrentPath) {
    return null
  }

  return (
    <>
      <div className="fixed bottom-0 left-0 z-50 flex h-[calc(128px+env(safe-area-inset-bottom))] w-full flex-col gap-4 border-t border-alpha-200 bg-alpha-100 px py-2 dark:border-alpha-600 dark:bg-alpha-700">
        <Search isMobileView={isMobileView} />
      </div>
    </>
  )
}
