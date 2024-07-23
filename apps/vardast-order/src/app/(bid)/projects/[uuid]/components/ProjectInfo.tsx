"use client"

import { useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useQueryClient } from "@tanstack/react-query"
import Card from "@vardast/component/Card"
import { useUpdateProjectMutation } from "@vardast/graphql/generated"
import graphqlRequestClientWithToken from "@vardast/query/queryClients/graphqlRequestClientWithToken"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@vardast/ui/form"
import { Input } from "@vardast/ui/input"
import zodI18nMap from "@vardast/util/zodErrorMap"
import { useForm } from "react-hook-form"
import { TypeOf, z } from "zod"

import { IProjectPageSectionProps } from "./ProjectPage"

const ProjectInfo = ({
  uuid,
  name
}: IProjectPageSectionProps & {
  name?: string
}) => {
  const queryClient = useQueryClient()
  const ProjectSchema = z.object({
    name: z.string()
  })

  type CreateProjectType = TypeOf<typeof ProjectSchema>

  const form = useForm<CreateProjectType>({
    resolver: zodResolver(ProjectSchema)
  })

  z.setErrorMap(zodI18nMap)

  const updateProjectMutation = useUpdateProjectMutation(
    graphqlRequestClientWithToken,
    {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["FindOneProject"]
        })
      }
    }
  )

  const onSubmit = (data: CreateProjectType) => {
    updateProjectMutation.mutate({
      updateProjectInput: {
        id: +uuid,
        name: data.name
      }
    })
  }

  useEffect(() => {
    if (name) {
      form.setValue("name", name)
    }
  }, [name])

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card
          title="اطلاعات پروژه"
          actionButton={{
            disabled:
              !form.watch("name") ||
              updateProjectMutation.isLoading ||
              (form.watch("name") && name === form.watch("name")),
            loading: updateProjectMutation.isLoading,
            type: "submit",
            variant: "primary",
            text: "ذخیره اطلاعات"
          }}
          template="1/2"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>نام پروژه</FormLabel>
                <FormControl>
                  <Input
                    disabled={updateProjectMutation.isLoading}
                    type="text"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </Card>
      </form>
    </Form>
  )
}

export default ProjectInfo
