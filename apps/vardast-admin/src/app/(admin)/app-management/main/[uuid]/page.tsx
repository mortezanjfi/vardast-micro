import SliderEdit from "@/app/(admin)/app-management/main/components/SliderEdit"

type Props = { params: { uuid: string } }

export default ({ params: { uuid } }: Props) => {
  return <SliderEdit uuid={uuid} />
}
