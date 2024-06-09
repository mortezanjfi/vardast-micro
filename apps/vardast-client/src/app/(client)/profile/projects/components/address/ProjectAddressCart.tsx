import { useState } from "react"
import { DetailsWithTitle } from "@vardast/component/desktop/DetailsWithTitle"
import { ProjectAddress } from "@vardast/graphql/generated"
import { Button } from "@vardast/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@vardast/ui/dropdown-menu"
import { LucideEdit, LucideMoreVertical, LucideTrash } from "lucide-react"
import useTranslation from "next-translate/useTranslation"

import {
  SELECTED_ITEM,
  SELECTED_ITEM_TYPE
} from "@/app/(client)/profile/projects/components/address/ProjectAddressesTab"

type ProjectAddressCartProps = {
  address: ProjectAddress
  onOpenModal: (selectedAddressesData: SELECTED_ITEM) => void
}

const ProjectAddressCart = ({
  address,
  onOpenModal
}: ProjectAddressCartProps) => {
  const { t } = useTranslation()
  const [dropDownMenuOpen, setDropDownMenuOpen] = useState(false)

  return (
    <div className="flex flex-col border-b py-5">
      <div className="flex w-full items-center justify-between">
        <span className="text-base font-semibold">{address?.title}</span>
        <DropdownMenu
          modal={false}
          open={dropDownMenuOpen}
          onOpenChange={setDropDownMenuOpen}
        >
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" iconOnly>
              <LucideMoreVertical className="icon text-black" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem
              onSelect={() =>
                onOpenModal({
                  type: SELECTED_ITEM_TYPE.EDIT,
                  data: address
                })
              }
            >
              <LucideEdit className="dropdown-menu-item-icon" />
              <span>{t("common:edit")}</span>
            </DropdownMenuItem>

            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onSelect={() => {
                  onOpenModal({
                    type: SELECTED_ITEM_TYPE.DELETE,
                    data: address
                  })
                }}
                className="danger"
              >
                <LucideTrash className="dropdown-menu-item-icon" />
                <span>{t("common:delete")}</span>
              </DropdownMenuItem>
            </>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="flex flex-col">
        <DetailsWithTitle title={t("common:address")} text={address?.address} />
        <DetailsWithTitle
          title={t("common:transferee")}
          text={address?.delivery_name}
        />
        <DetailsWithTitle
          title={t("common:transferee-number")}
          text={address?.delivery_contact}
        />
      </div>
    </div>
  )
}

export default ProjectAddressCart
