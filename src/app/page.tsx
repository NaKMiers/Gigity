'use client';

import { useChat } from '@ai-sdk/react';
import { useState } from 'react';

export default function Chat() {
  const [input, setInput] = useState('');
  const { messages, sendMessage, status } = useChat({});
  console.log(messages);
  const isLoading = status === 'submitted' || status === 'streaming';

  return (
    <div className="flex flex-col w-full max-w-4xl py-24 mx-auto stretch px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">🎬 AI Video Marketing Generator</h1>
      <p className="text-center text-gray-600 dark:text-gray-400 mb-8 -mt-6">
        Generate complete video production plan from business description
      </p>
      
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
            <div className="whitespace-pre-wrap space-y-2">
              {message.parts.map((part, i) => {
                switch (part.type) {
                  case 'text':
                    // Render markdown-like text with better formatting
                    const renderFormattedText = (text: string) => {
                      const lines = text.split('\n');
                      return lines.map((line, idx) => {
                        // Headers
                        if (line.startsWith('# ')) {
                          return <h1 key={idx} className="text-2xl font-bold mt-6 mb-3">{line.slice(2)}</h1>;
                        }
                        if (line.startsWith('## ')) {
                          return <h2 key={idx} className="text-xl font-bold mt-5 mb-2 text-blue-600 dark:text-blue-400">{line.slice(3)}</h2>;
                        }
                        if (line.startsWith('### ')) {
                          return <h3 key={idx} className="text-lg font-semibold mt-4 mb-2 text-purple-600 dark:text-purple-400">{line.slice(4)}</h3>;
                        }
                        // Bold text
                        if (line.startsWith('**') && line.endsWith('**')) {
                          return <p key={idx} className="font-semibold my-1">{line.slice(2, -2)}</p>;
                        }
                        // List items
                        if (line.startsWith('- ') || line.startsWith('• ')) {
                          return <li key={idx} className="ml-4 my-1">{line.slice(2)}</li>;
                        }
                        // Numbered list
                        if (/^\d+\./.test(line)) {
                          return <li key={idx} className="ml-4 my-1">{line}</li>;
                        }
                        // Horizontal rule
                        if (line === '---') {
                          return <hr key={idx} className="my-4 border-gray-300 dark:border-gray-600" />;
                        }
                        // Code/prompt blocks (lines with quotes)
                        if (line.includes('Image Prompt:') || line.includes('Prompt:')) {
                          return <p key={idx} className="text-sm bg-gray-100 dark:bg-gray-700 p-2 rounded my-1 font-mono">{line}</p>;
                        }
                        // Regular text
                        if (line.trim()) {
                          return <p key={idx} className="my-1">{line}</p>;
                        }
                        return <br key={idx} />;
                      });
                    };
                    
                    return (
                      <div key={`${message.id}-${i}`} className="text-gray-800 dark:text-gray-200 text-sm leading-relaxed">
                        {renderFormattedText(part.text)}
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
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              {status === 'submitted' ? '📝 Generating scripts...' : '🎬 Creating video plan...'}
            </div>
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
            placeholder="Nhập thông tin về doanh nghiệp (tên, ngành nghề, sản phẩm, khách hàng mục tiêu...)..."
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