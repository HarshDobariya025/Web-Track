"use client"

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import React, { useState } from 'react'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group"
import { Globe, Loader2Icon, Plus } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'


const WebsiteForm = () => {
    const [domain,setDomain]=useState("");
    const [timeZone,setTimeZone]=useState("");
    const [enableLocalhostTracking,setEnableLocalhostTracking]=useState(false);
    const [loading,setLoading]=useState(false);
    const route=useRouter();

    const onFormSubmit = async (e:any) => {
        e.preventDefault();
        setLoading(true);
        const websiteId=crypto.randomUUID();
        const result = await axios.post('/api/website', {
            websiteId: websiteId,
            domain: domain,
            timeZone: timeZone,
            enableLocalhostTracking: enableLocalhostTracking,
        })

        if(result?.data?.msg=='limit'){
            console.log("Upgrade your plan")
            toast.error('Limit Exceed, Upgrade your plan');
            setLoading(false);
            route.replace('/dashboard/pricing');
            return;
        }

        if(result.data.data){   //existing domain 
            route.push('/dashboard/new?step=script&websiteId='+result?.data?.data?.websiteId+'&domain='+result?.data?.data?.domain);
        }else if(!result?.data?.message){   //new domain added
            route.push('/dashboard/new?step=script&websiteId='+websiteId+'&domain='+domain);
        }else{
            alert(result?.data?.message); //domain not beling to you
        }

        console.log("New Website form data:"+result.data);
        setLoading(false);
        route.replace('/dashboard');
    }

    
  return (
    <div className="max-w-xl">
      <Card className="rounded-xl border bg-background shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-semibold">
            Add a New Website
          </CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Connect a website to start tracking visitors and analytics
          </p>
        </CardHeader>

        <Separator />

        <CardContent className="pt-6">
          <form onSubmit={onFormSubmit} className="space-y-6">
            {/* Website URL */}
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Website URL
              </label>

              <InputGroup>
                <InputGroupInput
                  type="text"
                  placeholder="mywebsite.com"
                  required
                  onChange={(e) =>
                    setDomain("https://" + e.target.value)
                  }
                />
                <InputGroupAddon className="flex items-center gap-1">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">
                    https://
                  </span>
                </InputGroupAddon>
              </InputGroup>

              <p className="text-xs text-muted-foreground">
                Enter your domain without protocol (https is added automatically)
              </p>
            </div>

            {/* Time Zone */}
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Time Zone
              </label>
              <Select required onValueChange={(value)=>setTimeZone(value)}>
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a timezone" />
                    </SelectTrigger>
                    <SelectContent className="max-h-72 overflow-y-auto">
                        <SelectGroup>
                        <SelectLabel>North America</SelectLabel>
                        <SelectItem value="est">Eastern Standard Time (EST)</SelectItem>
                        <SelectItem value="cst">Central Standard Time (CST)</SelectItem>
                        <SelectItem value="mst">Mountain Standard Time (MST)</SelectItem>
                        <SelectItem value="pst">Pacific Standard Time (PST)</SelectItem>
                        <SelectItem value="akst">Alaska Standard Time (AKST)</SelectItem>
                        <SelectItem value="hst">Hawaii Standard Time (HST)</SelectItem>
                        </SelectGroup>
                        <SelectGroup>
                        <SelectLabel>Europe & Africa</SelectLabel>
                        <SelectItem value="gmt">Greenwich Mean Time (GMT)</SelectItem>
                        <SelectItem value="cet">Central European Time (CET)</SelectItem>
                        <SelectItem value="eet">Eastern European Time (EET)</SelectItem>
                        <SelectItem value="west">
                            Western European Summer Time (WEST)
                        </SelectItem>
                        <SelectItem value="cat">Central Africa Time (CAT)</SelectItem>
                        <SelectItem value="eat">East Africa Time (EAT)</SelectItem>
                        </SelectGroup>
                        <SelectGroup>
                        <SelectLabel>Asia</SelectLabel>
                        <SelectItem value="msk">Moscow Time (MSK)</SelectItem>
                        <SelectItem value="ist">India Standard Time (IST)</SelectItem>
                        <SelectItem value="cst_china">China Standard Time (CST)</SelectItem>
                        <SelectItem value="jst">Japan Standard Time (JST)</SelectItem>
                        <SelectItem value="kst">Korea Standard Time (KST)</SelectItem>
                        <SelectItem value="ist_indonesia">
                            Indonesia Central Standard Time (WITA)
                        </SelectItem>
                        </SelectGroup>
                        <SelectGroup>
                        <SelectLabel>Australia & Pacific</SelectLabel>
                        <SelectItem value="awst">
                            Australian Western Standard Time (AWST)
                        </SelectItem>
                        <SelectItem value="acst">
                            Australian Central Standard Time (ACST)
                        </SelectItem>
                        <SelectItem value="aest">
                            Australian Eastern Standard Time (AEST)
                        </SelectItem>
                        <SelectItem value="nzst">New Zealand Standard Time (NZST)</SelectItem>
                        <SelectItem value="fjt">Fiji Time (FJT)</SelectItem>
                        </SelectGroup>
                        <SelectGroup>
                        <SelectLabel>South America</SelectLabel>
                        <SelectItem value="art">Argentina Time (ART)</SelectItem>
                        <SelectItem value="bot">Bolivia Time (BOT)</SelectItem>
                        <SelectItem value="brt">Brasilia Time (BRT)</SelectItem>
                        <SelectItem value="clt">Chile Standard Time (CLT)</SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>

              <p className="text-xs text-muted-foreground">
                Used to align analytics with your local time
              </p>
            </div>

            {/* Checkbox */}
            <div className="flex items-start gap-3 rounded-lg border bg-muted/30 p-4">
              <Checkbox
                checked={enableLocalhostTracking}
                onCheckedChange={(value: boolean) =>
                  setEnableLocalhostTracking(value)
                }
              />
              <div>
                <p className="text-sm font-medium">
                  Enable localhost tracking
                </p>
                <p className="text-xs text-muted-foreground">
                  Track visits during local development
                </p>
              </div>
            </div>

            {/* Submit */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full h-11 text-sm font-semibold"
            >
              {loading ? (
                <Loader2Icon className="h-4 w-4 animate-spin" />
              ) : (
                <Plus className="h-4 w-4" />
              )}
              <span className="ml-2">
                {loading ? "Adding Website..." : "Add Website"}
              </span>
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default WebsiteForm