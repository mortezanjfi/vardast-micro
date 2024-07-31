export default async function ({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen w-full items-center justify-center md:bg-[url('/images/background.svg')]">
      <div className="md:min-w-xsm md:max-w-xsm flex h-full w-full flex-col justify-center">
        <div className="flex w-full flex-col gap-y-6 overflow-y-auto px-6 md:py">
          {children}
        </div>
      </div>
    </div>
  )
}
