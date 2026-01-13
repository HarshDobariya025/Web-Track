# WEBTRACK – Website Analytics Platform

WEBTRACK is a modern, privacy-focused website analytics platform designed to help developers and businesses understand how users interact with their websites in real time. It provides detailed insights into traffic, user behavior, devices, and locations using a lightweight tracking script and a clean dashboard experience.

The project is built using **Next.js**, **Neon PostgreSQL**, **Clerk Authentication**, **Tailwind CSS**, and **shadcn/ui**, ensuring scalability, performance, and a polished user interface.


## Project Overview

WEBTRACK allows users to track one or more websites by simply adding a generated script to their website’s `<head>` tag. Once integrated, the platform starts collecting analytics data and presents it through interactive dashboards and visualizations.

The system is designed with a clear workflow:
1. User authentication
2. Website onboarding
3. Script integration
4. Real-time and historical analytics
5. Website management and billing-based limits


## Application Workflow

### 1. Landing Page
The landing page is the first point of interaction for users. It introduces WEBTRACK, highlights its features, and provides options to sign up or log in. Authentication is handled securely using Clerk.  
After successful authentication, users are automatically redirected to the dashboard.


### 2. Dashboard (Website Onboarding)

If a user has **not added any website**, the dashboard prompts them to add one by filling in:
- Website domain
- Preferred time zone
- Option to enable localhost tracking (useful for development environments)

After submission:
- A unique tracking script is generated
- The user is instructed to place this script inside the `<head>` tag of their website
- Once the script is added, WEBTRACK begins collecting analytics data

If websites already exist, the dashboard displays a list of tracked websites and quick access to their analytics.


### 3. Detailed Website Analytics

Each website has a dedicated analytics page that provides in-depth insights.

#### Filters & Controls
Users can filter analytics data using:
- Today
- Date
- Custom date range
- Hourly view

Additional controls include:
- Refresh analytics data
- View tracking script
- Open website settings


#### Core Metrics
The analytics dashboard displays key performance metrics such as:
- Total visitors
- Total page views
- Total active time
- Average active time
- Live users

These metrics update dynamically based on selected filters.


#### Visual Analytics
- Interactive charts and graphs
- Data visualization changes according to selected date or range
- Designed for quick interpretation and clarity


#### Traffic Sources & Referrals
- Identify where users are coming from
- Understand referral performance
- Track direct, referral, and external traffic


#### Geographic Analytics
- Country-level access data
- City and region breakdown
- Helps understand audience distribution globally


#### Device & Platform Analytics
- Operating systems (Windows, macOS, Linux, Android, iOS, etc.)
- Browsers (Chrome, Firefox, Safari, Edge, etc.)
- Device types (Desktop, Mobile, Tablet)


### 4. Website Settings

Each website includes a settings page where users can:
- View and copy the tracking script
- Access the public WEBTRACK ID
- Manage website domain information
- Save configuration changes
- Permanently delete the website and its analytics data


## Pricing Model

WEBTRACK follows a simple and scalable pricing structure:

- **Free Trial**
  - 7-day trial period
  - Track up to **1 website**

- **Premium Plan**
  - Track **unlimited websites**
  - Ideal for developers, agencies, and businesses managing multiple projects


## Technology Stack

- **Frontend & Backend**: Next.js (App Router)
- **Database**: Neon PostgreSQL
- **Authentication**: Clerk
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui

This stack ensures fast rendering, secure authentication, scalable data handling, and a modern user experience.


## Key Design Principles

- Privacy-first analytics approach
- Lightweight tracking script
- No unnecessary data collection
- Developer-friendly setup
- Clean and intuitive UI


## Use Cases

- Personal websites and portfolios
- SaaS products
- Blogs and content platforms
- Agency-managed client websites
- Startup analytics without heavy third-party tools


## Conclusion

WEBTRACK is a complete, developer-friendly analytics solution that balances simplicity, performance, and detailed insights. Its modular design, modern stack, and scalable pricing make it suitable for both individual developers and growing teams.

