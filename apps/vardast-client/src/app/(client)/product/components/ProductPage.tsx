"use client"

import { useContext, useEffect } from "react"
import { notFound } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import Loading from "@vardast/component/Loading"
import LoadingFailed from "@vardast/component/LoadingFailed"
import NoResult from "@vardast/component/NoResult"
import ProductDescription from "@vardast/component/product-description"
import {
  EventTrackerTypes,
  GetProductQuery,
  Offer,
  Product,
  Image as ProductImage,
  Seller,
  Uom
} from "@vardast/graphql/generated"
import { setBreadCrumb } from "@vardast/provider/LayoutProvider/use-layout"
import { PublicContext } from "@vardast/provider/PublicProvider"
import { getProductQueryFn } from "@vardast/query/queryFns/productQueryFns"
import QUERY_FUNCTIONS_KEY from "@vardast/query/queryFns/queryFunctionsKey"
import { CrumbItemProps } from "@vardast/type/breadcrumb"
import { addDays, format, setDefaultOptions } from "date-fns"
import { faIR } from "date-fns/locale"
import { ClientError } from "graphql-request"
import { useSetAtom } from "jotai"
import { useSession } from "next-auth/react"
import {
  AggregateOffer,
  BreadcrumbList,
  ItemList,
  Offer as OfferSchema,
  Product as ProductSchema,
  WithContext
} from "schema-dts"

import ProductAttributes from "@/app/(client)/product/components/product-attributes"
import ProductImages from "@/app/(client)/product/components/product-images"
import ProductOffers from "@/app/(client)/product/components/product-offers"
import ProductIntroduce from "@/app/(client)/product/components/ProductIntroduce"
import SameCategories from "@/app/(client)/product/components/SameCategories"

export type GroupedAttributes = {
  name: string
  values: string[]
  uom: Uom
  isRequired: boolean
}

type ProductPageProps = {
  isMobileView: boolean
  id: number
}

const ProductPage = ({ id, isMobileView }: ProductPageProps) => {
  const { data: session } = useSession()
  const { contactModalDataAtom } = useContext(PublicContext)
  const setContactModalData = useSetAtom(contactModalDataAtom)
  const queryProduct = useQuery<GetProductQuery>({
    queryKey: [QUERY_FUNCTIONS_KEY.PRODUCT_QUERY_KEY, { id: +id }],
    queryFn: () => getProductQueryFn(id)
  })

  useEffect(() => {
    if (queryProduct.data?.product.lowestPrice) {
      setContactModalData({
        data: queryProduct.data?.product.lowestPrice?.seller as Seller,
        type: EventTrackerTypes.ViewBuyBox,
        title: "اطلاعات تماس"
      })
    }
  }, [
    queryProduct.data?.product.lowestPrice,
    queryProduct.data?.product.lowestPrice?.seller,
    setContactModalData
  ])

  if (queryProduct.isLoading) return <Loading />
  if (queryProduct.error) {
    if (
      (queryProduct?.error as ClientError)?.response?.errors?.at(0)?.extensions
        .status === 404
    ) {
      return notFound()
    }
    return <LoadingFailed />
  }
  if (!queryProduct.data) return <NoResult entity="product" />

  let groupedAttributes: GroupedAttributes[] = []
  queryProduct.data?.product.attributeValues.forEach((attributeValue) => {
    if (!attributeValue) return
    const attributeId = attributeValue.attribute.id
    const attributeName = attributeValue.attribute.name
    const attributeValueValue = attributeValue.value

    if (groupedAttributes[attributeId]) {
      groupedAttributes[attributeId].values.push(attributeValueValue)
    } else {
      groupedAttributes[attributeId] = {
        name: attributeName,
        values: [attributeValueValue],
        uom: attributeValue.attribute.uom as Uom,
        isRequired: attributeValue.attribute.isRequired
      }
    }
  })
  groupedAttributes = groupedAttributes.filter((n) => n)

  const breadcrumbJsonLdArray = []
  queryProduct.data?.product.category.parentsChain.forEach((parent, idx) => {
    breadcrumbJsonLdArray.push({
      "@type": "ListItem",
      position: idx + 2,
      item: {
        "@id": encodeURI(
          `${process.env.NEXT_PUBLIC_URL}/product/${parent.id}/${parent.title}`
        ),
        name: parent.title
      }
    })
  })

  breadcrumbJsonLdArray.push({
    "@type": "ListItem",
    position:
      queryProduct.data?.product.category.parentsChain &&
      queryProduct.data?.product.category.parentsChain.length + 2,
    item: {
      "@id": encodeURI(
        `${process.env.NEXT_PUBLIC_URL}/products/${queryProduct.data?.product.category.id}/${queryProduct.data?.product.category.title}`
      ),
      name: queryProduct.data?.product.category.title
    }
  })

  const breadcrumbJsonLd: WithContext<BreadcrumbList> = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        item: {
          "@id": process.env.NEXT_PUBLIC_URL as string,
          name: process.env.NEXT_PUBLIC_TITLE as string
        }
      },
      ...(breadcrumbJsonLdArray as ItemList[]),
      {
        "@type": "ListItem",
        position: breadcrumbJsonLdArray.length + 2,
        item: {
          "@id": encodeURI(
            `${process.env.NEXT_PUBLIC_URL}/products/${queryProduct.data?.product.id}/${queryProduct.data?.product.name}`
          ),
          name: queryProduct.data?.product.name
        }
      }
    ]
  }

  const breadcrumb: CrumbItemProps[] = []
  queryProduct.data?.product.category.parentsChain.forEach((parent) => {
    breadcrumb.push({
      label: parent.title,
      path: `/products/${parent.id}/${parent.title}`,
      isCurrent: false
    })
  })

  breadcrumb.push({
    label: queryProduct.data?.product.category.title ?? "",
    path: `/products/${queryProduct.data?.product.category.id}/${queryProduct.data?.product.category.title}`,
    isCurrent: false
  })

  let offersJsonLd = {}
  if (
    queryProduct.data?.product.publicOffers &&
    queryProduct.data?.product.publicOffers.length > 0
  ) {
    const offersTemp: OfferSchema[] = []
    queryProduct.data?.product.publicOffers.forEach((offer) => {
      offersTemp.push({
        "@type": "Offer",
        price: (offer?.lastPublicConsumerPrice?.amount || 0) * 10,
        priceCurrency: "IRR",
        name: offer?.seller.name,
        priceValidUntil: format(addDays(new Date(), 1), "yyyy-MM-dd"),
        itemCondition: "NewCondition",
        availability: "InStock"
      })
    })
    offersJsonLd = {
      "@type": "AggregateOffer",
      priceCurrency: "IRR",
      lowPrice: (queryProduct.data?.product.lowestPrice?.amount || 0) * 10,
      highPrice: (queryProduct.data?.product.highestPrice?.amount || 0) * 10,
      offerCount: queryProduct.data?.product.publicOffers.length,
      offers: offersTemp
    }
  }
  const productJsonLd: WithContext<ProductSchema> = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: queryProduct.data?.product.name,
    image: queryProduct.data?.product.images.at(0)?.file.presignedUrl.url,
    sku: queryProduct.data?.product.sku,
    url: `${process.env.NEXT_PUBLIC_URL}/product/${queryProduct.data?.product.id}/${queryProduct.data?.product.name}`,
    offers: offersJsonLd as AggregateOffer
  }

  setDefaultOptions({
    locale: faIR,
    weekStartsOn: 6
  })

  setBreadCrumb(breadcrumb)

  return (
    <>
      {/* <SellerCardDesktop
        offers={queryProduct?.data?.product?.publicOffers[0] as Offer}
      /> */}
      <div className="flex h-full w-full flex-col gap-1  pb-6 sm:gap-0 sm:pb-0">
        <div className="flex flex-col xl:flex-row xl:gap-x-9">
          {queryProduct.data?.product.images &&
            queryProduct.data?.product.images.length > 0 && (
              <ProductImages
                isMobileView={isMobileView}
                images={queryProduct.data?.product.images as ProductImage[]}
                session={session}
                product={queryProduct.data?.product as Product}
              />
            )}

          <div className=" flex w-full flex-col sm:flex-1">
            <div className="flex w-full flex-col  divide-y-4 divide-alpha-50 md:gap-0 md:bg-alpha-white">
              <ProductIntroduce
                isMobileView={isMobileView}
                session={session}
                product={queryProduct.data?.product as Product}
              />
              {groupedAttributes.filter((item) => !!item.isRequired).length >
                0 && (
                <ProductAttributes
                  title="مشخصات اصلی"
                  attributes={
                    groupedAttributes.filter(
                      (item) => !!item.isRequired
                    ) as GroupedAttributes[]
                  }
                />
              )}
              {queryProduct.data?.product.attributeValues &&
                queryProduct.data?.product.attributeValues.length > 0 && (
                  // <ProductDetails
                  //   attributes={groupedAttributes as GroupedAttributes[]}
                  // />

                  <ProductAttributes
                    title="مشخصات فرعی"
                    attributes={
                      groupedAttributes.filter(
                        (item) => !item.isRequired
                      ) as GroupedAttributes[]
                    }
                  />
                )}
              {queryProduct.data?.product.publicOffers &&
                queryProduct.data?.product.publicOffers.length > 0 && (
                  <ProductOffers
                    isMobileView={isMobileView}
                    uom={queryProduct.data?.product.uom as Uom}
                    offers={queryProduct.data?.product.publicOffers as Offer[]}
                  />
                )}

              {queryProduct.data?.product.description && (
                <ProductDescription
                  description={queryProduct.data?.product.description}
                />
              )}
            </div>
          </div>
        </div>
        <div className="w-full">
          {queryProduct.data?.product.sameCategory &&
            queryProduct.data?.product.sameCategory.length > 0 && (
              <SameCategories
                isMobileView={isMobileView}
                hasExtraItem={{
                  title: "کالاهای مشابه",
                  subtitle: "نمایش همه"
                }}
                products={queryProduct.data?.product.sameCategory as Product[]}
              />
            )}
        </div>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
    </>
  )
}

export default ProductPage
