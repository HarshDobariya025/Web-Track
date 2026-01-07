import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

import { WebsiteType } from '@/configs/type'
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

const chartData = [
  { month: "January", desktop: 186, mobile: 80 },
  { month: "February", desktop: 305, mobile: 200 },
  { month: "March", desktop: 237, mobile: 120 },
  { month: "April", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "June", desktop: 214, mobile: 140 },
]

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
    website:WebsiteType
}

const WebsiteCart = ({website}:Props) => {
  return (
    <div>
        <Card>
            <CardHeader>
                <CardTitle>
                    <div className="flex items-center gap-1">
                        <Globe className="h-10 w-10 p-2 rounded-md " />
                        <h2 className="font-bold text-lg">{website.domain.replace('https://','')}</h2>
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
                        }}
                    >
                        <CartesianGrid vertical={false} />
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
                        dataKey="desktop"
                        type="natural"
                        fill="var(--color-primary)"
                        fillOpacity={0.4}
                        stroke="var(--color-primary)"
                        stackId="a"
                        strokeWidth={2}
                        />
                        {/* <ChartLegend content={<ChartLegendContent />} />   */}
                    </AreaChart>
                </ChartContainer>

                <h2 className="text-sm mt-1"><strong>24</strong>Visiters</h2>
            </CardContent>
        </Card>
    </div>
  )
}

export default WebsiteCart