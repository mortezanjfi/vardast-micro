"use client"

import { useState } from "react"
import { digitsEnToFa } from "@persian-tools/persian-tools"
import Link from "@vardast/component/Link"
import { Country, useUpdateCountryMutation } from "@vardast/graphql/generated"
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
import { getFlagEmoji } from "@vardast/util/getFlagEmoji"
import clsx from "clsx"
import { LucideEdit, LucideMoreVertical, LucideTrash } from "lucide-react"
import { useSession } from "next-auth/react"
import useTranslation from "next-translate/useTranslation"

type CountryCardProps = {
  onDeleteTriggered: (_: Country) => void
  show: boolean
  country: Country
}

const CountryCard = ({
  show,
  country,
  onDeleteTriggered
}: CountryCardProps) => {
  const { t } = useTranslation()
  const { data: session } = useSession()
  const { name, slug, alphaTwo, isActive, provincesCount } = country
  const [active, setActive] = useState(isActive)

  const updateCountryMutation = useUpdateCountryMutation(
    graphqlRequestClientWithToken,
    {
      onSuccess: () => {
        toast({
          description: t("common:entity_updated_successfully", {
            entity: t("common:country")
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
    updateCountryMutation.mutate({
      updateCountryInput: {
        id: country.id,
        isActive: !oldActiveMode
      }
    })
  }

  const toggleRemoveItem = () => {
    onDeleteTriggered(country)
  }

  return (
    <div
      className={clsx([
        "card flex items-center gap-3 rounded px-4 py-2 pe-2",
        !show && "hidden"
      ])}
    >
      <div className="flex items-center gap-2">
        <span className="align-baseline text-2xl leading-none">
          {getFlagEmoji(alphaTwo)}
        </span>
        <Link
          className="font-bold text-alpha-800 underline-offset-2 hover:text-alpha-900 hover:underline dark:text-alpha-400 dark:hover:text-alpha-300"
          href={`/locations/country/${slug}`}
        >
          {name}
        </Link>
        {provincesCount !== 0 && (
          <span className="text-sm text-alpha-500 dark:text-alpha-600">
            {digitsEnToFa(provincesCount)} استان
          </span>
        )}
      </div>
      <div className="mr-auto flex items-center gap-2">
        <Label className="flex items-center" noStyle>
          <>
            <Switch
              checked={active}
              disabled={updateCountryMutation.isLoading}
              size="small"
              onCheckedChange={toggleActive}
            />
            <span>{t("common:is_active")}</span>
          </>
        </Label>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button iconOnly variant="ghost">
              <LucideMoreVertical className="icon" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {session?.abilities?.includes(
              "gql.base.location.country.index"
            ) && (
              <DropdownMenuItem>
                <LucideEdit className="dropdown-menu-item-icon" />
                <span>{t("common:edit")}</span>
              </DropdownMenuItem>
            )}
            {session?.abilities?.includes(
              "gql.base.location.country.index"
            ) && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="danger"
                  onSelect={toggleRemoveItem}
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

export default CountryCard
