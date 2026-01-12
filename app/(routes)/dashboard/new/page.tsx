import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import React from 'react'
import WebsiteForm from './_components/WebsiteForm'
import Link from 'next/link'

const AddWebsite = () => {
  return (
    <div className="flex justify-center items-center w-full mt-15 ">
        <div className="max-w-lg flex flex-col items-start w-full">
            <Link href={`/dashboard`}>
              <Button variant={'outline'}><ArrowLeft/>Dashboard</Button>
            </Link>

            <div className="w-full mt-5">
                <WebsiteForm />
            </div>
        </div>
    </div>
  )
}

export default AddWebsite