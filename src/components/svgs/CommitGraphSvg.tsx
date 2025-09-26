import React, { useEffect, useRef, useState } from 'react'
import CommitSvg from './CommitSvg';
import { useGitResponses } from '@/lib/react-query/queries/useGitResponses';
import { ICommit, IHead } from '@/types/git';

interface CommitNode {
    commit: ICommit;
    x: number;
    y: number;
    level: number;
    branch: string;
}

interface CommitGraphSvgProps extends React.SVGProps<SVGSVGElement> {
    width: number;
    height: number;
    pan: { x: number; y: number };
    zoom: number;
}

const R = 30;
const D = 160;

function CommitGraphSvg({
    width,
    height,
    pan,
    zoom,
    ...svgProps
}: CommitGraphSvgProps) {
    const [head, setHead] = useState<IHead>(null);
    const [commitNodes, setCommitNodes] = useState<CommitNode[]>([]);
    const { data: responses = [], isLoading, isFetching, isError, error } = useGitResponses();
    const branchCommits = useRef<{ [branchName: string]: ICommit[] }>({});
    console.log("responses:::", responses);
    console.log(commitNodes);
        useEffect(() => {
        if (isLoading || isFetching) return; 
        console.log("HERE");
        
        if (responses.length === 0) return;

        const latestRepositoryState = responses[responses.length - 1].repositoryState;
        branchCommits.current = {};
        const commitNodes = calculateTreeLayout();
        console.log("Commit Nodes:::", commitNodes);
        
        setCommitNodes(commitNodes);

        setHead(latestRepositoryState?.head ?? null);
    }, [responses, isLoading, isFetching]);

    
    
    const calculateTreeLayout = () => {
        const lastCommits = responses[responses.length - 1].repositoryState?.commits ?? [];
        console.log("lastCommits:::", lastCommits);
        
        const sortedCommits = [...lastCommits].sort((a, b) => {
            const dateA = new Date(a.committer.date).getTime();
            const dateB = new Date(b.committer.date).getTime();
            return dateA - dateB;
        });

        const nodes: CommitNode[] = [];
        const levelHeight = 140;
        const branchSpacing = 300; // Increased spacing for better symmetry
        const startX = width / 2 - R; // Center position
        const startY = height / 2;

        // Group commits by branch
        sortedCommits.forEach(commit => {
            if (!branchCommits.current[commit.branch]) {
                branchCommits.current[commit.branch] = [];
            }
            branchCommits.current[commit.branch].push(commit);
        });

        // Sort branches by creation order (main first, then others)
        const branchNames = Object.keys(branchCommits.current);
        const mainBranch = branchNames.find(name => name === 'main') || branchNames[0];
        const otherBranches = branchNames.filter(name => name !== mainBranch);
        const orderedBranches = [mainBranch, ...otherBranches];

        // Calculate positions for each branch
        const branchPositions: { [branchName: string]: number } = {};

        // Main branch goes in the center
        branchPositions[mainBranch] = startX;

        // Other branches are distributed symmetrically around main
        otherBranches.forEach((branchName, index) => {
            const totalBranches = otherBranches.length;
            if (totalBranches === 1) {
                // Single branch: place to the right
                branchPositions[branchName] = startX + branchSpacing;
            } else if (totalBranches === 2) {
                // Two branches: place left and right
                branchPositions[branchName] = startX + (index === 0 ? -branchSpacing : branchSpacing);
            } else {
                // Multiple branches: distribute symmetrically
                const isEven = totalBranches % 2 === 0;
                const half = Math.floor(totalBranches / 2);
                const offset = isEven
                    ? (index - half + 0.5) * branchSpacing
                    : (index - half) * branchSpacing;
                branchPositions[branchName] = startX + offset;
            }
        });

        // Process commits in chronological order
        sortedCommits.forEach((commit, index) => {
            let x = branchPositions[commit.branch];
            let y = startY + (index * levelHeight);
            let level = index;
            let branch = commit.branch;

            // If this commit has parents, position it relative to its parent
            if (commit.parents.length > 0) {
                const parentCommit = sortedCommits.find(c => c.id === commit.parents[0]);
                if (parentCommit) {
                    const parentNode = nodes.find(n => n.commit.id === parentCommit.id);
                    if (parentNode) {
                        // If switching branches, use the branch position
                        if (parentNode.branch !== commit.branch) {
                            x = branchPositions[commit.branch];
                            level = parentNode.level + 1;
                            y = startY + (level * levelHeight);
                        } else {
                            // Continue on same branch
                            x = parentNode.x;
                            level = parentNode.level + 1;
                            y = startY + (level * levelHeight);
                        }
                    }
                }
            }

            nodes.push({
                commit,
                x,
                y,
                level,
                branch: commit.branch
            });
        });

        return nodes;
    }

      // Calculate total graph dimensions
    const minX = Math.min(...commitNodes.map(n => n.x)) - 200;
    const maxX = Math.max(...commitNodes.map(n => n.x)) + 200;
    const maxY = Math.max(...commitNodes.map(n => n.y)) + 200;
    const graphWidth = Math.max(width, maxX - minX);
    const graphHeight = Math.max(height, maxY);
    
    if (isLoading) {
        return (
            <div className="w-full h-full flex items-center justify-center">
                <div className="text-gray-500">Loading...</div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="w-full h-full flex items-center justify-center">
                <div className="text-red-500">Error: {error?.message || 'Failed to load data'}</div>
            </div>
        );
    }

    if (commitNodes.length === 0) {
        return (
            <div className="w-full h-full flex items-center justify-center">
                <div className="text-center text-gray-500">
                    <div className="text-lg mb-2">📊</div>
                    <div>No commits yet</div>
                    <div className="text-sm mt-1">Create a commit to see the graph</div>
                </div>
            </div>
        );
    }

    return (
        <svg
            width={width}
            height={height}
            className={`absolute inset-0 cursor-grab`}
            {...svgProps}
        >
            <defs>
                {/* Gradient for commit circles */}
                <radialGradient id="commitGradient" cx="50%" cy="30%">
                    <stop offset="0%" stopColor="#ffffff" stopOpacity="0.3"/>
                    <stop offset="100%" stopColor="#000000" stopOpacity="0.1"/>
                </radialGradient>
                
                {/* Arrow marker */}
                <marker
                    id="arrowhead"
                    markerWidth="10"
                    markerHeight="7"
                    refX="9"
                    refY="3.5"
                    orient="auto"
                >
                    <polygon
                    points="0 0, 10 3.5, 0 7"
                    fill="#6b7280"
                    />
                </marker>

                {/* Shadow filter */}
                <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
                    <feDropShadow dx="2" dy="2" stdDeviation="2" floodColor="#000000" floodOpacity="0.3"/>
                </filter>
            </defs>
            {/* Background grid */}
            <g transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`}>
                <defs>
                    <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
                    <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#e5e7eb" strokeWidth="0.5"/>
                    </pattern>
                </defs>
                <rect x={minX} y={0} width={graphWidth} height={graphHeight} fill="url(#grid)" />
            </g>
            <g transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`} >
                {/* Draw connection */}
                {commitNodes.map((commitNode) => {
                    const parentNodes = commitNode.commit.parents.map(parentId =>
                        commitNodes.find(commitNode => commitNode.commit.id === parentId)
                    ).filter(Boolean) as CommitNode[];

                    return parentNodes.map((parentNode, index) => (
                        <line
                            key={`${parentNode.commit.id}-${commitNode.commit.id}-${index}`}
                            x1={parentNode.x}
                            y1={parentNode.y}
                            x2={commitNode.x}
                            y2={commitNode.y}
                            stroke="#6b7280"
                            strokeWidth="3"
                            markerEnd="url(#arrowhead)"
                            className="transition-all duration-200"
                        />
                    ));
                })}

                {
                    commitNodes.map((commitNode) => {
                        const currentHead = head?.type === 'branch' ? head.commitId : head?.ref;
                        const currentBranch = head?.ref;
                        const isHead = commitNode.commit.id === currentHead;
                        const index = branchCommits.current[currentBranch!] && branchCommits.current[currentBranch!].find((commit) => commit.id === commitNode.commit.id);
                        const isCurrentBranch = index ? true : false;

                        return (
                            <CommitSvg x={commitNode.x} y={commitNode.y} isHead={isHead} isCurrentBranch={isCurrentBranch} commit={commitNode.commit} />
                        )
                    })
                }
            </g>
        </svg>
    )
}

export default CommitGraphSvg
