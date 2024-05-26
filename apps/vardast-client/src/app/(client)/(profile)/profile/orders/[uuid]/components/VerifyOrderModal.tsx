/* eslint-disable no-unused-vars */
"use client"

import { Dispatch, SetStateAction } from "react"
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogFooter
} from "@vardast/ui/alert-dialog"
import { Button } from "@vardast/ui/button"
import { LucideAlertOctagon } from "lucide-react"
import useTranslation from "next-translate/useTranslation"

type VerifyOrderModalProps = {
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
  onVerify: (_?: any) => void
}

const VerifyOrderModal = ({
  open,
  setOpen,
  onVerify
}: VerifyOrderModalProps) => {
  const { t } = useTranslation()

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <div className="flex flex-col">
          <div className="flex flex-1 items-center gap">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-600 dark:bg-red-800/20">
              <LucideAlertOctagon className="h-6 w-6" />
            </span>
            <p className="my-4 leading-loose">
              آیا از تایید اطلاعات اطمینان دارید؟
            </p>
          </div>
          <div>
            <AlertDialogFooter>
              <div className="flex items-center gap-2">
                <Button variant="ghost" onClick={() => setOpen(false)}>
                  {t("common:cancel")}
                </Button>
                <Button variant="danger" onClick={onVerify}>
                  {t("common:sure")}
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
