import { AnalyticsType, IMAGE_URL_FOR_DOMAINS } from "@/configs/type"
import React from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from "recharts"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

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

const SourceWidget = ({ websiteAnalytics, loading }: Props) => {
  const BarLabelWithImage = (props: any) => {
    const { x, y, height, value } = props
    const imageUrl = IMAGE_URL_FOR_DOMAINS?.replace("<domain>", value)

    return (
      <g transform={`translate(${x + 10}, ${y + height / 2 - 8})`}>
        <image href={imageUrl} width={16} height={16} />
        <text x={22} y={12} fontSize={12} fill="#ffffff">
          {value}
        </text>
      </g>
    )
  }

  return (
    <div>
      {!loading ? (
        <Card className="rounded-xl border bg-white shadow-sm">
          <CardContent className="p-5">
            <Tabs defaultValue="source" className="w-full">
              
              {/* Tabs Header */}
              <TabsList>
                <TabsTrigger value="source" >
                  Source
                </TabsTrigger>
                <TabsTrigger value="referral" >
                  Referral
                </TabsTrigger>
              </TabsList>

              {/* SOURCE TAB */}
              <TabsContent value="source" className="mt-2">
                <ChartContainer config={chartConfig} className="h-[300px] w-full">
                  <BarChart
                    accessibilityLayer
                    data={websiteAnalytics?.referrals}
                    layout="vertical"
                    margin={{ right: 20, left: 8 }}
                  >
                    <CartesianGrid horizontal={false} strokeDasharray="3 3" />

                    <YAxis
                      dataKey="domainName"
                      type="category"
                      tickLine={false}
                      axisLine={false}
                      hide
                    />

                    <XAxis type="number" hide />

                    <ChartTooltip
                      cursor={false}
                      content={<ChartTooltipContent indicator="line" />}
                    />

                    <Bar
                      dataKey="uv"
                      layout="vertical"
                      fill="var(--color-primary)"
                      fillOpacity={0.75}
                      radius={6}
                    >
                      <LabelList
                        dataKey="domainName"
                        position="insideLeft"
                        offset={10}
                        fontSize={12}
                        content={<BarLabelWithImage />}
                      />
                    </Bar>
                  </BarChart>
                </ChartContainer>
              </TabsContent>

              {/* REFERRAL TAB */}
              <TabsContent value="referral" className="mt-2">
                <ChartContainer config={chartConfig} className="h-[300px] w-full">
                  <BarChart
                    accessibilityLayer
                    data={websiteAnalytics?.refParams}
                    layout="vertical"
                    margin={{ right: 20, left: 8 }}
                  >
                    <CartesianGrid horizontal={false} strokeDasharray="3 3" />

                    <YAxis
                      dataKey="name"
                      type="category"
                      tickLine={false}
                      axisLine={false}
                      hide
                    />

                    <XAxis type="number" hide />

                    <ChartTooltip
                      cursor={false}
                      content={<ChartTooltipContent indicator="line" />}
                    />

                    <Bar
                      dataKey="uv"
                      layout="vertical"
                      fill="var(--color-primary)"
                      fillOpacity={0.75}
                      radius={6}
                    >
                      <LabelList
                        dataKey="name"
                        position="insideLeft"
                        offset={10}
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
        <Skeleton className="h-[340px] w-full rounded-xl" />
      )}
    </div>
  )
}

export default SourceWidget
