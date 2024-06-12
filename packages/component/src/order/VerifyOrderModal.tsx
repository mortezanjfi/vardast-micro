/* eslint-disable no-unused-vars */
"use client"

import { Dispatch, SetStateAction } from "react"
import { LucideAlertOctagon } from "lucide-react"
import useTranslation from "next-translate/useTranslation"

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogFooter
} from "../../../ui/src/alert-dialog"
import { Button } from "../../../ui/src/button"

type VerifyOrderModalProps = {
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
  onVerify: (_?: any) => void
  description?: string
}

const VerifyOrderModal = ({
  open,
  setOpen,
  description,
  onVerify
}: VerifyOrderModalProps) => {
  const { t } = useTranslation()

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <div className="flex flex-col">
          <div className="flex flex-1 items-center gap">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-warning dark:bg-red-800/20">
              <LucideAlertOctagon className="h-6 w-6" />
            </span>
            <h4 className="my-4 leading-loose">آیا مطمئن هستید؟</h4>
            <p className="my-4 leading-loose">{description}</p>
          </div>
          <div>
            <AlertDialogFooter>
              <div className="flex items-center gap-2">
                <Button variant="secondary" onClick={() => setOpen(false)}>
                  {t("common:no")}
                </Button>
                <Button variant="primary" onClick={onVerify}>
                  {t("common:yes")}
                </Button>
              </div>
            </AlertDialogFooter>
          </div>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default VerifyOrderModal
