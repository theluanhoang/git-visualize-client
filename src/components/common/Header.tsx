'use client';

import Link from 'next/link'
import { GitFork, Menu, X } from 'lucide-react'
import React from 'react'
import ThemeToggle from '@/components/common/ThemeToggle'
import { Button } from '@/components/ui/button'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useLogout } from '@/lib/react-query/hooks/use-auth'
import { authStorage } from '@/services/auth'

function Header() {
    const [open, setOpen] = React.useState(false)

    React.useEffect(() => {
        const handler = () => setOpen(false)
        window.addEventListener('resize', handler)
        return () => window.removeEventListener('resize', handler)
    }, [])

    const queryClient = useQueryClient()
    const { data: user } = useQuery({
        queryKey: ['auth','user'],
        queryFn: async () => (queryClient.getQueryData(['auth','user']) as any) ?? null,
        initialData: authStorage.load().user ?? null,
        staleTime: Infinity,
        gcTime: Infinity,
        enabled: false,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
    })
    const isAuthed = !!user
    const logout = useLogout()

    React.useEffect(() => {
        const stored = authStorage.load()
        if (!queryClient.getQueryData(['auth','user']) && stored.user) {
            queryClient.setQueryData(['auth','user'], stored.user)
        }
    }, [queryClient])

    return (
        <header className="sticky top-0 z-50 bg-[color-mix(in_srgb,var(--surface),#000_4%)] backdrop-blur-sm border-b border-[var(--border)] shadow-sm">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center gap-3 min-w-0">
                        <div className="p-2 rounded-lg bg-gradient-to-br from-[var(--primary-50)] to-[var(--primary-100)] shadow-sm">
                            <GitFork className="text-[var(--primary-600)]" size={24} />
                        </div>
                        <Link href="/" className="font-bold text-xl text-[var(--foreground)] hover:text-[var(--primary-600)] transition-colors truncate">
                            Git Visualized Engine
                        </Link>
                    </div>
                    <nav className="hidden sm:flex items-center gap-2" aria-label="Main navigation">
                        <Link 
                            href="/" 
                            className="px-3 py-2 rounded-md text-sm font-medium text-[var(--foreground)]/85 hover:text-[var(--primary-600)] hover:bg-[var(--primary-50)] transition-colors"
                        >
                            Home
                        </Link>
                        <Link 
                            href="/git-theory" 
                            className="px-3 py-2 rounded-md text-sm font-medium text-[var(--foreground)]/85 hover:text-[var(--primary-600)] hover:bg-[var(--primary-50)] transition-colors"
                        >
                            Git Theory
                        </Link>
                        <Link 
                            href="/practice" 
                            className="px-3 py-2 rounded-md text-sm font-medium text-[var(--foreground)]/85 hover:text-[var(--primary-600)] hover:bg-[var(--primary-50)] transition-colors"
                        >
                            Practice
                        </Link>
                        <Link 
                            href="/editor" 
                            className="px-3 py-2 rounded-md text-sm font-medium text-[var(--foreground)]/85 hover:text-[var(--primary-600)] hover:bg-[var(--primary-50)] transition-colors"
                        >
                            Editor
                        </Link>
                        <ThemeToggle />
                        <div className="flex items-center gap-2 ml-2">
                            {!isAuthed ? (
                                <>
                                    <Link 
                                        href="/auth/login" 
                                        className="px-3 py-2 rounded-md text-sm font-medium text-[var(--foreground)]/85 hover:text-[var(--primary-600)] hover:bg-[var(--primary-50)] transition-colors"
                                    >
                                        Login
                                    </Link>
                                    <Link 
                                        href="/auth/register" 
                                        className="px-3 py-2 rounded-md text-sm font-medium text-[var(--foreground)]/85 hover:text-[var(--primary-600)] hover:bg-[var(--primary-50)] transition-colors"
                                    >
                                        Register
                                    </Link>
                                </>
                            ) : (
                                <>
                                    {user?.email && (
                                        <span className="px-2 text-sm text-[var(--foreground)]/70 truncate max-w-[12rem]" title={user.email}>
                                            {user.email}
                                        </span>
                                    )}
                                    <Button variant="outline" size="sm" onClick={() => logout()}>
                                        Logout
                                    </Button>
                                </>
                            )}
                        </div>
                    </nav>
                    <div className="sm:hidden flex items-center gap-2">
                        <ThemeToggle />
                        <button
                            onClick={() => setOpen(v => !v)}
                            aria-label="Open menu"
                            aria-expanded={open}
                            aria-controls="mobile-nav"
                            className="inline-flex items-center justify-center w-10 h-10 rounded-md border border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] shadow-sm"
                        >
                            {open ? <X size={18} /> : <Menu size={18} />}
                        </button>
                    </div>
                </div>
            </div>
            <div id="mobile-nav" className={`sm:hidden ${open ? 'block' : 'hidden'} border-t border-[var(--border)] bg-[var(--surface)]`}>
                <div className="container mx-auto px-4 py-3">
                    <div className="flex flex-col gap-1" role="menu" aria-label="Mobile navigation">
                        <Link onClick={() => setOpen(false)} href="/" className="px-3 py-2 rounded-md text-sm font-medium text-[var(--foreground)]/90 hover:bg-[var(--primary-50)]" role="menuitem">Home</Link>
                        <Link onClick={() => setOpen(false)} href="/git-theory" className="px-3 py-2 rounded-md text-sm font-medium text-[var(--foreground)]/90 hover:bg-[var(--primary-50)]" role="menuitem">Git Theory</Link>
                        <Link onClick={() => setOpen(false)} href="/practice" className="px-3 py-2 rounded-md text-sm font-medium text-[var(--foreground)]/90 hover:bg-[var(--primary-50)]" role="menuitem">Practice</Link>
                        <div className="flex items-center gap-2 pt-2">
                            {!isAuthed ? (
                                <>
                                    <Link onClick={() => setOpen(false)} href="/auth/login" className="px-3 py-2 rounded-md text-sm font-medium text-[var(--foreground)]/90 hover:bg-[var(--primary-50)]" role="menuitem">Login</Link>
                                    <Link onClick={() => setOpen(false)} href="/auth/register" className="px-3 py-2 rounded-md text-sm font-medium text-[var(--foreground)]/90 hover:bg-[var(--primary-50)]" role="menuitem">Register</Link>
                                </>
                            ) : (
                                <Button variant="outline" size="sm" className="w-full justify-center" onClick={() => { logout(); setOpen(false); }}>
                                    Logout
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </header>
    )
}

export default Header
