"use client"

import { LiveUserType, WebsiteInfoType, WebsiteType } from '@/configs/type';
import axios from 'axios';
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import FormInputs from './_components/FormInputs';
import PageViewAnalytics from './_components/PageViewAnalytics';
import { format } from 'date-fns';
import SourceWidget from './_components/SourceWidget';
import LocationWidget from './_components/LocationWidget';
import DevicesWidget from './_components/DevicesWidget';


const WebsiteDetail = () => {
    const {websiteId}=useParams();
    const [websiteList,setWebsiteList]=useState<WebsiteType[]>([]);
    const [websiteInfo,setWebsiteInfo]=useState<WebsiteInfoType|null>();
    const [liveUser,setLiveUser]=useState<LiveUserType[]>([]);
    const [loading,setLoading]=useState<boolean>(false)
    const [formData,setFormData]=useState<any>({
        analyticsType:'hourly',
        fromDate: new Date(),
        toDate: new Date()
    });

    useEffect(() => {
        GetWebsiteList();
        GetWebsiteAnalyticalDetail();
    },[]);

    const GetWebsiteList = async () => {
        const websites=await axios.get('/api/website?websiteOnly=true');
        console.log('Websites: ',websites.data);
        setWebsiteList(websites?.data);
    }

    const GetWebsiteAnalyticalDetail = async () => {
        setLoading(true);
        const fromDate=format(formData?.fromDate,'yyyy-MM-dd');
        const toDate=formData?.toDate ? format(formData?.toDate,'yyyy-MM-dd') : fromDate;
        const websiteResult=await axios.get(`/api/website?websiteId=${websiteId}&from=${fromDate}&to=${toDate}`);
        console.log('WebsiteResult: ',websiteResult?.data);
        setWebsiteInfo(websiteResult?.data[0]);
        setLoading(false);
        GetLiveUsers();
    }

    const GetLiveUsers = async () => {
      const result = await axios.get(`/api/live?websiteId=${websiteId}`);
      console.log('Live Users:', result.data);
      setLiveUser(result?.data);
    };

    useEffect(() => {
      GetWebsiteAnalyticalDetail();
    },[formData?.fromDate, formData?.toDate]);

  return (
    <div className="mt-10">
      <FormInputs websiteList={websiteList} setFormData={setFormData} setReloadData={() => GetWebsiteAnalyticalDetail()}/>
      <PageViewAnalytics websiteInfo={websiteInfo} loading={loading} analyticType={formData?.analyticsType} liveUserCount={liveUser?.length}/>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">
        <SourceWidget websiteAnalytics={websiteInfo?.analytics} loading={loading}/>
        <LocationWidget websiteAnalytics={websiteInfo?.analytics} loading={loading}/>
        <DevicesWidget websiteAnalytics={websiteInfo?.analytics} loading={loading}/>
      </div>
    </div>
  )
}

export default WebsiteDetail