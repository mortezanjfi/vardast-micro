"use client"

import { usePathname, useRouter } from "next/navigation"
import { BookmarkIcon as OutlineBookmarkIcon } from "@heroicons/react/24/outline"
import { BookmarkIcon } from "@heroicons/react/24/solid"
import { UseQueryResult } from "@tanstack/react-query"
import {
  EntityTypeEnum,
  GetIsFavoriteQuery,
  useUpdateFavoriteMutation
} from "@vardast/graphql/generated"
import { toast } from "@vardast/hook/use-toast"
import graphqlRequestClient from "@vardast/query/queryClients/graphqlRequestClient"
import { Button } from "@vardast/ui/button"
import { ClientError } from "graphql-request"
import { useSession } from "next-auth/react"

type Props = {
  isFavoriteQuery: UseQueryResult<GetIsFavoriteQuery, unknown>
  type: EntityTypeEnum
  entityId: number
}

export default function FavoriteIcon({
  isFavoriteQuery,
  type,
  entityId
}: Props) {
  const { data: session } = useSession()
  const pathname = usePathname()
  const router = useRouter()
  const createEventTrackerMutation = useUpdateFavoriteMutation(
    graphqlRequestClient(session),
    {
      onSuccess: () => {
        isFavoriteQuery.refetch()
      },
      onError: (errors: ClientError) => {
        router.replace(`/auth/signin${pathname}`)

        if (
          errors.response.errors?.find(
            (error) => error.extensions?.code === "FORBIDDEN"
          )
        ) {
          // toast({
          //   description:
          //     "لطفا برای مشاهده اطلاعات تماس، ابتدا وارد حساب کاربری خود شوید.",
          //   duration: 8000,
          //   variant: "default"
          // })
          console.log("redirect to login for FORBIDDEN favorite visit")

          router.replace(`/auth/signin${pathname}`)
        } else {
          toast({
            description: (
              errors.response.errors?.at(0)?.extensions
                .displayErrors as string[]
            ).map((error) => error),
            duration: 8000,
            variant: "default"
          })
        }
      }
    }
  )

  const toggleFavorite = () => {
    createEventTrackerMutation.mutate({
      UpdateFavoriteInput: {
        type,
        entityId
      }
    })
  }

  return (
    <Button
      id="header-back-button"
      variant={"ghost"}
      onClick={toggleFavorite}
      //   loading={createEventTrackerMutation.isLoading}
      disabled={createEventTrackerMutation.isLoading}
      iconOnly
    >
      {isFavoriteQuery.data?.isFavorite ? (
        <BookmarkIcon className="h-6 w-6 text-primary" />
      ) : (
        <OutlineBookmarkIcon className="h-6 w-6 text-alpha" />
      )}
    </Button>
  )
}
