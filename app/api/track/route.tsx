import { db } from "@/configs/db";
import { pageViewTable } from "@/configs/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import {UAParser} from 'ua-parser-js';


const CORS_HEADERS = {  // Slove "Cross Origin API call" issue
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
};
export async function OPTIONS(req: Request) {
    const origin = req.headers.get("origin") || "*";
    return new NextResponse(null, {
        status: 200,
        headers: {
            "Access-Control-Allow-Origin": origin,
            "Access-Control-Allow-Methods": "POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type",
        },
    });
}

export function getClientIP(req: Request) {
    // Vercel-specific header (MOST IMPORTANT)
    const vercelIP = req.headers.get("x-vercel-forwarded-for");
    console.log(vercelIP)
    if (vercelIP) return vercelIP.split(",")[0].trim();

    // Standard proxy header
    const xff = req.headers.get("x-forwarded-for");
    if (xff) return xff.split(",")[0].trim();

    // Fallback
    const realIp = req.headers.get("x-real-ip");
    if (realIp) return realIp;

    return null;
}

export async function POST(req:NextRequest){
    const body = await req.json();

    //fetch all required data from Analytics.js
    const parser = new UAParser(req.headers.get('user-agent') || '');  // get all info about devics(mobile, crom, desktop..
    const deviceInfo = parser.getDevice()?.model;
    const osInfo = parser.getOS()?.name;
    const browserInfo = parser.getBrowser()?.name;
    
    const ip = getClientIP(req) || "71.71.22.54";
    console.log(ip)
    let geoInfo = null;
    if (ip && !ip.startsWith("10.") && !ip.startsWith("192.168")) {
        const geoRes = await fetch(`http://ip-api.com/json/${ip}`);
        geoInfo = await geoRes.json();

    }

    console.log("Body Data:", body);
    console.log("Device Info:", deviceInfo);
    console.log("OS Info:", osInfo);
    console.log("Browser Info:", browserInfo);
    console.log("IP Address:", ip);
    console.log("Geo Info:", geoInfo);


    //Insert to DB
    let result;
    if(body?.type=='entry'){
        result = await db.insert(pageViewTable).values({
            visitorId: body.visitorId,
            websiteId: body.websiteId,
            domain: body.domain,
            url: body.url,
            type: body.type,
            referrer: body.referrer,
            entryTime: body.entryTime,
            exitTime: body.exitTime,
            totalActiveTime: body.totalActiveTime,
            urlParams: body.urlParams,
            utm_sorce: body.utmSource,
            utm_medium: body.utmMedium,
            utm_campaign: body.utmCampaign,
            device: deviceInfo,
            os: osInfo,
            browser: browserInfo,
            city: geoInfo.city,
            region: geoInfo.regionName,
            country: geoInfo.country,
            countryCode: geoInfo.countryCode,
            ipAddress: ip || '',
            RefParams: body.RefParams,
        }).returning();
    }else{
        await db.update(pageViewTable).set({
            exitTime: body.exitTime,
            totalActiveTime: body.totalActiveTime,
            exitUrl: body.exitUrl,
        }).where(eq(pageViewTable.visitorId, body.visitorId)).returning();
    }

    console.log("Insert Result:", result);
    
    return NextResponse.json(
        { message: "Data received successfully", data: result },
        { headers: CORS_HEADERS }
    );
}


