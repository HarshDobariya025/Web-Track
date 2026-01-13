import React from 'react'
import { PricingTable } from '@clerk/nextjs'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'

const Pricing = () => {
  return (
    <div className="mt-7">
        <Link href={`/dashboard`}>
          <Button variant="outline"><ArrowLeft/>Dashboard</Button>
        </Link>
        <h2 className="font-bold text-3xl mt-8">Pricing</h2>
        <h2 className="mb-5">Select best plan for your website</h2>
        <PricingTable />
    </div>
  )
}

export default Pricing