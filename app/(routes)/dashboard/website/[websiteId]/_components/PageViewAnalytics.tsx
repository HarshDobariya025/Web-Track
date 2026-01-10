import { Card, CardContent } from '@/components/ui/card'
import { WebsiteInfoType } from '@/configs/type'
import React from 'react'
import LabelCountItem from './LabelCountItem'
import { Separator } from '@/components/ui/separator'
import { TrendingUp } from "lucide-react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { Skeleton } from '@/components/ui/skeleton'

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig

type props={
    websiteInfo:WebsiteInfoType | undefined | null,
    loading:boolean,
    analyticType:string
}

const PageViewAnalytics = ({websiteInfo,loading,analyticType}:props) => {
    const webAnalytics=websiteInfo?.analytics;

  return (
    <div className="mt-7">
        {!loading? 
            <Card>
                <CardContent className='p-5 flex items-center gap-6'>
                    <LabelCountItem label="Visitors" value={webAnalytics?.totalVisitors}/>
                    <Separator orientation='vertical' className='h-12'/>
                    <LabelCountItem label="Total Page Views" value={webAnalytics?.totalSessions}/>
                    <Separator orientation='vertical' className='h-12'/>
                    <LabelCountItem label="Total Active Time" value={(Number(webAnalytics?.totalActiveTime)/60).toFixed(1)+"min"}/>
                    <Separator orientation='vertical' className='h-12'/>
                    <LabelCountItem label="Average Active Time" value={(Number(webAnalytics?.avgActiveTime)/60).toFixed(1)+"min"}/>
                    <Separator orientation='vertical' className='h-12'/>
                    <LabelCountItem label="Live Users" value={"10"}/>
                </CardContent>

                <CardContent className='mt-5 p-5'>
                    <ChartContainer config={chartConfig} className="h-96 w-full">
                        <AreaChart
                            accessibilityLayer
                            data={analyticType=='hourly'? webAnalytics?.hourlyVisitors : webAnalytics?.dailyVisitors}
                            margin={{
                                left: 12,
                                right: 12,
                                top: 12,
                                bottom: 12,
                            }}
                        >
                            <CartesianGrid vertical={false} />
                            <XAxis
                                dataKey={analyticType=='hourly'? "hourLabel" : "date"}
                                tickLine={false}
                                axisLine={false}
                            />
                            <YAxis
                                allowDecimals={false}
                                tickLine={false}
                                axisLine={false}
                                width={30}
                            />

                            <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent indicator="line" />}
                            />
                            <Area
                            dataKey="count"
                            type="monotone"
                            fill="var(--color-primary)"
                            fillOpacity={0.4}
                            stroke="var(--color-primary)"
                            />
                        </AreaChart>
                        </ChartContainer>
                </CardContent>
            </Card>
            :
            <div>
                <Skeleton className="w-full h-80 rounded-2px"/>
            </div>

        }
    </div>
  )
}

export default PageViewAnalytics