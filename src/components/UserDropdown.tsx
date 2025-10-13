'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useRouter } from 'next/navigation';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';
import { LogOut } from 'lucide-react';
import { signOut } from '@/lib/actions/auth.actions';

const UserDropdown = ({ user }: { user: User }) => {
  const router = useRouter();
  const handleSignOut = async () => {
    await signOut();
    router.push('/sign-in');
  };

  // const user = { name: 'Helder Mendes', email: 'info@helderdesign.nl' };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex items-center gap-3 text-gray-400 hover:text-yellow-500"
        >
          <Avatar className="size-8">
            <AvatarImage
              src="https://avatars.githubusercontent.com/u/1050193?v=4"
              alt={user.name}
              className="rounded-full"
            />
            <AvatarFallback className="bg-yellow-500 text-sm font-bold text-yellow-900">
              {user.name[0]}
            </AvatarFallback>
          </Avatar>
          <div className="hidden items-start md:flex md:flex-col">
            <span className="text-base font-medium text-gray-400">
              {user.name}
            </span>
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="text-gray-400">
        <DropdownMenuLabel>
          <div className="relative flex items-center gap-3 py-2">
            <Avatar className="size-10">
              <AvatarImage
                src="https://avatars.githubusercontent.com/u/1050193?v=4"
                alt={user.name}
                className="rounded-full"
              />
              <AvatarFallback className="bg-yellow-500 text-sm font-bold text-yellow-900">
                {user.name[0]}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-base font-medium text-gray-400">
                {user.name}
              </span>
              <span className="text-sm text-gray-500">{user.email}</span>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-gray-600" />
        <DropdownMenuItem
          onClick={handleSignOut}
          className="text-md cursor-pointer font-medium text-gray-100 transition-colors focus:bg-transparent focus:text-yellow-500"
        >
          <LogOut className="mr-2 hidden size-4 sm:block" />
          Logout
        </DropdownMenuItem>
        <DropdownMenuItem>Billing</DropdownMenuItem>
        <DropdownMenuItem>Team</DropdownMenuItem>
        <DropdownMenuItem>Subscription</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserDropdown;
