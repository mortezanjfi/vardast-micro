"use client"

import Card from "@vardast/component/Card"
import { useGetPastDurationEventsChartQuery } from "@vardast/graphql/generated"
import graphqlRequestClient from "@vardast/query/queryClients/graphqlRequestClient"
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
import { useSession } from "next-auth/react"
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
type Props = {}

export const SellerPastDurationEventsChart = (_: Props) => {
  const { data: session } = useSession()
  const { data, isLoading } = useGetPastDurationEventsChartQuery(
    graphqlRequestClient(session)
  )

  return (
    <Card title="تعداد نمایش اطلاعات تماس شما">
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
          id="seller-chart"
          // options={{
          //   responsive: true,
          //   plugins: {
          //     legend: {
          //       display: false
          //     }
          //   }
          // }}
          options={{
            responsive: true,
            plugins: {
              // legend: {
              //   position: "top" as const
              // },
              title: {
                display: false
                // text: "Chart.js Line Chart"
              }
            }
          }}
          data={{
            labels: data.pastDurationEventsChart.labels,
            datasets: [
              {
                // lin: 10.49,
                label: "تعداد نمایش",
                backgroundColor: "#1d4ed8",
                // borderRadius: 10,
                data: data.pastDurationEventsChart.data
              }
            ]
          }}
        />
      )}
    </Card>
  )
}

export default SellerPastDurationEventsChart
