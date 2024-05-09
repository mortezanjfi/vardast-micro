import {
  GetWhoAmIDocument,
  GetWhoAmIQuery,
  LoginUserDocument,
  LoginUserMutation,
  LoginWithOtpDocument,
  LoginWithOtpMutation,
  RefreshUserMutation,
  RefreshUserMutationDocument
} from "@vardast/graphql/generated"
import { GraphQLClient } from "graphql-request"
import { AuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

import AuthLogger from "./auth-logger"

async function refreshAccessToken(tokenObject: any) {
  try {
    // Get a new set of tokens with a refreshToken
    const client = new GraphQLClient(
      process.env.NEXT_PUBLIC_GRAPHQL_API_ENDPOINT || ""
    )
    const data: RefreshUserMutation = await client.request(
      RefreshUserMutationDocument,
      {
        refreshInput: {
          accessToken: tokenObject.accessToken,
          refreshToken: tokenObject.refreshToken
        }
      }
    )

    if (!data) {
      return null
    }

    return {
      ...tokenObject,
      userId: data.refresh.user.id,
      abilities: data.refresh.abilities,
      accessToken: data.refresh.accessToken,
      accessTokenTtl: data.refresh.accessTokenTtl + Date.now(),
      refreshToken: data.refresh.refreshToken,
      refreshTokenTtl: data.refresh.refreshTokenTtl + Date.now()
    }
  } catch (error) {
    return {
      ...tokenObject,
      error: "RefreshAccessTokenError"
    }
  }
}

export const authOptions: AuthOptions = {
  session: {
    strategy: "jwt"
  },
  secret: process.env.NEXTAUTH_SECRET,
  // pages: {
  //   signIn: "/authentication/signin",
  //   signOut: "/"
  // },
  logger: AuthLogger(),
  providers: [
    CredentialsProvider({
      name: "Otp",
      type: "credentials",
      credentials: {
        cellphone: { label: "Cellphone", type: "text" },
        validationKey: { label: "ValidationKey", type: "text" },
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
        signInType: { label: "SignInType", type: "text" }
      },
      // @ts-ignore
      authorize: async (credentials, request) => {
        try {
          const { signInType, username, password, cellphone, validationKey } =
            credentials as {
              cellphone: string
              validationKey: string
              username: string
              password: string
              signInType: string
            }

          const client = new GraphQLClient(
            process.env.NEXT_PUBLIC_GRAPHQL_API_ENDPOINT || "",
            {
              headers: {
                "user-agent": request.headers
                  ? request.headers["user-agent"]
                  : ""
              }
            }
          )

          if (signInType === "otp") {
            const data: LoginWithOtpMutation = await client.request(
              LoginWithOtpDocument,
              {
                LoginOTPInput: {
                  cellphone,
                  validationKey
                }
              }
            )
            if (!data) {
              throw new Error("Authorization failed")
            }

            return {
              accessToken: data.loginWithOtp.accessToken,
              accessTokenTtl: data.loginWithOtp.accessTokenTtl + Date.now(),
              refreshToken: data.loginWithOtp.refreshToken,
              refreshTokenTtl: data.loginWithOtp.refreshTokenTtl + Date.now(),
              userId: data.loginWithOtp.user.id,
              abilities: data.loginWithOtp.abilities,
              roles: data.loginWithOtp.user.roles
            }
          }
          if (signInType === "username") {
            const data: LoginUserMutation = await client.request(
              LoginUserDocument,
              {
                loginInput: {
                  username,
                  password
                }
              }
            )

            if (!data) {
              throw new Error("Authorization failed")
            }

            return {
              accessToken: data.login.accessToken,
              accessTokenTtl: data.login.accessTokenTtl + Date.now(),
              refreshToken: data.login.refreshToken,
              refreshTokenTtl: data.login.refreshTokenTtl + Date.now(),
              userId: data.login.user.id,
              abilities: data.login.abilities,
              roles: data.login.user.roles
            }
          }
        } catch (error) {
          console.error("Error in authorize function:", error)
          return Promise.resolve(null)
        }
        return credentials
      }
      // async signOut({ callbackUrl }: { callbackUrl: string }) {
      //   // Your sign-out logic here
      //   // Redirect the user to the specified callbackUrl after signing out
      //   return {
      //     url: callbackUrl || "/" // Default to the root path if callbackUrl is not provided
      //   }
      // }
    })
  ],
  callbacks: {
    jwt: async ({ token, user, trigger, session }) => {
      try {
        if (user) {
          token.userId = user.userId
          token.abilities = user.abilities
          token.accessToken = user.accessToken
          token.accessTokenTtl = user.accessTokenTtl
          token.refreshToken = user.refreshToken
          token.refreshTokenTtl = user.refreshTokenTtl
        }

        if (trigger === "update" && session) {
          token.userId = session.userId
          token.abilities = session.abilities
          token.accessToken = session.accessToken
          token.accessTokenTtl = session.accessTokenTtl
          token.refreshToken = session.refreshToken
          token.refreshTokenTtl = session.refreshTokenTtl
          return token
        }

        const shouldRefreshTime = Math.round(
          (token.accessTokenTtl as number) - Date.now()
        )

        if (shouldRefreshTime > 0) {
          // console.log("JWT refreshAccessToken: ", {
          //   token: Promise.resolve(token)
          // })
          return Promise.resolve(token)
        }

        token = await refreshAccessToken(token)

        // console.log("JWT validate successfully: ", {
        //   user,
        //   token: Promise.resolve(token)
        // })

        return Promise.resolve(token)
      } catch (error) {
        console.error("Error in jwt callback:", error)
      }
      // console.log("JWT default: ", { user, token })
      return token
    },
    session: async ({ session, token }) => {
      try {
        const userClient = new GraphQLClient(
          process.env.NEXT_PUBLIC_GRAPHQL_API_ENDPOINT || "",
          {
            headers: {
              authorization: `Bearer ${token.accessToken}`
            }
          }
        )

        const userInfo: GetWhoAmIQuery =
          await userClient.request(GetWhoAmIDocument)
        session.accessToken = token.accessToken as string
        session.accessTokenTtl = token.accessTokenTtl as number
        session.refreshToken = token.refreshToken as string
        session.refreshTokenTtl = token.refreshTokenTtl as number
        session.profile = userInfo.whoAmI as any
        session.abilities = token.abilities as string[]
        session.error = token.error as string
        // console.log("Session validate successfully: ", { session, token })

        return session
      } catch (error) {
        console.error("Error in session callback:", error)
      }
      // console.log("Session default: ", { session, token })

      return session
    },
    // async signIn({ user }) {
    //   try {
    //     // Check if roles array exists and is not empty
    //     if (user.roles && user.roles.length > 0) {
    //       // Check if the user has the "admin" role
    //       if (user.roles.find((role) => role?.name === "admin")) {
    //         if (process.env.NEXT_PUBLIC_PROJECT_NAME_FOR === "seller") {
    //           return "https://stage.vardast.com/admin"
    //         }
    //         return "/admin" // Redirect to "/admin" for admin users
    //       }
    //       // Check if the user has the "seller" role
    //       if (user.roles.find((role) => role?.name === "seller")) {
    //         if (process.env.NEXT_PUBLIC_PROJECT_NAME_FOR === "seller") {
    //           return "/seller-panel" // Redirect to "/seller" for seller users
    //         }
    //         return "https://seller.vardast.com/"
    //       }
    //       if (process.env.NEXT_PUBLIC_PROJECT_NAME_FOR === "seller") {
    //         return "/auth/request-seller" // Redirect to "/seller" for seller users
    //       }
    //       return "/profile"
    //     }

    //     // Default behavior if no specific role is matched
    //     return true // Proceed with the sign-in
    //   } catch (error) {
    //     console.error("Error in signIn callback:", error)
    //     // Handle the error gracefully, you might want to redirect to an error page or log it
    //     return false // or return a URL to an error page
    //   }
    // },
    // @ts-ignore
    onError: async (error, _, __) => {
      console.error("NextAuth.js error:", error)
      return false
    }
  }
}
