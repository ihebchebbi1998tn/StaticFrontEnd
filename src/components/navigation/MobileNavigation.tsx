import { 
  Users, 
  GitBranch, 
  MessageSquare, 
  CheckSquare, 
  Zap, 
  BarChart3,
  Home,
  Settings,
  Calendar,
  Languages
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const navigationItems = [
  { 
    title: "dashboard", 
    url: "/dashboard", 
    icon: Home,
    description: "Overview & insights",
    color: "from-blue-500 to-blue-600"
  },
  { 
    title: "contacts", 
    url: "/dashboard/contacts", 
    icon: Users,
    description: "Customer database",
    color: "from-green-500 to-green-600"
  },
  { 
    title: "deals", 
    url: "/dashboard/deals", 
    icon: GitBranch,
    description: "Pipeline management",
    color: "from-purple-500 to-purple-600"
  },
  { 
    title: "communication", 
    url: "/dashboard/communication", 
    icon: MessageSquare,
    description: "Email & call logs",
    color: "from-orange-500 to-orange-600"
  },
  { 
    title: "tasks", 
    url: "/dashboard/tasks", 
    icon: CheckSquare,
    description: "Tasks management",
    color: "from-teal-500 to-teal-600"
  },
  { 
    title: "automation", 
    url: "/dashboard/automation", 
    icon: Zap,
    description: "Workflow builder",
    color: "from-yellow-500 to-yellow-600"
  },
  { 
    title: "calendar", 
    url: "/dashboard/calendar", 
    icon: Calendar,
    description: "Events & scheduling",
    color: "from-red-500 to-red-600"
  },
  {
    title: "analytics", 
    url: "/dashboard/analytics", 
    icon: BarChart3,
    description: "Reports & insights",
    color: "from-indigo-500 to-indigo-600"
  },
  {
    title: "settings",
    url: "/dashboard/settings",
    icon: Settings,
    description: "System preferences",
    color: "from-gray-500 to-gray-600"
  }
];

export function MobileNavigation() {
  const location = useLocation();
  const { t, i18n } = useTranslation();
  const resolveTitle = (key: string) => {
    if (!key) return key;

    const isLikelyRaw = (val: any) => {
      if (typeof val !== 'string') return false;
      const v = val.trim();
      return v === key || v === `${key}.title`;
    };

    const direct = t(key);
    if (typeof direct === 'string' && direct.trim() !== '' && !isLikelyRaw(direct)) return direct;
    if (typeof direct === 'object' && direct && 'title' in direct) {
      // @ts-ignore
      const maybe = direct.title;
      if (typeof maybe === 'string' && maybe.trim() !== '' && !isLikelyRaw(maybe)) return maybe;
    }

    if (key.endsWith('.title')) {
      const base = key.replace(/\.title$/, '');
      const nested = t(`${base}.title`);
      if (typeof nested === 'string' && nested.trim() !== '' && !isLikelyRaw(nested)) return nested;
      const alt = t(base);
      if (typeof alt === 'string' && alt.trim() !== '' && !isLikelyRaw(alt)) return alt;
      if (typeof alt === 'object' && alt && 'title' in alt) {
        // @ts-ignore
        const maybe = alt.title;
        if (typeof maybe === 'string' && maybe.trim() !== '' && !isLikelyRaw(maybe)) return maybe;
      }
    }

    try {
      const nested = t(`${key}.title`);
      if (typeof nested === 'string' && nested.trim() !== '' && !isLikelyRaw(nested)) return nested;
      if (typeof nested === 'object' && nested && 'title' in nested) {
        // @ts-ignore
        const maybe = nested.title;
        if (typeof maybe === 'string' && maybe.trim() !== '' && !isLikelyRaw(maybe)) return maybe;
      }
    } catch (_) {}

    return key;
  };
  const resolveDescription = (key: string, fallback?: string) => {
    if (!key) return fallback ?? '';
    try {
      const nested = t(`${key}.description`);
      if (typeof nested === 'string' && nested.trim() !== '') return nested;
    } catch (_) {}
    const direct = t(key);
    if (typeof direct === 'object' && direct && 'description' in direct) {
      // @ts-ignore
      const maybe = direct.description;
      if (typeof maybe === 'string' && maybe.trim() !== '') return maybe;
    }
    return fallback ?? '';
  };
  const currentPath = location.pathname;

  const isActive = (path: string) => currentPath === path;

  return (
    <div className="p-4">
      {/* Language Selector */}
      <div className="flex justify-center mb-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              <Languages className="h-4 w-4" />
              {i18n.language === 'fr' ? '🇫🇷 Français' : '🇺🇸 English'}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="center">
            <DropdownMenuItem 
              onClick={() => i18n.changeLanguage('en')}
              className="gap-2"
            >
              🇺🇸 English
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => i18n.changeLanguage('fr')}
              className="gap-2"
            >
              🇫🇷 Français
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {navigationItems.map((item) => (
          <NavLink key={item.title} to={item.url} end={item.url === "/dashboard"}>
            <Card className={`hover-lift transition-all duration-300 border-0 shadow-medium overflow-hidden ${
              isActive(item.url) ? 'ring-2 ring-primary ring-offset-2' : ''
            }`}>
              <CardContent className="p-6">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-4 shadow-lg`}>
                  <item.icon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground capitalize mb-1">
                    {resolveTitle(item.title)}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-tight">
                    {resolveDescription(item.title, item.description)}
                  </p>
                </div>
              </CardContent>
            </Card>
          </NavLink>
        ))}
      </div>
    </div>
  );
}