import React from 'react'
import Terminal from './Terminal'
import { TerminalIcon } from 'lucide-react'

function TerminalWrapper() {
    return (
        <div className="rounded-lg shadow-sm border border-[var(--border)] bg-[var(--surface)]">
            {/* <div className="px-4 py-3 border-b border-[var(--border)] bg-background">
                <h2 className="text-lg font-semibold text-foreground flex items-center">
                    <TerminalIcon className="h-5 w-5 mr-2 text-foreground" />
                    Terminal
                </h2>
                <p className="text-sm mt-1 text-muted-foreground">
                    Type git commands to see the visualization
                </p>
            </div> */}
            <div className="p-4">
                <Terminal />
            </div>
        </div>
    )
}

export default TerminalWrapper