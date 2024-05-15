import { useState } from "react"
import { PencilSquareIcon, PlusIcon } from "@heroicons/react/24/outline"
import { digitsEnToFa } from "@persian-tools/persian-tools"
import { Button } from "@vardast/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader
} from "@vardast/ui/dialog"
import { Input } from "@vardast/ui/input"
import { useSession } from "next-auth/react"
import useTranslation from "next-translate/useTranslation"

type MobileNumberSectionProps = {}

const MobileNumberSection = ({}: MobileNumberSectionProps) => {
  const { data: session } = useSession()
  const [open, setOpen] = useState<boolean>(false)
  const { t } = useTranslation()

  return (
    <div>
      {" "}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="gap-7">
          <DialogHeader className="border-b pb">افزودن شماره تماس</DialogHeader>
          <div className="flex w-full flex-col gap-1">
            <div>شماره تماس</div>
            <Input className="w-full" />
          </div>
          <DialogFooter className="border-t pt">
            <Button>{t("common:confirm")}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <div className="flex h-28 items-center justify-between  border-l border-alpha-200 pl-5">
        <div className="flex h-full flex-col justify-center gap-2">
          <span>شماره موبایل</span>
          <span className="text-black">
            {session?.profile.cellphone
              ? digitsEnToFa(session?.profile.cellphone)
              : "--"}
          </span>
        </div>
        <Button
          variant="ghost"
          onClick={() => {
            setOpen((prev) => !prev)
          }}
        >
          {session?.profile.cellphone ? (
            <PencilSquareIcon height={20} width={20} className=" text-black" />
          ) : (
            <PlusIcon height={20} width={20} className="text-black" />
          )}
        </Button>
      </div>
    </div>
  )
}

export default MobileNumberSection
