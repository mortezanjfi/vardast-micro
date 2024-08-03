import { Session } from "@vardast/graphql/auth.type"
import axios from "axios"

export type IServePdf = {
  uuid: string
  access_token: Session["accessToken"]
}

const servePdf = ({ uuid, access_token }: IServePdf) => {
  return axios.get(
    `${process.env.NEXT_PUBLIC_REST_API_ENDPOINT}/base/storage/file/${uuid}`,
    {
      headers: { Authorization: `Bearer ${access_token}` },
      responseType: "arraybuffer"
    }
  )
}

const getPreInvoice = ({ uuid, access_token }: IServePdf) => {
  return axios.get(
    `${process.env.NEXT_PUBLIC_REST_API_ENDPOINT}/pre/order/file/${uuid}`,
    {
      headers: { Authorization: `Bearer ${access_token}` }
    }
  )
}

const getInvoice = ({ uuid, access_token }: IServePdf) => {
  return axios.get(
    `${process.env.NEXT_PUBLIC_REST_API_ENDPOINT}/order/file/${uuid}`,
    {
      headers: { Authorization: `Bearer ${access_token}` }
    }
  )
}

const getVersion = () => {
  return axios.get(`${process.env.NEXT_PUBLIC_REST_API_ENDPOINT}/app/version`)
}

const axiosApis = {
  servePdf,
  getVersion,
  getInvoice,
  getPreInvoice
}

type AxiosApisType = keyof typeof axiosApis

export const axiosDownLoad = async ({
  uuid,
  access_token,
  apiName
}: IServePdf & { apiName: AxiosApisType }) => {
  const response = await axiosApis[apiName]({
    uuid: uuid,
    access_token
  })
  const html = response.data
  const blob = new Blob([html], { type: "text/html" })
  const url = window.URL.createObjectURL(blob)

  const newTab = window.open(url, "_blank")
  newTab.focus()
}

export default axiosApis
