"use client"

import { useContext, useMemo } from "react"
import { usePathname, useRouter } from "next/navigation"
import {
  EventTrackerSubjectTypes,
  useCreateEventTrackerMutation
} from "@vardast/graphql/generated"
import useIsCurrentPath from "@vardast/hook/use-is-current-path"
import { toast } from "@vardast/hook/use-toast"
import mobile_footer_options from "@vardast/lib/mobile_footer_options"
import paths from "@vardast/lib/paths"
import { PublicContext } from "@vardast/provider/PublicProvider"
import graphqlRequestClient from "@vardast/query/queryClients/graphqlRequestClient"
import { mergeClasses } from "@vardast/tailwind-config/mergeClasses"
import { ILayoutMobileFooter } from "@vardast/type/layout"
import { Button } from "@vardast/ui/button"
import { AnimatePresence, motion } from "framer-motion"
import { ClientError } from "graphql-request"
import { useAtom, useSetAtom } from "jotai"
import { ArrowRight } from "lucide-react"
import { useSession } from "next-auth/react"

import DynamicHeroIcon from "./DynamicHeroIcon"
import Link from "./Link"
import Progress from "./Progress"
import Search from "./Search"

const MobileNavigation = ({
  back: propsBack,
  action,
  options,
  search
}: ILayoutMobileFooter) => {
  const session = useSession()
  const router = useRouter()
  const pathname = usePathname()
  const { contactModalVisibilityAtom, contactModalDataAtom } =
    useContext(PublicContext)
  const setOpen = useSetAtom(contactModalVisibilityAtom)
  const [{ data, type, title }] = useAtom(contactModalDataAtom)
  const back = Array.isArray(propsBack)
    ? useIsCurrentPath(propsBack)
    : propsBack

  const getIsActiveNav = (path: string) => {
    if (path === "/" && pathname !== "/") {
      return false
    }

    const pathSplit = path.split("/").filter(Boolean).join("")
    const pathnameSplit = pathname.split("/").filter(Boolean).join("")

    if (pathnameSplit > pathSplit) {
      if (pathnameSplit.startsWith(pathSplit)) {
        return true
      }
    } else if (pathSplit === pathnameSplit) {
      return true
    }

    return false
  }

  const getActiveClassName = (activePath: string | string[]) => {
    const isActiveNav = Array.isArray(activePath)
      ? activePath.some((item) => getIsActiveNav(item))
      : getIsActiveNav(activePath)

    return isActiveNav
      ? "text-primary-600 dark:text-primary-500"
      : "text-alpha-500 dark:text-alpha-900"
  }

  const createEventTrackerMutation = useCreateEventTrackerMutation(
    graphqlRequestClient(session?.data),
    {
      onSuccess: () => {
        setOpen(true)
      },
      onError: (errors: ClientError) => {
        router.replace(`${paths.signin}?ru=${pathname}`)
        if (
          errors.response.errors?.find(
            (error) => error.extensions?.code === "FORBIDDEN"
          )
        ) {
          router.replace(`${paths.signin}?ru=${pathname}`)
        } else {
          toast({
            description: (
              errors.response.errors?.at(0)?.extensions
                .displayErrors as string[]
            ).map((error) => error),
            duration: 8000,
            variant: "default"
          })
        }
      }
    }
  )

  const showSellerContact = () => {
    if (session?.data) {
      createEventTrackerMutation.mutate({
        createEventTrackerInput: {
          type,
          subjectType: EventTrackerSubjectTypes.ContactInfo,
          subjectId: data?.contacts?.at(0)?.id || 0,
          url: window.location.href
        }
      })
      return
    }
    router.replace(`${paths.signin}?ru=${pathname}`)
  }

  const navigationItems = useMemo(() => {
    return options ? (
      <div className="grid h-14 w-full grid-cols-4 bg-alpha-white bg-opacity-5">
        {mobile_footer_options[`${options.name}`].map(
          ({ button, id, title, icon }) => {
            const href = button.value as string | string[]
            const isActive = Array.isArray(href)
              ? href.some((item) => getIsActiveNav(item))
              : getIsActiveNav(href)

            const hrefLink = Array.isArray(href) ? href?.at(0) : href

            return (
              <Link
                className={`group inline-flex h-full flex-col items-center justify-center gap-y-0.5 pb-2`}
                href={hrefLink}
                key={id}
              >
                <DynamicHeroIcon
                  className={mergeClasses(
                    "icon h-7 w-7 transform transition-all",
                    isActive ? "text-primary-600" : "text-alpha-500"
                  )}
                  icon={icon}
                  solid={isActive}
                />
                <p
                  className={mergeClasses(
                    "pt-1 text-xs font-bold",
                    getActiveClassName(href)
                  )}
                >
                  {title}
                </p>
              </Link>
            )
          }
        )}
      </div>
    ) : null
  }, [pathname])

  return (
    <>
      {(search || back || action) && (
        <div className="flex h-16 gap-x px-8 py-2">
          <AnimatePresence>
            {back && (
              <motion.div
                animate={{ opacity: 1, x: 0, display: "block" }}
                className="h-full"
                exit={{ opacity: 0, x: 100, display: "none" }}
                initial={{ opacity: 0, x: 100, display: "none" }}
                key="bottom-navigation-back-button"
              >
                <Button
                  // variant="ghost"
                  block
                  iconOnly
                  onClick={() => {
                    router.back()
                  }}
                >
                  <ArrowRight className="" />
                </Button>
              </motion.div>
            )}
            {(action || search) && (
              <motion.div
                className="w-full transform transition-all delay-300 duration-300"
                key="bottom-navigation-content"
              >
                {action && (
                  <Button
                    className="btn btn-md btn-primary
                            relative
                            flex
                            h-full
                            w-full
                            items-center
                            gap-2
                            rounded-lg
                            px-4
                            py-3
                            font-semibold"
                    disabled={
                      createEventTrackerMutation.isLoading ||
                      session?.status === "loading" ||
                      (!data?.contacts.length && !data?.addresses.length)
                    }
                    loading={
                      createEventTrackerMutation.isLoading ||
                      session?.status === "loading"
                    }
                    onClick={showSellerContact}
                  >
                    <span className="relative flex flex-col items-center justify-center">
                      {title}
                    </span>
                    <Progress reverseBg />
                  </Button>
                )}
                {search && <Search isMobileView={true} />}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
      {navigationItems}
    </>
  )
}

export default MobileNavigation
