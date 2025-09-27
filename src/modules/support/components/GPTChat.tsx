import React, { useState } from 'react';
import { Card } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';

// Dummy GPT chat logic (replace with real integration)
const mockGptResponse = (msg: string) => {
  if (msg.toLowerCase().includes('reset password')) return 'To reset your password, go to Settings > Account > Reset Password.';
  if (msg.toLowerCase().includes('contact')) return 'You can contact support by creating a ticket or using this chat.';
  return "I'm here to help! Please describe your issue.";
};

export default function GPTChat() {
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input) return;
    setMessages([...messages, { from: 'user', text: input }]);
    setLoading(true);
    setTimeout(() => {
      setMessages(msgs => [...msgs, { from: 'gpt', text: mockGptResponse(input) }]);
      setLoading(false);
    }, 800);
    setInput('');
  };

  return (
    <div className="max-w-xl mx-auto py-8">
      <Card className="p-6 flex flex-col gap-4">
        <h2 className="text-xl font-bold mb-2">Ask our Assistant</h2>
        <div className="flex flex-col gap-2 min-h-[200px]">
          {messages.map((msg, idx) => (
            <div key={idx} className={`rounded px-3 py-2 ${msg.from === 'user' ? 'bg-primary/10 self-end' : 'bg-secondary/10 self-start'}`}>
              <span className="font-medium">{msg.from === 'user' ? 'You' : 'Assistant'}:</span> {msg.text}
            </div>
          ))}
          {loading && <div className="text-muted-foreground">Assistant is typing...</div>}
        </div>
        <form className="flex gap-2 mt-2" onSubmit={sendMessage}>
          <Input
            placeholder="Type your question..."
            value={input}
            onChange={e => setInput(e.target.value)}
            disabled={loading}
            autoFocus
          />
          <Button type="submit" disabled={loading || !input}>Send</Button>
        </form>
      </Card>
    </div>
  );
}
