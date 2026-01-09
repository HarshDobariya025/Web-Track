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
    <div>
        <Card>
            <CardHeader>
                <CardTitle>
                    <div className="flex items-center gap-1">
                        <Globe className="h-10 w-10 p-2 rounded-md " />
                        <h2 className="font-bold text-lg">{websiteInfo?.website?.domain.replace('https://','')}</h2>
                    </div>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig} className="max-h-40 w-full">
                    <AreaChart
                        accessibilityLayer
                        data={chartData}
                        margin={{
                          left: 12,
                          right: 12,
                        }}
                    >
                        {/* <CartesianGrid vertical={false} /> */}
                        {/* <XAxis
                        dataKey="month"
                        tickLine={false}
                        axisLine={false}
                        tickMargin={8}
                        tickFormatter={(value) => value.slice(0, 3)}
                        /> */}+
                        {/* <ChartTooltip
                        cursor={false}
                        content={<ChartTooltipContent indicator="line" />}
                        /> */}
                        
                        <Area
                        dataKey="count"
                        type="natural"
                        fill="var(--color-primary)"
                        fillOpacity={0.4}
                        stroke="var(--color-primary)"
                        strokeWidth={2}
                        />
                        {/* <ChartLegend content={<ChartLegendContent />} />   */}
                    </AreaChart>
                </ChartContainer>

                <h2 className="text-sm mt-1"><strong>{websiteInfo?.analytics?.last24hVisitors}</strong> Visiters</h2>
            </CardContent>
        </Card>
    </div>
  )
}

export default WebsiteCart