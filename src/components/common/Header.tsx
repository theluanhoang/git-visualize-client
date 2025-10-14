'use client';

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { GitFork, Menu, X, Bell } from 'lucide-react'
import React from 'react'
import ThemeToggle from '@/components/common/ThemeToggle'
import { Button } from '@/components/ui/button'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useLogout, useCurrentUser } from '@/lib/react-query/hooks/use-auth'
import { authStorage } from '@/services/auth'
import { Input } from '@/components/ui/input'

function Header() {
    const [open, setOpen] = React.useState(false)
    const router = useRouter()

    React.useEffect(() => {
        const handler = () => setOpen(false)
        window.addEventListener('resize', handler)
        return () => window.removeEventListener('resize', handler)
    }, [])

    const queryClient = useQueryClient()
    const { data: user, isLoading } = useCurrentUser()
    const isAuthed = !!user
    const logout = useLogout()

    React.useEffect(() => {
        const stored = authStorage.load()
        if (!queryClient.getQueryData(['auth','user']) && stored.user) {
            queryClient.setQueryData(['auth','user'], stored.user)
        }
    }, [queryClient])

    const displayName: string | undefined = React.useMemo(() => {
        const name = [user?.firstName, user?.lastName].filter(Boolean).join(' ')
        return user?.email ?? (name.length > 0 ? name : undefined)
    }, [user?.email, user?.firstName, user?.lastName])

    return (
        <header className="sticky top-0 z-50 bg-[color-mix(in_srgb,var(--surface),#000_4%)] backdrop-blur-sm border-b border-[var(--border)] shadow-sm">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16 gap-4">
                    <div className="flex items-center gap-3 min-w-0">
                        <div className="p-2 rounded-lg bg-gradient-to-br from-[var(--primary-50)] to-[var(--primary-100)] shadow-sm">
                            <GitFork className="text-[var(--primary-600)]" size={24} />
                        </div>
                        <Link href="/" className="font-bold text-xl text-[var(--foreground)] hover:text-[var(--primary-600)] transition-colors truncate">
                            Git Visualized Engine
                        </Link>
                    </div>
                    {/* Centered search on desktop */}
                    <div className="hidden md:flex flex-1 items-center justify-center max-w-2xl">
                        <SearchBar />
                    </div>
                    <nav className="hidden sm:flex items-center gap-2 shrink-0" aria-label="Main navigation">
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
                                    <button aria-label="Notifications" className="p-2 rounded-md hover:bg-[var(--primary-50)] text-[var(--foreground)]/85">
                                        <Bell size={18} />
                                    </button>
                                    <Link href="/profile" className="px-2 py-1 rounded-md text-sm font-medium text-[var(--foreground)]/85 hover:text-[var(--primary-600)] hover:bg-[var(--primary-50)] transition-colors flex items-center gap-2">
                                        <UserAvatar name={displayName ?? 'User'} url={(user as any)?.avatar} />
                                        <span className="hidden md:inline truncate max-w-[10rem]">{displayName ?? 'User'}</span>
                                    </Link>
                                    <Button variant="outline" size="sm" onClick={() => { logout(); router.replace('/') }}>
                                        Logout
                                    </Button>
                                </>
                            )}
                        </div>
                        <ThemeToggle />
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
                        <div className="py-2"><SearchBar size="sm" /></div>
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

function SearchBar({ size = 'md' as 'md' | 'sm' }) {
    const router = useRouter()
    const [q, setQ] = React.useState('')
    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        const query = q.trim()
        if (query.length > 0) router.push(`/git-theory?query=${encodeURIComponent(query)}`)
    }
    return (
        <form onSubmit={onSubmit} className={`w-full ${size==='sm' ? '' : 'max-w-xl'}`} role="search">
            <div className="relative">
                <Input
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    placeholder="Search lessons, practices..."
                    className="pl-3 pr-3"
                />
            </div>
        </form>
    )
}

function UserAvatar({ name, url }: { name: string; url?: string }) {
    const initials = name.trim().slice(0,1).toUpperCase()
    return (
        <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--primary-100)] text-[var(--primary-700)] text-xs font-semibold overflow-hidden">
            {url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={url} alt={name} className="h-full w-full object-cover" />
            ) : (
                initials
            )}
        </span>
    )
}
