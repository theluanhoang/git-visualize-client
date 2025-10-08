import { ICommit } from '@/types/git'
import React from 'react'

interface CommitSvgParams {
    x: number,
    y: number,
    isHead: boolean,
    isCurrentBranch: boolean,
    commit?: ICommit
}

function CommitSvg({ x, y, commit, isHead, isCurrentBranch }: CommitSvgParams) {
    return (
        <g>
            {/* Commit circle with shadow */}
            <circle
                cx={x}
                cy={y}
                r="30"
                fill={isHead ? '#10b981' : isCurrentBranch ? '#3b82f6' : '#6b7280'}
                  stroke={isHead ? '#059669' : isCurrentBranch ? '#2563eb' : '#4b5563'}
                  strokeWidth="4"
                  className="cursor-pointer hover:opacity-80 transition-all duration-200"
                //   onClick={() => onCommitClick(node.commit)}
                  filter="url(#shadow)"
            />

            {/* Inner circle for depth */}
            <circle
                cx={x}
                cy={y}
                r="20"
                fill="url(#commitGradient)"
                className="pointer-events-none"
            />

            {/* Commit ID */}
            <text
                x={x}
                y={y + 5}
                textAnchor="middle"
                className="text-xs fill-white font-mono font-bold pointer-events-none"
            >
                {commit ? commit.id.substring(0, 7) : "7aj8dc"}
            </text>

            {/* Commit message */}
            <text
                x={x}
                y={y - 50}
                textAnchor="middle"
                className="text-sm fill-gray-700 font-medium pointer-events-none"
                width="200"
            >
                {commit ? commit.message : "feat: create a commit"}
            </text>

            {/* Branch label */}
            <rect
                x={x - 30}
                y={y + 40}
                width="60"
                height="20"
                rx="10"
                fill={isCurrentBranch ? '#dc2626' : '#6b7280'}
                className="pointer-events-none"
            />
            <text
                x={x}
                y={y + 53}
                textAnchor="middle"
                className="text-xs fill-white font-bold pointer-events-none"
            >
                {commit ? commit.branch : "main"}
            </text>
        </g>
    )
}

export default CommitSvg