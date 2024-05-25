import SellerOrdersPage from "@/app/(seller)/components/SellerOrdersPage"

const fakeData = [
  {
    id: 3,
    projectName: "Innovative AI Development",
    personInCharge: "Jane Doe",
    dateOfSubmission: "2023-11-01",
    dateOfExpiry: "2024-11-01",
    hasFile: true,
    status: false,
    projectCode: "AI-DEV-001",
    purchaser: "Tech Solutions Inc."
  }
]
const page = async () => {
  return <SellerOrdersPage isMyOrderPage={true} data={fakeData} />
}

export default page
