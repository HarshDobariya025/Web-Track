"use client"

import { Button } from '@/components/ui/button'
import { WebsiteType } from '@/configs/type';
import axios from 'axios';
import { ArrowLeft, Copy, Loader, Save, Trash } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
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
import Link from 'next/link';


const a11yDark =
  require("react-syntax-highlighter/dist/cjs/styles/prism").a11yDark;

const WebsiteSettings = () => {
    const {websiteId} = useParams();
    const [websiteDetail,setWebsiteDetail]=useState<WebsiteType>();
    const [websiteDomain,setWebsiteDomain]=useState<string>();
    const [loading,setLoading]=useState(false);
    const router=useRouter();

    const GetWebsiteDetail= async () => {
        const result = await axios.get(`/api/website?websiteId=${websiteId}&websiteOnly=true`);
        console.log('Website settigs Detail: ', result.data);
        setWebsiteDetail(result?.data);
        setWebsiteDomain(result?.data?.domain);
    }

    useEffect(()=>{
        GetWebsiteDetail();
    },[]);

    const Script = 
    `<script
    defer
    data-website-id='${websiteId}'
    data-domain='${websiteDetail?.domain}'
    sec"${process.env.NEXT_PUBLIC_HOST_URL}/analytics.js">
</script>`;

    const onCopy = () => {
        navigator.clipboard.writeText(Script);
        toast.success('Script Copied to clipboard');
    }

    const onDeleteWebsite=async()=>{
        setLoading(true);
        const result = await axios.delete('/api/website',{
            data:{ websiteId:websiteId }
        })
        toast.success("Website Deleted!");
        setLoading(false);
        router.replace('/dashboard');
    }

  return (
    <div className="w-full mt-10 mb-20">
        <Link href={`/dashboard`}>
        <Button variant="outline"><ArrowLeft/>Back</Button>
        </Link>
        <h2 className="font-bold text-2xl mt-4">Settings for {websiteDetail?.domain?.replace('https://','')}</h2>
        <Tabs defaultValue="general" className="w-[800px] mt-4">
            <TabsList>
                <TabsTrigger value="general">General</TabsTrigger>
                <TabsTrigger value="other">Other</TabsTrigger>
            </TabsList>

            {/* general */}
            <TabsContent value="general">
                <Card>
                    <CardHeader>
                        <CardTitle>Script</CardTitle>
                    </CardHeader>
                    <Separator/>
                    <CardContent>
                        <div className="w-full mt-5 relative">
                            <p>Copy and paste the following script into the <code>&lt;head&gt;</code> section of your website's HTML</p>
                            <SyntaxHighlighter
                                language="javascript"
                                style={a11yDark}
                                customStyle={{ borderRadius: 8 }}
                                >
                                {Script}
                                </SyntaxHighlighter>
                            <Button variant={'outline'} size={'icon'} onClick={onCopy} className="absolute top-8 right-0 m-3"><Copy/></Button>
                        </div>
                    </CardContent>
                </Card>

                <Card className="mt-6">
                    <CardHeader>
                        <CardTitle>Domain</CardTitle>
                        <CardDescription>Your main website domain for analytic tracking</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Input placeholder='website.com' value={websiteDomain}
                        onChange={(e)=>setWebsiteDomain(e.target.value)}/>
                        <div className="flex justify-between mt-2 items-center">
                            <h2>Your public WENTRACK ID is {websiteId}</h2>
                            <Button variant={'outline'}>Save</Button>
                        </div>
                    </CardContent>
                </Card>
            </TabsContent>

            {/* other */}
            <TabsContent value="other">
                <Card>
                    <CardHeader>
                        <CardTitle>Danger</CardTitle>
                    </CardHeader>
                    <Separator/>
                    <CardContent className="flex justify-between items-center mt-3">
                        <h2>Do you wnat to delete this website from webtrack ?</h2>
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button className="text-white" variant={'destructive'}><Trash/> Delete</Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete your website
                                    and remove your data from our servers.
                                </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <Button onClick={()=>onDeleteWebsite()} disabled={loading}
                                    className="text-white" variant={'destructive'}>
                                    {loading? <Loader className="animate-spin"/>:"Continue to Delete"}
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