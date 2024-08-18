"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import Card from "@vardast/component/Card"
import {
  Permission,
  Role,
  useGetAllPermissionsQuery,
  useGetAllRolesQuery,
  useUpdateUserMutation
} from "@vardast/graphql/generated"
import { toast } from "@vardast/hook/use-toast"
import graphqlRequestClientWithToken from "@vardast/query/queryClients/graphqlRequestClientWithToken"
import { Alert, AlertDescription, AlertTitle } from "@vardast/ui/alert"
import { Button } from "@vardast/ui/button"
import { Checkbox } from "@vardast/ui/checkbox"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@vardast/ui/form"
import zodI18nMap from "@vardast/util/zodErrorMap"
import { ClientError } from "graphql-request"
import { LucideAlertOctagon } from "lucide-react"
import useTranslation from "next-translate/useTranslation"
import { useForm } from "react-hook-form"
import { TypeOf, z } from "zod"

interface UserPermissionsFormType {
  userId: number
  userRoles: Role[]
  userPermissions: Permission[]
}

const UserPermissionsForm = ({
  userId,
  userRoles,
  userPermissions
}: UserPermissionsFormType) => {
  const { t } = useTranslation()
  const router = useRouter()
  const [errors, setErrors] = useState<ClientError>()
  const { data: roles } = useGetAllRolesQuery(graphqlRequestClientWithToken)
  const { data: permissions } = useGetAllPermissionsQuery(
    graphqlRequestClientWithToken,
    {
      indexPermissionInput: {
        page: 1,
        perPage: 130
      }
    }
  )

  const updateUserMutation = useUpdateUserMutation(
    graphqlRequestClientWithToken,
    {
      onError: (errors: ClientError) => {
        setErrors(errors)
      },
      onSuccess: () => {
        toast({
          description: t("common:entity_updated_successfully", {
            entity: t("common:user")
          }),
          duration: 2000,
          variant: "success"
        })
        router.push("/users")
      }
    }
  )

  const currentUserRoles: number[] = userRoles.reduce<number[]>((acc, item) => {
    acc.push(item.id)
    return acc
  }, [])

  const currentUserPermissions: number[] = userPermissions.reduce<number[]>(
    (acc, item) => {
      acc.push(item.id)
      return acc
    },
    []
  )

  z.setErrorMap(zodI18nMap)
  const UserPermissionsSchema = z.object({
    roles: z.array(z.number()),
    permissions: z.array(z.number())
  })
  type UserPermissionsType = TypeOf<typeof UserPermissionsSchema>
  const form = useForm<UserPermissionsType>({
    resolver: zodResolver(UserPermissionsSchema),
    defaultValues: {
      roles: currentUserRoles,
      permissions: currentUserPermissions
    }
  })

  const onSubmit = (data: UserPermissionsType) => {
    const { roles, permissions } = data
    updateUserMutation.mutate({
      updateUserInput: {
        id: userId,
        roleIds: roles
        // permissionIds: permissions
      }
    })
  }

  return (
    <Form {...form}>
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
      <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
        <div className="mb-6 mt-8 flex items-end justify-between">
          <h2 className="text-xl font-black text-alpha-800 lg:text-3xl">
            {t("common:edit_entity", {
              entity: t("common:role_and_permissions")
            })}
          </h2>
          <Button
            className="sticky top-0"
            type="submit"
            loading={form.formState.isSubmitting}
            disabled={form.formState.isSubmitting}
          >
            {t("common:save_entity", {
              entity: t("common:role_and_permissions")
            })}
          </Button>
        </div>
        <div className="flex flex-col gap-8">
          {roles && (
            <Card title={t("common:roles")}>
              <div>
                <FormField
                  control={form.control}
                  name="roles"
                  render={() => (
                    <FormItem>
                      {roles.roles.data.map(
                        (item) =>
                          item && (
                            <FormField
                              key={item.id}
                              control={form.control}
                              name="roles"
                              render={({ field }) => {
                                return (
                                  <FormItem
                                    key={item.id}
                                    className="checkbox-field"
                                  >
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value?.includes(item.id)}
                                        onCheckedChange={(checked) => {
                                          return checked
                                            ? field.onChange([
                                                ...field.value,
                                                item.id
                                              ])
                                            : field.onChange(
                                                field.value?.filter(
                                                  (value) => value !== item.id
                                                )
                                              )
                                        }}
                                      />
                                    </FormControl>
                                    <FormLabel>{item.displayName}</FormLabel>
                                  </FormItem>
                                )
                              }}
                            />
                          )
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </Card>
          )}

          {permissions && (
            <Card title={t("common:permissions")}>
              <div>
                <FormField
                  control={form.control}
                  name="permissions"
                  render={() => (
                    <FormItem className="md:grid md:grid-cols-2 xl:grid-cols-3">
                      {permissions.permissions.data.map(
                        (item) =>
                          item && (
                            <FormField
                              key={item.id}
                              control={form.control}
                              name="permissions"
                              render={({ field }) => {
                                return (
                                  <FormItem
                                    key={item.id}
                                    className="checkbox-field"
                                  >
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value?.includes(item.id)}
                                        onCheckedChange={(checked) => {
                                          return checked
                                            ? field.onChange([
                                                ...field.value,
                                                item.id
                                              ])
                                            : field.onChange(
                                                field.value?.filter(
                                                  (value) => value !== item.id
                                                )
                                              )
                                        }}
                                      />
                                    </FormControl>
                                    <FormLabel>{item.displayName}</FormLabel>
                                  </FormItem>
                                )
                              }}
                            />
                          )
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </Card>
          )}
        </div>
      </form>
    </Form>
  )
}

export default UserPermissionsForm
