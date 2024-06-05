"use client"

import { useCallback, useContext, useEffect, useState } from "react"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import { ChevronLeftIcon } from "@heroicons/react/24/outline"
import {
  useClickOutside,
  useDebouncedState,
  useLocalStorage
} from "@mantine/hooks"
import { useGetSuggestQuery } from "@vardast/graphql/generated"
import { PublicContext } from "@vardast/provider/PublicProvider"
import graphqlRequestClientWithoutToken from "@vardast/query/queryClients/graphqlRequestClientWithoutToken"
import { Button } from "@vardast/ui/button"
import { Input } from "@vardast/ui/input"
import clsx from "clsx"
import { AnimatePresence, motion } from "framer-motion"
import { useAtom } from "jotai"
import { Loader2, LucideSearch, LucideTrash, LucideX } from "lucide-react"

import Link from "./Link"
import Progress from "./Progress"

interface ILatestSearchType {
  query: string
  uri: string
}

interface ISearch {
  isMobileView: boolean
}

const Search: React.FC<ISearch> = ({ isMobileView }) => {
  const { globalSearchModalAtom } = useContext(PublicContext)
  const [open, setOpen] = useAtom(globalSearchModalAtom)

  return (
    <>
      {!isMobileView && (
        <div
          className={clsx([
            "fixed inset-0 z-20 h-full w-full bg-alpha-800 transition duration-200",
            open ? "visible opacity-50" : "invisible hidden opacity-0"
          ])}
        ></div>
      )}

      <div
        className={clsx([
          "relative mx-auto h-full w-full transform transition-all",
          open && " opacity-0"
        ])}
      >
        <Button
          onClick={() => setOpen(true)}
          noStyle
          className="flex
          h-full
          w-full
          items-center
          gap-2
          rounded-lg
          bg-alpha-100
          px-4
          py-3"
        >
          <LucideSearch className="h-6 w-6 text-primary" />
          <span className="text-alpha-800">جستجو در وردست...</span>
          {isMobileView && <Progress />}
        </Button>
      </div>
    </>
  )
}

export const SearchActionModal: React.FC<ISearch> = ({ isMobileView }) => {
  const [loader, setLoader] = useState(false)
  const { globalSearchModalAtom } = useContext(PublicContext)
  const [open, setOpen] = useAtom(globalSearchModalAtom)
  const router = useRouter()
  const pathname = usePathname()
  const [latestSearch, SetLatestSearch] = useLocalStorage<ILatestSearchType[]>({
    key: "latest-search",
    defaultValue: []
  })

  const ref = useClickOutside(() => {
    if (open) onCloseModal()
  })

  const [query, setQuery] = useDebouncedState<string>("", 500)

  const searchQuery = useGetSuggestQuery(
    graphqlRequestClientWithoutToken,
    {
      suggestInput: {
        query
      }
    },
    {
      enabled: !!query
    }
  )

  const navigateTo = ({ query, uri }: { query?: string; uri: string }) => {
    if (query) {
      SetLatestSearch((values) => {
        const newSearch = {
          query,
          uri: uri
        }
        const temp = [...values, newSearch]
        return temp
          .filter((n) => n)
          .filter(
            (value, index, self) =>
              index === self.findIndex((t) => t.query === value.query)
          )
      })
    }
    setLoader(true)
    router.push(uri)
  }

  const onCloseModal = useCallback(() => {
    setOpen(false)
    setLoader(false)
    setQuery("")
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    onCloseModal()
  }, [onCloseModal, pathname])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="search-modal"
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          className={clsx([
            open ? "z-[99]" : "",
            "w-full",
            open
              ? isMobileView
                ? "fixed inset-0 mx-auto w-full overflow-y-auto"
                : "relative mx-auto md:max-w-md lg:max-w-lg"
              : ""
          ])}
        >
          <div
            ref={ref}
            className={clsx([
              "card absolute w-full overscroll-contain px-4 pt-3",
              isMobileView ? "top-0 h-full " : "top rounded-md"
            ])}
          >
            <div className="relative flex transform items-center rounded-lg border-alpha-200 bg-alpha-100 pr-2 transition-all">
              {loader ? (
                <Loader2 className="h-6 w-6 animate-spin text-alpha-400" />
              ) : (
                <LucideSearch className="h-6 w-6 text-primary" />
              )}
              <Input
                autoFocus
                disabled={loader}
                defaultValue={query}
                onChange={(e) => setQuery(e.target.value)}
                type="text"
                placeholder="جستجو در وردست..."
                className="flex h-full
                w-full
                items-center
                gap-2
                rounded-lg
                bg-alpha-100
                px-4
                py-3
                placeholder:text-alpha-700 focus:!ring-0 disabled:bg-alpha-100"
              />
              <Button
                variant="ghost"
                size="small"
                iconOnly
                className="rounded-full"
                onClick={() => onCloseModal()}
              >
                <LucideX className="icon" />
              </Button>
            </div>
            <div className="py-6">
              {!query && latestSearch.length > 0 && (
                <div>
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-semibold text-alpha-700 md:text-base">
                      آخرین جستجوی‌های شما
                    </div>
                    <Button
                      disabled={loader}
                      variant="ghost"
                      iconOnly
                      size="small"
                      onClick={() => SetLatestSearch([])}
                    >
                      <LucideTrash className="icon text-alpha-400" />
                    </Button>
                  </div>
                  <ul className="hide-scrollbar flex items-center gap-3 overflow-x-auto overflow-y-hidden whitespace-nowrap py-4">
                    {latestSearch.map((item, idx: number) => (
                      <li key={idx}>
                        <Button
                          disabled={loader}
                          noStyle
                          className="inline-flex rounded-lg border border-alpha-200 px-3 py-2 text-sm text-alpha-600 shadow-sm hover:bg-alpha-100 hover:text-alpha-700"
                          onClick={() => {
                            navigateTo({
                              uri: `${item.uri}`
                            })
                          }}
                        >
                          {item.query}
                        </Button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {searchQuery.fetchStatus === "fetching" &&
                searchQuery.status === "loading" && (
                  <div className="flex animate-pulse flex-col gap-3">
                    <div className="h-12 w-[30%] rounded-md bg-alpha-200"></div>
                    <div className="h-5 w-[80%] rounded-md bg-alpha-200"></div>
                    <div className="h-5 w-full rounded-md bg-alpha-200"></div>
                    <div className="h-5 w-[90%] rounded-md bg-alpha-200"></div>
                    <div className="h-5 w-[70%] rounded-md bg-alpha-200"></div>
                  </div>
                )}

              {searchQuery.data && (
                <div className="flex flex-col gap-6 divide-y divide-alpha-200 [&>div:nth-child(n+2)]:pt-4">
                  {searchQuery.data.suggest.products.length > 0 && (
                    <div className="hide-scrollbar flex items-center gap-3 overflow-x-auto overflow-y-hidden whitespace-nowrap">
                      {searchQuery.data.suggest.products.slice(0, 4).map(
                        (suggestedProduct) =>
                          suggestedProduct && (
                            <Button
                              disabled={loader}
                              noStyle
                              onClick={() =>
                                navigateTo({
                                  uri: `/product/${suggestedProduct.id}/${suggestedProduct.name}`
                                })
                              }
                              key={suggestedProduct.id}
                              className="flex items-start gap-2 rounded-md border border-alpha-200 p-2"
                            >
                              <div className="relative h-14 w-14 rounded-md">
                                <Image
                                  src={
                                    suggestedProduct.images.at(0)?.file
                                      .presignedUrl.url as string
                                  }
                                  alt={suggestedProduct.name}
                                  className="object-contain"
                                  sizes="5vw"
                                  fill
                                />
                              </div>
                              <div className="text-sm text-alpha-800">
                                {suggestedProduct.name}
                              </div>
                            </Button>
                          )
                      )}
                      <Link
                        href="/products"
                        className="flex items-center gap-x-0.5 text-sm font-semibold text-primary"
                      >
                        نمایش همه
                        <ChevronLeftIcon className="h-4 w-4 text-primary" />
                      </Link>
                    </div>
                  )}
                  {searchQuery.data.suggest.categories.length > 0 && (
                    <div>
                      {searchQuery.data.suggest.categories.slice(0, 4).map(
                        (suggestedCategory) =>
                          suggestedCategory && (
                            <Button
                              disabled={loader}
                              noStyle
                              className="w-full rounded px-3 py-2 text-start text-alpha-700 hover:bg-alpha-50"
                              onClick={() =>
                                navigateTo({
                                  query,
                                  uri: `/products/${suggestedCategory.id}/${suggestedCategory.title}`
                                })
                              }
                              key={suggestedCategory.id}
                            >
                              جستجوی {query} در دسته{" "}
                              <strong className="text-primary-500">
                                {suggestedCategory.title}
                              </strong>
                            </Button>
                          )
                      )}
                      <Link
                        href="/categories"
                        className="flex items-center justify-end gap-x-0.5 text-sm font-semibold text-primary"
                      >
                        نمایش همه
                        <ChevronLeftIcon className="h-4 w-4 text-primary" />
                      </Link>
                    </div>
                  )}
                  {searchQuery.data.suggest.brand.length > 0 && (
                    <div>
                      {searchQuery.data.suggest.brand.slice(0, 4).map(
                        (suggestedCategory) =>
                          suggestedCategory && (
                            <Button
                              disabled={loader}
                              noStyle
                              className="w-full rounded px-3 py-2 text-start text-alpha-700 hover:bg-alpha-50"
                              onClick={() =>
                                navigateTo({
                                  query,
                                  uri: `/brand/${suggestedCategory.id}/${suggestedCategory.name}`
                                })
                              }
                              key={suggestedCategory.id}
                            >
                              جستجوی {query} در برند{" "}
                              <strong className="text-primary-500">
                                {suggestedCategory.name}
                              </strong>
                            </Button>
                          )
                      )}
                      <Link
                        href="/brands"
                        className="flex items-center justify-end gap-x-0.5 text-sm font-semibold text-primary"
                      >
                        نمایش همه
                        <ChevronLeftIcon className="h-4 w-4 text-primary" />
                      </Link>
                    </div>
                  )}
                  {searchQuery.data.suggest.seller.length > 0 && (
                    <div>
                      {searchQuery.data.suggest.seller.slice(0, 4).map(
                        (suggestedCategory) =>
                          suggestedCategory && (
                            <Button
                              disabled={loader}
                              noStyle
                              className="w-full rounded px-3 py-2 text-start text-alpha-700 hover:bg-alpha-50"
                              onClick={() =>
                                navigateTo({
                                  query,
                                  uri: `/seller/${suggestedCategory.id}/${suggestedCategory.name}`
                                })
                              }
                              key={suggestedCategory.id}
                            >
                              جستجوی {query} در فروشنده‌{" "}
                              <strong className="text-primary-500">
                                {suggestedCategory.name}
                              </strong>
                            </Button>
                          )
                      )}
                      <Link
                        href="/sellers"
                        className="flex items-center justify-end gap-x-0.5 self-center text-sm font-semibold text-primary"
                      >
                        نمایش همه
                        <ChevronLeftIcon className="h-4 w-4 text-primary" />
                      </Link>
                    </div>
                  )}
                  <div>
                    <Button
                      disabled={loader}
                      noStyle
                      className="flex w-full items-center gap-2 rounded px-3 py-2 text-start text-alpha-700 hover:bg-alpha-50"
                      onClick={() =>
                        navigateTo({
                          query,
                          uri: `/products?query=${query}`
                        })
                      }
                    >
                      <LucideSearch className="h-5 w-5" />
                      <span>{query}</span>
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default Search
