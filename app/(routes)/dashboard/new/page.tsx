import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import React from 'react'
import WebsiteForm from './_components/WebsiteForm'

const AddWebsite = () => {
  return (
    <div className="flex justify-center items-center w-full mt-10 ">
        <div className="max-w-lg flex flex-col items-start w-full">
            <Button variant={'outline'}><ArrowLeft/>Dashboard</Button>

            <div className="w-full mt-10">
                <WebsiteForm />
            </div>
        </div>
    </div>
  )
}

export default AddWebsite