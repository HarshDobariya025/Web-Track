"use client"

import { useAuth, UserButton, SignInButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Sparkles, Crown } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

function AppHeader() {
  const { isLoaded, isSignedIn, has } = useAuth();

  if (!isLoaded) return null;

  const isPremium = has?.({ plan: "monthly" });

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur">
      <nav className="mx-auto flex h-16 max-w-[85rem] items-center justify-between px-6">
        {/* Brand */}
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/logo2.png"
              alt="WebTrack logo"
              width={36}
              height={36}
              className="rounded-md"
            />
            <span className="text-lg font-semibold tracking-tight">
              WebTrack
            </span>
          </Link>

          {isPremium && (
            <span className="inline-flex items-center gap-1 rounded-full 
                  bg-gradient-to-r from-amber-300/70 to-orange-300/70 
                  px-3 py-1 text-xs font-medium text-amber-900 
                  border border-amber-200/60">
                    <Crown className="h-3 w-3" />
                    Premium
              </span>
          )}
        </div>


        {/* Actions */}
        <div className="flex items-center gap-3">
          {!isSignedIn ? (
            <SignInButton mode="modal" signUpForceRedirectUrl="/dashboard">
              <button className="px-4 py-2 text-sm font-medium hover:text-blue-600">
                Get Started
              </button>
            </SignInButton>
          ) : (
            <>
              {isPremium ? (
                <Link href="/dashboard/pricing">
                  <Button variant="outline" size="sm" className="gap-1">
                    <Crown className="h-4 w-4" />
                    Your plan
                  </Button>
                </Link>
              ) : (
                <Link href="/dashboard/pricing">
                  <Button variant="outline" size="sm" className="gap-1">
                    <Crown className="h-4 w-4" />
                    Upgrade to Premium
                  </Button>
                </Link>
              )}

              <UserButton />
            </>
          )}
        </div>
      </nav>
    </header>
  );
}

export default AppHeader;
