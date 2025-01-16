"use client";
import { signOut, useSession } from 'next-auth/react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import ThemeToggle from '@/components/theme';

const ProfileNav = () => {
  const { data } = useSession();
  const formatRole = (role) => {
    if (!role) return '';
    return role
      .toLowerCase()             
      .split('_')                
      .map(word => word.charAt(0).toUpperCase() + word.slice(1)) 
      .join(' ');                
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src="https://www.pngplay.com/wp-content/uploads/12/User-Avatar-Profile-PNG-Pic-Clip-Art-Background.png" alt="avatar" />
            <AvatarFallback></AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {data?.user.username}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {formatRole(data?.user?.role)}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <ThemeToggle />
        <DropdownMenuSeparator />
        <DropdownMenuLabel>
          <Button 
          className="w-full justify-start bg-red-600 hover:bg-red-700"
          onClick={() => signOut({ callbackUrl: '/login' })}>
            Log out
          </Button>
        </DropdownMenuLabel>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default ProfileNav;