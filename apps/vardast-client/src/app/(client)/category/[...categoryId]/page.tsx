import { Metadata } from "next"
import { dehydrate } from "@tanstack/react-query"
import CategoriesPage from "@vardast/component/category/CategoriesPage"
import { ReactQueryHydrate } from "@vardast/provider/ReactQueryHydrate"
import getQueryClient from "@vardast/query/queryClients/getQueryClient"
import { getCategoryQueryFn } from "@vardast/query/queryFns/categoryQueryFns"
import QUERY_FUNCTIONS_KEY from "@vardast/query/queryFns/queryFunctionsKey"
import { CheckIsMobileView } from "@vardast/util/checkIsMobileView"

interface CategoryIdPageIndexProps {
  params: {
    categoryId: string
  }
}
const titlePrefix = process.env.NEXT_PUBLIC_CATEGORY_TITLE_PREFIX
const titleSuffix = process.env.NEXT_PUBLIC_CATEGORY_TITLE_SUFFIX

export async function generateMetadata(
  { params }: CategoryIdPageIndexProps
  // parent: ResolvingMetadata
): Promise<Metadata> {
  if (params?.categoryId && params.categoryId[0]) {
    try {
      const data = await getCategoryQueryFn(+params.categoryId[0])
      return {
        title: `${titlePrefix} ${data.category.title} ${titleSuffix}`,
        description: data.category.description,
        alternates: {
          canonical: encodeURI(
            `${process.env.NEXTAUTH_URL}/category/${data.category.id}/${data.category.title}`
          )
        }
      }
    } catch (error) {
      // throw Error("generateMetadata category")
      console.log("generateMetadata category", error)
    }

    return {
      title: "دسته بندی یافت نشد"
    }
  }
  return {
    title: "دسته بندی وردست"
  }
}

const CategoryIdPage: React.FC<CategoryIdPageIndexProps> = async ({
  params: { categoryId }
}) => {
  const isMobileView = await CheckIsMobileView()
  const queryClient = getQueryClient()
  await queryClient.prefetchQuery(
    [QUERY_FUNCTIONS_KEY.CATEGORY_QUERY_KEY, { id: categoryId[0] }],
    () => getCategoryQueryFn(+categoryId[0])
  )
  const dehydratedState = dehydrate(queryClient)

  return (
    <ReactQueryHydrate state={dehydratedState}>
      <CategoriesPage categoryId={categoryId[0]} isMobileView={isMobileView} />
    </ReactQueryHydrate>
  )
}

export default CategoryIdPage
