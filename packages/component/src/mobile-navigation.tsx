"use client"

import { useContext } from "react"
import { usePathname, useRouter } from "next/navigation"
import {
  EventTrackerSubjectTypes,
  useCreateEventTrackerMutation
} from "@vardast/graphql/generated"
import { toast } from "@vardast/hook/use-toast"
import mobile_footer_options from "@vardast/lib/mobile_footer_options"
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

import Link from "./Link"
import Progress from "./Progress"
import Search from "./Search"

const MobileNavigation = ({
  back,
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

  const getIsActiveNav = (activePath: string) =>
    pathname.split("/")[1] === activePath.split("/")[1]
  const getActiveClassName = (activePath: string) => {
    const isActiveNav = getIsActiveNav(activePath)

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
        router.replace(`/auth/signin${pathname}`)
        if (
          errors.response.errors?.find(
            (error) => error.extensions?.code === "FORBIDDEN"
          )
        ) {
          router.replace(`/auth/signin${pathname}`)
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
    if (!!session?.data) {
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
    router.replace(`/auth/signin${pathname}`)
  }

  // useEffect(() => {
  //   const appMobileFooter = document?.querySelector("#mobile-navigation-bar")
  //   if (appMobileFooter) {
  //     const hastShortClassNow = appMobileFooter?.querySelector(".short")
  //     if (action) {
  //       if (!hastShortClassNow) {
  //         appMobileFooter?.classList.add("short")
  //       }
  //     } else {
  //       if (hastShortClassNow) {
  //         appMobileFooter?.classList.remove("short")
  //       }
  //     }
  //   }
  // }, [])

  // useEffect(() => {
  //   const appMobileFooter = document?.querySelector("#mobile-navigation-bar")
  //   if (appMobileFooter) {
  //     const hastShortClassNow = appMobileFooter?.querySelector(".short")
  //     const observer = new MutationObserver(() => {
  //       if (action) {
  //         if (!hastShortClassNow) {
  //           appMobileFooter?.classList.add("short")
  //         }
  //       } else {
  //         if (hastShortClassNow) {
  //           appMobileFooter?.classList.remove("short")
  //         }
  //       }
  //     })

  //     observer.observe(appMobileFooter, {
  //       childList: true,
  //       subtree: true,
  //       attributes: true
  //     })

  //     // Clean up the observer on unmount
  //     return () => {
  //       observer.disconnect()
  //     }
  //   }
  // }, [])

  return (
    <>
      {(search || back || action) && (
        <div className="flex gap-x px-8 py-2">
          <AnimatePresence>
            {back && (
              <motion.div
                key="bottom-navigation-back-button"
                initial={{ opacity: 0, x: 100, display: "none" }}
                animate={{ opacity: 1, x: 0, display: "block" }}
                exit={{ opacity: 0, x: 100, display: "none" }}
                className="h-full"
              >
                <Button
                  // variant="ghost"
                  block
                  onClick={() => {
                    router.back()
                  }}
                  iconOnly
                >
                  <ArrowRight className="" />
                </Button>
              </motion.div>
            )}
            {(action || search) && (
              <motion.div
                key="bottom-navigation-content"
                className="w-full transform transition-all delay-300 duration-300"
              >
                {action && (
                  <Button
                    onClick={showSellerContact}
                    loading={
                      createEventTrackerMutation.isLoading ||
                      session?.status === "loading"
                    }
                    disabled={
                      createEventTrackerMutation.isLoading ||
                      session?.status === "loading" ||
                      (!data?.contacts.length && !data?.addresses.length)
                    }
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
      {options && (
        <div className="grid w-full grid-cols-4 bg-alpha-white bg-opacity-5">
          {mobile_footer_options[`${options.name}`].map(
            ({ icon, button, id, title }) => {
              const href = button.value as string
              const ShowedIcon = getIsActiveNav(href)
                ? icon.Active
                : icon.Default
              return (
                <Link
                  key={id}
                  href={href}
                  className={`group inline-flex h-full flex-col items-center justify-center gap-y-0.5 pb-2`}
                >
                  <ShowedIcon
                    className={mergeClasses(
                      "h-7 w-7 transform transition-all",
                      getActiveClassName(href)
                    )}
                  />
                  <p
                    className={mergeClasses(
                      "text-xs font-bold",
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
      )}
    </>
  )
}

export default MobileNavigation
