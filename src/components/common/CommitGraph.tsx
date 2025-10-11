import { Dot, GitCommitHorizontal, Minus, Plus, RotateCcw, Trash2 } from 'lucide-react'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import CommitGraphSvg from './svgs/CommitGraphSvg'
import { useGitEngine } from '@/lib/react-query/hooks/use-git-engine';

function CommitGraph() {
    const [containerSize, setContainerSize] = useState({ width: 1504, height: 400 });
    const [zoom, setZoom] = useState(1);
    const [pan, setPan] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [pointerOffset, setPointerOffset] = useState({ x: 0, y: 0 });
    const containerRef = useRef<HTMLDivElement>(null);
    
    // Get clearAllData function from git engine
    const { clearAllData } = useGitEngine();

    useEffect(() => {
        const updateSize = () => {
            if (containerRef.current) {
                setContainerSize({ width: containerRef.current.offsetWidth, height: containerRef.current.offsetHeight })
            }
        };

        updateSize();
        window.addEventListener('resize', updateSize);
        return () => window.removeEventListener('resize', updateSize);

    }, [containerRef])

    const handleWheel = useCallback((e: WheelEvent) => {
        e.preventDefault();
        e.stopPropagation();

        const delta = e.deltaY > 0 ? 0.9 : 1.1;
        const newZoom = Math.max(0.1, Math.min(3, zoom * delta));

        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        const pointerOffsetX = mouseX - pan.x;
        const pointerOffsetY = mouseY - pan.y;

        setPan({
            x: mouseX - pointerOffsetX * (newZoom / zoom),
            y: mouseY - pointerOffsetY * (newZoom / zoom)
        });

        setZoom(newZoom);
    }, [zoom, pan]);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        container.addEventListener('wheel', handleWheel, { passive: false });

        return () => {
            container.removeEventListener('wheel', handleWheel);
        };
    }, [handleWheel]);

    const handleMouseDown = useCallback((e: React.MouseEvent) => {
        if (e.button === 0) {
            e.preventDefault();
            e.stopPropagation();
            setIsDragging(true);
            setPointerOffset({ x: e.clientX - pan.x, y: e.clientY - pan.y });
        }
    }, [pan]);

    const handleMouseMove = useCallback((e: React.MouseEvent) => {
        if (isDragging) {
            e.preventDefault();
            e.stopPropagation();
            setPan({
                x: e.clientX - pointerOffset.x,
                y: e.clientY - pointerOffset.y,
            });
        }
    }, [isDragging, pointerOffset]);

    const handleMouseUp = useCallback((e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    }, []);

    const handleReset = () => {
        if (!containerRef.current) return;

        const centerX = containerSize.width / 2;
        const centerY = containerSize.height / 2;
        const newZoom = 1;

        setPan(prevPan => ({
            x: centerX - (centerX - prevPan.x) * (newZoom / zoom),
            y: centerY - (centerY - prevPan.y) * (newZoom / zoom)
        }));

        setZoom(newZoom);
    };

    const handlePlus = () => {
        if (!containerRef.current) return;

        const centerX = containerSize.width / 2;
        const centerY = containerSize.height / 2;

        setZoom(prevZoom => {
            const newZoom = Math.min(prevZoom * 1.1, 3);

            setPan(prevPan => ({
                x: centerX - (centerX - prevPan.x) * (newZoom / prevZoom),
                y: centerY - (centerY - prevPan.y) * (newZoom / prevZoom)
            }));

            return newZoom;
        });
    };

    const handleMinus = () => {
        if (!containerRef.current) return;

        const centerX = containerSize.width / 2;
        const centerY = containerSize.height / 2;

        setZoom(prevZoom => {
            const newZoom = Math.max(prevZoom * 0.9, 0.1);

            setPan(prevPan => ({
                x: centerX - (centerX - prevPan.x) * (newZoom / prevZoom),
                y: centerY - (centerY - prevPan.y) * (newZoom / prevZoom)
            }));

            return newZoom;
        });
    };

    const handleClearPositions = () => {
        if ((window as any).clearCommitGraphPositions) {
            (window as any).clearCommitGraphPositions();
        }
    };

    const handleClearAllData = () => {
        if (confirm('Are you sure you want to clear all data? This will reset the terminal, commit graph, and all saved positions.')) {
            clearAllData();
            // Also clear commit graph positions
            if ((window as any).clearCommitGraphPositions) {
                (window as any).clearCommitGraphPositions();
            }
        }
    };

    return (
        <div className="rounded-lg shadow-sm border border-[var(--border)] bg-[var(--surface)]">
            <div className="px-4 py-3 border-b border-[var(--border)] bg-[color-mix(in_srgb,var(--surface),#000_4%)] ">
                <span className="flex items-center gap-2 text-foreground">
                    <GitCommitHorizontal />
                    <h1 className="font-bold text-xl">Commit Graph</h1>
                </span>
                <ul className="flex items-center text-[14px] text-muted-foreground">
                    <li>Scroll to zoom</li>
                    <li><Dot /></li>
                    <li>Drag to pan</li>
                    <li><Dot /></li>
                    <li>Drag commits to reposition</li>
                    <li><Dot /></li>
                    <li>State persists on reload</li>
                </ul>
            </div>
            <div className="p-4">
                <div ref={containerRef} className="min-h-[400px] border border-[var(--border)] rounded-lg relative bg-[color-mix(in_srgb,var(--surface),#000_4%)] shadow-inner">
                    {/* Introduction */}
                    <ul className="absolute z-10 flex items-center text-[12px] border px-2 rounded-sm border-[var(--border)] bg-background/85 backdrop-blur-sm top-2 left-2 text-muted-foreground ">
                        <li>Scroll to zoom</li>
                        <li><Dot /></li>
                        <li>Drag to pan</li>
                    </ul>
                    {/* Controls */}
                    <div className="absolute z-10 flex items-center top-2 right-2 gap-2">
                        <button className="bg-background border border-[var(--border)] rounded-sm cursor-pointer p-1 text-muted-foreground text-sm hover:bg-muted" onClick={handleMinus}><Minus size={16} /></button>
                        <button className="bg-background border border-[var(--border)] rounded-sm cursor-pointer p-1 text-muted-foreground text-sm hover:bg-muted" onClick={handlePlus}><Plus size={16} /></button>
                        <button className="bg-background border border-[var(--border)] rounded-sm cursor-pointer p-1 text-muted-foreground text-sm hover:bg-muted" onClick={handleReset}>Reset</button>
                        <button className="bg-background border border-[var(--border)] rounded-sm cursor-pointer p-1 text-muted-foreground text-sm hover:bg-muted" onClick={handleClearPositions} title="Reset commit positions">
                            <RotateCcw size={16} />
                        </button>
                        <button className="bg-background border border-[var(--border)] rounded-sm cursor-pointer p-1 text-muted-foreground text-sm hover:bg-muted hover:text-red-500" onClick={handleClearAllData} title="Clear all data (terminal + graph)">
                            <Trash2 size={16} />
                        </button>
                        <input disabled className="bg-background border border-[var(--border)] rounded-sm p-1 text-muted-foreground text-sm outline-none max-w-12" value={`${Math.floor(zoom * 100)}%`} />
                    </div>
                    {/* SVG Component */}
                    <CommitGraphSvg 
                        width={containerSize.width} 
                        height={containerSize.height} 
                        pan={pan} 
                        zoom={zoom}
                        onMouseDown={handleMouseDown}
                        onMouseMove={handleMouseMove}
                        onMouseUp={handleMouseUp}
                        onMouseLeave={handleMouseUp} 
                    />
                </div>
            </div>
        </div>
    )
}

export default CommitGraph