"use client"

import { usePathname } from "next/navigation"
import { PopoverArrow } from "@radix-ui/react-popover"
import { useGetVocabularyQuery } from "@vardast/graphql/generated"
import paths from "@vardast/lib/paths"
import graphqlRequestClientWithoutToken from "@vardast/query/queryClients/graphqlRequestClientWithoutToken"
import { Popover, PopoverContent, PopoverTrigger } from "@vardast/ui/popover"
import slugify from "@vardast/util/persian-slugify"
import { LucideChevronDown } from "lucide-react"
import { Session } from "next-auth"

import Link from "./Link"

type Props = {
  session: Session | null
}

const FrontPageHeader = ({ session }: Props) => {
  const pathname = usePathname()
  const categories = useGetVocabularyQuery(graphqlRequestClientWithoutToken, {
    slug: "product_categories"
  })

  return (
    <div className="flex items-center py-12">
      {categories.data && (
        <ol className="flex items-center gap-4">
          {categories.data?.vocabulary.categories.slice(0, 5).map(
            (category) =>
              category && (
                <li key={category.id}>
                  <Link
                    className="whitespace-nowrap"
                    href={`/products/${category.id}/${slugify(category.title)}`}
                  >
                    {category.title}
                  </Link>
                </li>
              )
          )}
          <li>
            <Popover>
              <PopoverTrigger asChild>
                <button className="flex items-center gap-1.5">
                  <span>دیگر دسته‌بندی‌ها</span>
                  <LucideChevronDown className="h-4 w-4" />
                </button>
              </PopoverTrigger>
              <PopoverContent>
                <PopoverArrow />
                <div className="card rounded-md px-4">
                  <ol className="flex flex-col divide-y divide-alpha-200">
                    {categories.data?.vocabulary.categories.slice(5).map(
                      (category) =>
                        category && (
                          <li key={category.id}>
                            <Link
                              className="inline-block whitespace-nowrap py-3"
                              href={`/products/${category.id}/${slugify(
                                category.title
                              )}`}
                            >
                              {category.title}
                            </Link>
                          </li>
                        )
                    )}
                  </ol>
                </div>
              </PopoverContent>
            </Popover>
          </li>
        </ol>
      )}
      <div className="mr-auto flex gap-x">
        {session?.profile?.roles.some(
          (role) => role?.name === "admin" || role?.name === "seller"
        ) ? (
          <>
            {session?.profile?.roles.some((role) => role?.name === "admin") ? (
              <Link
                className="btn btn-md btn-primary block"
                href={process.env.NEXT_PUBLIC_ADMIN_VARDAST}
              >
                ورود به پنل ادمین
              </Link>
            ) : (
              <Link
                className="btn btn-md btn-primary block"
                href={process.env.NEXT_PUBLIC_SELLER_VARDAST}
              >
                ورود به پنل فروشنده
              </Link>
            )}
          </>
        ) : (
          !session?.user && (
            <Link
              className="btn btn-ghost"
              href={`${paths.signin}?ru=${pathname}`}
            >
              ورود / ثبت‌نام
            </Link>
          )
        )}
        {session?.user && (
          <Link className="btn btn-danger" href="/auth/signout">
            خروج
          </Link>
        )}
      </div>
    </div>
  )
}

export default FrontPageHeader
