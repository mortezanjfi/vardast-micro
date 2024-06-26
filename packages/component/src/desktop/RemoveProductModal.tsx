"use client"

import { Dispatch, SetStateAction } from "react"
import { UseMutationResult } from "@tanstack/react-query"
import { Exact, Product, RemoveOfferMutation } from "@vardast/graphql/generated"
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

type RemoveProductModalProps = {
  isAdmin?: boolean
  adminRemoveOfferMutation?: Function
  sellerRemoveOfferMutation?: UseMutationResult<
    RemoveOfferMutation,
    ClientError,
    Exact<{
      offerId?: number
      productId?: number
    }>,
    unknown
  >
  productToDelet: Product
  open: boolean
  onOpenChange: Dispatch<SetStateAction<boolean>>
}

const RemoveProductModal = ({
  isAdmin,
  adminRemoveOfferMutation,
  sellerRemoveOfferMutation,
  productToDelet,
  open,
  onOpenChange
}: RemoveProductModalProps) => {
  const { t } = useTranslation()
  // const [errors, setErrors] = useState<ClientError>()

  if (!productToDelet) return <></>

  const onDelete = () => {
    isAdmin
      ? adminRemoveOfferMutation()
      : sellerRemoveOfferMutation.mutate({
          productId: productToDelet.id
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
            {/* {errors && (
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
            )} */}
            <p className="my-4 leading-loose">
              {t(
                "common:are_you_sure_you_want_to_delete_x_entity_this_action_cannot_be_undone_and_all_associated_data_will_be_permanently_removed",
                {
                  entity: `${t(`common:offer`)}`,
                  name: productToDelet.name
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

export default RemoveProductModal
