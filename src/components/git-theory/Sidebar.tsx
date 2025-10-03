import React from "react";
import { LessonMeta } from "@/types/git-theory";

type Props = {
    items: LessonMeta[];
    activeSlug: string;
    onSelect: (slug: string) => void;
};

export default function Sidebar({ items, activeSlug, onSelect }: Props) {
    const [query, setQuery] = React.useState<string>("");
    const filtered = React.useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return items;
        return items.filter((i) => i.title.toLowerCase().includes(q) || i.description.toLowerCase().includes(q));
    }, [items, query]);

    return (
        <aside className="w-full md:w-64 lg:w-72 xl:w-80 flex-shrink-0 md:sticky md:top-6 self-start">
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
                <h2 className="text-lg font-semibold text-gray-900">Git Theory</h2>
                <label htmlFor="git-theory-search" className="sr-only">Search lessons</label>
                <input
                    id="git-theory-search"
                    type="search"
                    placeholder="Search lessons..."
                    className="mt-3 w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-sm text-gray-900 placeholder:text-gray-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    aria-label="Search lessons"
                />
                <nav className="mt-3" aria-label="Table of contents">
                    <ol className="space-y-1 list-decimal ml-5">
                        {filtered.map((item) => {
                            const isActive = item.slug === activeSlug;
                            return (
                                <li key={item.slug}>
                                    <button
                                        onClick={() => onSelect(item.slug)}
                                        className={`text-left w-full px-2 py-1.5 rounded-md transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] ${isActive ? "bg-[var(--primary-50)] text-[var(--primary-700)]" : "hover:bg-gray-50 text-gray-800"
                                            }`}
                                        aria-current={isActive ? "page" : undefined}
                                    >
                                        <span className="font-medium">{item.title}</span>
                                        <p className="text-xs text-gray-600">{item.description}</p>
                                    </button>
                                </li>
                            );
                        })}
                    </ol>
                </nav>
            </div>
        </aside>
    );
} 