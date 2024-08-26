import { useState } from "react"
import { digitsEnToFa } from "@persian-tools/persian-tools"
import Card from "@vardast/component/Card"
import { useGetOrderPercentageQuery } from "@vardast/graphql/generated"
import graphqlRequestClientWithToken from "@vardast/query/queryClients/graphqlRequestClientWithToken"
import DatePicker from "@vardast/ui/date-picker"
import { SelectPopoverTrigger } from "@vardast/ui/select-popover"
import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip
} from "chart.js"
import { Bar, Pie } from "react-chartjs-2"
import { DateObject } from "react-multi-date-picker"

type Props = {}
const now = new Date()

const twoWeeksLater = new Date()
twoWeeksLater.setDate(now.getDate() - 14)

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
)
function OrdersReportsCharts({}: Props) {
  const [endDate, setEndDate] = useState<Date>(now)
  const [startDate, setStartDate] = useState<Date>(twoWeeksLater)

  const orderReport = useGetOrderPercentageQuery(
    graphqlRequestClientWithToken,
    { orderPercentageInput: { startDate: startDate, endDate: endDate } },
    { queryKey: [{ endDate: endDate }] }
  )

  const barData = {
    labels:
      orderReport?.data?.orderPercentage?.orderCount?.labels.map((label) =>
        digitsEnToFa(label)
      ) || [], // X-axis labels
    datasets: [
      {
        label: "خرید",
        data: orderReport?.data?.orderPercentage?.orderCount?.data[0],
        backgroundColor: "#4BC0C0",
        maxBarThickness: 20
      },

      {
        label: "جاری",
        data: orderReport?.data?.orderPercentage?.orderCount?.data[2],
        backgroundColor: "#059BFF",
        maxBarThickness: 20
      },
      {
        label: "بسته شده",
        data: orderReport?.data?.orderPercentage?.orderCount?.data[1],
        backgroundColor: " #FF6384 ",
        maxBarThickness: 20
      }
    ]
  }

  const pieData = {
    labels: ["خرید", "جاری", "بسته شده"],
    datasets: [
      {
        label: "درصد",
        data: [
          orderReport?.data?.orderPercentage?.orderPercent
            ?.completed_percentage,
          orderReport?.data?.orderPercentage?.orderPercent
            ?.inprogress_percentage,
          orderReport?.data?.orderPercentage?.orderPercent?.closed_percentage
        ],
        backgroundColor: ["#217AC4", "#8B5CF6", "#F59E0B"]
      }
    ]
  }

  const handleStartDateChange = (value) => {
    const date = new Date(value)
    setStartDate(date)
  }

  const handleEndDateChange = (value) => {
    const date = new Date(value)
    setEndDate(date)
  }

  return (
    <div className="row-span-2 grid grid-cols-3 gap-7">
      <Card className="col-span-2 h-fit">
        <div className="flex items-center justify-between pb">
          <h2 className="font-medium text-alpha-800 ">تعداد سفارشات</h2>
          <div className="flex items-center gap-3">
            <span className="whitespace-nowrap text-xs">از تاریخ:</span>
            <DatePicker
              render={(value, openCalendar) => {
                return (
                  <SelectPopoverTrigger label={value} onClick={openCalendar} />
                )
              }}
              value={startDate ? new DateObject(new Date(startDate)) : ""}
              onChange={(value) => {
                handleStartDateChange(value)
              }}
            />

            <span className="whitespace-nowrap text-xs">تا تاریخ:</span>
            <DatePicker
              highlightToday
              render={(value, openCalendar) => {
                return (
                  <SelectPopoverTrigger label={value} onClick={openCalendar} />
                )
              }}
              value={endDate ? new DateObject(new Date(endDate)) : ""}
              onChange={(value) => {
                handleEndDateChange(value)
              }}
            />
          </div>
        </div>

        <div className=" h-80">
          <Bar
            data={{
              labels: barData.labels,
              datasets: barData.datasets.map((dataset) => ({
                ...dataset
              }))
            }}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  display: true,
                  position: "top",
                  align: "end"
                },
                tooltip: {
                  enabled: true
                }
              },
              scales: {
                x: { stacked: true },
                y: {
                  stacked: true,
                  min: 0,
                  max: 20,
                  ticks: {
                    stepSize: 5,
                    callback: (value) => {
                      return digitsEnToFa(value)
                    }
                  }
                }
              },
              elements: {
                bar: {
                  borderRadius: 4
                }
              }
            }}
          />
        </div>
      </Card>
      <Card className="col-span-1 h-fit" title="درصد سفارشات">
        <div className="h-80">
          <Pie
            data={pieData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  display: true,
                  position: "top",
                  align: "end",
                  labels: {
                    pointStyle: "rectRounded"
                  }
                },
                tooltip: {
                  enabled: true
                }
              }
            }}
          />
        </div>
      </Card>
    </div>
  )
}

export default OrdersReportsCharts
