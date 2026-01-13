import { AnalyticsType, IMAGE_URL_FOR_DOMAINS } from "@/configs/type"
import React from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from "recharts"
import {
  Card,
  CardContent,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { getCountryCode } from "@/lib/country"
import { Skeleton } from "@/components/ui/skeleton"

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "var(--chart-2)",
  },
  mobile: {
    label: "Mobile",
    color: "var(--chart-2)",
  },
  label: {
    color: "var(--background)",
  },
} satisfies ChartConfig

type Props = {
  websiteAnalytics: AnalyticsType | undefined
  loading: boolean
}

const LocationWidget = ({ websiteAnalytics, loading }: Props) => {
  const BarLabelWithImageCountry = (props: any) => {
    const { x, y, height, value } = props
    const countryName = value
    const code = getCountryCode(countryName)?.toLowerCase()
    if (!code) return null

    const imageUrl = `https://flagcdn.com/w20/${code}.png`

    return (
      <g transform={`translate(${x + 8}, ${y + height / 2 - 8})`}>
        <image href={imageUrl} width={16} height={16} />
        <text
          x={22}
          y={12}
          fontSize={12}
          fill="#ffffff"
          dominantBaseline="middle"
        >
          {countryName}
        </text>
      </g>
    )
  }

  const BarLabelWithImage = (props: any) => {
    const { x, y, height, value } = props
    const imageUrl = IMAGE_URL_FOR_DOMAINS?.replace("<domain>", value)

    return (
      <g transform={`translate(${x + 8}, ${y + height / 2 - 8})`}>
        <image href={imageUrl} width={16} height={16} />
        <text x={20} y={12} fontSize={12} fill="#ffffff">
          {value}
        </text>
      </g>
    )
  }

  return (
    <div>
      {!loading ? (
        <Card>
          <CardContent className="p-5">
            <Tabs defaultValue="countries" className="w-full">
              <TabsList>
                <TabsTrigger value="countries">Countries</TabsTrigger>
                <TabsTrigger value="city">City</TabsTrigger>
                <TabsTrigger value="regions">Regions</TabsTrigger>
              </TabsList>

              {/* COUNTRIES */}
              <TabsContent value="countries">
                <ChartContainer config={chartConfig}>
                  <BarChart
                    accessibilityLayer
                    data={websiteAnalytics?.countries}
                    layout="vertical"
                    margin={{ right: 16 }}
                  >
                    <CartesianGrid horizontal={false} />
                    <YAxis
                      dataKey="name"
                      type="category"
                      tickLine={false}
                      tickMargin={10}
                      axisLine={false}
                      hide
                    />
                    <XAxis dataKey="uv" type="number" hide />
                    <ChartTooltip
                      cursor={false}
                      content={<ChartTooltipContent indicator="line" />}
                    />
                    <Bar
                      dataKey="uv"
                      layout="vertical"
                      fill="var(--color-primary)"
                      fillOpacity={0.8}
                      radius={4}
                    >
                      <LabelList
                        dataKey="name"
                        position="insideLeft"
                        offset={8}
                        fontSize={12}
                        content={<BarLabelWithImageCountry />}
                      />
                    </Bar>
                  </BarChart>
                </ChartContainer>
              </TabsContent>

              {/* CITY */}
              <TabsContent value="city">
                <ChartContainer config={chartConfig}>
                  <BarChart
                    accessibilityLayer
                    data={websiteAnalytics?.cities}
                    layout="vertical"
                    margin={{ right: 16 }}
                  >
                    <CartesianGrid horizontal={false} />
                    <YAxis
                      dataKey="name"
                      type="category"
                      tickLine={false}
                      tickMargin={10}
                      axisLine={false}
                      hide
                    />
                    <XAxis dataKey="uv" type="number" hide />

                    <ChartTooltip
                      cursor={false}
                      content={<ChartTooltipContent indicator="line" />}
                    />
                    <Bar
                      dataKey="uv"
                      layout="vertical"
                      fill="var(--color-primary)"
                      fillOpacity={0.8}
                      radius={4}
                    >
                      <LabelList
                        dataKey="name"
                        position="insideLeft"
                        offset={8}
                        fontSize={12}
                        content={<BarLabelWithImage />}
                      />
                    </Bar>
                  </BarChart>
                </ChartContainer>
              </TabsContent>

              {/* REGIONS */}
              <TabsContent value="regions">
                <ChartContainer config={chartConfig}>
                  <BarChart
                    accessibilityLayer
                    data={websiteAnalytics?.regions}
                    layout="vertical"
                    margin={{ right: 16 }}
                  >
                    <CartesianGrid horizontal={false} />
                    <YAxis
                      dataKey="name"
                      type="category"
                      tickLine={false}
                      tickMargin={10}
                      axisLine={false}
                      hide
                    />
                    <XAxis dataKey="uv" type="number" hide />
                    <ChartTooltip
                      cursor={false}
                      content={<ChartTooltipContent indicator="line" />}
                    />

                    <Bar
                      dataKey="uv"
                      layout="vertical"
                      fill="var(--color-primary)"
                      fillOpacity={0.8}
                      radius={4}
                    >
                      <LabelList
                        dataKey="name"
                        position="insideLeft"
                        offset={8}
                        fontSize={12}
                        content={<BarLabelWithImage />}
                      />
                    </Bar>
                  </BarChart>
                </ChartContainer>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      ) : (
        <Skeleton className="h-80 w-full rounded-2xl" />
      )}
    </div>
  )
}

export default LocationWidget
