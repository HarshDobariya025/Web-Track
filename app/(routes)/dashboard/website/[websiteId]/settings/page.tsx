"use client"

import { Button } from "@/components/ui/button"
import { WebsiteType } from "@/configs/type"
import axios from "axios"
import { ArrowLeft, Copy, Loader, Trash } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import React, { useEffect, useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { toast } from "sonner"
import { Input } from "@/components/ui/input"
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
import Link from "next/link"

const a11yDark =
  require("react-syntax-highlighter/dist/cjs/styles/prism").a11yDark

const WebsiteSettings = () => {
  const { websiteId } = useParams()
  const router = useRouter()

  const [websiteDetail, setWebsiteDetail] = useState<WebsiteType>()
  const [websiteDomain, setWebsiteDomain] = useState<string>()
  const [loading, setLoading] = useState(false)

  const GetWebsiteDetail = async () => {
    const result = await axios.get(
      `/api/website?websiteId=${websiteId}&websiteOnly=true`
    )
    setWebsiteDetail(result?.data)
    setWebsiteDomain(result?.data?.domain)
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

  const onDeleteWebsite = async () => {
    setLoading(true)
    await axios.delete("/api/website", {
      data: { websiteId },
    })
    toast.success("Website deleted")
    setLoading(false)
    router.replace("/dashboard")
  }

  return (
    <div className="mx-auto mt-10 mb-20 max-w-5xl space-y-6">
      
      {/* Back */}
      <Link href="/dashboard">
        <Button variant="outline" className="gap-1">
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
      </Link>

      {/* Title */}
      <div className="mt-5">
        <h2 className="text-2xl font-bold">
          Settings for{" "}
          <span className="text-muted-foreground">
            {websiteDetail?.domain?.replace("https://", "")}
          </span>
        </h2>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="general" className="w-full">
        <TabsList className="mb-4 h-9 rounded-lg bg-muted/50 p-1">
          <TabsTrigger value="general" className="rounded-md px-4 text-sm">
            General
          </TabsTrigger>
          <TabsTrigger value="other" className="rounded-md px-4 text-sm">
            Other
          </TabsTrigger>
        </TabsList>

        {/* GENERAL */}
        <TabsContent value="general" className="space-y-6">
          
          {/* Script Card */}
          <Card className="rounded-xl border bg-white shadow-sm">
            <CardHeader>
              <CardTitle>Tracking Script</CardTitle>
              <CardDescription>
                Install this script in your website’s HTML
              </CardDescription>
            </CardHeader>

            <Separator />

            <CardContent className="pt-6">
              <div className="relative space-y-3">
                <p className="text-sm text-muted-foreground">
                  Copy and paste the following script inside the{" "}
                  <code>&lt;head&gt;</code> section of your website.
                </p>

                <div className="relative overflow-x-auto rounded-lg border">
                  <SyntaxHighlighter
                    language="javascript"
                    style={a11yDark}
                    customStyle={{ margin: 0, borderRadius: 0 }}
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
            </CardContent>
          </Card>

          {/* Domain Card */}
          <Card className="rounded-xl border bg-white shadow-sm">
            <CardHeader>
              <CardTitle>Domain</CardTitle>
              <CardDescription>
                Main website domain used for analytics tracking
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <Input
                placeholder="website.com"
                value={websiteDomain}
                onChange={(e) => setWebsiteDomain(e.target.value)}
              />

              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  Public WebTrack ID:{" "}
                  <span className="font-medium text-foreground">
                    {websiteId}
                  </span>
                </span>

                <Button variant="outline">Save</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* OTHER */}
        <TabsContent value="other">
          <Card className="rounded-xl border border-red-200 bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="text-red-600">Danger Zone</CardTitle>
              <CardDescription>
                Destructive actions cannot be undone
              </CardDescription>
            </CardHeader>

            <Separator />

            <CardContent className="flex items-center justify-between pt-6">
              <p className="text-sm text-muted-foreground">
                Delete this website and all associated analytics data.
              </p>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" className="gap-1 text-white">
                    <Trash className="h-4 w-4" />
                    Delete
                  </Button>
                </AlertDialogTrigger>

                <AlertDialogContent className="rounded-xl">
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete
                      your website and remove all analytics data.
                    </AlertDialogDescription>
                  </AlertDialogHeader>

                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <Button
                      variant="destructive"
                      disabled={loading}
                      onClick={onDeleteWebsite}
                      className="text-white"
                    >
                      {loading ? (
                        <Loader className="h-4 w-4 animate-spin" />
                      ) : (
                        "Delete Website"
                      )}
                    </Button>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default WebsiteSettings
