"use client"

import { useState } from "react"
import { digitsEnToFa } from "@persian-tools/persian-tools"
import Link from "@vardast/component/Link"
import { City, useUpdateCityMutation } from "@vardast/graphql/generated"
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

interface ProvinceCardProps {
  onDeleteTriggered: (_: City) => void
  show: boolean
  countrySlug: string
  provinceSlug: string
  city: City
}

const CityCard = ({
  show,
  countrySlug,
  provinceSlug,
  onDeleteTriggered,
  city
}: ProvinceCardProps) => {
  const { t } = useTranslation()
  const { data: session } = useSession()
  const { name, slug, isActive, areasCount } = city

  const [active, setActive] = useState(isActive)

  const updateCityMutation = useUpdateCityMutation(
    graphqlRequestClientWithToken,
    {
      onSuccess: () => {
        toast({
          description: t("common:entity_updated_successfully", {
            entity: t("common:city")
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
    updateCityMutation.mutate({
      updateCityInput: {
        id: city.id,
        isActive: !oldActiveMode
      }
    })
  }

  const toggleRemoveItem = () => {
    onDeleteTriggered(city)
  }

  return (
    <div
      className={clsx([
        "card flex items-center gap-3 rounded px-4 py-2 pe-2",
        !show && "hidden"
      ])}
    >
      <Link
        href={`/locations/country/${countrySlug}/province/${provinceSlug}/city/${slug}`}
        className="font-bold text-alpha-800 underline-offset-2 hover:text-alpha-900 hover:underline dark:text-alpha-400 dark:hover:text-alpha-300"
      >
        {name}
      </Link>
      {areasCount !== 0 && (
        <span className="text-sm text-alpha-500 dark:text-alpha-600">
          {digitsEnToFa(areasCount)} منطقه
        </span>
      )}
      <div className="mr-auto flex items-center gap-2">
        <Label noStyle className="flex items-center">
          <>
            <Switch
              onCheckedChange={toggleActive}
              checked={active}
              size="small"
              disabled={updateCityMutation.isLoading}
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
            {session?.abilities?.includes("gql.base.location.city.index") && (
              <DropdownMenuItem>
                <LucideEdit className="dropdown-menu-item-icon" />
                <span>{t("common:edit")}</span>
              </DropdownMenuItem>
            )}
            {session?.abilities?.includes("gql.base.location.city.index") && (
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

export default CityCard
