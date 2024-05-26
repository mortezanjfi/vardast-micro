"use client"

import { Button } from "@vardast/ui/button"

type Props = { buttonText: string; onClick?: Function }

function SubmitButton({ buttonText, onClick }: Props) {
  return (
    <div className="justify between flex flex-row-reverse border-t pt-5">
      <Button
        onClick={(e) => {
          e.stopPropagation()
          e.nativeEvent.preventDefault()
          e.nativeEvent.stopImmediatePropagation()
          onClick()
        }}
        className="py-2"
        type="submit"
        variant="primary"
      >
        {buttonText}
      </Button>
    </div>
  )
}

export default SubmitButton
