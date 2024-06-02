"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useQueryClient } from "@tanstack/react-query"
import {
  useCreateProjectMutation,
  useUpdateProjectMutation
} from "@vardast/graphql/generated"
import { toast } from "@vardast/hook/use-toast"
import graphqlRequestClientWithToken from "@vardast/query/queryClients/graphqlRequestClientWithToken"
import { Button } from "@vardast/ui/button"
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
import { ClientError } from "graphql-request/build/esm/types"
import { useForm } from "react-hook-form"
import { TypeOf, z } from "zod"

import {
  PROJECT_TAB,
  ProjectTabProps
} from "@/app/(client)/(profile)/profile/projects/components/project/ProjectForm"

const ProjectInfoTab = ({
  setActiveTab,
  uuid,
  isNew,
  findOneProjectQuery
}: ProjectTabProps) => {
  const queryClient = useQueryClient()
  const router = useRouter()
  const ProjectSchema = z.object({
    name: z.string()
  })

  type CreateProjectType = TypeOf<typeof ProjectSchema>

  const form = useForm<CreateProjectType>({
    resolver: zodResolver(ProjectSchema)
  })

  z.setErrorMap(zodI18nMap)

  const createProjectMutation = useCreateProjectMutation(
    graphqlRequestClientWithToken,
    {
      onError: (errors: ClientError) => {
        toast({
          description: (
            errors.response.errors?.at(0)?.extensions.displayErrors as string[]
          )
            .map((error) => error)
            .join(" "),
          duration: 2000,
          variant: "danger"
        })
      },
      onSuccess: (data) => {
        if (data?.createProject?.id) {
          toast({
            description: "پروژه با موفقیت اضافه شد",
            duration: 2000,
            variant: "success"
          })
          router.push(`/profile/projects/${data.createProject.id}`)
        } else {
          toast({
            description: "خطا درایجاد پروژه",
            duration: 2000,
            variant: "danger"
          })
        }
      }
    }
  )

  const updateProjectMutation = useUpdateProjectMutation(
    graphqlRequestClientWithToken,
    {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["FindOneProject"]
        })
        setActiveTab(PROJECT_TAB.ADDRESSES)
      }
    }
  )

  const onSubmit = (data: CreateProjectType) => {
    if (isNew) {
      return createProjectMutation.mutate({
        createProjectInput: {
          name: data.name
        }
      })
    }

    updateProjectMutation.mutate({
      updateProjectInput: {
        id: +uuid,
        name: data.name
      }
    })
  }

  useEffect(() => {
    if (findOneProjectQuery?.data?.findOneProject?.name) {
      form.setValue("name", findOneProjectQuery.data.findOneProject?.name)
    }
  }, [findOneProjectQuery?.data])

  return (
    <Form {...form}>
      <form className="md:py-5" onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 gap-x-7 gap-y-5 md:grid-cols-3 2xl:grid-cols-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>نام پروژه</FormLabel>
                <FormControl>
                  <Input
                    disabled={
                      (findOneProjectQuery.isLoading &&
                        findOneProjectQuery.isFetching) ||
                      updateProjectMutation.isLoading ||
                      createProjectMutation.isLoading
                    }
                    type="text"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="absolute bottom-[calc(env(safe-area-inset-bottom)*0.5+8rem)] flex w-full justify-end md:relative md:bottom-0">
          <Button
            className="w-full md:w-fit"
            disabled={
              !form.watch("name") ||
              updateProjectMutation.isLoading ||
              createProjectMutation.isLoading ||
              (findOneProjectQuery.isLoading &&
                findOneProjectQuery.isFetching) ||
              (form.watch("name") &&
                findOneProjectQuery?.data?.findOneProject?.name ===
                  form.watch("name"))
            }
            loading={
              updateProjectMutation.isLoading ||
              createProjectMutation.isLoading ||
              (findOneProjectQuery.isLoading && findOneProjectQuery.isFetching)
            }
            type="submit"
            variant="primary"
          >
            ذخیره اطلاعات
          </Button>
        </div>
      </form>
    </Form>
  )
}

export default ProjectInfoTab
