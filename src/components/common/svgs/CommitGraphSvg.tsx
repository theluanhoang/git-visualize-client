import React, { useEffect, useRef, useState, useCallback } from 'react'
import CommitSvg from './CommitSvg';
import { useTerminalResponses, useGoalTerminalResponses } from '@/lib/react-query/hooks/use-git-engine';
import { ICommit, IHead, GitCommandResponse } from '@/types/git';
import { useQueryClient } from '@tanstack/react-query';

const getNodePositionsKey = (dataSource: 'practice' | 'goal', practiceId?: string) => 
    dataSource === 'goal' 
        ? 'git-goal-commit-graph-node-positions'
        : (practiceId ? `git-commit-graph-node-positions:${practiceId}` : 'git-commit-graph-node-positions');

const saveNodePositions = (positions: Record<string, { x: number; y: number }>, dataSource: 'practice' | 'goal', practiceId?: string) => {
    try {
        const key = getNodePositionsKey(dataSource, practiceId);
        localStorage.setItem(key, JSON.stringify(positions));
    } catch (error) {
        console.warn('Failed to save node positions:', error);
    }
};

const loadNodePositions = (dataSource: 'practice' | 'goal', practiceId?: string): Record<string, { x: number; y: number }> => {
    try {
        const key = getNodePositionsKey(dataSource, practiceId);
        const saved = localStorage.getItem(key);
        const positions = saved ? JSON.parse(saved) : {};
        return positions;
    } catch (error) {
        console.warn('Failed to load node positions:', error);
        return {};
    }
};

const clearNodePositions = (dataSource: 'practice' | 'goal', practiceId?: string) => {
    try {
        const key = getNodePositionsKey(dataSource, practiceId);
        localStorage.removeItem(key);
    } catch (error) {
        console.warn('Failed to clear node positions:', error);
    }
};

interface CommitNode {
    commit: ICommit;
    x: number;
    y: number;
    level: number;
    branch: string;
}

interface DragState {
    isDragging: boolean;
    draggedNodeId: string | null;
    dragOffset: { x: number; y: number };
    startPosition: { x: number; y: number };
    currentMousePosition: { x: number; y: number };
}

interface CommitGraphSvgProps extends React.SVGProps<SVGSVGElement> {
    width: number;
    height: number;
    pan: { x: number; y: number };
    zoom: number;
    onResetView?: (targetPanX?: number, targetPanY?: number) => void;
    onCommitsChange?: (hasCommits: boolean) => void;
    onCommitDoubleClick?: (commit: ICommit) => void;
    dataSource?: 'practice' | 'goal';
    customResponses?: GitCommandResponse[];
    practiceId?: string;
}

const R = 30;

function CommitGraphSvg({
    width,
    height,
    pan,
    zoom,
    onResetView,
    onCommitsChange,
    onCommitDoubleClick,
    dataSource = 'practice',
    customResponses,
    practiceId,
    ...svgProps
}: CommitGraphSvgProps) {
    const [head, setHead] = useState<IHead>(null);
    const [commitNodes, setCommitNodes] = useState<CommitNode[]>([]);
    const [dragState, setDragState] = useState<DragState>({
        isDragging: false,
        draggedNodeId: null,
        dragOffset: { x: 0, y: 0 },
        startPosition: { x: 0, y: 0 },
        currentMousePosition: { x: 0, y: 0 }
    });
    const [hasAutoCentered, setHasAutoCentered] = useState(false);
    
    const { data: practiceResponses = [] } = useTerminalResponses(practiceId);
    const { data: goalResponses = [] } = useGoalTerminalResponses();
    
    const responses = customResponses || (dataSource === 'goal' ? goalResponses : practiceResponses);
    
    const branchCommits = useRef<{ [branchName: string]: ICommit[] }>({});
    const svgRef = useRef<SVGSVGElement>(null);
    const queryClient = useQueryClient();

    useEffect(() => {
        const storageKey = dataSource === 'goal' ? 'git-goal-terminal-responses' : (practiceId ? `git-terminal-responses:${practiceId}` : 'git-terminal-responses');
        const queryKey = dataSource === 'goal' ? ['goal-terminal-responses'] : ['terminal-responses'];
        
        const rawData = localStorage.getItem(storageKey);
        const savedResponses = JSON.parse(rawData || '[]');
        
        if (savedResponses.length > 0) {
            queryClient.setQueryData(dataSource === 'goal' ? ['goal-terminal-responses'] : ['terminal-responses', practiceId ?? 'global'], savedResponses);
        }
    }, [queryClient, dataSource, practiceId]);

    useEffect(() => {
        if (responses.length === 0) {
            const storageKey = dataSource === 'goal' ? 'git-goal-terminal-responses' : (practiceId ? `git-terminal-responses:${practiceId}` : 'git-terminal-responses');
            const savedResponses = JSON.parse(localStorage.getItem(storageKey) || '[]');
            if (savedResponses.length > 0) {
                queryClient.setQueryData(dataSource === 'goal' ? ['goal-terminal-responses'] : ['terminal-responses', practiceId ?? 'global'], savedResponses);
            }
        }
    }, [responses.length, queryClient, dataSource, practiceId]);
    useEffect(() => {
        if (responses.length === 0) {
            const storageKey = dataSource === 'goal' ? 'git-goal-terminal-responses' : (practiceId ? `git-terminal-responses:${practiceId}` : 'git-terminal-responses');
            const savedResponses = JSON.parse(localStorage.getItem(storageKey) || '[]');
            
            if (savedResponses.length > 0) {
                return;
            }
            
            setCommitNodes([]);
            setHead(null);
            setHasAutoCentered(false);
            return;
        }

        const latestRepositoryState = responses[responses.length - 1].repositoryState;
        branchCommits.current = {};
        const commitNodes = calculateTreeLayout();

        const savedPositions = loadNodePositions(dataSource, practiceId);
        let commitNodesWithSavedPositions = commitNodes.map(node => {
            const savedPos = savedPositions[node.commit.id];
            if (savedPos) {
                return { ...node, x: savedPos.x, y: savedPos.y };
            }
            return node;
        });

        commitNodesWithSavedPositions = recalculatePositionsFromParents(commitNodesWithSavedPositions, savedPositions);

        setCommitNodes(commitNodesWithSavedPositions);

        setHead(latestRepositoryState?.head ?? null);
    }, [responses]);

    useEffect(() => {
        if (commitNodes.length > 0 && onResetView && !hasAutoCentered) {
            const mainBranchCommits = commitNodes.filter(node => node.branch === 'main');

            if (mainBranchCommits.length > 0) {
                const minX = Math.min(...mainBranchCommits.map(n => n.x));
                const maxX = Math.max(...mainBranchCommits.map(n => n.x));
                const minY = Math.min(...mainBranchCommits.map(n => n.y));
                const maxY = Math.max(...mainBranchCommits.map(n => n.y));

                const centerX = (minX + maxX) / 2;
                const centerY = (minY + maxY) / 2;

                const targetPanX = width / 2 - centerX;
                const targetPanY = height / 2 - centerY;

                onResetView(targetPanX, targetPanY);
            } else {
                const minX = Math.min(...commitNodes.map(n => n.x));
                const maxX = Math.max(...commitNodes.map(n => n.x));
                const minY = Math.min(...commitNodes.map(n => n.y));
                const maxY = Math.max(...commitNodes.map(n => n.y));

                const centerX = (minX + maxX) / 2;
                const centerY = (minY + maxY) / 2;

                const targetPanX = width / 2 - centerX;
                const targetPanY = height / 2 - centerY;

                onResetView(targetPanX, targetPanY);
            }

            setHasAutoCentered(true);
        }
    }, [commitNodes.length, onResetView, width, height, commitNodes, hasAutoCentered]);

    useEffect(() => {
        onCommitsChange?.(commitNodes.length > 0);
    }, [commitNodes.length, onCommitsChange]);

    const recalculatePositionsFromParents = (nodes: CommitNode[], savedPositions: Record<string, { x: number; y: number }>) => {
        const nodeMap = new Map(nodes.map(node => [node.commit.id, node]));
        const updatedNodes = [...nodes];
        
        const sortedNodes = [...nodes].sort((a, b) => {
            const dateA = new Date(a.commit.committer.date).getTime();
            const dateB = new Date(b.commit.committer.date).getTime();
            return dateA - dateB;
        });

        for (const node of sortedNodes) {
            if (savedPositions[node.commit.id]) {
                continue;
            }

            const primaryParentId = node.commit.parents[0];
            if (!primaryParentId) {
                continue; // Root commit, keep original position
            }

            const parentNode = nodeMap.get(primaryParentId);
            if (!parentNode) {
                continue; // Parent not found, keep original position
            }

            const parentIndex = updatedNodes.findIndex(n => n.commit.id === primaryParentId);
            if (parentIndex === -1) {
                continue;
            }

            const parentNodeUpdated = updatedNodes[parentIndex];
            
            if (node.commit.branch === parentNodeUpdated.commit.branch) {
                const updatedNode = {
                    ...node,
                    x: parentNodeUpdated.x,
                    y: parentNodeUpdated.y + 4*R + 20 // Same spacing as levelHeight
                };
                
                const nodeIndex = updatedNodes.findIndex(n => n.commit.id === node.commit.id);
                if (nodeIndex !== -1) {
                    updatedNodes[nodeIndex] = updatedNode;
                }
            }
        }

        return updatedNodes;
    };

    const calculateTreeLayout = () => {
        const lastCommits = responses[responses.length - 1].repositoryState?.commits ?? [];
        
        const idToCommit: Record<string, ICommit> = {};
        lastCommits.forEach(c => { idToCommit[c.id] = c; });

        const sortedCommits = [...lastCommits].sort((a, b) => {
            const dateA = new Date(a.committer.date).getTime();
            const dateB = new Date(b.committer.date).getTime();
            return dateA - dateB;
        });

        const childrenMap: Record<string, string[]> = {};
        sortedCommits.forEach(commit => {
            const primaryParent = commit.parents[0];
            if (primaryParent) {
                if (!childrenMap[primaryParent]) childrenMap[primaryParent] = [];
                childrenMap[primaryParent].push(commit.id);
            }
        });

        const commitIdSet = new Set(sortedCommits.map(c => c.id));
        const roots: string[] = sortedCommits
            .filter(c => c.parents.length === 0 || !commitIdSet.has(c.parents[0]))
            .map(c => c.id);

        const levelById: Record<string, number> = {};
        const queue: string[] = [];
        roots.forEach(id => { levelById[id] = 0; queue.push(id); });

        while (queue.length) {
            const current = queue.shift() as string;
            const currentLevel = levelById[current];
            const children = childrenMap[current] ?? [];
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

        const levelHeight = 4*R + 20;
        const branchSpacing = 120; // Horizontal spacing between branches
        const startX = width / 2 - R; // center X
        const startY = height / 2;    // base Y

        const xById: Record<string, number> = {};
        const branchLanes: Map<string, number> = new Map(); // branch -> lane number
        const branchPositions: Map<string, number> = new Map(); // branch -> base X position

        const allBranches = new Set<string>();
        sortedCommits.forEach(commit => allBranches.add(commit.branch));
        
        const branchList = Array.from(allBranches);
        const mainBranch = branchList.find(b => b === 'main' || b === 'master') || branchList[0];
        const otherBranches = branchList.filter(b => b !== mainBranch);

        branchLanes.set(mainBranch, 0);
        branchPositions.set(mainBranch, startX);

        otherBranches.forEach((branch, index) => {
            const lane = Math.floor(index / 2) + 1;
            const laneNumber = index % 2 === 0 ? lane : -lane;
            branchLanes.set(branch, laneNumber);
            branchPositions.set(branch, startX + laneNumber * branchSpacing);
        });
        const maxLevel = Object.values(levelById).reduce((m, v) => Math.max(m, v), 0);

        roots.forEach((rootId) => {
            const commit = idToCommit[rootId];
            const branch = commit.branch;
            const branchX = branchPositions.get(branch) || startX;
            xById[rootId] = branchX;
        });

        for (let lvl = 1; lvl <= maxLevel; lvl++) {
            const nodesAtLevel = sortedCommits
                .filter(c => levelById[c.id] === lvl)
                .map(c => c.id);

            const nodesByParent: Record<string, string[]> = {};
            for (const id of nodesAtLevel) {
                const parentId = idToCommit[id].parents[0];
                if (!parentId) continue;
                if (!nodesByParent[parentId]) nodesByParent[parentId] = [];
                nodesByParent[parentId].push(id);
            }

            for (const parentId of Object.keys(nodesByParent)) {
                const siblings = nodesByParent[parentId];
                const parentCommit = idToCommit[parentId];
                const parentBranch = parentCommit.branch;
                const parentX = xById[parentId] || startX;

                siblings.sort((a, b) => {
                    const da = new Date(idToCommit[a].committer.date).getTime();
                    const db = new Date(idToCommit[b].committer.date).getTime();
                    return da - db;
                });

                const siblingsByBranch: Record<string, string[]> = {};
                siblings.forEach(childId => {
                    const commit = idToCommit[childId];
                    const branch = commit.branch;
                    if (!siblingsByBranch[branch]) {
                        siblingsByBranch[branch] = [];
                    }
                    siblingsByBranch[branch].push(childId);
                });

                Object.entries(siblingsByBranch).forEach(([branchName, branchSiblings]) => {
                    const branchX = branchPositions.get(branchName) || startX;
                    
                    branchSiblings.forEach((childId) => {
                        xById[childId] = branchX;
                    });
                });
            }

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

        const minGap = R * 2 + 20; // circle diameter + margin
        for (let lvl = 0; lvl <= maxLevel; lvl++) {
            const idsAtLevel = sortedCommits
                .filter(c => (levelById[c.id] ?? 0) === lvl)
                .map(c => c.id)
                .filter(id => xById[id] !== undefined);
            
            if (idsAtLevel.length <= 1) continue;
            
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

        branchCommits.current = {};
        sortedCommits.forEach(commit => {
            if (!branchCommits.current[commit.branch]) {
                branchCommits.current[commit.branch] = [];
            }
            branchCommits.current[commit.branch].push(commit);
        });

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

    const screenToGraph = useCallback((screenX: number, screenY: number) => {
        return {
            x: (screenX - pan.x) / zoom,
            y: (screenY - pan.y) / zoom
        };
    }, [pan.x, pan.y, zoom]);

    const handleNodeMouseDown = useCallback((e: React.MouseEvent, nodeId: string) => {
        e.preventDefault();
        e.stopPropagation();
        
        const rect = svgRef.current?.getBoundingClientRect();
        if (!rect) return;

        const screenX = e.clientX - rect.left;
        const screenY = e.clientY - rect.top;
        const graphPos = screenToGraph(screenX, screenY);
        
        const node = commitNodes.find(n => n.commit.id === nodeId);
        if (!node) return;

        const offsetX = node.x - graphPos.x;
        const offsetY = node.y - graphPos.y;
        setDragState({
            isDragging: true,
            draggedNodeId: nodeId,
            dragOffset: { x: offsetX, y: offsetY },
            startPosition: { x: screenX, y: screenY },
            currentMousePosition: { x: screenX, y: screenY }
        });
    }, [commitNodes, screenToGraph, pan, zoom]);

    const handleNodeDoubleClick = useCallback((e: React.MouseEvent, nodeId: string) => {
        e.preventDefault();
        e.stopPropagation();
        
        const node = commitNodes.find(n => n.commit.id === nodeId);
        if (!node) return;

        onCommitDoubleClick?.(node.commit);
    }, [commitNodes, onCommitDoubleClick]);

    const getNodesToDrag = useCallback((draggedNodeId: string) => {
        const draggedNode = commitNodes.find(n => n.commit.id === draggedNodeId);
        if (!draggedNode) return [];

        const nodesToDrag = [draggedNodeId];
        const visited = new Set<string>();
        const queue = [draggedNodeId];

        while (queue.length > 0) {
            const currentNodeId = queue.shift()!;
            if (visited.has(currentNodeId)) continue;
            visited.add(currentNodeId);

            const children = commitNodes.filter(node => 
                node.commit.parents.includes(currentNodeId)
            );

            children.forEach(child => {
                if (!visited.has(child.commit.id)) {
                    nodesToDrag.push(child.commit.id);
                    queue.push(child.commit.id);
                }
            });
        }

        return nodesToDrag;
    }, [commitNodes]);

    const handleMouseMove = useCallback((e: MouseEvent) => {
        if (!dragState.isDragging || !dragState.draggedNodeId) return;

        const rect = svgRef.current?.getBoundingClientRect();
        if (!rect) return;

        const screenX = e.clientX - rect.left;
        const screenY = e.clientY - rect.top;
        const graphPos = screenToGraph(screenX, screenY);

        const newX = graphPos.x + dragState.dragOffset.x;
        const newY = graphPos.y + dragState.dragOffset.y;

        const nodesToDrag = getNodesToDrag(dragState.draggedNodeId);

        setDragState(prev => ({
            ...prev,
            currentMousePosition: { x: screenX, y: screenY }
        }));

        setCommitNodes(prevNodes => {
            const currentDraggedNode = prevNodes.find(n => n.commit.id === dragState.draggedNodeId);
            if (!currentDraggedNode) return prevNodes;

            const deltaX = newX - currentDraggedNode.x;
            const deltaY = newY - currentDraggedNode.y;
            const updatedNodes = prevNodes.map(node => 
                nodesToDrag.includes(node.commit.id)
                    ? { ...node, x: node.x + deltaX, y: node.y + deltaY }
                    : node
            );
            return updatedNodes;
        });
    }, [dragState, screenToGraph, getNodesToDrag]);

    const handleMouseUp = useCallback(() => {
        if (dragState.isDragging) {
            const currentPositions: Record<string, { x: number; y: number }> = {};
            commitNodes.forEach(node => {
                currentPositions[node.commit.id] = { x: node.x, y: node.y };
            });
            saveNodePositions(currentPositions, dataSource, practiceId);

            setDragState({
                isDragging: false,
                draggedNodeId: null,
                dragOffset: { x: 0, y: 0 },
                startPosition: { x: 0, y: 0 },
                currentMousePosition: { x: 0, y: 0 }
            });
        }
    }, [dragState.isDragging, commitNodes]);
    const resetView = useCallback(() => {
        if (commitNodes.length === 0) return;

        const mainBranchCommits = commitNodes.filter(node => node.branch === 'main');
        
        if (mainBranchCommits.length > 0) {
            const minX = Math.min(...mainBranchCommits.map(n => n.x));
            const maxX = Math.max(...mainBranchCommits.map(n => n.x));
            const minY = Math.min(...mainBranchCommits.map(n => n.y));
            const maxY = Math.max(...mainBranchCommits.map(n => n.y));
            
            const centerX = (minX + maxX) / 2;
            const centerY = (minY + maxY) / 2;
            
            const targetPanX = width / 2 - centerX;
            const targetPanY = height / 2 - centerY;
            
            onResetView?.(targetPanX, targetPanY);
        } else {
            const minX = Math.min(...commitNodes.map(n => n.x));
            const maxX = Math.max(...commitNodes.map(n => n.x));
            const minY = Math.min(...commitNodes.map(n => n.y));
            const maxY = Math.max(...commitNodes.map(n => n.y));
            
            const centerX = (minX + maxX) / 2;
            const centerY = (minY + maxY) / 2;
            
            const targetPanX = width / 2 - centerX;
            const targetPanY = height / 2 - centerY;
            
            onResetView?.(targetPanX, targetPanY);
        }
    }, [commitNodes, width, height, onResetView]);

    useEffect(() => {
        if (onResetView) {
            const windowKey = dataSource === 'goal' ? 'resetGoalCommitGraphView' : 'resetCommitGraphView';
            (window as any)[windowKey] = resetView;
        }
    }, [resetView, onResetView, dataSource]);

    useEffect(() => {
        if (dragState.isDragging) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
            document.body.style.cursor = 'grabbing';
            document.body.style.userSelect = 'none';
        } else {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
            document.body.style.cursor = '';
            document.body.style.userSelect = '';
        }

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
            document.body.style.cursor = '';
            document.body.style.userSelect = '';
        };
    }, [dragState.isDragging, handleMouseMove, handleMouseUp]);

    const minX = Math.min(...commitNodes.map(n => n.x)) - 200;
    const maxX = Math.max(...commitNodes.map(n => n.x)) + 200;
    const maxY = Math.max(...commitNodes.map(n => n.y)) + 200;

    const viewportMinX = (-pan.x) / zoom;
    const viewportMaxX = (width - pan.x) / zoom;
    const viewportMinY = (-pan.y) / zoom;
    const viewportMaxY = (height - pan.y) / zoom;

    const gridMinX = Math.min(viewportMinX, minX);
    const gridMaxX = Math.max(viewportMaxX, maxX);
    const gridMinY = Math.min(viewportMinY, 0);
    const gridMaxY = Math.max(viewportMaxY, maxY);
    const gridWidth = gridMaxX - gridMinX;
    const gridHeight = gridMaxY - gridMinY;
    if (commitNodes.length === 0) {
        return (
            <div 
                className="w-full h-full flex items-center justify-center absolute inset-0"
                style={{ 
                    width: width, 
                    height: height,
                    pointerEvents: 'none' // Disable all interactions
                }}
            >
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
            ref={svgRef}
            width={width}
            height={height}
            className={`absolute inset-0 ${dragState.isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
            {...svgProps}
        >
            <defs>
                {}
                <radialGradient id="commitGradient" cx="50%" cy="30%">
                    <stop offset="0%" stopColor="#ffffff" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#000000" stopOpacity="0.1" />
                </radialGradient>

                {}
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

                {}
                <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
                    <feDropShadow dx="2" dy="2" stdDeviation="2" floodColor="#000000" floodOpacity="0.3" />
                </filter>
            </defs>
            {}
            <g transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`}>
                <defs>
                    <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
                        <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#e5e7eb" strokeWidth="0.5" />
                    </pattern>
                </defs>
                <rect x={gridMinX} y={gridMinY} width={gridWidth} height={gridHeight} fill="url(#grid)" />
            </g>
            <g transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`} >
                {}
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
                            className={dragState.isDragging ? "" : "transition-all duration-200"}
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
                        const isDragging = dragState.draggedNodeId === commitNode.commit.id;

                        return (
                            <g
                                key={commitNode.commit.id}
                                style={{
                                    cursor: isDragging ? 'grabbing' : 'grab',
                                    filter: isDragging ? 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))' : undefined,
                                    transition: dragState.isDragging ? 'none' : 'all 0.2s ease'
                                }}
                                onMouseDown={(e) => handleNodeMouseDown(e, commitNode.commit.id)}
                                onDoubleClick={(e) => handleNodeDoubleClick(e, commitNode.commit.id)}
                            >
                                <g transform={`translate(${commitNode.x}, ${commitNode.y})`}>
                                    <CommitSvg 
                                        x={0} 
                                        y={0} 
                                        isHead={isHead} 
                                        isCurrentBranch={isCurrentBranch} 
                                        commit={commitNode.commit} 
                                    />
                                </g>
                            </g>
                        )
                    })
                }
            </g>
        </svg>
    )
}

export default CommitGraphSvg
