import { Session } from "@vardast/graphql/src/auth.type"
import { GraphQLClient } from "graphql-request"

const getRequestMiddleware: any = async (session: Session | null) => {
  return async (request: any) => {
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
}

const graphqlRequestClient = (session: Session | null) =>
  new GraphQLClient(process.env.NEXT_PUBLIC_GRAPHQL_API_ENDPOINT as string, {
    requestMiddleware: getRequestMiddleware(session)
  })

export default graphqlRequestClient
