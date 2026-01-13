import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

import { WebsiteInfoType, WebsiteType } from '@/configs/type'
import { Globe } from 'lucide-react'
import React from 'react'
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import Link from 'next/link'
import { Separator } from '@/components/ui/separator'



const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "var(--chart-1)",
  },
  mobile: {
    label: "Mobile",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig

type Props={
    websiteInfo:WebsiteInfoType;
}

const WebsiteCart = ({websiteInfo}:Props) => {
  const hourlyData= websiteInfo?.analytics?.hourlyVisitors;

  const chartData = hourlyData?.length==1?
  [
    {
      ...hourlyData[0],
      hour: Number(hourlyData[0].hour)-1>=0? Number(hourlyData[0].hour)-1 : 0,
      count:0,
      hourLabel: `${Number(hourlyData[0].hour)-1} AM/PM`,
    },
    hourlyData[0],
  ]:hourlyData;
 
  
  return (
     <Link href={`/dashboard/website/${websiteInfo?.website?.websiteId}`}>
      <Card className="group h-full rounded-xl border bg-background transition-all hover:-translate-y-1 hover:shadow-lg">
        <CardHeader className="pb-4">
          <CardTitle>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-muted">
                <Globe className="h-5 w-5 text-muted-foreground" />
              </div>

              <h2 className="text-base font-semibold truncate max-w-[200px]">
                {websiteInfo?.website?.domain.replace("https://", "")}
              </h2>
            </div>
          </CardTitle>
        </CardHeader>

        <Separator />

        <CardContent className="pt-5">
          {/* Chart */}
          <div className="rounded-lg bg-muted/30 p-2">
            <ChartContainer
              config={chartConfig}
              className="h-[90px] w-full"
            >
              <AreaChart
                accessibilityLayer
                data={chartData}
                margin={{
                  left: 12,
                  right: 12,
                  top: 12,
                  bottom: 12,
                }}
              >
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="line" />}
                />

                <Area
                  dataKey="count"
                  type="monotone"
                  fill="var(--color-primary)"
                  fillOpacity={0}
                  stroke="var(--color-primary)"
                  strokeWidth={2.5}
                />
              </AreaChart>
            </ChartContainer>
          </div>

          {/* Visitors */}
          <div className="mt-4 flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              Total Visitors
            </span>
            <span className="text-lg font-semibold">
              {websiteInfo?.analytics?.totalVisitors}
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

export default WebsiteCart