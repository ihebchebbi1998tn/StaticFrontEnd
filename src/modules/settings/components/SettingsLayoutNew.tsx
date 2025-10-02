import { useState } from "react";
import { useTranslation } from "react-i18next";
import { 
  Settings, 
  User, 
  Users, 
  Shield, 
  Cog, 
  Heart, 
  FileText, 
  Activity, 
  Wrench, 
  Database,
  Globe,
  LayoutGrid,
  Monitor,
  DollarSign,
  MoreHorizontal,
  Building2,
  Languages,
  Hash,
  Sparkles,
  Palette,
  Lock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { AccountSettings } from "./AccountSettings";
import { UserManagement } from "@/modules/users";
import { RoleManagement } from "./RoleManagement";
import { SkillsManagement } from "@/modules/skills";
import { ApplicationSettings } from "./ApplicationSettings";
import { Preferences } from "./Preferences";
import { ApiDocumentation } from "./ApiDocumentation";
import { SystemLogs } from "./SystemLogs";
import { DatabaseVisualization } from "./DatabaseVisualization";
import { CompanySettings } from "./CompanySettings";
import { ConnectionLogs } from "./ConnectionLogs";

type MainTab = 'general' | 'website' | 'app' | 'system' | 'financial' | 'other';
type SubSection = string;

interface TabConfig {
  id: MainTab;
  label: string;
  icon: any;
  subSections: {
    id: string;
    label: string;
    component: React.ComponentType;
  }[];
}

export function SettingsLayoutNew() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<MainTab>('website');
  const [activeSubSection, setActiveSubSection] = useState<string>('company');

  const tabsConfig: TabConfig[] = [
    {
      id: 'general',
      label: 'General Settings',
      icon: Settings,
      subSections: [
        { id: 'account', label: 'Account', component: AccountSettings },
        { id: 'security', label: 'Security', component: AccountSettings },
        { id: 'notifications', label: 'Notifications', component: Preferences },
      ]
    },
    {
      id: 'website',
      label: 'Website Settings',
      icon: Globe,
      subSections: [
        { id: 'company', label: 'Company Settings', component: CompanySettings },
        { id: 'localization', label: 'Localization', component: Preferences },
        { id: 'prefixes', label: 'Prefixes', component: ApplicationSettings },
        { id: 'preference', label: 'Preference', component: Preferences },
      ]
    },
    {
      id: 'app',
      label: 'App Settings',
      icon: LayoutGrid,
      subSections: [
        { id: 'application', label: 'Application', component: ApplicationSettings },
        { id: 'preferences', label: 'Preferences', component: Preferences },
        { id: 'api', label: 'API & Docs', component: ApiDocumentation },
      ]
    },
    {
      id: 'system',
      label: 'System Settings',
      icon: Monitor,
      subSections: [
        { id: 'users', label: 'Users', component: UserManagement },
        { id: 'roles', label: 'Roles & Permissions', component: RoleManagement },
        { id: 'skills', label: 'Skills', component: SkillsManagement },
        { id: 'database', label: 'Database', component: DatabaseVisualization },
        { id: 'logs', label: 'System Logs', component: SystemLogs },
        { id: 'connections', label: 'Connection Logs', component: ConnectionLogs },
      ]
    },
    {
      id: 'financial',
      label: 'Financial Settings',
      icon: DollarSign,
      subSections: [
        { id: 'billing', label: 'Billing', component: ApplicationSettings },
        { id: 'invoices', label: 'Invoices', component: ApplicationSettings },
        { id: 'payments', label: 'Payment Methods', component: ApplicationSettings },
      ]
    },
    {
      id: 'other',
      label: 'Other Settings',
      icon: MoreHorizontal,
      subSections: [
        { id: 'integrations', label: 'Integrations', component: ApiDocumentation },
        { id: 'advanced', label: 'Advanced', component: ApplicationSettings },
      ]
    }
  ];

  const currentTabConfig = tabsConfig.find(tab => tab.id === activeTab)!;
  const currentSubSection = currentTabConfig.subSections.find(
    section => section.id === activeSubSection
  ) || currentTabConfig.subSections[0];

  const ContentComponent = currentSubSection.component;

  const handleTabChange = (tabId: MainTab) => {
    setActiveTab(tabId);
    const newTabConfig = tabsConfig.find(tab => tab.id === tabId);
    if (newTabConfig && newTabConfig.subSections.length > 0) {
      setActiveSubSection(newTabConfig.subSections[0].id);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header with breadcrumb */}
      <div className="border-b border-border bg-card px-6 py-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Settings</h1>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
            <span>Home</span>
            <span>›</span>
            <span>Settings</span>
          </div>
        </div>
      </div>

      {/* Main tabs navigation */}
      <div className="border-b border-border bg-card px-6">
        <Tabs value={activeTab} onValueChange={(v) => handleTabChange(v as MainTab)} className="w-full">
          <TabsList className="h-auto bg-transparent border-0 p-0 w-full justify-start gap-4">
            {tabsConfig.map((tab) => {
              const Icon = tab.icon;
              return (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  className={cn(
                    "relative px-4 py-3 rounded-none border-b-2 border-transparent",
                    "data-[state=active]:border-primary data-[state=active]:text-primary",
                    "data-[state=active]:bg-transparent data-[state=active]:shadow-none",
                    "hover:text-primary transition-colors"
                  )}
                >
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4" />
                    <span className="font-medium text-sm">{tab.label}</span>
                  </div>
                </TabsTrigger>
              );
            })}
          </TabsList>
        </Tabs>
      </div>

      {/* Content area with sidebar */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left sidebar with sub-navigation */}
        <div className="w-64 border-r border-border bg-card overflow-y-auto">
          <div className="p-4 space-y-1">
            {currentTabConfig.subSections.map((section, index) => (
              <button
                key={section.id}
                onClick={() => setActiveSubSection(section.id)}
                className={cn(
                  "w-full text-left px-4 py-2.5 rounded-lg transition-colors text-sm",
                  activeSubSection === section.id
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-foreground/70 hover:bg-muted hover:text-foreground"
                )}
              >
                {section.label}
              </button>
            ))}
          </div>
        </div>

        {/* Main content area */}
        <div className="flex-1 overflow-auto bg-muted/30">
          <div className="p-6">
            <Card className="shadow-sm border-0">
              <div className="p-6">
                <ContentComponent />
              </div>
            </Card>
          </div>
        </div>

      </div>
    </div>
  );
}
