"use client"

import { useState } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { useRemoveCategoryMutation } from "@vardast/graphql/generated"
import { toast } from "@vardast/hook/use-toast"
import graphqlRequestClientWithToken from "@vardast/query/queryClients/graphqlRequestClientWithToken"
import { Alert, AlertDescription, AlertTitle } from "@vardast/ui/alert"
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@vardast/ui/alert-dialog"
import { Button } from "@vardast/ui/button"
import { ClientError } from "graphql-request"
import { LucideAlertOctagon } from "lucide-react"
import useTranslation from "next-translate/useTranslation"

import { CategoryModalEnumType } from "@/app/(admin)/vocabularies/components/Categories"
import { CategoryFormModalProps } from "@/app/(admin)/vocabularies/components/CategoryFormModal"

const CategoryDeleteModal = ({
  onOpenChange,
  modalsOpen
}: Omit<CategoryFormModalProps, "actionType">) => {
  const { t } = useTranslation()
  const [errors, setErrors] = useState<ClientError>()
  const queryClient = useQueryClient()

  const removeCategoryMutation = useRemoveCategoryMutation(
    graphqlRequestClientWithToken,
    {
      onError: (errors: ClientError) => {
        setErrors(errors)
      },
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["GetVocabulary", "admin-category-create"]
        })
        queryClient.invalidateQueries({
          queryKey: [
            "GetCategory",
            "admin-category-card",
            modalsOpen?.category?.id
          ]
        })
        onOpenClose()
        toast({
          description: t("common:entity_removed_successfully", {
            entity: `${t(`common:vocabulary`)}`
          }),
          duration: 2000,
          variant: "success"
        })
      }
    }
  )

  if (!modalsOpen?.category) return <></>

  const onDelete = () => {
    if (modalsOpen?.category?.id) {
      removeCategoryMutation.mutate({
        id: modalsOpen?.category.id
      })
    }
  }

  const onOpenClose = () => {
    onOpenChange({
      type: CategoryModalEnumType.RemoveCategory,
      currentCategory: modalsOpen.category
    })
  }

  return (
    <AlertDialog
      open={modalsOpen[CategoryModalEnumType.RemoveCategory]}
      onOpenChange={onOpenClose}
    >
      <AlertDialogContent>
        <div className="flex">
          <div className="me-6 flex-1 shrink-0">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-600 dark:bg-red-800/20">
              <LucideAlertOctagon className="h-6 w-6" />
            </span>
          </div>
          <div>
            <AlertDialogHeader>
              <AlertDialogTitle>{t("common:warning")}</AlertDialogTitle>
            </AlertDialogHeader>
            {errors && (
              <Alert variant="danger">
                <LucideAlertOctagon />
                <AlertTitle>خطا</AlertTitle>
                <AlertDescription>
                  {(
                    errors.response.errors?.at(0)?.extensions
                      .displayErrors as string[]
                  ).map((error) => (
                    <p key={error}>{error}</p>
                  ))}
                </AlertDescription>
              </Alert>
            )}
            <p className="my-4 leading-loose">
              {t(
                "common:are_you_sure_you_want_to_delete_x_entity_this_action_cannot_be_undone_and_all_associated_data_will_be_permanently_removed",
                {
                  entity: `${t(`common:category`)}`,
                  name: modalsOpen?.category.title
                }
              )}
            </p>
            <AlertDialogFooter>
              <div className="flex items-center gap-2">
                <Button variant="ghost" onClick={() => onOpenClose()}>
                  {t("common:cancel")}
                </Button>
                <Button variant="danger" onClick={() => onDelete()}>
                  {t("common:delete")}
                </Button>
              </div>
            </AlertDialogFooter>
          </div>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default CategoryDeleteModal
