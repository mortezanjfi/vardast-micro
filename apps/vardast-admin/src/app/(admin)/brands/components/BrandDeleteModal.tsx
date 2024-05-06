"use client"

import { Dispatch, SetStateAction, useEffect, useState } from "react"
import graphqlRequestClientAdmin from "@/graphqlRequestClientAdmin"
import { useQueryClient } from "@tanstack/react-query"
import { Brand, useRemoveBrandMutation } from "@vardast/graphql/generated"
import { toast } from "@vardast/hook/use-toast"
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

type BrandDeleteModalProps = {
  brandToDelete: Brand
  open: boolean
  onOpenChange: Dispatch<SetStateAction<boolean>>
}

const BrandDeleteModal = ({
  brandToDelete,
  open,
  onOpenChange
}: BrandDeleteModalProps) => {
  const { t } = useTranslation()
  const [errors, setErrors] = useState<ClientError | null>(null)
  const queryClient = useQueryClient()

  const removeBrandMutation = useRemoveBrandMutation(
    graphqlRequestClientAdmin,
    {
      onError: (errors: ClientError) => {
        setErrors(errors)
      },
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["GetAllBrands"]
        })

        onOpenChange(false)
        toast({
          description: t("common:entity_removed_successfully", {
            entity: `${t(`common:brand`)}`
          }),
          duration: 2000,
          variant: "success"
        })
      }
    }
  )

  useEffect(() => {
    if (!open) {
      setErrors(null)
    }
  }, [open])

  if (!brandToDelete) return <></>

  const onDelete = () => {
    removeBrandMutation.mutate({
      id: brandToDelete.id
    })
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
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
                  entity: `${t(`common:brand`)}`,
                  name: brandToDelete.name
                }
              )}
            </p>
            <AlertDialogFooter>
              <div className="flex items-center gap-2">
                <Button variant="ghost" onClick={() => onOpenChange(false)}>
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

export default BrandDeleteModal
