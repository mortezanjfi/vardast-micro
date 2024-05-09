"use client"

import { ReactElement, useEffect } from "react"
import { UseInfiniteQueryResult } from "@tanstack/react-query"
import { useInView } from "react-intersection-observer"

import NoProductFound from "./no-product-found"

interface IInfiniteScrollPagination<T> {
  infiniteQuery: UseInfiniteQueryResult<T, unknown>
  CardLoader: React.FC
  fetchingLoaderCount?: number
  // eslint-disable-next-line no-unused-vars
  children(
    _: T,
    // eslint-disable-next-line no-unused-vars
    ref: ((node?: Element | null | undefined) => void) | undefined,
    // eslint-disable-next-line no-unused-vars
    props: any
  ): ReactElement
}

const InfiniteScrollPagination = <T extends unknown>({
  infiniteQuery,
  CardLoader,
  children,
  fetchingLoaderCount = 3,
  ...props
}: IInfiniteScrollPagination<T>) => {
  const { ref, inView } = useInView({ threshold: 0.1 })

  useEffect(() => {
    if (inView) {
      infiniteQuery.fetchNextPage()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView])

  return (
    <>
      {infiniteQuery.data?.pages && infiniteQuery.data?.pages.length > 0 ? (
        <>
          {infiniteQuery?.data?.pages.map((page: T) =>
            children(page, infiniteQuery.hasNextPage ? ref : undefined, props)
          )}
          {infiniteQuery.isFetching &&
            infiniteQuery.isFetchingNextPage &&
            [...Array(3)].map((_, loader) => (
              <CardLoader key={`infinite-scroll-loader-${loader}`} />
            ))}
        </>
      ) : infiniteQuery.isFetching && infiniteQuery.isLoading ? (
        [...Array(fetchingLoaderCount)].map((_, loader) => (
          <CardLoader key={`infinite-scroll-outer-loader-${loader}`} />
        ))
      ) : (
        <NoProductFound />
      )}
    </>
  )
}

export default InfiniteScrollPagination
