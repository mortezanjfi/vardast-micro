"use client"

import { Dispatch, SetStateAction, useEffect, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@radix-ui/react-popover"
import {
  Attribute,
  AttributeValue,
  useGetAttributesOfACategoryQuery
} from "@vardast/graphql/generated"
import graphqlRequestClient from "@vardast/query/queryClients/graphqlRequestClient"
import { mergeClasses } from "@vardast/tailwind-config/mergeClasses"
import { Button } from "@vardast/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem
} from "@vardast/ui/command"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@vardast/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@vardast/ui/form"
import { Input } from "@vardast/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@vardast/ui/select"
import { LucideCheck, LucideChevronsUpDown } from "lucide-react"
import { useSession } from "next-auth/react"
import useTranslation from "next-translate/useTranslation"
import { useForm } from "react-hook-form"
import { TypeOf, z } from "zod"

import { AttributeValueTempState } from "@/app/(seller)/products/new/ProductForm"

type AttributeValueModalProps = {
  categoryId: number
  open: boolean
  onOpenChange: Dispatch<SetStateAction<boolean>>
  attribute?: AttributeValue
  onAttributeSubmit: (_: AttributeValueTempState) => void
}

const AttributeValueModal = ({
  open,
  onOpenChange,
  categoryId,
  attribute,
  onAttributeSubmit
}: AttributeValueModalProps) => {
  const { t } = useTranslation()
  const [attributeOpen, setAttributeOpen] = useState<boolean>(false)
  const [selectAttribute, setSelectAttribute] = useState<
    Attribute | undefined
  >()
  const { data: session } = useSession()

  const AttributeValueFormSchema = z.object({
    attributeId: z.number(),
    value: z.string()
  })
  type AttributeValueForm = TypeOf<typeof AttributeValueFormSchema>

  const attributes = useGetAttributesOfACategoryQuery(
    graphqlRequestClient(session),
    {
      id: categoryId
    }
  )

  const form = useForm<AttributeValueForm>({
    resolver: zodResolver(AttributeValueFormSchema),
    defaultValues: {}
  })

  const onClose = () => {
    form.reset()
    setSelectAttribute(undefined)
    onOpenChange(false)
  }

  useEffect(() => {
    if (attribute) {
      form.setValue("attributeId", attribute.attribute.id, {
        shouldDirty: true
      })
      form.setValue("value", attribute.value, {
        shouldDirty: true
      })
      setSelectAttribute(attribute.attribute)
    }

    return () => {
      setSelectAttribute(undefined)
      form.reset()
    }
  }, [attribute, form, open])

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {attribute
              ? t("common:edit_entity", {
                  entity: t("common:attribute")
                })
              : t("common:add_entity", {
                  entity: t("common:attribute")
                })}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onAttributeSubmit as any)}
            noValidate
          >
            <div className="flex flex-col gap-6 py-8">
              <FormField
                control={form.control}
                name="attributeId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("common:attribute")}</FormLabel>
                    <Popover
                      open={attributeOpen}
                      onOpenChange={setAttributeOpen}
                    >
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            disabled={
                              attributes.isLoading || attributes.isError
                            }
                            noStyle
                            role="combobox"
                            className="input-field flex items-center text-start"
                          >
                            {field.value
                              ? attributes.data?.categoryAttribuite.attributes.find(
                                  (attribute) =>
                                    attribute && attribute.id === field.value
                                )?.name
                              : t("common:choose_entity", {
                                  entity: t("common:attribute")
                                })}
                            <LucideChevronsUpDown className="ms-auto h-4 w-4 shrink-0" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="z-[9999]">
                        <Command>
                          <CommandInput
                            placeholder={t("common:search_entity", {
                              entity: t("common:attribute")
                            })}
                          />
                          <CommandEmpty>
                            {t("common:no_entity_found", {
                              entity: t("common:attribute")
                            })}
                          </CommandEmpty>
                          <CommandGroup>
                            {attributes.data?.categoryAttribuite.attributes.map(
                              (attribute) =>
                                attribute && (
                                  <CommandItem
                                    value={attribute.name}
                                    key={attribute.id}
                                    onSelect={(value) => {
                                      setSelectAttribute(() => {
                                        const item =
                                          attributes.data?.categoryAttribuite.attributes.find(
                                            (item) =>
                                              item &&
                                              item.name.toLowerCase() === value
                                          ) as Attribute
                                        form.setValue("attributeId", item.id)
                                        setAttributeOpen(false)
                                        return item
                                      })
                                    }}
                                  >
                                    <LucideCheck
                                      className={mergeClasses(
                                        "mr-2 h-4 w-4",
                                        attribute.id === field.value
                                          ? "opacity-100"
                                          : "opacity-0"
                                      )}
                                    />
                                    {attribute.name}
                                  </CommandItem>
                                )
                            )}
                          </CommandGroup>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {selectAttribute && selectAttribute.type === "TEXT" && (
                <FormField
                  control={form.control}
                  name="value"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("common:value")}</FormLabel>
                      <FormControl>
                        <Input type="text" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              {selectAttribute && selectAttribute.type === "SELECT" && (
                <FormField
                  control={form.control}
                  name="value"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("common:value")}</FormLabel>
                      <Select
                        onValueChange={(value) => {
                          form.setValue("value", value)
                        }}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue
                              placeholder={t("common:select_placeholder")}
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="z-[9999]">
                          {selectAttribute.values?.options.map(
                            (option: string) => (
                              <SelectItem value={option} key={option}>
                                {option}
                              </SelectItem>
                            )
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>
            <DialogFooter>
              <div className="flex items-center justify-end gap-2">
                <Button
                  variant="ghost"
                  type="button"
                  disabled={form.formState.isSubmitting}
                  onClick={() => onClose()}
                >
                  {t("common:cancel")}
                </Button>
                <Button
                  type="submit"
                  loading={form.formState.isSubmitting}
                  disabled={form.formState.isSubmitting}
                >
                  {t("common:submit")}
                </Button>
              </div>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default AttributeValueModal
