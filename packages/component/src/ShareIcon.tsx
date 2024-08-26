import { ShareIcon as ShareIconHero } from "@heroicons/react/24/outline"
import { toast } from "@vardast/hook/use-toast"
import { Button } from "@vardast/ui/button"
import copy from "copy-to-clipboard"

type Props = {
  name: string
}

export default function ShareIcon({ name }: Props) {
  const handleOnClick = async () => {
    if (navigator?.share) {
      try {
        await navigator.share({
          url: window.location.href,
          text: name,
          title: "وردست"
        })
      } catch (err) {
        // toast({
        //   description: `${err}`,
        //   duration: 5000,
        //   variant: "danger"
        // })
      }
    } else {
      copy(window.location.href)
      toast({
        description: "کپی شد!",
        duration: 5000,
        variant: "success"
      })
    }
  }

  return (
    <Button iconOnly variant={"ghost"} onClick={handleOnClick}>
      <ShareIconHero className="h-6 w-6 text-alpha" />
    </Button>
  )
}
