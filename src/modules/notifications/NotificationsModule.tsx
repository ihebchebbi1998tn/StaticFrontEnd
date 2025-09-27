import { useEffect, useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "@/hooks/use-toast";
import { notifications as notificationsData, type NotificationItem } from "@/data/notifications";

export function NotificationsModule() {
  const [tab, setTab] = useState<"all" | "unread">("all");

  const filtered: NotificationItem[] = useMemo(() => {
    return tab === "all" ? notificationsData : notificationsData.filter((n) => !n.read);
  }, [tab]);

  useEffect(() => {
    document.title = "Notifications | FlowSolution";
    const desc = "View and manage all your notifications in one place.";
    let meta = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "description";
      document.head.appendChild(meta);
    }
    meta.content = desc;

    // Canonical tag
    let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!link) {
      link = document.createElement("link");
      link.rel = "canonical";
      document.head.appendChild(link);
    }
    link.href = window.location.origin + "/dashboard/notifications";
  }, []);

  const markAllAsRead = () => {
    toast({ title: "All caught up", description: "All notifications marked as read." });
  };

  return (
    <main className="container mx-auto max-w-5xl">
      <header className="mb-6">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">Notifications</h1>
        <p className="text-muted-foreground">Stay up to date with your workspace activity.</p>
      </header>

      <section className="mb-4 flex items-center justify-between">
        <Tabs value={tab} onValueChange={(v) => setTab(v as any)}>
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="unread">Unread</TabsTrigger>
          </TabsList>
        </Tabs>
        <Button variant="secondary" onClick={markAllAsRead}>Mark all as read</Button>
      </section>

      <section aria-live="polite">
        <ScrollArea className="max-h-[70vh] rounded-md border border-border bg-card">
          <ul className="divide-y divide-border">
            {filtered.map((n) => (
              <li key={n.id} className="p-4">
                <Card className="border-0 shadow-none bg-transparent">
                  <CardContent className="p-0">
                    <div className="flex items-start gap-3">
                      <span className={`mt-1 inline-block h-2.5 w-2.5 rounded-full ${n.read ? 'bg-muted-foreground/40' : 'bg-primary'}`} aria-hidden />
                      <div className="flex-1">
                        <div className="flex items-center justify-between gap-4">
                          <h2 className="text-sm font-semibold leading-tight">{n.title}</h2>
                          <time className="text-xs text-muted-foreground">{n.time}</time>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{n.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </li>
            ))}
            {filtered.length === 0 && (
              <li className="p-12 text-center text-muted-foreground">You're all caught up. No new notifications.</li>
            )}
          </ul>
        </ScrollArea>
      </section>
    </main>
  );
}
