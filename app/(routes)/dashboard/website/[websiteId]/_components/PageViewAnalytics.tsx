import { Card, CardContent } from "@/components/ui/card"
import { WebsiteInfoType } from "@/configs/type"
import React from "react"
import LabelCountItem from "./LabelCountItem"
import { Separator } from "@/components/ui/separator"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { Skeleton } from "@/components/ui/skeleton"

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig

type Props = {
  websiteInfo: WebsiteInfoType | undefined | null
  loading: boolean
  analyticType: string
  liveUserCount: number | undefined
}

const PageViewAnalytics = ({
  websiteInfo,
  loading,
  analyticType,
  liveUserCount,
}: Props) => {
  const webAnalytics = websiteInfo?.analytics

  return (
    <div className="mt-8">
      {!loading ? (
        <Card className="rounded-xl border bg-white shadow-sm">
          
          {/* METRICS ROW */}
            <CardContent className="mx-6 flex flex-wrap items-stretch gap-x-10 gap-y-6 border-b px-6 py-5">
                <LabelCountItem label="Visitors" value={webAnalytics?.totalVisitors} />
                <Separator orientation="vertical" className="hidden h-14 md:block" />

                <LabelCountItem
                    label="Total Page Views"
                    value={webAnalytics?.totalSessions}
                />
                <Separator orientation="vertical" className="hidden h-14 md:block" />

                <LabelCountItem
                    label="Total Active Time"
                    value={(Number(webAnalytics?.totalActiveTime) / 60).toFixed(1) + " min"}
                />
                <Separator orientation="vertical" className="hidden h-14 md:block" />

                <LabelCountItem
                    label="Average Active Time"
                    value={(Number(webAnalytics?.avgActiveTime) / 60).toFixed(1) + " min"}
                />
                <Separator orientation="vertical" className="hidden h-14 md:block" />

                <LabelCountItem label="Live Users" value={liveUserCount ?? 0} />
            </CardContent>


          {/* CHART */}
          <CardContent className="p-6">
            <ChartContainer config={chartConfig} className="h-[360px] w-full">
              <AreaChart
                accessibilityLayer
                data={
                  analyticType === "hourly"
                    ? webAnalytics?.hourlyVisitors
                    : webAnalytics?.dailyVisitors
                }
                margin={{ top: 16, right: 16, left: 8, bottom: 8 }}
              >
                <CartesianGrid vertical={false} strokeDasharray="3 3" />

                <XAxis
                  dataKey={analyticType === "hourly" ? "hourLabel" : "date"}
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  className="text-xs text-muted-foreground"
                />

                <YAxis
                  allowDecimals={false}
                  tickLine={false}
                  axisLine={false}
                  width={32}
                  tickMargin={6}
                  className="text-xs text-muted-foreground"
                />

                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="line" />}
                />

                <Area
                  type="monotone"
                  dataKey="count"
                  stroke="var(--color-primary)"
                  fill="var(--color-primary)"
                  fillOpacity={0.2}
                  strokeWidth={2}
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>
      ) : (
        <Skeleton className="h-[420px] w-full rounded-xl" />
      )}
    </div>
  )
}

export default PageViewAnalytics
