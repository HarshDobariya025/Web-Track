"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { SignInButton, UserButton, useUser } from "@clerk/nextjs"

export default function Page() {
  const { user } = useUser();

  return (

    <main className="bg-white text-gray-900">
      <header className="fixed top-0 z-50 w-full border-b bg-white/70 backdrop-blur">
        <nav className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Image src="/logo2.png" alt="logo" width={40} height={40} />
            <span className="text-xl font-semibold">WebTrack</span>
          </div>

          {!user ? (
            <SignInButton mode="modal" signUpForceRedirectUrl="/dashboard">
              <button className="text-sm font-medium text-gray-700 hover:text-blue-600 transition">
                Get Started
              </button>
            </SignInButton>
          ) : (
            <UserButton />
          )}
        </nav>
      </header>

      {/* ================= HERO ================= */}
      <section className="relative pt-40 pb-32 text-center overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,#e6f0ff,transparent_70%)]" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto px-6"
        >
          <span className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-4 py-1 text-sm font-medium">
            ⚡ Fast & Reliable Web Analytics
          </span>

          <h1 className="mt-8 text-4xl md:text-6xl font-extrabold tracking-tight">
            Track Your Website
            <span className="block text-blue-600 mt-2">
              Performance in Real-Time
            </span>
          </h1>

          <p className="mt-6 text-lg text-gray-600">
            Get powerful insights into your website’s performance, user behavior,
            and traffic patterns. Simple setup, powerful analytics.
          </p>

          <div className="mt-10 flex justify-center gap-4">
            <Link
              href="/dashboard"
              className="rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow hover:bg-blue-700 transition"
            >
              Start Free Trial →
            </Link>
            <Link
              href="/dashboard"
              className="rounded-lg border px-6 py-3 text-sm font-semibold hover:bg-gray-50 transition"
            >
              Dashboard
            </Link>
          </div>

          <p className="mt-4 text-sm text-gray-500">
            No credit card required • 7-day free trial • Cancel anytime
          </p>
        </motion.div>
      </section>

      {/* ================= FEATURES ================= */}
      <section className="py-24 bg-gray-50">
        <div className="text-center mb-16">
          <span className="rounded-full border px-4 py-1 text-sm">Features</span>
          <h2 className="mt-6 text-4xl font-bold">
            Everything You Need to Track
          </h2>
          <p className="mt-4 text-gray-600">
            Powerful features to understand your audience.
          </p>
        </div>

        <div className="max-w-7xl mx-auto px-6 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="rounded-xl bg-white border p-6 shadow-sm hover:shadow-lg transition"
            >
              <div className="text-3xl">{f.icon}</div>
              <h3 className="mt-4 font-semibold text-lg">{f.title}</h3>
              <p className="mt-2 text-gray-600 text-sm">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ================= STEPS ================= */}
      <section className="py-28 text-center">
        <span className="rounded-full border px-4 py-1 text-sm">
          Simple Process
        </span>

        <h2 className="mt-6 text-4xl font-bold">
          Get Started in Minutes
        </h2>
        <p className="mt-4 text-gray-600">
          Three simple steps to start tracking your website
        </p>

        <div className="mt-20 grid gap-12 md:grid-cols-3 max-w-6xl mx-auto px-6">
          {steps.map((s) => (
            <div key={s.step}>
              <div className="text-6xl font-bold text-blue-100">
                {s.step}
              </div>
              <h3 className="mt-4 font-semibold text-lg">{s.title}</h3>
              <p className="mt-2 text-gray-600">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ================= PRICING ================= */}
      <section className="py-28 bg-gray-50">
        <h2 className="text-center text-4xl font-bold">
          Simple, Transparent Pricing
        </h2>
        <p className="text-center text-gray-600 mt-4">
          Choose the plan that fits your needs
        </p>

        <div className="mt-16 grid gap-8 lg:grid-cols-3 max-w-7xl mx-auto px-6">
          {pricing.map((p) => (
            <div
              key={p.title}
              className={`rounded-xl border bg-white p-8 ${
                p.popular ? "ring-2 ring-blue-500" : ""
              }`}
            >
              {p.popular && (
                <span className="inline-block mb-4 rounded-full bg-blue-600 px-3 py-1 text-xs text-white">
                  Most Popular
                </span>
              )}
              <h3 className="text-xl font-semibold">{p.title}</h3>
              <p className="text-gray-600 text-sm mt-1">{p.desc}</p>

              <div className="mt-6 text-4xl font-bold">
                {p.price}
                <span className="text-base font-medium text-gray-500">
                  /month
                </span>
              </div>

              <ul className="mt-6 space-y-3 text-sm">
                {p.features.map((f) => (
                  <li key={f} className="flex items-center gap-2">
                    ✅ {f}
                  </li>
                ))}
              </ul>

              <button className="mt-8 w-full rounded-lg bg-blue-600 py-3 text-sm font-semibold text-white hover:bg-blue-700 transition">
                {p.cta}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="py-24 px-6">
        <div className="mx-auto max-w-6xl rounded-3xl bg-gradient-to-r from-blue-600 to-purple-600 px-10 py-20 text-center text-white">
          <h2 className="text-4xl font-bold">
            Ready to Get Started?
          </h2>
          <p className="mt-4 text-lg opacity-90">
            Join thousands of websites using WEBTRACK to understand users better
          </p>

          <div className="mt-10 flex justify-center gap-4">
            <button className="rounded-lg bg-white px-6 py-3 text-sm font-semibold text-gray-900">
              Start Free Trial →
            </button>
            <button className="rounded-lg border border-white px-6 py-3 text-sm font-semibold">
              Schedule Demo
            </button>
          </div>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="border-t py-16 text-sm">
        <div className="max-w-7xl mx-auto px-6 grid gap-10 md:grid-cols-4">
          <div>
            <h3 className="font-bold text-lg">WEBTRACK</h3>
            <p className="mt-2 text-gray-600">
              Simple, powerful analytics for modern websites.
            </p>
          </div>

          <FooterCol title="Product" items={["Features", "Pricing", "Docs", "API"]} />
          <FooterCol title="Company" items={["About", "Blog", "Careers", "Contact"]} />
          <FooterCol title="Legal" items={["Privacy", "Terms", "Security"]} />
        </div>

        <p className="mt-10 text-center text-gray-500">
          © 2024 WEBTRACK. All rights reserved.
        </p>
      </footer>

    </main>
  )
}

/* ================= DATA ================= */

const features = [
  { title: "Real-Time Analytics", desc: "Instant traffic insights.", icon: "👁️" },
  { title: "Performance Metrics", desc: "Track speed & conversions.", icon: "📈" },
  { title: "Privacy First", desc: "GDPR compliant analytics.", icon: "🛡️" },
  { title: "Global Coverage", desc: "Worldwide visitor tracking.", icon: "🌍" },
  { title: "Lightning Fast", desc: "Sub-100ms responses.", icon: "⚡" },
  { title: "Goal Tracking", desc: "Measure success easily.", icon: "🎯" },
]

const steps = [
  { step: "01", title: "Add Tracking Code", desc: "Copy & paste the script." },
  { step: "02", title: "Start Collecting Data", desc: "No configuration needed." },
  { step: "03", title: "Get Insights", desc: "Make data-driven decisions." },
]

const pricing = [
  {
    title: "Starter",
    desc: "Perfect for personal projects",
    price: "$0",
    cta: "Start Free",
    features: ["10k events", "1 website", "Basic analytics"],
  },
  {
    title: "Professional",
    desc: "For growing businesses",
    price: "$8",
    cta: "Get Started",
    popular: true,
    features: [
      "500k events",
      "10 websites",
      "Advanced analytics",
      "Priority support",
    ],
  },
  {
    title: "Enterprise",
    desc: "For large organizations",
    price: "$10",
    cta: "Contact Sales",
    features: [
      "Unlimited events",
      "Unlimited websites",
      "Premium analytics",
      "24/7 support",
    ],
  },
]

function FooterCol({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <h4 className="font-semibold mb-3">{title}</h4>
      <ul className="space-y-2 text-gray-600">
        {items.map((i) => (
          <li key={i}>{i}</li>
        ))}
      </ul>
    </div>
  )
}
