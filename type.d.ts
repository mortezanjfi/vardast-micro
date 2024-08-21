declare module NodeJS {
  interface ProcessEnv {
    NEXT_PUBLIC_PROJECT_NAME_FOR: "client" | "admin" | "seller";
  }
}
