"use client"

import { Button } from "@/components/ui/button"
import { WebsiteInfoType } from "@/configs/type"
import axios from "axios"
import Image from "next/image"
import Link from "next/link"
import React, { useEffect, useState } from "react"
import WebsiteCart from "./_components/WebsiteCart"
import { Skeleton } from "@/components/ui/skeleton"
import { format } from "date-fns-tz/format"

const Dashboard = () => {
  const [websiteList, setWebsiteList] = useState<WebsiteInfoType[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    GetUserWebsite()
  }, [])

  const GetUserWebsite = async () => {
    setLoading(true)
    const today = format(new Date(), "yyyy-MM-dd")
    const result = await axios.get(
      "/api/website?from=" + today + "&to=" + today
    )
    setWebsiteList(result?.data)
    setLoading(false)
  }

  return (
    <div className="mt-10 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">
            My Websites
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Manage and monitor all your tracked websites
          </p>
        </div>

        <Link href="/dashboard/new">
          <Button className="shadow-sm">
            + Add Website
          </Button>
        </Link>
      </div>

      {/* Content */}
      <div>
        {/* Loading Skeleton */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {[1, 2, 3].map((_, index) => (
              <div
                key={index}
                className="rounded-xl border bg-background p-5 space-y-4"
              >
                <div className="flex items-center gap-3">
                  <Skeleton className="h-9 w-9 rounded-md" />
                  <Skeleton className="h-4 w-2/3 rounded-sm" />
                </div>
                <Skeleton className="h-[90px] w-full rounded-md" />
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && websiteList?.length === 0 && (
          <div className="mt-10 flex flex-col items-center justify-center gap-4 rounded-xl border border-dashed bg-muted/30 p-10 text-center">
            <Image
              src="/website.png"
              alt="Empty State"
              width={120}
              height={120}
              className="opacity-80"
            />
            <h3 className="text-lg font-medium">
              No websites added yet
            </h3>
            <p className="text-sm text-muted-foreground max-w-sm">
              Add your first website to start tracking visitors and analytics
            </p>
            <Link href="/dashboard/new">
              <Button className="mt-2">
                + Add Website
              </Button>
            </Link>
          </div>
        )}

        {/* Website Grid */}
        {!loading && websiteList?.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {websiteList.map((website, index) => (
              <div
                key={index}
                className="transition-transform hover:-translate-y-1"
              >
                <WebsiteCart websiteInfo={website} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard
