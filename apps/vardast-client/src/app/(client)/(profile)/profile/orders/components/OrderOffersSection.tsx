import { useState } from "react"
import { Product } from "@vardast/graphql/generated"

import AddPriceModal from "@/app/(client)/(profile)/profile/orders/components/AddPriceModal"
import OrderProductCard, {
  OrderProductCardSkeleton
} from "@/app/(client)/(profile)/profile/orders/components/OrderProductCard"
import OrderProductListContainer from "@/app/(client)/(profile)/profile/orders/components/OrderProductListContainer"
import { NotFoundItems } from "@/app/(public)/(purchaser)/favorites/components/FavoritesPageIndex"

type OrderOffersSectionProps = {}

const OrderOffersSection = ({}: OrderOffersSectionProps) => {
  const [open, setOpen] = useState<boolean>(false)

  const OfferProducts = [
    {
      rating: 3,
      id: 345408,
      slug: "902911",
      name: "هود اخوان مدل H11",
      sku: "902911",
      isActive: true,
      status: "CONFIRMED",
      techNum: "110307001174",
      highestPrice: {
        amount: 4537000,
        id: 759588,
        type: "CONSUMER",
        createdAt: "2024-04-21T15:20:59.500Z",
        isPublic: true
      },
      lowestPrice: {
        amount: 4537000,
        id: 759588,
        type: "CONSUMER",
        createdAt: "2024-04-21T15:20:59.500Z",
        isPublic: true,
        discount: null
      },
      category: {
        id: 3867,
        title: "سایر هودها",
        slug: "سایر هودها"
      },
      images: [
        {
          id: 488463,
          sort: 1,
          isPublic: true,
          file: {
            id: 507405,
            presignedUrl: {
              url: "http://storage:9000/vardast/product/image/files/7257de2d764a64fdf6a691d72d1baba5.webp?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=farbod%2F20240513%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20240513T090131Z&X-Amz-Expires=3600&X-Amz-SignedHeaders=host&X-Amz-Signature=03729705d7d1fb863024270a7fbd88fb62ed0e61b56dcadbde846feb41c99373"
            }
          }
        }
      ],
      uom: {
        id: 1,
        name: "عدد",
        slug: "عدد",
        symbol: "عدد",
        isActive: true
      }
    },
    {
      rating: 3,
      id: 345409,
      slug: "180674",
      name: "هود بیمکث مدل B2018U شومینه‌ ای سایز 90",
      sku: "180674",
      isActive: true,
      status: "CONFIRMED",
      techNum: "110303000238",
      highestPrice: {
        amount: 5000000,
        id: 170753,
        type: "CONSUMER",
        createdAt: "2023-10-21T08:46:07.012Z",
        isPublic: true
      },
      lowestPrice: {
        amount: 5000000,
        id: 476404,
        type: "CONSUMER",
        createdAt: "2024-03-04T10:04:04.453Z",
        isPublic: true,
        discount: null
      },
      category: {
        id: 3869,
        title: "هود شومینه ای",
        slug: "هود شومینه ای"
      },
      images: [
        {
          id: 488464,
          sort: 1,
          isPublic: true,
          file: {
            id: 507406,
            presignedUrl: {
              url: "http://storage:9000/vardast/product/image/files/36f8cf21fe15ac32bb0442cde8720be6.webp?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=farbod%2F20240513%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20240513T090131Z&X-Amz-Expires=3600&X-Amz-SignedHeaders=host&X-Amz-Signature=3b8aed534e012828324ffaf8acd3363dfb97dc6e89d0444c02b387cc6f5e255c"
            }
          }
        },
        {
          id: 488465,
          sort: 2,
          isPublic: true,
          file: {
            id: 507407,
            presignedUrl: {
              url: "http://storage:9000/vardast/product/image/files/e85a2d4af8917090fb3a4a9e1ec98dc9.webp?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=farbod%2F20240513%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20240513T090131Z&X-Amz-Expires=3600&X-Amz-SignedHeaders=host&X-Amz-Signature=721ca97cd0e0d5bba265bbc02b1f7589babc216627d183c0b91ab6ccb1647549"
            }
          }
        },
        {
          id: 488466,
          sort: 3,
          isPublic: true,
          file: {
            id: 507408,
            presignedUrl: {
              url: "http://storage:9000/vardast/product/image/files/dd42e008adfc8830ff2b515dc0b2628d.webp?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=farbod%2F20240513%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20240513T090131Z&X-Amz-Expires=3600&X-Amz-SignedHeaders=host&X-Amz-Signature=0c02e7f59475ba5c4e1a4f87a40c1dee2a54d6b43357f8120306914f77ee7a86"
            }
          }
        },
        {
          id: 488467,
          sort: 4,
          isPublic: true,
          file: {
            id: 507409,
            presignedUrl: {
              url: "http://storage:9000/vardast/product/image/files/113bdca9599e3a4c5ac94bfdaf114864.webp?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=farbod%2F20240513%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20240513T090131Z&X-Amz-Expires=3600&X-Amz-SignedHeaders=host&X-Amz-Signature=d00a63d8d85f354b75b91e584a6a4caf2b300888e50256ce6a3b57bc73043d72"
            }
          }
        },
        {
          id: 488468,
          sort: 5,
          isPublic: true,
          file: {
            id: 507410,
            presignedUrl: {
              url: "http://storage:9000/vardast/product/image/files/0b464d0d9805da8ca264426a087838b6.webp?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=farbod%2F20240513%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20240513T090131Z&X-Amz-Expires=3600&X-Amz-SignedHeaders=host&X-Amz-Signature=c555d2532c42ba68938ff6cbd9d5122877527e5deeb058691371fd837d1954ed"
            }
          }
        },
        {
          id: 488469,
          sort: 6,
          isPublic: true,
          file: {
            id: 507411,
            presignedUrl: {
              url: "http://storage:9000/vardast/product/image/files/35a1aab7eefd8147b3a20301a9d041da.webp?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=farbod%2F20240513%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20240513T090131Z&X-Amz-Expires=3600&X-Amz-SignedHeaders=host&X-Amz-Signature=3a2cf04828e11243998e5acc12f369376679de0937a4c3024852d49bfb8be50e"
            }
          }
        },
        {
          id: 488470,
          sort: 7,
          isPublic: true,
          file: {
            id: 507412,
            presignedUrl: {
              url: "http://storage:9000/vardast/product/image/files/64fa069d1e58d75e5d6e66768360ec2e.webp?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=farbod%2F20240513%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20240513T090131Z&X-Amz-Expires=3600&X-Amz-SignedHeaders=host&X-Amz-Signature=b3dc59a5554161c970b27d2019c4519ed498a6249fd26ab5f9d7504e02cde415"
            }
          }
        },
        {
          id: 488471,
          sort: 8,
          isPublic: true,
          file: {
            id: 507413,
            presignedUrl: {
              url: "http://storage:9000/vardast/product/image/files/6ef942042d3ca47f20aa5e1722cd3eca.webp?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=farbod%2F20240513%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20240513T090131Z&X-Amz-Expires=3600&X-Amz-SignedHeaders=host&X-Amz-Signature=5fcafe462f65748bf03d5ba07fcac7b60530c34e61c7dec43a1a2cb265b414d2"
            }
          }
        },
        {
          id: 488472,
          sort: 9,
          isPublic: true,
          file: {
            id: 507414,
            presignedUrl: {
              url: "http://storage:9000/vardast/product/image/files/7b61047576531d5975a942d669e37420.webp?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=farbod%2F20240513%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20240513T090131Z&X-Amz-Expires=3600&X-Amz-SignedHeaders=host&X-Amz-Signature=7e232ae47a262c477c193dd3515c962d1b31f9c8b94d30a752c64e88d9ac8139"
            }
          }
        }
      ],
      uom: {
        id: 1,
        name: "عدد",
        slug: "عدد",
        symbol: "عدد",
        isActive: true
      }
    }
  ]

  // const expense = [
  //   { id: 1, name: "هزینه حمل" },
  //   { id: 2, name: "هزینه حمل" }
  // ]

  return (
    <>
      <AddPriceModal setOpen={setOpen} open={open} />
      {!OfferProducts.length ? (
        <OrderProductListContainer>
          {() => (
            <>
              <OrderProductCardSkeleton />
              <OrderProductCardSkeleton />
              <OrderProductCardSkeleton />
            </>
          )}
        </OrderProductListContainer>
      ) : OfferProducts.length ? (
        <OrderProductListContainer>
          {({ selectedItemId, setSelectedItemId }) => (
            <>
              {OfferProducts.map(
                (product) =>
                  product && (
                    <OrderProductCard
                      setOpen={setOpen}
                      isOffer={true}
                      selectedItemId={selectedItemId}
                      setSelectedItemId={setSelectedItemId}
                      key={product.id}
                      product={product as Product}
                      isDefault={false}
                      hasDefaultButton={false}
                    />
                  )
              )}
              {/* {expense.length > 0 &&
                expense.map(
                  (expense) =>
                    expense && (
                      <OrderProductCard
                        key={expense.id}
                        isOffer={true}
                        product={expense as Product}
                      />
                    )
                )} */}
            </>
          )}
        </OrderProductListContainer>
      ) : (
        <NotFoundItems text="کالا" />
      )}
    </>
  )
}

export default OrderOffersSection
