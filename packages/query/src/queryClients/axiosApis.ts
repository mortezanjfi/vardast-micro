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

const getInvoice = ({ uuid, access_token }: IServePdf) => {
  return axios.get(
    `${process.env.NEXT_PUBLIC_REST_API_ENDPOINT}/pre/order/file/${uuid}`,
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
  getInvoice
}

export default axiosApis
