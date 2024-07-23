/* eslint-disable no-unused-vars */
"use client"

import { Dispatch, SetStateAction, useState } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { toast } from "@vardast/hook/use-toast"
import { ClientError } from "graphql-request"
import { LucideAlertOctagon } from "lucide-react"
import useTranslation from "next-translate/useTranslation"

import {
  Product,
  useRemoveProductMutation
} from "../../../graphql/src/generated"
import graphqlRequestClientWithToken from "../../../query/src/queryClients/graphqlRequestClientWithToken"
import { Alert, AlertDescription, AlertTitle } from "../../../ui/src/alert"
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "../../../ui/src/alert-dialog"
import { Button } from "../../../ui/src/button"

type ProductDeleteModalProps = {
  productToDelete: Product
  open: boolean
  onOpenChange: Dispatch<SetStateAction<boolean>>
}

const ProductDeleteModal = ({
  productToDelete,
  open,
  onOpenChange
}: ProductDeleteModalProps) => {
  const { t } = useTranslation()
  const [errors, setErrors] = useState<ClientError>()
  const queryClient = useQueryClient()
  const removeProductMutation = useRemoveProductMutation(
    graphqlRequestClientWithToken,
    {
      onError: (errors: ClientError) => {
        setErrors(errors)
      },
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["GetAllProducts"]
        })
        onOpenChange(false)
        toast({
          description: t("common:entity_removed_successfully", {
            entity: `${t(`common:product`)}`
          }),
          duration: 2000,
          variant: "success"
        })
      }
    }
  )

  const onDelete = () => {
    removeProductMutation.mutate({ id: productToDelete.id })
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
                  entity: `${t(`common:product`)}`,
                  name: productToDelete?.name
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

export default ProductDeleteModal
