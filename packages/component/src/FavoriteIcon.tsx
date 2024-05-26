"use client"

import { usePathname, useRouter } from "next/navigation"
import {
  BookmarkIcon as OutlineBookmarkIcon,
  ShoppingCartIcon as OutlineShoppingCartIcon
} from "@heroicons/react/24/outline"
import { BookmarkIcon, ShoppingCartIcon } from "@heroicons/react/24/solid"
import { UseQueryResult } from "@tanstack/react-query"
import {
  EntityTypeEnum,
  GetIsFavoriteQuery,
  useUpdateFavoriteMutation
} from "@vardast/graphql/generated"
import { toast } from "@vardast/hook/use-toast"
import graphqlRequestClientWithToken from "@vardast/query/queryClients/graphqlRequestClientWithToken"
import { Button } from "@vardast/ui/button"
import { ClientError } from "graphql-request"

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
  const pathname = usePathname()
  const router = useRouter()
  const createEventTrackerMutation = useUpdateFavoriteMutation(
    graphqlRequestClientWithToken,
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
      {type === EntityTypeEnum.Basket ? (
        isFavoriteQuery.data?.isFavorite ? (
          <ShoppingCartIcon className="h-6 w-6 text-primary" />
        ) : (
          <OutlineShoppingCartIcon className="h-6 w-6 text-alpha" />
        )
      ) : isFavoriteQuery.data?.isFavorite ? (
        <BookmarkIcon className="h-6 w-6 text-primary" />
      ) : (
        <OutlineBookmarkIcon className="h-6 w-6 text-alpha" />
      )}
    </Button>
  )
}
