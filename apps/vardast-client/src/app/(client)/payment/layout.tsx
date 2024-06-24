export default async function ({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen w-full items-center justify-center md:bg-[url('/images/background.svg')]">
      <div className="flex h-full w-full flex-col justify-center md:min-w-xsm md:max-w-xsm">
        <div className="flex w-full flex-col gap-y-6 overflow-y-auto px-6 md:py">
          {children}
        </div>
      </div>
    </div>
  )
}
