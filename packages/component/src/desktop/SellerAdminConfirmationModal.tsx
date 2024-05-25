"use client"

import { Dispatch, SetStateAction } from "react"
import { CheckCircleIcon } from "@heroicons/react/24/outline"
import { Button } from "@vardast/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader
} from "@vardast/ui/dialog"
import useTranslation from "next-translate/useTranslation"

type Props = {
  onSubmit: Function
  content: string
  open: boolean
  onOpenChange: Dispatch<SetStateAction<boolean>>
  setIsResponsible: Dispatch<SetStateAction<boolean>>
}

function SellerAdminConfirmationModal({
  onSubmit,
  open,
  onOpenChange,
  content,
  setIsResponsible
}: Props) {
  const { t } = useTranslation()

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader className=" pb">
          <span className="flex gap-5">
            {" "}
            <CheckCircleIcon width={22} height={22} className="text-success" />
            آیا مطمئن هستید؟
          </span>
        </DialogHeader>

        <p className="my-4 leading-loose">{content}</p>
        <DialogFooter>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              onClick={() => {
                onOpenChange(false), setIsResponsible(false)
              }}
            >
              {t("common:cancel")}
            </Button>
            <Button variant="danger" onClick={() => onSubmit()}>
              {t("common:confirm")}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default SellerAdminConfirmationModal
