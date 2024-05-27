import { useState } from "react"
import { digitsEnToFa } from "@persian-tools/persian-tools"
import { DetailsWithTitle } from "@vardast/component/desktop/DetailsWithTitle"
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
  ProjectUser,
  SELECTED_ITEM,
  SELECTED_ITEM_TYPE
} from "@/app/(client)/(profile)/profile/projects/components/user/ProjectUsersTab"

type ProjectUserCartProps = {
  user: ProjectUser
  onOpenModal: (selectedUsersData: SELECTED_ITEM) => void
}

const ProjectUserCart = ({ user, onOpenModal }: ProjectUserCartProps) => {
  const { t } = useTranslation()
  const [dropDownMenuOpen, setDropDownMenuOpen] = useState(false)

  return (
    <div className="flex flex-col border-b py-5">
      <div className="flex w-full justify-between">
        <span className="text-base font-semibold">{user?.fullName}</span>
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
                  data: user
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
                    data: user
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
        <DetailsWithTitle
          title={t("شماره تماس")}
          text={digitsEnToFa(user?.cellphone)}
        />
      </div>
    </div>
  )
}

export default ProjectUserCart
