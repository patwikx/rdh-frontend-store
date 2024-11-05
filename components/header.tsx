'use client'
import { useCurrentUser } from '@/hooks/use-current-user';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React from 'react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuTrigger } from './ui/dropdown-menu';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { LogOutIcon, Package, Settings, User } from 'lucide-react';

export function Headerx () {
  const user = useCurrentUser();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/' }); // Sign out and redirect to homepage
    router.push('/'); // Navigate to the homepage
  };

  return (

    <div className='flex mr-4'>
    <div className='mt-[5px]'>
    <DropdownMenu>
          <DropdownMenuTrigger asChild>
  <Button variant="outline" size='icon' className="relative rounded-full hover:bg-primary hover:text-primary-foreground transition-colors duration-200">
    <Avatar className="h-9 w-9">
      {user?.image ? (
        <AvatarImage src={user.image} alt={`${user?.name}`} />
      ) : (
        <AvatarFallback>
          {user?.name?.charAt(0)}
        </AvatarFallback>
      )}
    </Avatar>
  </Button>
</DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user?.name}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user?.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => router.push("/my-orders")}>
            My Orders 
            <DropdownMenuShortcut><Package size={20} className='mr-2' /></DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push("/settings")}>
            Settings
            <DropdownMenuShortcut><Settings size={20} className='mr-2' /></DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          Log out
          <DropdownMenuShortcut><LogOutIcon size={20} className='mr-2' /></DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
    </div>
    </div>
         
  )
}

export default Headerx
