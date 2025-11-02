import React, { useEffect, useRef } from 'react'
import { useForm } from 'react-hook-form';
import { useGitEngine } from '@/lib/react-query/hooks/use-git-engine';

function Terminal({ practiceId }: { practiceId?: string }) {
    const outputRef = useRef<HTMLDivElement>(null);
    const { responses, runCommand } = useGitEngine(practiceId);

    const { register, handleSubmit, reset } = useForm<{ command: string }>();

    const onSubmit = async ({ command }: { command: string }) => {
        if (command.trim()) {
            await runCommand(command.trim());
            reset({ command: "" });
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSubmit(onSubmit)();
        }
    };

    useEffect(() => {
        if (outputRef.current) {
            outputRef.current.scrollTop = outputRef.current.scrollHeight;
        }
    }, [responses]);

    return (
        <div className="h-full w-full bg-gray-900 text-green-400 font-mono rounded-lg flex overflow-hidden flex-col h-[300px]">
            {}
            <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700">
                <div className="text-sm text-gray-300">
                    Git Terminal
                </div>
                <div className="flex space-x-1">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
            </div>

            {}
            <div
                ref={outputRef}
                className="flex-1 overflow-y-auto px-4 py-2 space-y-1 terminal-scrollbar"
                style={{
                    maxHeight: 'calc(100%)',
                    scrollbarWidth: 'thin',
                    scrollbarColor: '#4a5568 #2d3748'
                }}
            >
                {responses.map((response, index) => (
                    <div key={index} className="whitespace-pre-wrap text-sm">
                        {response.command && <div className="text-green-400">$ {response.command}</div>}
                        <div style={{ color: response.success ? 'inherit' : 'red' }}>
                            {response.output}
                        </div>
                    </div>
                ))}
            </div>

            {}
            <div className="px-4 py-2 bg-gray-800 border-t border-gray-700">
                <form onKeyDown={handleKeyDown} className="flex items-center">
                    <span className="text-green-400 mr-2 text-sm">$</span>
                    <input
                        type="text"
                        className="flex-1 bg-transparent text-green-400 outline-none text-sm"
                        placeholder="Enter git command..."
                        autoFocus
                        autoComplete="off"
                        {...register("command")}
                    />
                </form>
            </div>

            {}
            <style jsx>
                {`
                  .terminal-scrollbar::-webkit-scrollbar {
                    width: 8px;
                  }
                  
                  .terminal-scrollbar::-webkit-scrollbar-track {
                    background: #2d3748;
                    border-radius: 4px;
                  }
                  
                  .terminal-scrollbar::-webkit-scrollbar-thumb {
                    background: #4a5568;
                    border-radius: 4px;
                    border: 1px solid #2d3748;
                  }
                  
                  .terminal-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #718096;
                  }
                  
                  .terminal-scrollbar::-webkit-scrollbar-thumb:active {
                    background: #a0aec0;
                  }
                  
                  .terminal-scrollbar::-webkit-scrollbar-corner {
                    background: #2d3748;
                  }
              `}
            </style>
        </div>
    )
}

export default Terminal