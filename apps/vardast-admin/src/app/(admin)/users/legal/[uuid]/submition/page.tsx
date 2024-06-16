import SubmitPage from "@vardast/component/legal/submition/SubmitPage"

type Props = {}

async function page({ params: { uuid } }: { params: { uuid: string } }) {
  return <SubmitPage uuid={uuid} />
}

export default page
