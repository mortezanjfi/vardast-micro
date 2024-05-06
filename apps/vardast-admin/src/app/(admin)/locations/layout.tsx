import LocationsProvider from "./components/LocationsProvider"

export default function LocationsLayout({
  children
}: {
  children: React.ReactNode
}) {
  return <LocationsProvider>{children}</LocationsProvider>
}
