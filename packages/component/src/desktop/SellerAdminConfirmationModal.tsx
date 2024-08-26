"use client"

import { Dispatch, SetStateAction } from "react"
import { CheckCircleIcon } from "@heroicons/react/24/outline"
import useTranslation from "next-translate/useTranslation"

import { Button } from "../../../ui/src/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader
} from "../../../ui/src/dialog"

type Props = {
  // updateOrderOfferMutation: UseMutationResult<
  //   UpdateOrderOfferMutation,
  //   ClientError,
  //   Exact<{
  //     updateOrderOfferInput: UpdateOrderOfferInput
  //   }>,
  //   unknown
  // >
  onSubmit: Function
  content: string
  open: boolean
  onOpenChange: Dispatch<SetStateAction<boolean>>
  setIsResponsible?: Dispatch<SetStateAction<boolean>>
}

function SellerAdminConfirmationModal({
  // updateOrderOfferMutation,
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
            <CheckCircleIcon className="text-success" height={22} width={22} />
            آیا مطمئن هستید؟
          </span>
        </DialogHeader>

        <p className="my-4 leading-loose">{content}</p>
        <DialogFooter>
          <div className="flex items-center gap-2">
            <Button
              // loading={updateOrderOfferMutation?.isLoading}
              variant="ghost"
              onClick={() => {
                onOpenChange(false)
                if (setIsResponsible) setIsResponsible(false)
              }}
            >
              {t("common:cancel")}
            </Button>
            <Button
              // disabled={updateOrderOfferMutation?.isLoading}
              variant="danger"
              onClick={() => onSubmit()}
            >
              {t("common:confirm")}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default SellerAdminConfirmationModal
