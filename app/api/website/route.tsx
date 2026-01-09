import { db } from "@/configs/db";
import { pageViewTable, websitesTable } from "@/configs/schema";
import { currentUser } from "@clerk/nextjs/server";
import { and, desc, eq, gte, lte, sql } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { toZonedTime } from "date-fns-tz";

export async function POST(req:NextRequest){
    const {websiteId, domain, timeZone, enableLocalhostTracking} = await req.json();
    const user=await currentUser();

    //ckeck if  domain already exist
    const existingDomain= await db.select().from(websitesTable)
    .where( and(eq(websitesTable.domain,domain), eq(websitesTable.userEmail,user?.primaryEmailAddress?.emailAddress as string)));

    if(existingDomain.length>0){
        return NextResponse.json({message:"Domain already exists", data:existingDomain[0]});
    }
    const result = await db.insert(websitesTable).values({
        domain: domain,
        websiteId: websiteId,
        timeZone:timeZone,
        enableLocalhostTracking: enableLocalhostTracking,
        userEmail: user?.primaryEmailAddress?.emailAddress as string,
    }).returning();

    return NextResponse.json(result);
}


/* ---------------------------------------------
   SAFE TIMEZONE VALIDATOR (IANA ONLY)
--------------------------------------------- */
const getSafeTimeZone = (tz?: string | null) => {
    if (!tz) return "UTC";

    try {
        Intl.DateTimeFormat("en-US", { timeZone: tz });
        return tz;
    } catch {
        return "UTC";
    }
};

/* ---------------------------------------------
   TZ SAFE DATE FORMATTER (yyyy-MM-dd)
--------------------------------------------- */
const formatDateInTZ = (date: Date, timeZone: string) =>
    new Intl.DateTimeFormat("en-CA", {
        timeZone,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    }).format(date);

export async function GET(req: NextRequest) {
    const user = await currentUser();
    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const websiteId = req.nextUrl.searchParams.get("websiteId");
    const from = req.nextUrl.searchParams.get("from");
    const to = req.nextUrl.searchParams.get("to");
    const websiteOnly = req.nextUrl.searchParams.get("websiteOnly");

    const fromUnix = from
        ? Math.floor(new Date(`${from}T00:00:00`).getTime() / 1000)
        : null;

    const toUnix = to
        ? Math.floor(new Date(`${to}T23:59:59`).getTime() / 1000)
        : null;

    /* ---------------------------------------------
       WEBSITE ONLY
    --------------------------------------------- */
    if (websiteOnly === "true") {
        if (websiteId) {
            const websites = await db
                .select()
                .from(websitesTable)
                .where(
                    and(
                        eq(
                            websitesTable.userEmail,
                            user.primaryEmailAddress!.emailAddress
                        ),
                        eq(websitesTable.websiteId, websiteId)
                    )
                );

            return NextResponse.json(websites[0]);
        }

        const websites = await db
            .select()
            .from(websitesTable)
            .where(
                eq(websitesTable.userEmail, user.primaryEmailAddress!.emailAddress)
            );

        return NextResponse.json(websites);
    }

    /* ---------------------------------------------
       FETCH WEBSITES
    --------------------------------------------- */
    const websites = await db
        .select()
        .from(websitesTable)
        .where(
            websiteId
                ? and(
                      eq(
                          websitesTable.userEmail,
                          user.primaryEmailAddress!.emailAddress
                      ),
                      eq(websitesTable.websiteId, websiteId)
                  )
                : eq(
                      websitesTable.userEmail,
                      user.primaryEmailAddress!.emailAddress
                  )
        )
        .orderBy(sql`${websitesTable.id} DESC`);

    const result: any[] = [];

    /* ---------------------------------------------
       FORMATTERS
    --------------------------------------------- */
    const formatSimple = (map: Record<string, number>) =>
        Object.entries(map).map(([name, uv]) => ({ name, uv }));

    const formatWithImage = (map: Record<string, number>) =>
        Object.entries(map).map(([name, uv]) => ({
            name,
            uv,
            image: `/${name.toLowerCase()}.png`,
        }));

    const formatCountries = (
        map: Record<string, number>,
        codeMap: Record<string, string>
    ) =>
        Object.entries(map).map(([name, uv]) => ({
            name,
            uv,
            image: codeMap[name]
                ? `https://flagsapi.com/${codeMap[name]}/flat/64.png`
                : "/country.png",
        }));

    const formatCities = (
        map: Record<string, number>,
        codeMap: Record<string, string>
    ) =>
        Object.entries(map).map(([name, uv]) => ({
            name,
            uv,
            image: codeMap[name]
                ? `https://flagsapi.com/${codeMap[name]}/flat/64.png`
                : "/city.png",
        }));

    const formatRegions = (
        map: Record<string, number>,
        codeMap: Record<string, string>
    ) =>
        Object.entries(map).map(([name, uv]) => ({
            name,
            uv,
            image: codeMap[name]
                ? `https://flagsapi.com/${codeMap[name]}/flat/64.png`
                : "/region.png",
        }));

    const getDomainName = (value: string) => {
        try {
            const host = new URL(
                value.startsWith("http") ? value : `https://${value}`
            ).hostname;
            return host.replace("www.", "").split(".")[0];
        } catch {
            return value.split(".")[0];
        }
    };

    const formatReferrals = (map: Record<string, number>) =>
        Object.entries(map).map(([name, uv]) => ({
            name,
            uv,
            domainName: getDomainName(name),
        }));

    /* ---------------------------------------------
       LOOP WEBSITES
    --------------------------------------------- */
    for (const site of websites) {
        const siteTZ = getSafeTimeZone(site.timeZone);

        const views = await db
            .select()
            .from(pageViewTable)
            .where(
                and(
                    eq(pageViewTable.websiteId, site.websiteId),
                    ...(fromUnix && toUnix
                        ? [
                              gte(sql`${pageViewTable.entryTime}::bigint`, fromUnix),
                              lte(sql`${pageViewTable.entryTime}::bigint`, toUnix),
                          ]
                        : [])
                )
            );

        const makeSetMap = () => ({} as Record<string, Set<string>>);

        const countryVisitors = makeSetMap();
        const cityVisitors = makeSetMap();
        const regionVisitors = makeSetMap();
        const deviceVisitors = makeSetMap();
        const osVisitors = makeSetMap();
        const browserVisitors = makeSetMap();
        const referralVisitors = makeSetMap();
        const refParamsVisitors = makeSetMap();
        const utmSourceVisitors = makeSetMap();
        const urlVisitors = makeSetMap();

        const countryCodeMap: Record<string, string> = {};
        const cityCountryMap: Record<string, string> = {};
        const regionCountryMap: Record<string, string> = {};

        const uniqueVisitors = new Set<string>();

        const last24hVisitorsSet = new Set<string>();
        const nowUnix = Math.floor(Date.now() / 1000);
        const last24hUnix = nowUnix - 24 * 60 * 60;

        let totalActiveTime = 0;

        views.forEach(v => {
            if (!v.visitorId) return;

            uniqueVisitors.add(v.visitorId);

            if (v.entryTime && Number(v.entryTime) >= last24hUnix) {
                last24hVisitorsSet.add(v.visitorId);
            }

            if (v.totalActiveTime && v.totalActiveTime > 0) {
                totalActiveTime += v.totalActiveTime;
            }

            const add = (map: Record<string, Set<string>>, key: string) => {
                map[key] ??= new Set();
                map[key].add(v.visitorId!);
            };

            if (v.country) {
                add(countryVisitors, v.country);
                if (v.countryCode)
                    countryCodeMap[v.country] = v.countryCode.toUpperCase();
            }
            if (v.city) {
                add(cityVisitors, v.city);
                if (v.countryCode)
                    cityCountryMap[v.city] = v.countryCode.toUpperCase();
            }
            if (v.region) {
                add(regionVisitors, v.region);
                if (v.countryCode)
                    regionCountryMap[v.region] = v.countryCode.toUpperCase();
            }

            if (v.device) add(deviceVisitors, v.device);
            if (v.os) add(osVisitors, v.os);
            if (v.browser) add(browserVisitors, v.browser);
            if (v.referrer) add(referralVisitors, v.referrer);
            if (v.RefParams) add(refParamsVisitors, v.RefParams);
            if (v.utm_sorce) add(utmSourceVisitors, v.utm_sorce);
            if (v.url) add(urlVisitors, v.url);
        });

        const toCountMap = (map: Record<string, Set<string>>) =>
            Object.fromEntries(Object.entries(map).map(([k, v]) => [k, v.size]));

        const totalVisitors = uniqueVisitors.size;
        const last24hVisitors = last24hVisitorsSet.size;
        const totalSessions = views.length;
        const avgActiveTime =
            totalVisitors > 0 ? Math.round(totalActiveTime / totalVisitors) : 0;

        /* ---------- HOURLY VISITORS (FIXED) ---------- */
        const hourlyBucket: Record<
            string,
            { date: string; hour: number; visitors: Set<string> }
        > = {};

        views.forEach(v => {
            if (!v.entryTime || !v.visitorId) return;

            const local = toZonedTime(
                new Date(Number(v.entryTime) * 1000),
                siteTZ
            );

            const date = formatDateInTZ(local, siteTZ);
            const hour = local.getHours();
            const key = `${date}-${hour}`;

            hourlyBucket[key] ??= {
                date,
                hour,
                visitors: new Set(),
            };

            hourlyBucket[key].visitors.add(v.visitorId);
        });

        const hourlyVisitors = Object.values(hourlyBucket)
            .map(h => ({
                date: h.date,
                hour: h.hour,
                hourLabel: new Date(
                    `${h.date}T${String(h.hour).padStart(2, "0")}:00`
                ).toLocaleString("en-US", {
                    hour: "numeric",
                    hour12: true,
                    timeZone: siteTZ,
                }),
                count: h.visitors.size,
            }))
            .sort((a, b) =>
                a.date === b.date ? a.hour - b.hour : a.date.localeCompare(b.date)
            );

        /* ---------- DAILY VISITORS ---------- */
        const dailyMap: Record<string, Set<string>> = {};

        views.forEach(v => {
            if (!v.entryTime || !v.visitorId) return;

            const local = toZonedTime(
                new Date(Number(v.entryTime) * 1000),
                siteTZ
            );

            const date = formatDateInTZ(local, siteTZ);

            dailyMap[date] ??= new Set();
            dailyMap[date].add(v.visitorId);
        });

        const dailyVisitors = Object.entries(dailyMap).map(([date, set]) => ({
            date,
            count: set.size,
        }));

        /* ---------- FINAL RESPONSE ---------- */
        result.push({
            website: site,
            analytics: {
                last24hVisitors,
                totalVisitors,
                totalSessions,
                totalActiveTime,
                avgActiveTime,
                hourlyVisitors,
                dailyVisitors,

                countries: formatCountries(
                    toCountMap(countryVisitors),
                    countryCodeMap
                ),
                cities: formatCities(toCountMap(cityVisitors), cityCountryMap),
                regions: formatRegions(
                    toCountMap(regionVisitors),
                    regionCountryMap
                ),

                devices: formatWithImage(toCountMap(deviceVisitors)),
                os: formatWithImage(toCountMap(osVisitors)),
                browsers: formatWithImage(toCountMap(browserVisitors)),

                referrals: formatReferrals(toCountMap(referralVisitors)),
                refParams: formatSimple(toCountMap(refParamsVisitors)),
                utmSources: formatSimple(toCountMap(utmSourceVisitors)),
                urls: formatSimple(toCountMap(urlVisitors)),
            },
        });
    }

    return NextResponse.json(result);
}



