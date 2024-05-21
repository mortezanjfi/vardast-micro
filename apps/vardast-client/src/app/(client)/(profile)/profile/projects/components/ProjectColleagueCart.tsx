import { Dispatch, SetStateAction, useState } from "react"
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

import { Colleague } from "@/app/(client)/(profile)/profile/projects/components/ProjectColleaguesTab"

type ProjectColleagueCartProps = {
  setColleagueToDelete: Dispatch<SetStateAction<Colleague | undefined>>
  colleague: Colleague
  setDeleteModalOpen: Dispatch<SetStateAction<boolean>>
  setColleagueModalOpen: Dispatch<SetStateAction<boolean>>
}

const ProjectColleagueCart = ({
  setColleagueToDelete,
  colleague,
  setDeleteModalOpen,
  setColleagueModalOpen
}: ProjectColleagueCartProps) => {
  const { t } = useTranslation()
  const [dropDownMenuOpen, setDropDownMenuOpen] = useState(false)

  return (
    <div className="flex flex-col border-b py-5">
      <div className="flex w-full justify-between">
        <span className="text-base font-semibold">{colleague.name}</span>
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
              onSelect={() => {
                setColleagueModalOpen(true)
              }}
            >
              <LucideEdit className="dropdown-menu-item-icon" />
              <span>{t("common:edit")}</span>
            </DropdownMenuItem>

            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onSelect={() => {
                  setColleagueToDelete(colleague)
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
        <DetailsWithTitle title={"شماره تماس"} text={colleague.cellPhone} />
      </div>
    </div>
  )
}

export default ProjectColleagueCart
