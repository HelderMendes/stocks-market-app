import { auth } from '@/lib/better-auth/auth';
import { headers } from 'next/headers';
import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import React from 'react';

const Layout = async ({ children }: { children: React.ReactNode }) => {
  const session = await auth.api.getSession({ headers: await headers() });
  if (session?.user) redirect('/');

  return (
    <main className="auth-layout">
      <section className="auth-left-section scrollbar-auto-default">
        <Link href="/" className="auth-logo">
          <Image
            src="/assets/icons/logo.svg"
            alt="logo"
            width={140}
            height={32}
            className="h-8 w-auto"
          />
        </Link>
        <div className="flex-1 pb-6 lg:pb-8">{children}</div>
      </section>

      <section className="auth-right-section">
        <div className="relative z-10 lg:mt-4 lg:mb-16">
          <blockquote className="auth-blockquote">
            Signalist turned my watchlist into a winning list. The alerts are
            spot-on, and I feel more confident making moves in the market
          </blockquote>
          <div className="flex items-center justify-between">
            <div>
              <cite className="auth-testimonial-author">- Lucas Ph. </cite>
              <p className="text-gray-500 max-md:text-xs">Stock Investor</p>
            </div>
            <div className="flex items-center gap-1.5">
              {[...Array(5)].map((_, index) => (
                <Image
                  src={'/assets/icons/star.svg'}
                  alt="star"
                  key={index}
                  width={20}
                  height={20}
                  className="size-5"
                />
              ))}
            </div>
          </div>
        </div>

        <div className="relative flex-1">
          <Image
            src={'/assets/images/dashboard.png'}
            alt="dashboard preview"
            width={1440}
            height={1150}
            priority
            className="auth-dashboard-preview absolute top-0"
          />
        </div>
      </section>
    </main>
  );
};

export default Layout;
