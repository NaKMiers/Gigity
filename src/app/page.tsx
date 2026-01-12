'use client';

import { useChat } from '@ai-sdk/react';
import { useState } from 'react';

export default function Chat() {
  const [input, setInput] = useState('');
  const { messages, sendMessage, status } = useChat();
  
  const isLoading = status === 'submitted' || status === 'streaming';

  return (
    <div className="flex flex-col w-full max-w-4xl py-24 mx-auto stretch px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">Business Intelligence Research</h1>
      
      <div className="flex-1 overflow-y-auto mb-32 space-y-4">
        {messages.map(message => (
          <div 
            key={message.id} 
            className={`p-4 rounded-lg ${
              message.role === 'user' 
                ? 'bg-blue-100 dark:bg-blue-900 ml-auto max-w-[80%]' 
                : 'bg-gray-100 dark:bg-gray-800 mr-auto max-w-[90%]'
            }`}
          >
            <div className="font-semibold mb-2">
              {message.role === 'user' ? '👤 User' : '🤖 AI Assistant'}
            </div>
            <div className="whitespace-pre-wrap">
              {message.parts.map((part, i) => {
                switch (part.type) {
                  case 'text':
                    return (
                      <div key={`${message.id}-${i}`} className="prose dark:prose-invert max-w-none">
                        {part.text}
                      </div>
                    );
                  default:
                    return null;
                }
              })}
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg mr-auto max-w-[90%]">
            <div className="font-semibold mb-2">🤖 AI Assistant</div>
            <div className="flex items-center space-x-2">
              <div className="animate-bounce">●</div>
              <div className="animate-bounce delay-100">●</div>
              <div className="animate-bounce delay-200">●</div>
            </div>
          </div>
        )}
      </div>

      <form
        onSubmit={e => {
          e.preventDefault();
          if (input.trim()) {
            sendMessage({ text: input });
            setInput('');
          }
        }}
        className="fixed bottom-0 left-0 right-0 bg-white dark:bg-zinc-900 border-t border-zinc-300 dark:border-zinc-800 p-4"
      >
        <div className="max-w-4xl mx-auto flex gap-2">
          <input
            className="flex-1 p-3 border border-zinc-300 dark:border-zinc-700 dark:bg-zinc-800 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={input}
            placeholder="Ask about companies, industries, or market research..."
            onChange={e => setInput(e.currentTarget.value)}
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? 'Sending...' : 'Send'}
          </button>
        </div>
      </form>
    </div>
  );
}