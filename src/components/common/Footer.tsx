import Link from "next/link";
import React from "react";

function Footer() {
	return (
		<footer className="mt-10 border-t border-[var(--border)] bg-[var(--surface)]">
			<div className="container mx-auto py-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
				<div>
					<p className="text-sm text-[var(--foreground)]/90">© {new Date().getFullYear()} Git Visualized Engine. All rights reserved.</p>
					<p className="text-xs text-[var(--muted)]">An educational tool to learn Git concepts and commands.</p>
				</div>
				<nav aria-label="Footer navigation" className="flex items-center gap-4 text-sm">
					<Link href="/" className="text-[var(--foreground)]/85 hover:text-[var(--foreground)]">Home</Link>
					<Link href="/git-theory" className="text-[var(--foreground)]/85 hover:text-[var(--foreground)]">Git Theory</Link>
					<a href="https://github.com" target="_blank" rel="noreferrer" className="text-[var(--foreground)]/85 hover:text-[var(--foreground)]">GitHub</a>
				</nav>
			</div>
		</footer>
	);
}

export default Footer; 