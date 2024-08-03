import { Metadata } from "next"

import SliderForm from "../components/SliderForm"

type Props = {}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "افزودن اسلایدر"
  }
}

export default (_: Props) => {
  return <SliderForm />
}
