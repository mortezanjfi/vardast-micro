"use client"

import Card from "@vardast/component/Card"
import { useGetPastDurationEventsChartQuery } from "@vardast/graphql/generated"
import graphqlRequestClientWithToken from "@vardast/query/queryClients/graphqlRequestClientWithToken"
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip
} from "chart.js"
import { Bar } from "react-chartjs-2"

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

type Props = {}

const PastDurationEventsChart = (_: Props) => {
  const { data, isLoading } = useGetPastDurationEventsChartQuery(
    graphqlRequestClientWithToken
  )

  return (
    <Card
      description="این آمار مربوط به ۳۰ روز گذشته است"
      title="تعداد نمایش اطلاعات تماس شما"
    >
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
        <Bar
          data={{
            labels: data.pastDurationEventsChart.labels,
            datasets: [
              {
                barThickness: 10.49,
                label: "تعداد نمایش",
                backgroundColor: "#1d4ed8",
                borderRadius: 10,
                data: data.pastDurationEventsChart.data
              }
            ]
          }}
          options={{
            responsive: true,
            plugins: {
              legend: {
                display: false
              }
            }
          }}
        />
      )}
    </Card>
  )
}

export default PastDurationEventsChart
