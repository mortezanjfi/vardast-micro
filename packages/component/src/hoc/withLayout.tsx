import { PropsWithChildren, Suspense } from "react"
import dynamic from "next/dynamic"
import LayoutProvider from "@vardast/provider/LayoutProvider"
import PageLoadingProvider from "@vardast/provider/PageLoadingProvider"
import { ILayoutProps } from "@vardast/type/layout"
import { CheckIsMobileView } from "@vardast/util/checkIsMobileView"
import { clsx } from "clsx"

import Breadcrumb from "../Breadcrumb"
import DesktopFooter from "../desktop/DesktopFooter"
import DesktopHeader from "../desktop/DesktopHeader"
import PageBanner from "../desktop/PageBanner"
import MobileScrollProvider from "../header/MobileScrollProvider"
import MobileNavigation from "../mobile-navigation"
import { MotionSection } from "../motion/Motion"
import { SearchActionModal } from "../Search"
import Sidebar from "../Sidebar"

const MobileHeader = dynamic(() => import("../header/MobileHeader"), {
  ssr: true // Disable server-side rendering for this component
})

export default function withLayout<T>(
  Component: React.FC<PropsWithChildren<T>>,
  layout: ILayoutProps
) {
  return async (props: T) => {
    const isMobileView = await CheckIsMobileView()
    const height =
      (layout?.mobile?.footer?.search ||
      layout?.mobile?.footer?.back ||
      layout?.mobile?.footer?.action
        ? 4
        : 0) + (layout?.mobile?.footer?.options ? 3.5 : 0)

    return (
      <LayoutProvider>
        <PageLoadingProvider />
        {isMobileView ? (
          <>
            <SearchActionModal isMobileView />
            <div
              className={clsx("app mobile")}
              style={{
                paddingBottom: `calc(${height}rem + env(safe-area-inset-bottom) * 0.4)`
              }}
            >
              {layout?.mobile?.header && (
                <>
                  <div>
                    <div className="app-header-ghost mobile"></div>
                    <header
                      className="app-header mobile"
                      id="mobile-header-navbar"
                    >
                      <MobileHeader
                        {...layout?.mobile?.header}
                        key={
                          layout?.mobile?.header?.title?.value ?? Math.random()
                        }
                      />
                    </header>
                  </div>
                </>
              )}
              {layout?.mobile?.sidebar && (
                <Sidebar {...layout?.mobile?.sidebar} />
              )}
              <main
                className={clsx(
                  "app-inner mobile",
                  layout?.mobile?.main?.background?.value
                )}
              >
                <div className="app-layout mobile">
                  <MobileScrollProvider>
                    {layout?.mobile?.main?.breadcrumb && (
                      <Suspense>
                        <Breadcrumb />
                      </Suspense>
                    )}
                    {layout?.mobile?.main?.page_header && <PageBanner />}
                    <Component {...{ ...props, ...layout?.desktop?.main }} />
                  </MobileScrollProvider>
                </div>
              </main>
              {layout?.mobile?.footer && (
                <footer
                  className="app-footer mobile"
                  id="mobile-navigation-bar"
                >
                  <MobileNavigation {...layout?.mobile?.footer} />
                </footer>
                // <div>
                //   {(layout?.mobile?.footer?.search ||
                //     layout?.mobile?.footer?.back ||
                //     layout?.mobile?.footer?.action) && (
                //     <div className={clsx("h-16 w-full bg-transparent")}></div>
                //   )}
                //   {layout?.mobile?.footer?.options && (
                //     <div className={clsx("h-14 w-full bg-transparent")}></div>
                //   )}
                // </div>
              )}
            </div>
          </>
        ) : (
          <div className="app desktop">
            {layout?.desktop?.header && (
              <header className="app-header-ghost desktop">
                <div className="app-header desktop">
                  <DesktopHeader {...layout?.desktop?.header} />
                </div>
              </header>
            )}
            <main
              className={clsx(
                "app-inner desktop",
                layout?.desktop?.main?.container && "container"
              )}
            >
              {layout?.desktop?.breadcrumb && (
                <Suspense>
                  <Breadcrumb />
                </Suspense>
              )}
              {layout?.desktop?.main?.page_header && <PageBanner />}
              <div
                className={clsx(
                  "app-layout desktop",
                  !layout?.desktop?.breadcrumb &&
                    layout?.desktop?.sidebar &&
                    "pt-6",
                  layout?.desktop?.main?.page_header && "pt-6"
                )}
              >
                {layout?.desktop?.sidebar && (
                  <Sidebar
                    {...layout?.desktop?.sidebar}
                    withHeader={!!layout?.desktop?.header}
                  />
                )}
                <MotionSection
                  animate="enter" // Animated state to variants.enter
                  className={clsx(
                    "app-content desktop",
                    layout?.desktop?.sidebar ? "pr-6" : "pr-0.5"
                  )}
                  exit="exit" // Exit state (used later) to variants.exit
                  initial="hidden" // Set the initial state to variants.hidden
                  transition={{ type: "linear" }} // Set the transition to linear
                  variants={{
                    hidden: { opacity: 0 },
                    enter: { opacity: 1 }
                  }}
                >
                  {layout?.desktop?.main?.breadcrumb && (
                    <Suspense>
                      <Breadcrumb />
                    </Suspense>
                  )}
                  <Component {...{ ...props, ...layout?.desktop?.main }} />
                </MotionSection>
              </div>
            </main>
            {layout?.desktop?.footer && (
              <footer className="app-footer desktop">
                <DesktopFooter {...layout?.desktop?.footer} />
              </footer>
            )}
          </div>
        )}
      </LayoutProvider>
    )
  }
}
