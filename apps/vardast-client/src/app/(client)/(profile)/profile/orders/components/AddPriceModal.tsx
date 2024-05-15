import { Dispatch, SetStateAction } from "react"
import { Button } from "@vardast/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader
} from "@vardast/ui/dialog"
import { Input } from "@vardast/ui/input"
import useTranslation from "next-translate/useTranslation"

type AddPriceModalProps = {
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
}

const AddPriceModal = ({ open, setOpen }: AddPriceModalProps) => {
  const { t } = useTranslation()

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="gap-7">
        <DialogHeader className="border-b pb">قیمت واحد (تومان)</DialogHeader>
        <div className="flex w-full flex-col gap-1">
          <div>نام</div>
          <Input placeholder="وارد کنید" className="w-full" />
        </div>
        <div className="flex justify-center rounded-lg border border-blue-300 bg-blue-50 px-5 py-7">
          قیمت کل (تومان): -
        </div>
        <DialogFooter className="border-t pt">
          <Button>{t("common:confirm")}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default AddPriceModal
