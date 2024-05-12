"use client"

import { useState } from "react"
import { useQueryClient } from "@tanstack/react-query"
import {
  AttributeValue,
  Maybe,
  useRemoveAttributeValueMutation
} from "@vardast/graphql/generated"
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

type AttributeSectionProps = {
  attributes: Maybe<AttributeValue>[] | undefined
  onOpenCreateModal: () => void
  onOpenEditModal: (_: AttributeValue) => void
}

const AttributeSection = ({
  onOpenCreateModal,
  onOpenEditModal,
  attributes
}: AttributeSectionProps) => {
  const { t } = useTranslation()
  const [attributeToDelete, setAttributeToDelete] =
    useState<AttributeValue | null>()
  const [errors, setErrors] = useState<ClientError>()
  const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false)
  const queryClient = useQueryClient()

  const removeAttributeValueMutation = useRemoveAttributeValueMutation(
    graphqlRequestClientWithToken,
    {
      onSuccess: () => {
        toast({
          description: t("common:entity_removed_successfully", {
            entity: `${t(`common:attribute`)}`
          }),
          duration: 2000,
          variant: "success"
        })
        setDeleteModalOpen(false)
        queryClient.invalidateQueries({ queryKey: ["GetProduct"] })
      },
      onError: (errors: ClientError) => {
        setErrors(errors)
      }
    }
  )

  const onDelete = () => {
    if (attributeToDelete) {
      removeAttributeValueMutation.mutate({
        id: attributeToDelete.id
      })
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <AlertDialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
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
              <p className="py-4 leading-loose">
                {t(
                  "common:are_you_sure_you_want_to_delete_x_entity_this_action_cannot_be_undone_and_all_associated_data_will_be_permanently_removed",
                  {
                    entity: `${t(`common:attribute`)}`,
                    name: attributeToDelete?.attribute.name
                  }
                )}
              </p>
              <AlertDialogFooter>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setAttributeToDelete(null)
                      setDeleteModalOpen(false)
                    }}
                    disabled={removeAttributeValueMutation.isLoading}
                  >
                    {t("common:cancel")}
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => onDelete()}
                    disabled={removeAttributeValueMutation.isLoading}
                    loading={removeAttributeValueMutation.isLoading}
                  >
                    {t("common:delete")}
                  </Button>
                </div>
              </AlertDialogFooter>
            </div>
          </div>
        </AlertDialogContent>
      </AlertDialog>
      {attributes && attributes.length > 0 && (
        <div className="card table-responsive rounded">
          <table className="table">
            <thead>
              <tr>
                <th>{t("common:attribute")}</th>
                <th>{t("common:value")}</th>
                <th>{t("common:product_sku")}</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {attributes.map(
                (attribute) =>
                  attribute && (
                    <tr key={attribute.id}>
                      <td>
                        <span className="font-medium">
                          {attribute.attribute.name}
                        </span>
                      </td>
                      <td>
                        {attribute.value} {attribute.attribute.uom?.name}
                      </td>
                      <td>{attribute.sku}</td>
                      <td align="left">
                        <div className="flex items-center gap-4">
                          <Button
                            size="small"
                            type="button"
                            variant="secondary"
                            onClick={() => {
                              onOpenEditModal(attribute)
                            }}
                          >
                            {t("common:edit")}
                          </Button>
                          <Button
                            size="small"
                            variant="link"
                            className="!text-red-500"
                            type="button"
                            onClick={() => {
                              setAttributeToDelete(attribute)
                              setDeleteModalOpen(true)
                            }}
                          >
                            {t("common:delete")}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  )
              )}
            </tbody>
          </table>
        </div>
      )}
      <div className="flex justify-end">
        <Button
          variant="secondary"
          type="button"
          block
          onClick={() => onOpenCreateModal()}
        >
          {t("common:add_entity", { entity: t("common:attribute") })}
        </Button>
      </div>
    </div>
  )
}

export default AttributeSection
