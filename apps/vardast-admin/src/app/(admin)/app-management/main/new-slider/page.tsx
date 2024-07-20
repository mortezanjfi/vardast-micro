import { Metadata } from "next"

import NewSliderForm from "../components/NewSliderForm"

type Props = {}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "افزودن اسلایدر"
  }
}

export default (props: Props) => {
  return <NewSliderForm />
}
