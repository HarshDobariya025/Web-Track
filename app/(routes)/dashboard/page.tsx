"use client"

import { Button } from '@/components/ui/button'
import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react'

const Dashboard = () => {
    const [websiteList, setWebsiteList] = useState([]);

  return (
    <div className="mt-8">
        <div className="flex items-center justify-between">
            <h2 className="font-bold text-xl">My Website</h2>
            <Link href="/dashboard/new">
                <Button>+ Website</Button>
            </Link>
        </div>

        {/* Empty State */}
        <div>
            {websiteList?.length==0?
            <div className="flex flex-col justigy-center items-center gap-4 p-8 border-2 border-dashed rounded-md mt-5">
                <Image src="/website.png" alt="Empty State" width={100} height={200} />
                <h2>You didn't have any website added for tracking</h2>
                <Link href="/dashboard/new">
                    <Button>+ Website</Button>
                </Link>
            </div>
            :
            <div>
                {/* Website List Here */}
            </div>
            }
        </div>
    </div>
  )
}

export default Dashboard