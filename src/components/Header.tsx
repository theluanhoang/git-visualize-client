import { GitBranch, GitCommitHorizontal, GitFork } from 'lucide-react'
import React from 'react'

function Header() {
    return (
        <header className="flex items-center h-16 bg-white shadow-sm">
            <div className="container mx-auto flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <GitFork className="text-blue-600" size={32} />
                    <h1 className="font-bold text-2xl">Git Visualized Engine</h1>
                </div>
                <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                        <GitBranch size={24} className="text-[var(--foreround)]" />
                        <p className="flex items-center">Branch: <p className="ml-1">main</p></p>
                    </span>
                    <span className="flex items-center gap-1">
                        <GitCommitHorizontal size={24} className="text-[var(--foreround)]" />
                        <p className="flex items-center">Commit: <p className="ml-1">1</p></p>
                    </span>
                </div>
            </div>
        </header>
    )
}

export default Header