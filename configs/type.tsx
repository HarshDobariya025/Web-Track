export type WebsiteType = {
    id: number;
    websiteId: string;
    domain: string;
    timeZone: string;
    enableLocalhostTracking: boolean;
    userEmail: string;
}

export type WebsiteInfoType = {
    website: WebsiteType;
    analytics: AnalyticsType;
}

export type AnalyticsType = {
    avgActiveTime: number;
    totalActiveTime: number;
    totalSessions: number;
    totalVisitors: number;
    hourlyVisitors: HourlyVisitorsType[],
    dailyVisitors: DailyUsersType[],
    referrals: ReferralsType[],
    refParams: RefParamsType[];
    countries: RegionAndDeviceType[];
    cities: RegionAndDeviceType[];
    regions: RegionAndDeviceType[];
    devices: RegionAndDeviceType[];
    os: RegionAndDeviceType[];
    browsers: RegionAndDeviceType[];
}

export type HourlyVisitorsType = {
    count: number;
    date: string;
    hour: number;
    hourLabel: string;
}

export type DailyUsersType = {
    date: string;
    count: number;
}

export type ReferralsType = {
    domainName: string;
    name: string;
    uv: number;
}

export type RefParamsType = {
    name: string;
    uv: number;
}

export type RegionAndDeviceType = {
    image: string;
    name: string;
    uv: number;
}

export const IMAGE_URL_FOR_DOMAINS = "https://icons.duckduckgo.com/ip3/<domain>.com.ico";

export type LiveUserType = {
    visitorId: string; //needed
    websiteId: string; //needed
    last_seen: string;
    city: string;
    region: string;
    country: string;
    countryCode: string;
    lat: string;
    lng: string;
    device: string;
    os: string;
    browser: string;
}