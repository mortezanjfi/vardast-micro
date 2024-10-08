"use client"

import { useState } from "react"
import Image from "next/image"
import { digitsEnToFa } from "@persian-tools/persian-tools"
import { Category, useGetCategoryQuery } from "@vardast/graphql/generated"
import graphqlRequestClientWithToken from "@vardast/query/queryClients/graphqlRequestClientWithToken"
import { Button } from "@vardast/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@vardast/ui/dropdown-menu"
import {
  LucideEdit,
  LucideGripVertical,
  LucideMinus,
  LucideMoreVertical,
  LucidePlus,
  LucideTrash
} from "lucide-react"
import { Session } from "next-auth"
import useTranslation from "next-translate/useTranslation"

import {
  CategoryActionModalState,
  CategoryModalEnumType,
  OnOpenCategoryChangeProps
} from "@/app/(admin)/vocabularies/components/Categories"
import CategoryDeleteModal from "@/app/(admin)/vocabularies/components/CategoryDeleteModal"
import CategoryFormModal from "@/app/(admin)/vocabularies/components/CategoryFormModal"
import EditCategoryAttributeModal from "@/app/(admin)/vocabularies/components/EditCategoryAttributeModal"

interface CategoryCardProps {
  category: Category
  modalsOpen: CategoryActionModalState
  onOpenChange: (_: OnOpenCategoryChangeProps) => void
  session: Session | null
}

const CategoryCard = ({
  category,
  onOpenChange,
  session,
  modalsOpen
}: CategoryCardProps) => {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
  const [dropDownMenuOpen, setDropDownMenuOpen] = useState(false)

  const getCategoryQuery = useGetCategoryQuery(
    graphqlRequestClientWithToken,
    {
      id: category.id
    },
    { queryKey: ["admin-category-card", category.id], enabled: false }
  )

  const toggleChild = () => {
    const newOpen = !open
    if (newOpen) {
      getCategoryQuery.refetch()
    }

    setOpen(newOpen)
  }

  return (
    <>
      {modalsOpen.category?.id === category.id && (
        <>
          <EditCategoryAttributeModal
            modalsOpen={modalsOpen}
            onOpenChange={onOpenChange}
          />
          {modalsOpen[CategoryModalEnumType.EditCategory] && (
            <CategoryFormModal
              actionType="edit"
              modalsOpen={modalsOpen}
              onOpenChange={onOpenChange}
            />
          )}
          <CategoryDeleteModal
            modalsOpen={modalsOpen}
            onOpenChange={onOpenChange}
          />
        </>
      )}
      <div className="card flex items-center gap-3 rounded px-4 py-2 pe-2">
        <div className="flex flex-1 items-center gap-2">
          <LucideGripVertical className="hidden h-5 w-5 text-alpha-400" />
          <Button className="flex h-8 w-8 items-center justify-center" noStyle>
            {category.childrenCount ? (
              <LucidePlus
                className="h-5 w-5 text-alpha-500 dark:text-alpha-700"
                strokeWidth={1.5}
                onClick={toggleChild}
              />
            ) : (
              <LucideMinus
                className="h-5 w-5 text-alpha-500 dark:text-alpha-700"
                strokeWidth={1.5}
              />
            )}
          </Button>
          <Image
            alt="category-image"
            className="h-[50px] w-[50px]"
            height={48}
            src={
              category.imageCategory
                ? category.imageCategory[0]?.file?.presignedUrl?.url
                : "/images/blank.png"
            }
            width={48}
          />
          <div className="flex flex-col gap-2">
            <Button
              className="text-right font-bold text-alpha-800 underline-offset-2 hover:text-alpha-900 hover:underline dark:text-alpha-400 dark:hover:text-alpha-300"
              noStyle
              onClick={() => (category.childrenCount ? toggleChild() : null)}
            >
              {category.title}
            </Button>
            <div className="flex gap-10">
              {category.childrenCount && (
                <span className="text-sm text-alpha-500 dark:text-alpha-600">
                  {digitsEnToFa(category.childrenCount)} زیر دسته
                </span>
              )}
              {category.productsCount && category.productsCount > 0 && (
                <span className="text-sm text-alpha-500 dark:text-alpha-600">
                  {digitsEnToFa(category.productsCount)} کالا
                </span>
              )}
              {category.views && category.views > 0 && (
                <span className="text-sm text-alpha-500 dark:text-alpha-600">
                  {digitsEnToFa(category.views)} بازدید
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="mr-auto flex items-center gap-2">
          <Button
            size={"small"}
            onClick={() =>
              onOpenChange({
                currentCategory: category,
                type: CategoryModalEnumType.EditAttribute
              })
            }
          >
            ویرایش مشخصه ها
          </Button>
          <DropdownMenu
            modal={false}
            open={dropDownMenuOpen}
            onOpenChange={setDropDownMenuOpen}
          >
            <DropdownMenuTrigger asChild>
              <Button iconOnly variant="ghost">
                <LucideMoreVertical className="icon" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {session?.abilities?.includes(
                "gql.base.taxonomy.category.index"
              ) && (
                <>
                  <DropdownMenuItem
                    onSelect={() =>
                      onOpenChange({
                        currentCategory: category,
                        type: CategoryModalEnumType.EditCategory
                      })
                    }
                  >
                    <LucideEdit className="dropdown-menu-item-icon" />
                    <span>{t("common:edit")}</span>
                  </DropdownMenuItem>
                </>
              )}
              {session?.abilities?.includes(
                "gql.base.taxonomy.category.index"
              ) && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="danger"
                    onSelect={() =>
                      onOpenChange({
                        currentCategory: category,
                        type: CategoryModalEnumType.RemoveCategory
                      })
                    }
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
      {open && getCategoryQuery.data?.category.children.length && (
        <div className="ms-8 border-s border-alpha-200 ps-2">
          <div className="flex flex-col gap-2">
            {getCategoryQuery.data?.category.children.map((childCategory) => (
              <CategoryCard
                category={childCategory as Category}
                key={childCategory?.id}
                modalsOpen={modalsOpen}
                session={session}
                onOpenChange={onOpenChange}
              />
            ))}
          </div>
        </div>
      )}
    </>
  )
}

export default CategoryCard
