'use client'
import { useCurrentUser } from '@/hooks/use-current-user';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React from 'react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuTrigger } from './ui/dropdown-menu';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { LogOutIcon, Package, Settings, User } from 'lucide-react';

export function Headerx() {
  const user = useCurrentUser();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/' }); // Sign out and redirect to homepage
    router.push('/'); // Navigate to the homepage
  };

  // Generate initials from user's name or email
  const getInitials = (name?: string | null, email?: string | null) => {
    if (name) {
      const nameParts = name.trim().split(' ');
      if (nameParts.length >= 2) {
        return `${nameParts[0].charAt(0)}${nameParts[nameParts.length - 1].charAt(0)}`.toUpperCase();
      }
      return name.charAt(0).toUpperCase();
    }
    
    if (email) {
      return email.charAt(0).toUpperCase();
    }
    
    return 'U'; // Default fallback
  };

  const initials = getInitials(user?.name, user?.email);

  return (
    <div className='flex mr-4'>
      <div className='mt-[5px]'>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size='icon' className="relative rounded-full hover:bg-primary hover:text-primary-foreground transition-colors duration-200 mt-[-5px]">
              <Avatar className="h-9 w-9">
                {user?.image ? (
                  <AvatarImage 
                    src={user.image} 
                    alt={`${user?.firstName && user.lastName || user?.email || 'User'}`}
                    onError={(e) => {
                      // Hide the image if it fails to load, fallback will show
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                ) : null}
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold text-sm">
                  {initials}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="leading-none text-muted-foreground">
                  {user?.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => router.push("/my-orders")}>
                <Package className="mr-2 h-4 w-4" />
                My Orders
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push("/settings")}>
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOutIcon className="mr-2 h-4 w-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}

export default Headerx