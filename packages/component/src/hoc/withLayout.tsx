import { PropsWithChildren, Suspense } from "react"
import LayoutProvider from "@vardast/provider/LayoutProvider"
import { ILayoutProps, ILayoutTitle } from "@vardast/type/layout"
import { CheckIsMobileView } from "@vardast/util/checkIsMobileView"
import { clsx } from "clsx"

import Breadcrumb from "../Breadcrumb"
import DesktopFooter from "../desktop/DesktopFooter"
import DesktopHeader from "../desktop/DesktopHeader"
import MobileHeader from "../header/MobileHeader"
import MobileScrollProvider from "../header/MobileScrollProvider"
import MobileNavigation from "../mobile-navigation"
import Sidebar from "../Sidebar"

export default function withLayout<T>(
  Component: React.FC<PropsWithChildren<T>>,
  layout: ILayoutProps
) {
  return async (props: T & { params?: string[] }) => {
    const isMobileView = await CheckIsMobileView()
    const headerTitle = layout?.mobile?.header?.title
    const propsTitle =
      Object.values(props?.params)?.at(0)?.at(1) &&
      decodeURI(Object.values(props?.params)?.at(0)?.at(1))
    let title: ILayoutTitle<"text" | "image"> = headerTitle ?? {
      type: "text",
      value: propsTitle
    }

    return (
      <LayoutProvider>
        {isMobileView ? (
          <>
            {layout?.mobile?.header && (
              <header id="mobile-header-navbar" className="app-header mobile">
                <MobileHeader {...{ ...layout?.mobile?.header, title }} />
              </header>
            )}
            <main
              className={clsx(
                "app-layout mobile",
                layout?.mobile?.main?.background?.value
              )}
            >
              <MobileScrollProvider>
                {layout?.mobile?.main?.breadcrumb && (
                  <Suspense>
                    <Breadcrumb />
                  </Suspense>
                )}
                <Component {...{ ...props, ...layout?.mobile?.main }} />
              </MobileScrollProvider>
            </main>
            {layout?.mobile?.footer && (
              <footer id="mobile-navigation-bar" className="app-footer mobile">
                <MobileNavigation {...layout?.mobile?.footer} />
              </footer>
            )}
          </>
        ) : (
          <>
            <div className="app-header-ghost"></div>
            {layout?.desktop?.header && (
              <header className="app-header desktop">
                <DesktopHeader {...{ ...layout?.desktop?.header, title }} />
              </header>
            )}
            <main
              className={clsx(
                "app-inner desktop",
                layout?.desktop?.main?.container && "container"
              )}
            >
              {layout?.desktop?.main?.breadcrumb && (
                <Suspense>
                  <Breadcrumb />
                </Suspense>
              )}
              <div className={clsx("app-layout desktop")}>
                {layout?.desktop?.sidebar && (
                  <Sidebar {...layout?.desktop?.sidebar} />
                )}
                <div
                  className={clsx(
                    "app-content desktop",
                    layout?.desktop?.sidebar && "pr-6"
                  )}
                >
                  <Component {...{ ...props, ...layout?.desktop?.main }} />
                </div>
              </div>
            </main>
            {layout?.desktop?.footer && (
              <footer className="app-footer desktop">
                <DesktopFooter {...layout?.desktop?.footer} />
              </footer>
            )}
          </>
        )}
      </LayoutProvider>
    )
  }
}
