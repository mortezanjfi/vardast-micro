"use client"

import { useEffect, useRef, useState } from "react"

import ProductSectionContainer from "./ProductSectionContainer"

type ProductDescriptionProps = {
  description: string
}

const ProductDescription = ({ description }: ProductDescriptionProps) => {
  const [descriptionMoreFlag, setDescriptionMoreFlag] = useState(false)
  const [showSubtitle, setShowSubtitle] = useState(false)
  const descriptionRef = useRef<HTMLParagraphElement>(null)
  const onOpenDescription = () => {
    setDescriptionMoreFlag((prev) => !prev)
  }

  useEffect(() => {
    const descriptionElement = descriptionRef.current
    if (descriptionElement) {
      const lineHeight = parseInt(
        getComputedStyle(descriptionElement).lineHeight
      )
      const height = descriptionElement.clientHeight
      const numberOfLines = Math.floor(height / lineHeight)
      setShowSubtitle(numberOfLines >= 3)
    }
  }, [description])

  return (
    <ProductSectionContainer
      title="معرفی"
      subtitle={
        showSubtitle
          ? {
              text: descriptionMoreFlag ? "بستن" : "بیشتر",
              onClick: onOpenDescription
            }
          : undefined
      }
    >
      <div className="flex flex-col items-start gap-7">
        <h3
          ref={descriptionRef}
          className={`w-full text-justify text-sm  text-alpha-500 ${
            !descriptionMoreFlag ? "line-clamp-3" : ""
          }`}
        >
          {description}
        </h3>
      </div>
    </ProductSectionContainer>
  )
}

export default ProductDescription
