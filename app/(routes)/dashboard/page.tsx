"use client"

import { Button } from '@/components/ui/button'
import { WebsiteType } from '@/configs/type';
import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react'
import WebsiteCart from './_components/WebsiteCart';
import { Skeleton } from '@/components/ui/skeleton';

const Dashboard = () => {
    const [websiteList, setWebsiteList] = useState<WebsiteType[]>([]);
    const [loading,setLoading]=useState(false);

    useEffect(() => {
        GetUserWebsite();
    },[]);

    const GetUserWebsite = async () => {
        setLoading(true);
        const result = await axios.get('/api/website');
        setWebsiteList(result?.data);
        // console.log(result.data);
        setLoading(false);
    }

  return (
    <div className="mt-8">
        <div className="flex items-center justify-between">
            <h2 className="font-bold text-xl">My Website</h2>
            <Link href="/dashboard/new">
                <Button>+ Website</Button>
            </Link>
        </div>

        <div>
            {loading && <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-5">
                {[1,2,3,4].map((item,index)=>(
                    <div className="p-4" key={index}>
                        <div className="flex gap-2 items-center">
                            <Skeleton className="h-8 w-8 rounded-sm" />
                            <Skeleton className="h-4 w-1/2 rounded-sm" />
                        </div>
                        <Skeleton className="h-[80px] w-full mt-4" />
                    </div>
                ))}
            </div>}

            {/* Empty State */}
            {websiteList?.length==0?
                <div className="flex flex-col justigy-center items-center gap-4 p-8 border-2 border-dashed rounded-md mt-5">
                    <Image src="/website.png" alt="Empty State" width={100} height={200} />
                    <h2>You didn't have any website added for tracking</h2>
                    <Link href="/dashboard/new">
                        <Button>+ Website</Button>
                    </Link>
                </div>
                :
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-5">
                    {/* Website List Here */}
                    {websiteList?.map((website, index) => (
                        <WebsiteCart key={index} website={website} />
                    ))}
                </div>
            }
        </div>
    </div>
  )
}

export default Dashboard