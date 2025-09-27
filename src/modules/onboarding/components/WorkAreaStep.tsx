import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { OnboardingData } from "../pages/Onboarding";
import { Briefcase, Store, Stethoscope, GraduationCap, Palette, Code, Users, TrendingUp, ArrowLeft, ArrowRight } from "lucide-react";
import { useTranslation } from 'react-i18next';
interface WorkAreaStepProps {
  data: OnboardingData;
  onNext: (data: Partial<OnboardingData>) => void;
  onBack: () => void;
  isFirst: boolean;
}
const industries = [{
  id: 'technology',
  name: 'Technology & Software',
  description: 'Software companies, tech startups, IT services',
  icon: Code,
  color: 'bg-indigo-500/10 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400'
}, {
  id: 'healthcare',
  name: 'Healthcare & Medical',
  description: 'Hospitals, clinics, medical practices',
  icon: Stethoscope,
  color: 'bg-red-500/10 text-red-600 dark:bg-red-900/20 dark:text-red-400'
}, {
  id: 'finance',
  name: 'Finance & Banking',
  description: 'Banking, insurance, investment services',
  icon: Briefcase,
  color: 'bg-blue-600/10 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
}, {
  id: 'education',
  name: 'Education & Training',
  description: 'Schools, universities, online courses',
  icon: GraduationCap,
  color: 'bg-purple-500/10 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400'
}, {
  id: 'retail',
  name: 'Retail & E-commerce',
  description: 'Online stores, physical retail, marketplace',
  icon: Store,
  color: 'bg-green-500/10 text-green-600 dark:bg-green-900/20 dark:text-green-400'
}, {
  id: 'manufacturing',
  name: 'Manufacturing & Production',
  description: 'Production, industrial, automotive',
  icon: Briefcase,
  color: 'bg-amber-500/10 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400'
}, {
  id: 'construction',
  name: 'Construction & Engineering',
  description: 'Construction, infrastructure, engineering',
  icon: Briefcase,
  color: 'bg-slate-500/10 text-slate-600 dark:bg-slate-800/20 dark:text-slate-400'
}, {
  id: 'consulting',
  name: 'Consulting & Services',
  description: 'Management, strategy, specialized consulting',
  icon: TrendingUp,
  color: 'bg-cyan-500/10 text-cyan-600 dark:bg-cyan-900/20 dark:text-cyan-400'
}, {
  id: 'real-estate',
  name: 'Real Estate',
  description: 'Property management, development, sales',
  icon: Store,
  color: 'bg-emerald-500/10 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400'
}, {
  id: 'transportation',
  name: 'Transportation & Logistics',
  description: 'Shipping, supply chain, delivery services',
  icon: TrendingUp,
  color: 'bg-teal-500/10 text-teal-600 dark:bg-teal-900/20 dark:text-teal-400'
}, {
  id: 'hospitality',
  name: 'Hospitality & Tourism',
  description: 'Hotels, restaurants, travel services',
  icon: Users,
  color: 'bg-rose-500/10 text-rose-600 dark:bg-rose-900/20 dark:text-rose-400'
}, {
  id: 'media',
  name: 'Media & Entertainment',
  description: 'Publishing, broadcasting, content creation',
  icon: Palette,
  color: 'bg-violet-500/10 text-violet-600 dark:bg-violet-900/20 dark:text-violet-400'
}, {
  id: 'nonprofit',
  name: 'Non-profit & NGO',
  description: 'Charities, foundations, social organizations',
  icon: Users,
  color: 'bg-orange-500/10 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400'
}, {
  id: 'government',
  name: 'Government & Public Sector',
  description: 'Government agencies, public services',
  icon: Briefcase,
  color: 'bg-indigo-500/10 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400'
}, {
  id: 'other',
  name: 'Other',
  description: 'Other specialized industries',
  icon: Code,
  color: 'bg-gray-500/10 text-gray-600 dark:bg-gray-800/20 dark:text-gray-400'
}];
export function WorkAreaStep({
  data,
  onNext,
  onBack,
  isFirst
}: WorkAreaStepProps) {
  const { t } = useTranslation();
  const [selectedIndustry, setSelectedIndustry] = useState(data.workArea || '');
  const handleNext = () => {
    if (selectedIndustry) {
      onNext({
        workArea: selectedIndustry
      });
    }
  };
  return <div className="max-w-4xl mx-auto">
      <div className="space-y-8">
        {/* Header */}
        

        {/* Industry Selection */}
        <RadioGroup value={selectedIndustry} onValueChange={setSelectedIndustry} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {industries.map(industry => {
          const IconComponent = industry.icon;
          return <div key={industry.id} className="relative group">
                <RadioGroupItem value={industry.id} id={industry.id} className="peer sr-only" />
                <Label htmlFor={industry.id} className="flex flex-col items-center justify-between p-4 border-2 rounded-xl cursor-pointer transition-all duration-300 hover:border-primary/50 hover:bg-primary/5 hover-lift peer-checked:border-primary peer-checked:bg-primary/10 peer-checked:shadow-medium group-hover:shadow-soft h-[140px]">
                  <div className={`p-2.5 rounded-lg ${industry.color} mb-2 shadow-soft`}>
                    <IconComponent className="h-5 w-5" />
                  </div>
                  <div className="flex-1 flex flex-col justify-center text-center">
                    <span className="font-semibold text-sm">
                      {t(`onboarding.industries.${industry.id}`, industry.name)}
                    </span>
                  </div>
                  
                  <div className={`absolute top-2.5 right-2.5 w-4 h-4 rounded-full border-2 transition-all duration-300 ${selectedIndustry === industry.id ? 'bg-primary border-primary' : 'border-muted-foreground/30'}`}>
                    {selectedIndustry === industry.id && <div className="w-full h-full flex items-center justify-center">
                        <span className="text-white text-xs">✓</span>
                      </div>}
                  </div>
                </Label>
              </div>;
        })}
        </RadioGroup>
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center pt-12">
        <Button variant="outline" onClick={onBack} className="px-8 py-3 h-12 text-base border-2 hover:border-primary/50 hover:bg-primary/5 transition-smooth rounded-xl">
          <ArrowLeft className="h-4 w-4 mr-2" />
          {t('onboarding.back')}
        </Button>
        <Button onClick={handleNext} disabled={!selectedIndustry} className="px-12 py-3 h-12 text-base font-semibold gradient-primary text-white hover-lift shadow-medium hover:shadow-strong transition-smooth rounded-xl disabled:opacity-50 disabled:cursor-not-allowed">
          {t('onboarding.steps.workArea.button')}
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>;
}