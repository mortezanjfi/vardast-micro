"use client"

import { PropsWithChildren } from "react"
import { Alert, AlertDescription, AlertTitle } from "@vardast/ui/alert"
import { Button, ButtonProps } from "@vardast/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogVariantProps
} from "@vardast/ui/dialog"
import { FormLayout, FormLayoutProps } from "@vardast/ui/form"
import { ClientError } from "graphql-request"
import { LucideAlertOctagon } from "lucide-react"
import useTranslation from "next-translate/useTranslation"
import { FieldValues } from "react-hook-form"

export interface ModalProps<TFieldValues extends FieldValues = FieldValues>
  extends PropsWithChildren,
    DialogVariantProps {
  errors?: ClientError
  open?: boolean
  onOpenChange?: () => void
  title?: string
  description?: string
  action?: Omit<ButtonProps, "className" | "variant">
  secondAction?: Omit<ButtonProps, "className" | "variant">
  form?: FormLayoutProps<TFieldValues>
  modalType?: "delete" | "default"
}

const Footer = ({
  onOpenChange,
  action,
  secondAction
}: Pick<ModalProps, "onOpenChange" | "action" | "secondAction">) => {
  const { t } = useTranslation()

  return (
    <DialogFooter className="col-span-full flex items-center justify-end border-t pt">
      {secondAction && (
        <div className="w-full flex-1">
          <Button
            type="button"
            {...secondAction}
            className="w-full md:w-auto"
            variant="full-secondary"
          >
            {secondAction?.title || secondAction?.children}
          </Button>
        </div>
      )}
      <Button
        type="button"
        className="w-full md:w-auto"
        variant="secondary"
        onClick={onOpenChange}
      >
        {t("common:cancel")}
      </Button>
      <Button
        type="submit"
        {...action}
        className="w-full md:w-auto"
        variant="primary"
      >
        {action?.title || action?.children}
      </Button>
    </DialogFooter>
  )
}

const Modal = <TFieldValues extends FieldValues>({
  open,
  title,
  modalType = "default",
  onOpenChange,
  description,
  errors,
  form,
  action,
  secondAction,
  size,
  children
}: ModalProps<TFieldValues>) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent size={size}>
        {(title || modalType === "delete") && (
          <DialogHeader className="border-b pb">
            <DialogTitle>
              <div className="me-6 flex flex-1 shrink-0 items-center gap">
                {modalType === "delete" && (
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-600 dark:bg-red-800/20">
                    <LucideAlertOctagon className="h-6 w-6" />
                  </span>
                )}
                {title || ""}
              </div>
            </DialogTitle>
          </DialogHeader>
        )}
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
        {description && <p className="my-4 leading-loose">{description}</p>}
        {form ? (
          <FormLayout {...form}>
            {children}
            {(action || secondAction) && (
              <Footer
                onOpenChange={onOpenChange}
                action={action}
                secondAction={secondAction}
              />
            )}
          </FormLayout>
        ) : (
          <>
            {children}
            {(action || secondAction) && (
              <Footer
                onOpenChange={onOpenChange}
                action={action}
                secondAction={secondAction}
              />
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}

export { Modal }
