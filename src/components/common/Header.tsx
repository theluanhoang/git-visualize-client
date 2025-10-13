'use client';

import Link from 'next/link'
import { GitFork, Menu, X } from 'lucide-react'
import React from 'react'
import ThemeToggle from '@/components/common/ThemeToggle'

function Header() {
    const [open, setOpen] = React.useState(false)

    React.useEffect(() => {
        const handler = () => setOpen(false)
        window.addEventListener('resize', handler)
        return () => window.removeEventListener('resize', handler)
    }, [])

    return (
        <header className="sticky top-0 z-50 bg-[color-mix(in_srgb,var(--surface),#000_4%)] backdrop-blur-sm border-b border-[var(--border)] shadow-sm">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    {}
                    <div className="flex items-center gap-3 min-w-0">
                        <div className="p-2 rounded-lg bg-gradient-to-br from-[var(--primary-50)] to-[var(--primary-100)] shadow-sm">
                            <GitFork className="text-[var(--primary-600)]" size={24} />
                        </div>
                        <Link href="/" className="font-bold text-xl text-[var(--foreground)] hover:text-[var(--primary-600)] transition-colors truncate">
                            Git Visualized Engine
                        </Link>
                    </div>

                    {}
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
                    </nav>

                    {}
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

            {}
            <div id="mobile-nav" className={`sm:hidden ${open ? 'block' : 'hidden'} border-t border-[var(--border)] bg-[var(--surface)]`}>
                <div className="container mx-auto px-4 py-3">
                    <div className="flex flex-col gap-1" role="menu" aria-label="Mobile navigation">
                        <Link onClick={() => setOpen(false)} href="/" className="px-3 py-2 rounded-md text-sm font-medium text-[var(--foreground)]/90 hover:bg-[var(--primary-50)]" role="menuitem">Home</Link>
                        <Link onClick={() => setOpen(false)} href="/git-theory" className="px-3 py-2 rounded-md text-sm font-medium text-[var(--foreground)]/90 hover:bg-[var(--primary-50)]" role="menuitem">Git Theory</Link>
                        <Link onClick={() => setOpen(false)} href="/practice" className="px-3 py-2 rounded-md text-sm font-medium text-[var(--foreground)]/90 hover:bg-[var(--primary-50)]" role="menuitem">Practice</Link>
                    </div>
                </div>
            </div>
        </header>
    )
}

export default Header
