import React, { PropsWithChildren } from "react"
import clsx from "clsx"

interface IMobileBaseLayout extends PropsWithChildren {
  noStyle?: boolean | string
  limitWidth?: boolean
  bgWhite?: boolean
  spaceLess?: boolean
  fullHeight?: boolean
  extraPadding?: boolean
  isMobileView?: boolean
  background?: boolean
  container?: boolean
  gap?: boolean
  isAuth?: boolean
}

const MobileBaseLayout: React.FC<IMobileBaseLayout> = ({
  noStyle,
  limitWidth,
  bgWhite,
  spaceLess,
  container = true,
  extraPadding,
  fullHeight,
  background,
  gap,
  children,
  isMobileView,
  isAuth
}) => {
  if (isMobileView) {
    return (
      <div
        className={
          noStyle === true
            ? ""
            : clsx(
                noStyle,
                limitWidth && !isMobileView ? "max-w-md" : "w-full",
                bgWhite && "bg-alpha-white",
                fullHeight &&
                  "h-full pb-[calc(env(safe-area-inset-bottom)*0.5+10px)]",
                spaceLess ? "" : "gap-y px-3.5 py",
                "m-auto flex flex-1 flex-col",
                gap && "gap-y-1"
              )
        }
      >
        {children}
      </div>
    )
  }

  return (
    // <div
    //   className={clsx(
    //     "flex h-full w-full flex-1 flex-col",
    //     spaceLess ? "" : "gap p",
    //     limitWidth ? "max-w-md" : "w-full",
    //     background && "bg-[url('/images/background.svg')]",
    //     extraPadding && "py-20"
    //   )}
    // >
    //   <div
    //     className={clsx(
    //       container && "mx-auto w-full md:container",
    //       isAuth &&
    //         "flex h-full w-full items-center justify-center md:container"
    //     )}
    //   >
    //     {children}
    //   </div>
    // </div>
    <>{children}</>
  )
}

export default MobileBaseLayout
