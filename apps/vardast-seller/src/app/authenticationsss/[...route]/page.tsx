interface Props {
  params: { route: string[] }
  searchParams: any
}

const AuthPage = async ({ params, searchParams }: Props) => {
  const { route } = params // Extract the route from params
  const queryParams = new URLSearchParams(searchParams) // Convert searchParams to URLSearchParams

  let html = "not show"
  try {
    if (route[0] && !route[0].startsWith("_next")) {
      const res = await fetch(`http://localhost:3000/authentication/signin`)
      // console.log({ res })
      html = await res.text()
      // console.log({
      //   route: route.join("/"),
      //   params,
      //   searchParams,
      //   url: `http://localhost:3000/authentication/${route.join("/")}${!!searchParams ? "?" + queryParams : ""}`
      // })
    }
    // console.log({ html })
  } catch (error) {
    console.log({ error })
  }

  return <div dangerouslySetInnerHTML={{ __html: html }}></div>
}

export default AuthPage
