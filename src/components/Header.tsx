
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Logo } from './icons/Logo';
import { logout } from '@/services/authService';
import { useAuth } from '@/hooks/useAuth';
import { User } from 'firebase/auth';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu';
import { useRouter } from 'next/navigation';

export function Header() {
  const { t } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  const navLinks = [
    { href: "/", label: t('home') },
    { href: "/services", label: t('services') },
    { href: "/about", label: t('about') },
    { href: "/#contact", label: t('contact') },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/10 backdrop-blur-xl border-b border-white/20 shadow-lg">
      <div className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <Link href="/">
            <Logo className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent" />
          </Link>
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className="text-gray-700 hover:text-purple-600 transition-colors font-medium">
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="hidden md:flex items-center gap-4">
            {user ? (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                            <Avatar className="h-8 w-8">
                                <AvatarImage src={user.photoURL || undefined} alt="User avatar" />
                                <AvatarFallback>{user.email?.[0].toUpperCase()}</AvatarFallback>
                            </Avatar>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end" forceMount>
                        <DropdownMenuLabel className="font-normal">
                        <div className="flex flex-col space-y-1">
                            <p className="text-sm font-medium leading-none">My Account</p>
                            <p className="text-xs leading-none text-muted-foreground">
                            {user.email}
                            </p>
                        </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onSelect={() => router.push('/admin')}>Dashboard</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onSelect={handleLogout}>
                         Log out
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            ) : (
                <>
                    <Button asChild variant="ghost">
                        <Link href="/login">Login</Link>
                    </Button>
                    <Button asChild>
                        <Link href="/signup">Sign Up</Link>
                    </Button>
                </>
            )}
          </div>
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden p-2 text-gray-700 hover:text-purple-600 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>
        </div>
        {isMenuOpen && (
          <div className="md:hidden mt-4 py-4 border-t border-gray-100/10">
            <div className="space-y-4">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href} className="block text-gray-700 hover:text-purple-600 transition-colors font-medium" onClick={() => setIsMenuOpen(false)}>
                  {link.label}
                </Link>
              ))}
               {user ? (
                 <Button onClick={() => { handleLogout(); setIsMenuOpen(false);}} className="w-full">Logout</Button>
               ) : (
                <div className="flex flex-col space-y-2">
                    <Link href="/login" className="block text-gray-700 hover:text-purple-600 transition-colors font-medium text-center" onClick={() => setIsMenuOpen(false)}>Login</Link>
                    <Link href="/signup" className="inline-flex items-center justify-center px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-full" onClick={() => setIsMenuOpen(false)}>
                        {t('getStarted')}
                    </Link>
                </div>
               )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
