import React from 'react'
import Terminal from './Terminal'
import { TerminalIcon } from 'lucide-react'

function TerminalWrapper() {
    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-4 py-3 border-b bg-gray-50 border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                    <TerminalIcon className="h-5 w-5 mr-2" />
                    Terminal
                </h2>
                <p className="text-sm mt-1">
                    Type git commands to see the visualization
                </p>
            </div>
            <div className="p-4">
                <Terminal />
            </div>
        </div>
    )
}

export default TerminalWrapper