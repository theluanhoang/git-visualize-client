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
    useEffect(() => {
        if (isLoading || isFetching) return;

        if (responses.length === 0) return;

        const latestRepositoryState = responses[responses.length - 1].repositoryState;
        branchCommits.current = {};
        const commitNodes = calculateTreeLayout();

        setCommitNodes(commitNodes);

        setHead(latestRepositoryState?.head ?? null);
    }, [responses, isLoading, isFetching]);



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
        const branchSpacing = 300; // horizontal spacing between siblings
        const startX = width / 2 - R; // center X
        const startY = height / 2;    // base Y

        // Compute X positions per node
        const xById: Record<string, number> = {};

        // Helper to generate alternating offsets: [0, -1, +1, -2, +2, ...] * spacing
        const alternatingOffsets = (count: number): number[] => {
            const offsets: number[] = [];
            for (let i = 0; i < count; i++) {
                if (i === 0) {
                    offsets.push(0);
                } else {
                    const step = Math.ceil(i / 2);
                    const sign = i % 2 === 0 ? 1 : -1; // even index -> +, odd -> - (after the first)
                    offsets.push(sign * step);
                }
            }
            return offsets.map(m => m * branchSpacing);
        };

        // Levels present in the graph
        const maxLevel = Object.values(levelById).reduce((m, v) => Math.max(m, v), 0);

        // Place roots around center using alternating offsets
        const rootOffsets = alternatingOffsets(roots.length);
        roots.forEach((rootId, idx) => {
            xById[rootId] = startX + rootOffsets[idx];
        });

        // For each subsequent level, position children around their parent
        for (let lvl = 1; lvl <= maxLevel; lvl++) {
            // Collect nodes at this level
            const nodesAtLevel = sortedCommits
                .filter(c => levelById[c.id] === lvl)
                .map(c => c.id);

            // Group by parent (primary parent)
            const nodesByParent: Record<string, string[]> = {};
            for (const id of nodesAtLevel) {
                const parentId = idToCommit[id].parents[0];
                if (!parentId) continue;
                if (!nodesByParent[parentId]) nodesByParent[parentId] = [];
                nodesByParent[parentId].push(id);
            }

            // Position each sibling group around its parent.x with alternating offsets
            for (const parentId of Object.keys(nodesByParent)) {
                const siblings = nodesByParent[parentId];
                // stable sort by commit time
                siblings.sort((a, b) => {
                    const da = new Date(idToCommit[a].committer.date).getTime();
                    const db = new Date(idToCommit[b].committer.date).getTime();
                    return da - db;
                });
                const parentX = xById[parentId] ?? startX;
                const offsets = alternatingOffsets(siblings.length);
                siblings.forEach((childId, idx) => {
                    xById[childId] = parentX + offsets[idx];
                });
            }

            // Handle any nodes without a known parent placement (fallback to center distribution)
            const unplaced = nodesAtLevel.filter(id => xById[id] === undefined);
            if (unplaced.length > 0) {
                const offs = alternatingOffsets(unplaced.length);
                unplaced.forEach((id, idx) => {
                    xById[id] = startX + offs[idx];
                });
            }
        }

        // Collision avoidance: ensure minimum horizontal gap at each level
        const minGap = R * 2 + 24; // circle diameter + margin
        for (let lvl = 0; lvl <= maxLevel; lvl++) {
            const idsAtLevel = sortedCommits
                .filter(c => (levelById[c.id] ?? 0) === lvl)
                .map(c => c.id)
                .filter(id => xById[id] !== undefined);
            idsAtLevel.sort((a, b) => (xById[a] as number) - (xById[b] as number));
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
