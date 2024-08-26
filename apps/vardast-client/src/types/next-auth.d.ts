import {
  Session as SessionOver,
  User as UserOver
} from "@vardast/graphql/auth.type"

import "next-auth"

declare module "next-auth" {
  interface User extends UserOver {}
  interface Session extends SessionOver {}
}
