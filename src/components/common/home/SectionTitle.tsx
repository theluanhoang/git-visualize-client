import React from 'react'

interface SectionTitleParams {
    title: string;
    description: string;
}

function SectionTitle({ title, description } : SectionTitleParams) {
    return (
        <div>
            <h2 id="system-title" className="text-xl font-semibold text-[var(--foreground)] text-center">{title}</h2>
            <p className="text-[var(--foreground)] text-center mt-2">{description}</p>
        </div>
    )
}

export default SectionTitle