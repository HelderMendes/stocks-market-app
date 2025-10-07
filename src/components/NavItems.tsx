'use client';
import { nav } from '@/lib/constants';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

const NavItems = () => {
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === '/') return pathname === '/';
    return pathname.startsWith(path);
  };

  return (
    <ul className="flex flex-col gap-3 p-2 font-medium sm:flex-row sm:gap-10">
      {nav.map(({ href, label }, index) => (
        <li key={index}>
          <Link
            href={href}
            className={`transition-colors hover:text-yellow-500 ${isActive(href) ? 'text-gray-100' : ''}`}
          >
            {label}
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default NavItems;
