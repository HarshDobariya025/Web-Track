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
    dailyVisitors: DailyUsersType[]
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