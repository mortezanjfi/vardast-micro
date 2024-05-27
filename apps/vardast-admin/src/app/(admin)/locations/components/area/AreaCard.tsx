"use client"

import { useState } from "react"
import { Area, useUpdateAreaMutation } from "@vardast/graphql/generated"
import { toast } from "@vardast/hook/use-toast"
import graphqlRequestClientWithToken from "@vardast/query/queryClients/graphqlRequestClientWithToken"
import { Button } from "@vardast/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@vardast/ui/dropdown-menu"
import { Label } from "@vardast/ui/label"
import { Switch } from "@vardast/ui/switch"
import clsx from "clsx"
import { LucideEdit, LucideMoreVertical, LucideTrash } from "lucide-react"
import { useSession } from "next-auth/react"
import useTranslation from "next-translate/useTranslation"

interface AreaCardProps {
  onDeleteTriggered: (_: Area) => void
  show: boolean
  countrySlug?: string
  provinceSlug?: string
  citySlug?: string
  area: Area
}

const AreaCard = ({ show, area, onDeleteTriggered }: AreaCardProps) => {
  const { t } = useTranslation()
  const { data: session } = useSession()
  const { name, isActive } = area
  const [active, setActive] = useState<boolean>(isActive)

  const updateAreaMutation = useUpdateAreaMutation(
    graphqlRequestClientWithToken,
    {
      onSuccess: () => {
        toast({
          description: t("common:entity_updated_successfully", {
            entity: t("common:area")
          }),
          duration: 2000,
          variant: "success"
        })
        setActive((value) => !value)
      }
    }
  )

  const toggleActive = () => {
    const oldActiveMode = active
    updateAreaMutation.mutate({
      updateAreaInput: {
        id: area.id,
        isActive: !oldActiveMode
      }
    })
  }

  const toggleRemoveItem = () => {
    onDeleteTriggered(area)
  }

  return (
    <div
      className={clsx([
        "card flex items-center gap-3 rounded px-4 py-2 pe-2",
        !show && "hidden"
      ])}
    >
      <span className="text-alpha-800 dark:text-alpha-400">{name}</span>
      <div className="mr-auto flex items-center gap-2">
        <Label noStyle className="flex items-center">
          <>
            <Switch
              onCheckedChange={toggleActive}
              checked={active}
              size="small"
              disabled={updateAreaMutation.isLoading}
            />
            <span>{t("common:is_active")}</span>
          </>
        </Label>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" iconOnly>
              <LucideMoreVertical className="icon" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {session?.abilities?.includes("gql.base.location.area.index") && (
              <DropdownMenuItem>
                <LucideEdit className="dropdown-menu-item-icon" />
                <span>{t("common:edit")}</span>
              </DropdownMenuItem>
            )}
            {session?.abilities?.includes("gql.base.location.area.index") && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onSelect={toggleRemoveItem}
                  className="danger"
                >
                  <LucideTrash className="dropdown-menu-item-icon" />
                  <span>{t("common:delete")}</span>
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}

export default AreaCard
