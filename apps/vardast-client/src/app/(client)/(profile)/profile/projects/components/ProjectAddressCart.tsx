import { Dispatch, SetStateAction, useState } from "react"
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

import { DetailsWithTitle } from "@/app/(client)/(profile)/profile/projects/components/DetailsWithTitle"
import { Address } from "@/app/(client)/(profile)/profile/projects/components/ProjectAddressesTab"

type ProjectAddressCartProps = {
  address: Address
  setDeleteModalOpen: Dispatch<SetStateAction<boolean>>
  setaddAddressModalModalOpen: Dispatch<SetStateAction<boolean>>
  setAddressToDelete: Dispatch<SetStateAction<Address | undefined>>
}

const ProjectAddressCart = ({
  setAddressToDelete,
  address,
  setDeleteModalOpen,
  setaddAddressModalModalOpen
}: ProjectAddressCartProps) => {
  const { t } = useTranslation()
  const [dropDownMenuOpen, setDropDownMenuOpen] = useState(false)

  return (
    <div className="flex flex-col border-b py-5">
      <div className="flex w-full justify-between">
        <span className="text-base font-semibold">{address.title}</span>
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
              onSelect={() => setaddAddressModalModalOpen(true)}
            >
              <LucideEdit className="dropdown-menu-item-icon" />
              <span>{t("common:edit")}</span>
            </DropdownMenuItem>

            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onSelect={() => {
                  setAddressToDelete(address)
                  setDeleteModalOpen(true)
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
        <DetailsWithTitle
          title={t("common:address")}
          text={address.postalAddress}
        />
        <DetailsWithTitle
          title={t("common:transferee")}
          text={address.transfereeName}
        />
        <DetailsWithTitle
          title={t("common:transferee-number")}
          text={address.transfereeNumber}
        />
      </div>
    </div>
  )
}

export default ProjectAddressCart
