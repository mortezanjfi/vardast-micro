"use client"

import ProductSectionContainer from "@vardast/component/ProductSectionContainer"
import { ChartEnum, useGetPriceChartQuery } from "@vardast/graphql/generated"
import graphqlRequestClientWithToken from "@vardast/query/queryClients/graphqlRequestClientWithToken"
import convertToPersianDate from "@vardast/util/convertToPersianDate"
import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip
} from "chart.js"
import { Line } from "react-chartjs-2"

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

type Props = { productId: number }

const PriceChart = ({ productId }: Props) => {
  const { data, isLoading } = useGetPriceChartQuery(
    graphqlRequestClientWithToken,
    { chartInput: { productId: productId, type: ChartEnum.Yearly } }
  )

  const formattedLabels = data?.priceChart?.labels?.map((label) =>
    convertToPersianDate({ dateString: label })
  )

  if (!data?.priceChart?.data?.length) return null

  return (
    <ProductSectionContainer title="نمودار قیمت">
      <div className="h-56">
        {isLoading && (
          <div className="animate-pulse">
            <div className="mt-4 flex items-baseline space-x-6 space-x-reverse">
              <div className="h-72 w-full rounded-t-lg bg-alpha-200 dark:bg-alpha-700"></div>
              <div className="h-56 w-full rounded-t-lg bg-alpha-200 dark:bg-alpha-700"></div>
              <div className="h-72 w-full rounded-t-lg bg-alpha-200 dark:bg-alpha-700"></div>
              <div className="h-64 w-full rounded-t-lg bg-alpha-200 dark:bg-alpha-700"></div>
              <div className="h-80 w-full rounded-t-lg bg-alpha-200 dark:bg-alpha-700"></div>
              <div className="h-72 w-full rounded-t-lg bg-alpha-200 dark:bg-alpha-700"></div>
              <div className="h-80 w-full rounded-t-lg bg-alpha-200 dark:bg-alpha-700"></div>
            </div>
          </div>
        )}
        {data && (
          <Line
            data={{
              labels: formattedLabels,
              datasets: [
                {
                  label: "تعداد نمایش",
                  backgroundColor: "rgba(29, 78, 216, 0.5)",
                  borderColor: "#1d4ed8",
                  fill: true,
                  borderWidth: 2,
                  pointRadius: 3,
                  pointBackgroundColor: "#1d4ed8",
                  data: data.priceChart.data
                }
              ]
            }}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              layout: {},
              plugins: {
                legend: {
                  display: false
                }
              },
              elements: {
                line: {
                  tension: 0.4
                }
              }
            }}
          />
        )}
      </div>
    </ProductSectionContainer>
  )
}

export default PriceChart
