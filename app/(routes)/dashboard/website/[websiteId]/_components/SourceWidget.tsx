import { AnalyticsType, IMAGE_URL_FOR_DOMAINS } from '@/configs/type';
import React from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from "recharts"
import { Skeleton } from '@/components/ui/skeleton'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import Image from 'next/image';

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
    websiteAnalytics: AnalyticsType | undefined;
    loading: boolean;
}

const SourceWidget = ({websiteAnalytics,loading}:Props) => {

    const BarLabelWithImage = (props: any) => {
        const { x, y, width, height, value } = props;
        const imageUrl = IMAGE_URL_FOR_DOMAINS?.replace('<domain>', value);
        return (
            <g transform={`translate(${x + 8}, ${y + height / 2 - 8})`}>
                {/* SVG image */}
                <image href={imageUrl} width={16} height={16} />
                {/* SVG text */}
                <text x={20} y={12} fontSize={12} fill="#ffffff">
                    {value}
                </text>
            </g>
        );
    };



  return (
    <div className="">
        {!loading? 
            <Card>
                <CardContent className="p-5">
                    <Tabs defaultValue="source" className="w-full">
                        <TabsList>
                            <TabsTrigger value="source">Source</TabsTrigger>
                            <TabsTrigger value="referral">Referral</TabsTrigger>
                        </TabsList>

                        {/* source */}
                        <TabsContent value="source">
                            <ChartContainer config={chartConfig}>
                                <BarChart
                                    accessibilityLayer
                                    data={websiteAnalytics?.referrals}
                                    layout="vertical"
                                    margin={{
                                    right: 16,
                                    }}
                                >
                                    <CartesianGrid horizontal={false} />
                                    <YAxis
                                    dataKey="domainName"
                                    type="category"
                                    tickLine={false}
                                    tickMargin={10}
                                    axisLine={false}
                                    tickFormatter={(value) => value.slice(0, 3)}
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
                                        dataKey="domainName"    
                                        position="insideLeft"
                                        offset={8}
                                        className="fill-(--color-label)"
                                        fontSize={12}
                                        content={<BarLabelWithImage />}
                                    />
                                    </Bar>
                                </BarChart>
                            </ChartContainer>
                        </TabsContent>

                        {/* referral */}
                        <TabsContent value="referral">
                            <ChartContainer config={chartConfig}>
                                <BarChart
                                    accessibilityLayer
                                    data={websiteAnalytics?.refParams}
                                    layout="vertical"
                                    margin={{
                                    right: 16,
                                    }}
                                >
                                    <CartesianGrid horizontal={false} />
                                    <YAxis
                                    dataKey="name"
                                    type="category"
                                    tickLine={false}
                                    tickMargin={10}
                                    axisLine={false}
                                    tickFormatter={(value) => value.slice(0, 3)}
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
                                        className="fill-(--color-label)"
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
        :
            <div>
                <Skeleton className="w-full h-80 rounded-2px"/>
            </div>
        }
    </div>
  )
}

export default SourceWidget