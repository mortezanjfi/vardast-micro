"use client"

import { useRouter } from "next/navigation"
import { Button, ButtonProps } from "@vardast/ui/button"
import { AnimatePresence, motion } from "framer-motion"
import { ArrowRight } from "lucide-react"

import Progress from "./Progress"

type Props = {
  title: string
  actionButtonProps?: ButtonProps
}

const BuyBoxNavigation = ({ title, actionButtonProps }: Props) => {
  const router = useRouter()

  return (
    <>
      <div
        className={`fixed bottom-0 left-0 z-50 w-full transform border-t border-alpha-200 bg-alpha-white pb-[calc(env(safe-area-inset-bottom)*0.5+10px)] transition-all duration-300 dark:border-alpha-600  dark:bg-alpha-700`}
        id="bottom-navigation-buy-box"
      >
        <div className="flex gap-x px-8 pt-3">
          <AnimatePresence>
            <motion.div
              animate={{ opacity: 1, x: 0, display: "block" }}
              className="h-full"
              exit={{ opacity: 0, x: 100, display: "none" }}
              initial={{ opacity: 0, x: 100, display: "none" }}
              key="modal"
            >
              <Button
                iconOnly
                onClick={() => {
                  router.back()
                }}
              >
                <ArrowRight className="" />
              </Button>
            </motion.div>
            <motion.div
              animate={{ opacity: 1, x: 0, display: "block" }}
              className="relative h-full flex-1"
              exit={{ opacity: 0, x: -100, display: "none" }}
              initial={{ opacity: 0, x: -100, display: "none" }}
              key="modal"
            >
              <Button
                //   noStyle
                className="btn btn-md btn-primary
                flex
                h-full
                w-full
                items-center
                gap-2
                rounded-lg
                px-4
                py-3
                font-semibold"
                {...actionButtonProps}
              >
                <span className="relative flex flex-col items-center justify-center">
                  {title}
                </span>
              </Button>
              <Progress reverseBg />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </>
  )
}

export default BuyBoxNavigation
