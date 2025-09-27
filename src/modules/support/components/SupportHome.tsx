import React from 'react';
import { Card } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { useNavigate } from 'react-router-dom';

const supportCategories = [
  { title: 'Getting Started', articles: 24, lastUpdated: '2025-08-01', icon: '🚀' },
  { title: 'Account & Profile Management', articles: 13, lastUpdated: '2025-08-10', icon: '👤' },
  { title: 'Funding your Account', articles: 10, lastUpdated: '2025-08-12', icon: '💳' },
  { title: 'Security', articles: 14, lastUpdated: '2025-08-09', icon: '🔒' },
  { title: 'Messaging', articles: 4, lastUpdated: '2025-08-10', icon: '💬' },
  { title: 'Other', articles: 14, lastUpdated: '2025-08-15', icon: '❓' },
];

const popularArticles = [
  { title: 'How to reset your password', category: 'Account & Profile Management', likes: 356 },
  { title: 'How to enable dark mode', category: 'Getting Started', likes: 333 },
  { title: 'How to secure your account', category: 'Security', likes: 308 },
  { title: 'How to fund your account', category: 'Funding your Account', likes: 280 },
];

export default function SupportHome() {
  const navigate = useNavigate();
  return (
    <div className="w-full min-h-screen bg-background text-foreground flex flex-col">
      {/* Header */}
      <header className="w-full bg-gradient-to-br from-primary/90 to-secondary/80 py-8 px-4 md:px-0 flex flex-col items-center border-b border-border">
        <div className="w-full max-w-5xl flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-1">Support Center</h1>
            <nav className="text-xs text-muted-foreground flex gap-2 items-center">
              <span className="cursor-pointer hover:underline" onClick={() => navigate('/dashboard')}>Dashboard</span>
              <span>/</span>
              <span className="font-semibold">Support</span>
            </nav>
          </div>
          <Button variant="outline" onClick={() => navigate('/dashboard/help/tickets')}>Contact Support</Button>
        </div>
        <div className="w-full max-w-2xl mt-8 flex flex-col items-center">
          {/* AI Prompt Style Search */}
          <form className="w-full flex items-end gap-2 bg-background/80 border border-border rounded-xl shadow-sm px-4 py-3" onSubmit={e => { e.preventDefault(); navigate('/dashboard/help/chat'); }}>
            <div className="flex-1 flex items-center">
              <span className="mr-2 text-xl">💬</span>
              <input
                className="flex-1 bg-transparent outline-none border-none text-base placeholder:text-muted-foreground"
                placeholder="Ask anything, e.g. 'How do I reset my password?'"
                style={{ minHeight: '2.5rem' }}
                autoFocus
              />
            </div>
            <Button type="submit" className="rounded-full h-10 w-10 p-0 flex items-center justify-center" variant="default" title="Ask">
              <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M22 2L11 13"></path><path d="M22 2L15 22L11 13L2 9L22 2Z"></path></svg>
            </Button>
          </form>
          <div className="w-full mt-3 flex flex-wrap gap-2 text-xs text-muted-foreground justify-start">
            <span className="bg-muted px-3 py-1 rounded-full cursor-pointer hover:bg-accent transition" onClick={() => navigate('/dashboard/help/faq')}>Reset password</span>
            <span className="bg-muted px-3 py-1 rounded-full cursor-pointer hover:bg-accent transition" onClick={() => navigate('/dashboard/help/faq')}>Account security</span>
            <span className="bg-muted px-3 py-1 rounded-full cursor-pointer hover:bg-accent transition" onClick={() => navigate('/dashboard/help/tickets')}>Create ticket</span>
            <span className="bg-muted px-3 py-1 rounded-full cursor-pointer hover:bg-accent transition" onClick={() => navigate('/dashboard/help/chat')}>Chat with assistant</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-5xl mx-auto py-10 px-4 md:px-0">
        {/* Quick Links */}
        <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 justify-center mb-12 w-full">
          <Card
            className="flex flex-col items-center justify-center min-h-[110px] h-full w-full cursor-pointer hover:shadow-lg transition text-center py-4"
            onClick={() => navigate('/dashboard/help/faq')}
          >
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-2">
              <span className="text-2xl">📖</span>
            </div>
            <div className="font-semibold text-base">Frequently Asked Questions</div>
            <div className="text-xs text-muted-foreground mt-1">Find answers to common questions</div>
          </Card>
          <Card
            className="flex flex-col items-center justify-center min-h-[110px] h-full w-full cursor-pointer hover:shadow-lg transition text-center py-4"
            onClick={() => navigate('/dashboard/help/tickets')}
          >
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-2">
              <span className="text-2xl">🎫</span>
            </div>
            <div className="font-semibold text-base">My Support Tickets</div>
            <div className="text-xs text-muted-foreground mt-1">View or create support requests</div>
          </Card>
          <Card
            className="flex flex-col items-center justify-center min-h-[110px] h-full w-full cursor-pointer hover:shadow-lg transition text-center py-4"
            onClick={() => navigate('/dashboard/help/chat')}
          >
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-2">
              <span className="text-2xl">🤖</span>
            </div>
            <div className="font-semibold text-base">Ask our Assistant</div>
            <div className="text-xs text-muted-foreground mt-1">Chat with our AI support assistant</div>
          </Card>
        </section>

        {/* Categories */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Support Categories</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {supportCategories.map(cat => (
              <Card key={cat.title} className="p-5 flex flex-col gap-2 cursor-pointer hover:shadow-md transition" onClick={() => navigate('/dashboard/help/faq')}>
                <div className="flex items-center gap-2">
                  <span className="text-3xl">{cat.icon}</span>
                  <span className="font-semibold text-lg">{cat.title}</span>
                </div>
                <div className="text-xs text-muted-foreground">{cat.articles} Articles • Last Updated: {cat.lastUpdated}</div>
                <Button variant="link" size="sm" className="self-start px-0 mt-2" onClick={e => { e.stopPropagation(); navigate('/dashboard/help/faq'); }}>Browse</Button>
              </Card>
            ))}
          </div>
        </section>

        {/* Popular Articles */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Popular Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {popularArticles.map(a => (
              <Card key={a.title} className="p-4 flex items-center gap-4">
                <div className="flex-1">
                  <div className="font-medium text-base">{a.title}</div>
                  <div className="text-xs text-muted-foreground">{a.category}</div>
                </div>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <span>👍</span>
                  <span className="font-semibold">{a.likes}</span>
                </div>
                <Button variant="link" size="sm" className="px-0" onClick={() => navigate('/dashboard/help/faq')}>Read</Button>
              </Card>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-border py-6 mt-8 bg-muted/30 text-xs text-muted-foreground flex flex-col md:flex-row items-center justify-between px-4 md:px-0">
        <div className="mb-2 md:mb-0">&copy; {new Date().getFullYear()} FlowSolutions Support. All rights reserved.</div>
        <div className="flex gap-4">
          <span className="cursor-pointer hover:underline" onClick={() => navigate('/dashboard/help/tickets')}>Contact Support</span>
          <span className="cursor-pointer hover:underline" onClick={() => navigate('/dashboard/help/faq')}>FAQ</span>
          <span className="cursor-pointer hover:underline" onClick={() => navigate('/dashboard/help/chat')}>Chat Assistant</span>
        </div>
      </footer>
    </div>
  );
}
