import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import NavItems from './NavItems';
import UserDropdown from './UserDropdown';

const Header = ({ user }: { user: User }) => {
  return (
    <header className="header sticky top-0">
      <div className="header-wrapper container">
        <Link href="/" className="text-2xl font-bold">
          <Image
            src="/assets/images/logo.png"
            alt="logo"
            className="h-8 w-auto cursor-pointer"
            width={140}
            height={32}
          />
        </Link>
        <nav className="hidden sm:block">
          {/* Navigation */}

          <NavItems />
        </nav>

        <UserDropdown user={user} />
      </div>
    </header>
  );
};

export default Header;
