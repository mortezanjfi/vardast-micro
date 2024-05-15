import { Dispatch, SetStateAction } from "react"
import { CheckCircleIcon } from "@heroicons/react/24/outline"
import { DialogDescription } from "@radix-ui/react-dialog"
import { Button } from "@vardast/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader
} from "@vardast/ui/dialog"
import useTranslation from "next-translate/useTranslation"

type VardastDialogProps = {
  setOpen: Dispatch<SetStateAction<boolean>>
  open: boolean
}

const VardastDialog = ({ setOpen, open }: VardastDialogProps) => {
  const { t } = useTranslation()
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="gap-7">
        <DialogHeader className=" pb">
          <span className="flex gap-5">
            {" "}
            <CheckCircleIcon width={22} height={22} className="text-success" />
            سفارش شما با موفقیت ثبت شد
          </span>
        </DialogHeader>
        <DialogDescription>
          درخواست خرید شما ثبت شد، کارشناسان وردست به زودی با شما تماس خواهد
          گرفت.
        </DialogDescription>
        <DialogFooter className=" pt">
          <Button
            onClick={() => {
              setOpen(false)
            }}
          >
            {t("common:got-it")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default VardastDialog
