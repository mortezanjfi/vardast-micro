import { NextMiddleware } from "next/server"

export type MiddlewareFactory = (_: NextMiddleware) => NextMiddleware
