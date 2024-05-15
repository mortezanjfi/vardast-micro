"use client"

import { useState } from "react"
import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  ScriptableContext,
  Title,
  Tooltip
} from "chart.js"
import { Line } from "react-chartjs-2"

import "chart.js/auto"

import ProductSectionContainer from "@vardast/component/ProductSectionContainer"
import { ChartEnum, useGetPriceChartQuery } from "@vardast/graphql/generated"
import graphqlRequestClientWithToken from "@vardast/query/queryClients/graphqlRequestClientWithToken"
import QUERY_FUNCTIONS_KEY from "@vardast/query/queryFns/queryFunctionsKey"
import { myColors } from "@vardast/tailwind-config/themes"
import { ToggleGroup, ToggleGroupItem } from "@vardast/ui/toggle-group"
import convertToPersianDate from "@vardast/util/convertToPersianDate"
import clsx from "clsx"

ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  Title,
  Tooltip,
  Legend
)

type Props = {
  productId: number
}

const ProductPriceChart = ({ productId }: Props) => {
  const [value, setValue] = useState<ChartEnum>(ChartEnum.Daily)

  const { data, isLoading } = useGetPriceChartQuery(
    graphqlRequestClientWithToken,
    {
      chartInput: {
        productId,
        type: value
      }
    },
    {
      queryKey: [QUERY_FUNCTIONS_KEY.GET_PRICE_CHART, value]
    }
  )

  return (
    <ProductSectionContainer title="نمودار قیمتی این کالا">
      {isLoading && (
        <div className="animate-pulse">
          <div className="flex items-baseline space-x-6 space-x-reverse">
            <div className="h-40 w-full rounded-t-lg bg-alpha-200 dark:bg-alpha-700"></div>
            <div className="h-32 w-full rounded-t-lg bg-alpha-200 dark:bg-alpha-700"></div>
            <div className="h-40 w-full rounded-t-lg bg-alpha-200 dark:bg-alpha-700"></div>
            <div className="h-48 w-full rounded-t-lg bg-alpha-200 dark:bg-alpha-700"></div>
            <div className="h-24 w-full rounded-t-lg bg-alpha-200 dark:bg-alpha-700"></div>
            <div className="h-40 w-full rounded-t-lg bg-alpha-200 dark:bg-alpha-700"></div>
            <div className="h-24 w-full rounded-t-lg bg-alpha-200 dark:bg-alpha-700"></div>
          </div>
        </div>
      )}
      {data && (
        <Line
          id="price-chart"
          options={{
            responsive: true,
            plugins: {
              legend: {
                display: false,
                labels: {
                  font: {
                    family: "Iran Yekan" // Specify the Persian font family
                  }
                }
              }
            }
          }}
          data={{
            labels: data.priceChart.labels.map((label) =>
              convertToPersianDate({
                dateString: `${label}`
              })
            ),
            datasets: [
              {
                borderColor: myColors.primary[500],
                label: "قیمت",
                fill: "start",
                backgroundColor: (context: ScriptableContext<"line">) => {
                  const ctx = context.chart.ctx
                  const gradient = ctx.createLinearGradient(0, 0, 0, 200)
                  gradient.addColorStop(0, `${myColors.primary[500]}ff`)
                  gradient.addColorStop(1, `${myColors.primary[500]}00`)
                  return gradient
                },
                data: data.priceChart.data
              }
            ]
          }}
        />
      )}
      <ToggleGroup
        className="flex gap-6"
        type="single"
        value={value}
        onValueChange={(value: ChartEnum) => {
          value && setValue(value)
        }}
        defaultValue={ChartEnum.Daily}
      >
        <ToggleGroupItem
          className={clsx(
            "rounded-xl py-1 text-alpha-500",
            value === ChartEnum.Daily && "!bg-primary !text-alpha-white"
          )}
          value={ChartEnum.Daily}
        >
          روزانه
        </ToggleGroupItem>
        <ToggleGroupItem
          className={clsx(
            "rounded-xl py-1 text-alpha-500",
            value === ChartEnum.Weekly && "!bg-primary !text-alpha-white"
          )}
          value={ChartEnum.Weekly}
        >
          هفتگی
        </ToggleGroupItem>
        <ToggleGroupItem
          className={clsx(
            "rounded-xl py-1 text-alpha-500",
            value === ChartEnum.Monthly && "!bg-primary !text-alpha-white"
          )}
          value={ChartEnum.Monthly}
        >
          ماهانه
        </ToggleGroupItem>
        <ToggleGroupItem
          className={clsx(
            "rounded-xl py-1 text-alpha-500",
            value === ChartEnum.Yearly && "!bg-primary !text-alpha-white"
          )}
          value={ChartEnum.Yearly}
        >
          سالانه
        </ToggleGroupItem>
      </ToggleGroup>
    </ProductSectionContainer>
  )
}

export default ProductPriceChart
