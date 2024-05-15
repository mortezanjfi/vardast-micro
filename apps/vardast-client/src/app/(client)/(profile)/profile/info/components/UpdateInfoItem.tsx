import { useState } from "react"
import { PencilSquareIcon, PlusIcon } from "@heroicons/react/24/outline"
import { Button } from "@vardast/ui/button"

import UpdateInfoItemModal, {
  UpdateInfoItemModalProps
} from "@/app/(client)/(profile)/profile/info/components/UpdateInfoItemModal"

type UpdateInfoItemProps = Pick<
  UpdateInfoItemModalProps,
  "value" | "title" | "name"
>

const UpdateInfoItem = ({ value, title, name }: UpdateInfoItemProps) => {
  const [open, setOpen] = useState<boolean>(false)
  return (
    <div className="flex h-28 items-center justify-between rounded border border-alpha-200 px-6">
      <UpdateInfoItemModal
        open={open}
        setOpen={setOpen}
        value={value}
        name={name}
        title={title}
      />
      <div className="flex h-full flex-col justify-center gap-2">
        <span>{title}</span>
        <span className="text-black">{value || "--"}</span>
      </div>
      <Button
        variant="ghost"
        onClick={() => {
          setOpen((prev) => !prev)
        }}
      >
        {title ? (
          <PencilSquareIcon height={20} width={20} className=" text-black" />
        ) : (
          <PlusIcon height={20} width={20} className="text-black" />
        )}
      </Button>
    </div>
  )
}

export default UpdateInfoItem
