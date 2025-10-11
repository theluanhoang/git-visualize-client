import React, { useEffect, useRef, useState } from 'react'
import CommitSvg from './CommitSvg';
import { useTerminalResponses } from '@/lib/react-query/hooks/use-git-engine';
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

function CommitGraphSvg({
    width,
    height,
    pan,
    zoom,
    ...svgProps
}: CommitGraphSvgProps) {
    const [head, setHead] = useState<IHead>(null);
    const [commitNodes, setCommitNodes] = useState<CommitNode[]>([]);
    const { data: responses = [] } = useTerminalResponses();
    const branchCommits = useRef<{ [branchName: string]: ICommit[] }>({});
    useEffect(() => {
        if (responses.length === 0) return;

        const latestRepositoryState = responses[responses.length - 1].repositoryState;
        branchCommits.current = {};
        const commitNodes = calculateTreeLayout();

        setCommitNodes(commitNodes);

        setHead(latestRepositoryState?.head ?? null);
    }, [responses]);



    const calculateTreeLayout = () => {
        const lastCommits = responses[responses.length - 1].repositoryState?.commits ?? [];
        
        // Maps for quick lookup
        const idToCommit: Record<string, ICommit> = {};
        lastCommits.forEach(c => { idToCommit[c.id] = c; });

        // Sort commits chronologically (oldest first) for deterministic ordering
        const sortedCommits = [...lastCommits].sort((a, b) => {
            const dateA = new Date(a.committer.date).getTime();
            const dateB = new Date(b.committer.date).getTime();
            return dateA - dateB;
        });

        // Build parent -> children map using primary parent (first parent)
        const childrenMap: Record<string, string[]> = {};
        sortedCommits.forEach(commit => {
            const primaryParent = commit.parents[0];
            if (primaryParent) {
                if (!childrenMap[primaryParent]) childrenMap[primaryParent] = [];
                childrenMap[primaryParent].push(commit.id);
            }
        });

        // Find root commits (no parent or parent not in set)
        const commitIdSet = new Set(sortedCommits.map(c => c.id));
        const roots: string[] = sortedCommits
            .filter(c => c.parents.length === 0 || !commitIdSet.has(c.parents[0]))
            .map(c => c.id);

        // Compute levels by BFS from roots using primary parent
        const levelById: Record<string, number> = {};
        const queue: string[] = [];
        roots.forEach(id => { levelById[id] = 0; queue.push(id); });

        while (queue.length) {
            const current = queue.shift() as string;
            const currentLevel = levelById[current];
            const children = childrenMap[current] ?? [];
            // Sort children by date for stability
            children.sort((a, b) => {
                const da = new Date(idToCommit[a].committer.date).getTime();
                const db = new Date(idToCommit[b].committer.date).getTime();
                return da - db;
            });
            for (const childId of children) {
                if (levelById[childId] === undefined) {
                    levelById[childId] = currentLevel + 1;
                    queue.push(childId);
                }
            }
        }

        // Constants for layout
        const levelHeight = 4*R + 20;
        const branchSpacing = 120; // Horizontal spacing between branches
        const startX = width / 2 - R; // center X
        const startY = height / 2;    // base Y

        // Compute X positions per node using hierarchical layout
        const xById: Record<string, number> = {};
        const branchLanes: Map<string, number> = new Map(); // branch -> lane number
        const branchPositions: Map<string, number> = new Map(); // branch -> base X position

        // Step 1: Identify all branches and assign lanes
        const allBranches = new Set<string>();
        sortedCommits.forEach(commit => allBranches.add(commit.branch));
        
        const branchList = Array.from(allBranches);
        const mainBranch = branchList.find(b => b === 'main' || b === 'master') || branchList[0];
        const otherBranches = branchList.filter(b => b !== mainBranch);

        // Assign main branch to lane 0
        branchLanes.set(mainBranch, 0);
        branchPositions.set(mainBranch, startX);

        // Assign other branches to symmetric lanes
        otherBranches.forEach((branch, index) => {
            const lane = Math.floor(index / 2) + 1;
            const laneNumber = index % 2 === 0 ? lane : -lane;
            branchLanes.set(branch, laneNumber);
            branchPositions.set(branch, startX + laneNumber * branchSpacing);
        });

        console.log('Branch lanes:', Object.fromEntries(branchLanes));
        console.log('Branch positions:', Object.fromEntries(branchPositions));

        // Step 2: Place commits using hierarchical positioning
        const maxLevel = Object.values(levelById).reduce((m, v) => Math.max(m, v), 0);

        // Place roots at their branch positions
        roots.forEach((rootId) => {
            const commit = idToCommit[rootId];
            const branch = commit.branch;
            const branchX = branchPositions.get(branch) || startX;
            xById[rootId] = branchX;
        });

        // Process each level from top to bottom
        for (let lvl = 1; lvl <= maxLevel; lvl++) {
            const nodesAtLevel = sortedCommits
                .filter(c => levelById[c.id] === lvl)
                .map(c => c.id);

            // Group nodes by their parent
            const nodesByParent: Record<string, string[]> = {};
            for (const id of nodesAtLevel) {
                const parentId = idToCommit[id].parents[0];
                if (!parentId) continue;
                if (!nodesByParent[parentId]) nodesByParent[parentId] = [];
                nodesByParent[parentId].push(id);
            }

            // Position each group of siblings
            for (const parentId of Object.keys(nodesByParent)) {
                const siblings = nodesByParent[parentId];
                const parentCommit = idToCommit[parentId];
                const parentBranch = parentCommit.branch;
                const parentX = xById[parentId] || startX;

                // Sort siblings by commit time for consistent ordering
                siblings.sort((a, b) => {
                    const da = new Date(idToCommit[a].committer.date).getTime();
                    const db = new Date(idToCommit[b].committer.date).getTime();
                    return da - db;
                });

                // Group siblings by branch
                const siblingsByBranch: Record<string, string[]> = {};
                siblings.forEach(childId => {
                    const commit = idToCommit[childId];
                    const branch = commit.branch;
                    if (!siblingsByBranch[branch]) {
                        siblingsByBranch[branch] = [];
                    }
                    siblingsByBranch[branch].push(childId);
                });

                // Position each branch's commits
                Object.entries(siblingsByBranch).forEach(([branchName, branchSiblings]) => {
                    const branchX = branchPositions.get(branchName) || startX;
                    
                    branchSiblings.forEach((childId) => {
                        // All commits in a branch follow the same vertical line
                        xById[childId] = branchX;
                    });
                });
            }

            // Handle any unplaced nodes
            const unplaced = nodesAtLevel.filter(id => xById[id] === undefined);
            if (unplaced.length > 0) {
                unplaced.forEach((id, idx) => {
                    const commit = idToCommit[id];
                    const branch = commit.branch;
                    const branchX = branchPositions.get(branch) || startX;
                    xById[id] = branchX;
                });
            }
        }

        // Step 3: Collision avoidance - ensure minimum spacing between commits at same level
        const minGap = R * 2 + 20; // circle diameter + margin
        for (let lvl = 0; lvl <= maxLevel; lvl++) {
            const idsAtLevel = sortedCommits
                .filter(c => (levelById[c.id] ?? 0) === lvl)
                .map(c => c.id)
                .filter(id => xById[id] !== undefined);
            
            if (idsAtLevel.length <= 1) continue;
            
            // Sort by X position
            idsAtLevel.sort((a, b) => (xById[a] as number) - (xById[b] as number));
            
            // Resolve collisions by shifting nodes
            for (let i = 1; i < idsAtLevel.length; i++) {
                const prevId = idsAtLevel[i - 1];
                const currId = idsAtLevel[i];
                const prevX = xById[prevId] as number;
                const currX = xById[currId] as number;
                const gap = currX - prevX;
                
                if (gap < minGap) {
                    const shift = minGap - gap;
                    xById[currId] = currX + shift;
                }
            }
        }

        // Group commits by branch for later highlighting
        branchCommits.current = {};
        sortedCommits.forEach(commit => {
            if (!branchCommits.current[commit.branch]) {
                branchCommits.current[commit.branch] = [];
            }
            branchCommits.current[commit.branch].push(commit);
        });

        // Build final nodes
        const nodes: CommitNode[] = sortedCommits.map(c => {
            const level = levelById[c.id] ?? 0;
            const x = xById[c.id] ?? startX;
            const y = startY + level * levelHeight;
            return {
                commit: c,
                x,
                y,
                level,
                branch: c.branch,
            };
        });

        return nodes;
    }

    // Calculate total graph dimensions
    const minX = Math.min(...commitNodes.map(n => n.x)) - 200;
    const maxX = Math.max(...commitNodes.map(n => n.x)) + 200;
    const maxY = Math.max(...commitNodes.map(n => n.y)) + 200;

    // Calculate viewport bounds for grid coverage
    const viewportMinX = (-pan.x) / zoom;
    const viewportMaxX = (width - pan.x) / zoom;
    const viewportMinY = (-pan.y) / zoom;
    const viewportMaxY = (height - pan.y) / zoom;

    // Ensure grid covers the full viewport
    const gridMinX = Math.min(viewportMinX, minX);
    const gridMaxX = Math.max(viewportMaxX, maxX);
    const gridMinY = Math.min(viewportMinY, 0);
    const gridMaxY = Math.max(viewportMaxY, maxY);
    const gridWidth = gridMaxX - gridMinX;
    const gridHeight = gridMaxY - gridMinY;

    // No loading or error states for client-only cache

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
                    <stop offset="0%" stopColor="#ffffff" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#000000" stopOpacity="0.1" />
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
                    <feDropShadow dx="2" dy="2" stdDeviation="2" floodColor="#000000" floodOpacity="0.3" />
                </filter>
            </defs>
            {/* Background grid */}
            <g transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`}>
                <defs>
                    <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
                        <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#e5e7eb" strokeWidth="0.5" />
                    </pattern>
                </defs>
                <rect x={gridMinX} y={gridMinY} width={gridWidth} height={gridHeight} fill="url(#grid)" />
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
