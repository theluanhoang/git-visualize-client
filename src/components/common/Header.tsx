'use client';

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useParams } from 'next/navigation'
import { GitFork, Menu, X, Bell, Shield, Crown } from 'lucide-react'
import React from 'react'
import { useTranslations } from 'next-intl'
import ThemeToggle from '@/components/common/ThemeToggle'
import LanguageSwitcher from '@/components/common/LanguageSwitcher'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import Image from 'next/image';

function Header() {
    const [open, setOpen] = React.useState(false)
    const t = useTranslations('common')
    const params = useParams()
    const locale = (params.locale as string) || 'en'

    React.useEffect(() => {
        const handler = () => setOpen(false)
        window.addEventListener('resize', handler)
        return () => window.removeEventListener('resize', handler)
    }, [])

    const { isAuthenticated, user, logout, isLoading: authLoading, isAdmin } = useAuth()

    const handleLogout = async () => {
        await logout()
    }

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
                        <Link href={`/${locale}`} className="font-bold text-xl text-[var(--foreground)] hover:text-[var(--primary-600)] transition-colors truncate">
                            Git Visualized Engine
                        </Link>
                    </div>
                    <div className="hidden md:flex flex-1 items-center justify-center max-w-2xl">
                        <SearchBar />
                    </div>
                    <nav className="hidden sm:flex items-center gap-2 shrink-0" aria-label="Main navigation">
                        <Link 
                            href={`/${locale}`} 
                            className="px-3 py-2 rounded-md text-sm font-medium text-[var(--foreground)]/85 hover:text-[var(--primary-600)] hover:bg-[var(--primary-50)] transition-colors"
                        >
                            {t('home')}
                        </Link>
                        <Link 
                            href={`/${locale}/git-theory`} 
                            className="px-3 py-2 rounded-md text-sm font-medium text-[var(--foreground)]/85 hover:text-[var(--primary-600)] hover:bg-[var(--primary-50)] transition-colors"
                        >
                            {t('gitTheory')}
                        </Link>
                        {isAdmin && (
                            <Link 
                                href={`/${locale}/admin`} 
                                className="px-3 py-2 rounded-md text-sm font-medium text-[var(--foreground)]/85 hover:text-[var(--primary-600)] hover:bg-[var(--primary-50)] transition-colors flex items-center gap-1"
                            >
                                <Shield className="h-4 w-4" />
                                {t('admin')}
                            </Link>
                        )}
                        
                        <div className="flex items-center gap-2 ml-2">
                            {!isAuthenticated ? (
                                <>
                                    <Link 
                                        href="/auth/login" 
                                        className="px-3 py-2 rounded-md text-sm font-medium text-[var(--foreground)]/85 hover:text-[var(--primary-600)] hover:bg-[var(--primary-50)] transition-colors"
                                    >
                                        {t('login')}
                                    </Link>
                                    <Link 
                                        href="/auth/register" 
                                        className="px-3 py-2 rounded-md text-sm font-medium text-[var(--foreground)]/85 hover:text-[var(--primary-600)] hover:bg-[var(--primary-50)] transition-colors"
                                    >
                                        {t('register')}
                                    </Link>
                                </>
                            ) : (
                                <>
                                    <Button 
                                        variant={"ghost"}
                                        aria-label={t('notifications')} 
                                        className="p-2 rounded-md hover:bg-[var(--primary-50)] dark:hover:bg-[var(--primary-900)] text-[var(--foreground)]/85 hover:text-[var(--primary-600)] dark:hover:text-[var(--primary-400)] transition-colors"
                                    >
                                        <Bell size={18} />
                                    </Button>
                                    <Link href="/profile" className="px-2 py-1 rounded-md text-sm font-medium text-[var(--foreground)]/85 hover:text-[var(--primary-600)] hover:bg-[var(--primary-50)] transition-colors flex items-center gap-2">
                                        <UserAvatar name={displayName ?? 'User'} url={user?.avatar} />
                                        <div className="hidden md:flex items-center gap-2">
                                            <span className="truncate max-w-[10rem]">{displayName ?? 'User'}</span>
                                            {isAdmin && (
                                                <Badge variant="secondary" className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs px-2 py-0.5 flex items-center gap-1">
                                                    <Crown className="h-3 w-3" />
                                                    ADMIN
                                                </Badge>
                                            )}
                                        </div>
                                    </Link>
                                    <Button variant="outline" size="sm" onClick={handleLogout} disabled={authLoading}>
                                        {authLoading ? t('loggingOut') : t('logout')}
                                    </Button>
                                </>
                            )}
                        </div>
                        <LanguageSwitcher />
                        <ThemeToggle />
                    </nav>
                    <div className="sm:hidden flex items-center gap-2">
                        <LanguageSwitcher />
                        <ThemeToggle />
                        <Button
                            onClick={() => setOpen(v => !v)}
                            aria-label={open ? t('closeMenu') : t('openMenu')}
                            aria-expanded={open}
                            aria-controls="mobile-nav"
                            className="inline-flex items-center justify-center w-10 h-10 rounded-md border border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] shadow-sm"
                        >
                            {open ? <X size={18} /> : <Menu size={18} />}
                        </Button>
                    </div>
                </div>
            </div>
            <div id="mobile-nav" className={`sm:hidden ${open ? 'block' : 'hidden'} border-t border-[var(--border)] bg-[var(--surface)]`}>
                <div className="container mx-auto px-4 py-3">
                    <div className="flex flex-col gap-1" role="menu" aria-label={t('mobileNavigation')}>
                        <div className="py-2"><SearchBar size="sm" /></div>
                        <Link onClick={() => setOpen(false)} href={`/${locale}`} className="px-3 py-2 rounded-md text-sm font-medium text-[var(--foreground)]/90 hover:bg-[var(--primary-50)]" role="menuitem">{t('home')}</Link>
                        <Link onClick={() => setOpen(false)} href={`/${locale}/git-theory`} className="px-3 py-2 rounded-md text-sm font-medium text-[var(--foreground)]/90 hover:bg-[var(--primary-50)]" role="menuitem">{t('gitTheory')}</Link>
                        <Link onClick={() => setOpen(false)} href={`/${locale}/practice`} className="px-3 py-2 rounded-md text-sm font-medium text-[var(--foreground)]/90 hover:bg-[var(--primary-50)]" role="menuitem">{t('practice')}</Link>
                        {isAdmin && (
                            <Link onClick={() => setOpen(false)} href={`/${locale}/admin`} className="px-3 py-2 rounded-md text-sm font-medium text-[var(--foreground)]/90 hover:bg-[var(--primary-50)] flex items-center gap-2" role="menuitem">
                                <Shield className="h-4 w-4" />
                                {t('adminPanel')}
                            </Link>
                        )}
                        <div className="flex flex-col gap-2 pt-2">
                            {!isAuthenticated ? (
                                <>
                                    <Link onClick={() => setOpen(false)} href="/auth/login" className="px-3 py-2 rounded-md text-sm font-medium text-[var(--foreground)]/90 hover:bg-[var(--primary-50)]" role="menuitem">{t('login')}</Link>
                                    <Link onClick={() => setOpen(false)} href="/auth/register" className="px-3 py-2 rounded-md text-sm font-medium text-[var(--foreground)]/90 hover:bg-[var(--primary-50)]" role="menuitem">{t('register')}</Link>
                                </>
                            ) : (
                                <>
                                    <div className="flex items-center gap-2 px-3 py-2">
                                        <UserAvatar name={displayName ?? 'User'} url={user?.avatar} />
                                        <div className="flex flex-col">
                                            <span className="text-sm font-medium text-[var(--foreground)]/90">{displayName ?? 'User'}</span>
                                            {isAdmin && (
                                                <Badge variant="secondary" className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs px-2 py-0.5 w-fit flex items-center gap-1 mt-1">
                                                    <Crown className="h-3 w-3" />
                                                    ADMIN
                                                </Badge>
                                            )}
                                        </div>
                                    </div>
                                    <Button variant="outline" size="sm" className="w-full justify-center" onClick={() => { handleLogout(); setOpen(false); }} disabled={authLoading}>
                                        {authLoading ? t('loggingOut') : t('logout')}
                                    </Button>
                                </>
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
    const params = useParams()
    const locale = (params.locale as string) || 'en'
    const t = useTranslations('common')
    const [q, setQ] = React.useState('')
    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        const query = q.trim()
        if (query.length > 0) router.push(`/${locale}/git-theory?query=${encodeURIComponent(query)}`)
    }
    return (
        <form onSubmit={onSubmit} className={`w-full ${size==='sm' ? '' : 'max-w-xl'}`} role="search">
            <div className="relative">
                <Input
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    placeholder={t('search')}
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
                <img src={url} alt={name} className="h-full w-full object-cover" />
            ) : (
                initials
            )}
        </span>
    )
}
