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
        <Card>
            <CardHeader>
                <CardTitle>
                    <div className="flex items-center gap-1">
                        <Globe className="h-9 w-9 p-2 rounded-md " />
                        <h2 className="font-bold text-lg">{websiteInfo?.website?.domain.replace('https://','')}</h2>
                    </div>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig} className="max-h-30 w-full">
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
                        {/* <CartesianGrid vertical={false} /> */}
                        {/* <XAxis
                        dataKey="month"
                        tickLine={false}
                        axisLine={false}
                        tickMargin={8}
                        tickFormatter={(value) => value.slice(0, 3)}
                        /> */}
                        <ChartTooltip
                        cursor={false}
                        content={<ChartTooltipContent indicator="line" />}
                        />
                        
                        <Area
                        dataKey="count"
                        type="monotone"
                        fill="var(--color-primary)"
                        fillOpacity={0.0}
                        stroke="var(--color-primary)"
                        strokeWidth={3}
                        />
                        {/* <ChartLegend content={<ChartLegendContent />} />   */}
                    </AreaChart>
                </ChartContainer>

                <h2 className="text-sm mt-1"><strong>{websiteInfo?.analytics?.totalVisitors}</strong> Visiters</h2>
            </CardContent>
        </Card>
    </Link>
  )
}

export default WebsiteCart