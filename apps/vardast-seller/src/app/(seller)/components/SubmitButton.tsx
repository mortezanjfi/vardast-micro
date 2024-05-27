"use client"

import { Button } from "@vardast/ui/button"

type Props = {
  type?: "button" | "submit" | "reset"
  buttonText: string
  onClick?: Function
}

function SubmitButton({ type = "submit", buttonText, onClick }: Props) {
  return (
    <div className="justify between flex flex-row-reverse border-t pt-5">
      <Button
        onClick={(e) => {
          e.stopPropagation()
          e.nativeEvent.preventDefault()
          e.nativeEvent.stopImmediatePropagation()
          if (onClick) onClick()
        }}
        className="py-2"
        type={type}
        variant="primary"
      >
        {buttonText}
      </Button>
    </div>
  )
}

export default SubmitButton
