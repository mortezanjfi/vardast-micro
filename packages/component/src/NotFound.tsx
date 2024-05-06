import NotFoundIcon from "./not-found-icon"

const NotFoundMessage = ({ text = "کالا" }) => {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-y-7 bg-alpha-white px-6 py-10">
      <NotFoundIcon />
      <p className="text-center text-alpha-500">
        {`شما هنوز ${text} اضافه نکرده اید!`}
      </p>
    </div>
  )
}
export default NotFoundMessage
