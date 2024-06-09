import { PropsWithChildren, Suspense } from "react"
import LayoutProvider from "@vardast/provider/LayoutProvider"
import { ILayoutProps } from "@vardast/type/layout"
import { CheckIsMobileView } from "@vardast/util/checkIsMobileView"
import { clsx } from "clsx"

import Breadcrumb from "../Breadcrumb"
import DesktopFooter from "../desktop/DesktopFooter"
import DesktopHeader from "../desktop/DesktopHeader"
import PageBanner from "../desktop/PageBanner"
import MobileHeader from "../header/MobileHeader"
import MobileScrollProvider from "../header/MobileScrollProvider"
import MobileNavigation from "../mobile-navigation"
import { SearchActionModal } from "../Search"
import Sidebar from "../Sidebar"

export default function withLayout<T>(
  Component: React.FC<PropsWithChildren<T>>,
  layout: ILayoutProps
) {
  return async (props: T) => {
    const isMobileView = await CheckIsMobileView()

    return (
      <LayoutProvider>
        {isMobileView ? (
          <>
            <SearchActionModal isMobileView />
            <div className="app-header-ghost mobile"></div>
            {layout?.mobile?.header && (
              <header id="mobile-header-navbar" className="app-header mobile">
                <MobileHeader {...layout?.mobile?.header} />
              </header>
            )}
            {layout?.mobile?.sidebar && (
              <Sidebar {...layout?.mobile?.sidebar} />
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
                {layout?.mobile?.main?.page_header && <PageBanner />}
                <Component {...{ ...props, ...layout?.desktop?.main }} />
              </MobileScrollProvider>
            </main>
            {layout?.mobile?.footer && (
              <>
                <footer
                  id="mobile-navigation-bar"
                  className="app-footer mobile"
                >
                  <MobileNavigation {...layout?.mobile?.footer} />
                </footer>
                {(layout?.mobile?.footer?.search ||
                  layout?.mobile?.footer?.back ||
                  layout?.mobile?.footer?.action) && (
                  <div className={clsx("h-16 w-full bg-transparent")}></div>
                )}
                {layout?.mobile?.footer?.options && (
                  <div className={clsx("h-14 w-full bg-transparent")}></div>
                )}
              </>
            )}
          </>
        ) : (
          <>
            <div className="app-header-ghost desktop"></div>
            {layout?.desktop?.header && (
              <header className="app-header desktop">
                <DesktopHeader {...layout?.desktop?.header} />
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
              {layout?.desktop?.main?.page_header && <PageBanner />}
              <div
                className={clsx(
                  "app-layout desktop",
                  layout?.desktop?.main?.page_header && "pt-6"
                )}
              >
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
