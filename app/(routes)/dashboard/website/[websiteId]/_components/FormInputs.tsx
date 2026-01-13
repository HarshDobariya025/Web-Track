"use client"

import React, { useEffect, useState } from "react"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { WebsiteType } from "@/configs/type"
import { useParams, useRouter } from "next/navigation"
import {
  ArrowLeft,
  Calendar as CalendarIcon,
  Code2,
  RefreshCcw,
  Settings,
  Copy,
} from "lucide-react"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { DateRange } from "react-day-picker"
import Link from "next/link"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import axios from "axios"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

const a11yDark =
  require("react-syntax-highlighter/dist/cjs/styles/prism").a11yDark

type Props = {
  websiteList: WebsiteType[]
  setFormData: any
  setReloadData: any
}

const FormInputs = ({ websiteList, setFormData, setReloadData }: Props) => {
  const { websiteId } = useParams()
  const router = useRouter()

  const today = new Date()
  const [date, setDate] = useState<DateRange>({ from: today })
  const [analyticsType, setAnalyticsType] = useState<string>("hourly")
  const [websiteDetail, setWebsiteDetail] = useState<WebsiteType>()

  const handleDateChange = (range?: DateRange) => {
    if (!range?.from) return
    if (range.from && !range.to) {
      setDate({ from: range.from })
      return
    }
    setDate({ from: range.from, to: range.to })
  }

  useEffect(() => {
    setFormData({
      analyticsType,
      fromDate: date?.from ?? today,
      toDate: date?.to ?? today,
    })
  }, [date, analyticsType])

  const GetWebsiteDetail = async () => {
    const result = await axios.get(
      `/api/website?websiteId=${websiteId}&websiteOnly=true`
    )
    setWebsiteDetail(result?.data)
  }

  useEffect(() => {
    GetWebsiteDetail()
  }, [])

  const Script = `<script
  defer
  data-website-id='${websiteId}'
  data-domain='${websiteDetail?.domain}'
  src="${process.env.NEXT_PUBLIC_HOST_URL}/analytics.js">
</script>`

  const onCopy = () => {
    navigator.clipboard.writeText(Script)
    toast.success("Script copied to clipboard")
  }

  return (
    <div className="flex flex-col gap-4 rounded-xl border bg-white p-4 shadow-sm lg:flex-row lg:items-center lg:justify-between">
      
      {/* LEFT SECTION */}
      <div className="flex flex-wrap items-center gap-3">
        <Link href="/dashboard">
          <Button variant="outline" className="gap-1">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </Link>

        {/* Website Select */}
        <Select
          value={(websiteId as string) || ""}
          onValueChange={(v) => router.push(`/dashboard/website/${v}`)}
        >
          <SelectTrigger className="w-[240px] bg-white shadow-sm">
            <SelectValue placeholder="Select a website" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Website</SelectLabel>
              {websiteList.map((website) => (
                <SelectItem key={website.id} value={website.websiteId}>
                  {website.domain.replace("https://", "")}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        {/* Date Picker */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              data-empty={!date}
              className={cn(
                "justify-start gap-2 text-left font-normal bg-white shadow-sm",
                "data-[empty=true]:text-muted-foreground",
                date?.to ? "w-[360px]" : "w-[220px]"
              )}
            >
              <CalendarIcon className="h-4 w-4" />
              {date?.from ? (
                date.to ? (
                  <>
                    {format(date.from, "PPP")} – {format(date.to, "PPP")}
                  </>
                ) : (
                  <>{format(date.from, "PPP")}</>
                )
              ) : (
                <span>Pick a date</span>
              )}
            </Button>
          </PopoverTrigger>

          <PopoverContent className="w-auto rounded-xl border bg-white p-2 shadow-lg">
            <div className="mb-2 flex items-center justify-between gap-2">
              <Button variant="outline" size="sm" onClick={() => setDate({ from: today })}>
                Today
              </Button>
              <Button variant="outline" size="sm" onClick={() => setDate({ from: today })}>
                Reset
              </Button>
            </div>
            <Calendar
              mode="range"
              selected={date}
              onSelect={handleDateChange}
              className="w-[280px]"
            />
          </PopoverContent>
        </Popover>

        {/* Analytics Type */}
        <Select
          value={analyticsType}
          onValueChange={(value) => setAnalyticsType(value)}
        >
          <SelectTrigger className="w-[140px] bg-white shadow-sm">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="hourly">Hourly</SelectItem>
              <SelectItem value="daily">Daily</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>

        <Button
          variant="outline"
          size="icon"
          className="bg-white shadow-sm"
          onClick={() => setReloadData(true)}
        >
          <RefreshCcw className="h-4 w-4" />
        </Button>
      </div>

      {/* RIGHT SECTION */}
      <div className="flex items-center gap-3">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline" className="gap-2 bg-white shadow-sm">
              <Code2 className="h-4 w-4" />
              Code
            </Button>
          </AlertDialogTrigger>

          <AlertDialogContent className="max-w-2xl rounded-xl border bg-white shadow-xl">
            <AlertDialogHeader>
              <AlertDialogTitle>Install the WebTrack Script</AlertDialogTitle>
              <AlertDialogDescription asChild>
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    Copy and paste this script inside your website’s{" "}
                    <code>&lt;head&gt;</code>.
                  </p>

                  <div className="relative overflow-x-auto rounded-lg border bg-neutral-950">
                    <SyntaxHighlighter
                      language="javascript"
                      style={a11yDark}
                      customStyle={{
                        margin: 0,
                        borderRadius: 0,
                        minWidth: "100%",
                      }}
                    >
                      {Script}
                    </SyntaxHighlighter>

                    <Button
                      variant="outline"
                      size="icon"
                      onClick={onCopy}
                      className="absolute right-2 top-2 bg-white/90 backdrop-blur"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </AlertDialogDescription>
            </AlertDialogHeader>

            <AlertDialogFooter>
              <AlertDialogCancel>Close</AlertDialogCancel>
              <AlertDialogAction>Done</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <Link href={`/dashboard/website/${websiteId}/settings`}>
          <Button variant="outline" size="icon" className="bg-white shadow-sm">
            <Settings className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  )
}

export default FormInputs
