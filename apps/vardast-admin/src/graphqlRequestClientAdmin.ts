import { authOptions } from "@vardast/auth/authOptions"
import { GraphQLClient } from "graphql-request"
import { RequestMiddleware } from "graphql-request/build/esm/types"
import { getServerSession } from "next-auth"
import { getSession } from "next-auth/react"

const requestMiddleware: RequestMiddleware = async (request) => {
  // const session = await getSession()
  const session =
    typeof window === "undefined"
      ? await getServerSession(authOptions)
      : await getSession()
  const token = session?.accessToken || null

  try {
    return {
      ...request,
      headers: { ...request.headers, authorization: `Bearer ${token}` }
    }
  } catch (error) {
    throw new Error(`${error}`)
  }
}

const graphqlRequestClientAdmin = new GraphQLClient(
  process.env.NEXT_PUBLIC_GRAPHQL_API_ENDPOINT as string,
  { requestMiddleware }
)

export default graphqlRequestClientAdmin
