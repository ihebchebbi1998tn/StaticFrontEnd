import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Module locale imports
import fieldEn from '../modules/field/locale/en.json';
import fieldFr from '../modules/field/locale/fr.json';
import jobDetailEn from '../modules/field/dispatches/locales/job-detail/en.json';
import jobDetailFr from '../modules/field/dispatches/locales/job-detail/fr.json';
import dispatchesEn from '../modules/field/dispatches/locales/en.json';
import dispatchesFr from '../modules/field/dispatches/locales/fr.json';
import attachmentsEn from '../modules/field/dispatches/locales/attachments/en.json';
import attachmentsFr from '../modules/field/dispatches/locales/attachments/fr.json';
import notesEn from '../modules/field/dispatches/locales/notes/en.json';
import notesFr from '../modules/field/dispatches/locales/notes/fr.json';
import timeBookingEn from '../modules/field/dispatches/locales/time-booking/en.json';
import timeBookingFr from '../modules/field/dispatches/locales/time-booking/fr.json';
import technicianEn from '../modules/field/dispatches/locales/technician/en.json';
import technicianFr from '../modules/field/dispatches/locales/technician/fr.json';
import expenseBookingEn from '../modules/field/dispatches/locales/expense-booking/en.json';
import expenseBookingFr from '../modules/field/dispatches/locales/expense-booking/fr.json';
import dispatchCommonEn from '../modules/field/dispatches/locales/common/en.json';
import dispatchCommonFr from '../modules/field/dispatches/locales/common/fr.json';
import timeExpensesEn from '../modules/field/time-expenses/locales/time-expenses/en.json';
import timeExpensesFr from '../modules/field/time-expenses/locales/time-expenses/fr.json';
import serviceOrdersEn from '../modules/field/service-orders/locale/en.json';
import serviceOrdersFr from '../modules/field/service-orders/locale/fr.json';
import installationsEn from '../modules/field/installations/locale/en.json';
import installationsFr from '../modules/field/installations/locale/fr.json';
import contactsEn from '../modules/contacts/locale/en.json';
import contactsFr from '../modules/contacts/locale/fr.json';
import salesEn from '../modules/sales/locale/en.json';
import salesFr from '../modules/sales/locale/fr.json';
import offersEn from '../modules/offers/locale/en.json';
import offersFr from '../modules/offers/locale/fr.json';
import offersListEn from '../modules/offers/locale/list.en.json';
import offersDetailEn from '../modules/offers/locale/detail.en.json';
import offersAddEn from '../modules/offers/locale/add.en.json';
import lookupsEn from '../modules/lookups/locale/en.json';
import lookupsFr from '../modules/lookups/locale/fr.json';
import documentsEn from '../modules/documents/locale/en.json';
import documentsFr from '../modules/documents/locale/fr.json';
import documentsListEn from '../modules/documents/locale/list.en.json';
import documentsPreviewEn from '../modules/documents/locale/preview.en.json';
import documentsUploadEn from '../modules/documents/locale/upload.en.json';
import dashboardEn from '../modules/dashboard/locale/en.json';
import dashboardFr from '../modules/dashboard/locale/fr.json';
import workflowEn from '../modules/workflow/locale/en.json';
import workflowFr from '../modules/workflow/locale/fr.json';
import { en as dispatcherEn } from '../modules/dispatcher/locales/en/index';
import { fr as dispatcherFr } from '../modules/dispatcher/locales/fr/index';
import schedulingEnDefault from '../modules/scheduling/locales/en';
import { en as schedulingEnNested } from '../modules/scheduling/locales/en/index';
const __logs = import.meta.glob('../modules/field/dispatches/locales/logs/*.json', { eager: true }) as Record<string, any>;
const logsEn = __logs['../modules/field/dispatches/locales/logs/en.json']?.default ?? {};
const logsFr = __logs['../modules/field/dispatches/locales/logs/fr.json']?.default ?? {};
// Small helpers to reduce repetition
const isObj = (v: any) => v && typeof v === 'object' && !Array.isArray(v);
const dottedFromKey = (key: string, mod: any) => {
  const src = (mod && mod[key]) ? mod[key] : {};
  const out: Record<string, any> = {};
  Object.keys(src).forEach(k => { out[`${key}.${k}`] = src[k]; });
  return out;
};
const flattenNonObjects = (sources: any[]) => {
  const out: Record<string, any> = {};
  sources.forEach(src => {
    if (!src || !isObj(src)) return;
    Object.keys(src).forEach(k => { const v = src[k]; if (v !== null && typeof v === 'object') return; out[k] = v; });
  });
  return out;
};
const dottedFromMergedExcludingRoot = (merged: any, rootName: string) => {
  const out: Record<string, any> = {};
  if (!isObj(merged)) return out;
  Object.keys(merged).forEach(k => { if (k === rootName) return; out[`${rootName}.${k}`] = merged[k]; });
  return out;
};
const handleDispatcher = (mod: any) => {
  const out: Record<string, any> = {};
  const nested = mod || {};
  if (nested.dispatcher && typeof nested.dispatcher === 'object') {
    Object.keys(nested.dispatcher).forEach(k => { out[`dispatcher.${k}`] = nested.dispatcher[k]; });
    if (nested.dispatcher.title && typeof nested.dispatcher.title === 'string') out['dispatcher'] = nested.dispatcher.title;
  } else {
    Object.assign(out, nested);
  }
  return out;
};

// Helper merges: build dotted keys where needed to avoid exposing nested objects
const enTranslation = {
  // Authentication (core)
  auth: {
    welcome: 'Welcome to FlowSolution',
    signIn: 'Sign In',
    signOut: 'Sign Out',
    signUp: 'Sign up',
    email: 'Email',
    email_placeholder: 'Enter your email',
    password: 'Password',
    password_placeholder: 'Enter your password',
    confirm_password: 'Confirm password',
    confirm_password_placeholder: 'Confirm your password',
    rememberMe: 'Remember me',
    forgotPassword: 'Forgot password?',
    noAccount: "Don't have an account?",
    createAccount: 'Create account',
    haveAccount: 'Already have an account?',
    creating_account: 'Creating account...',
    signing_in: 'Signing in...',
    continue_with: 'Or continue with',
    continue_with_google: 'Continue with Google',
    continue_with_microsoft: 'Continue with Microsoft',
    developer_mode: 'Developer Mode',
  },

  // Footer / common
  footer: { terms: 'Terms', privacy: 'Privacy', faq: 'FAQ', all_rights_reserved: 'All rights reserved.' },
  loading: 'Loading...', save: 'Save', cancel: 'Cancel', delete: 'Delete', edit: 'Edit', add: 'Add',
  search: 'Search', filter: 'Filter', lightMode: 'Light', darkMode: 'Dark', back: 'Back',

  // Core titles
  contacts: 'Contacts', companies: 'Companies', deals: 'Deals', tasks: 'Tasks', articles: 'Articles', dashboard: 'Dashboard', calendar: 'Calendar',
  jobs: 'Jobs', technicians: 'Technicians', customers: 'Customers', inventory: 'Inventory', installations: 'Installations',
  settings: 'Settings', profile: 'Profile', preferences: 'Preferences', language: 'Language',
  communication: 'Communication', automation: 'Automation', analytics: 'Analytics',

  // Merge module pieces
  ...dashboardEn,
  ...dottedFromKey('contacts', contactsEn),
  field: (fieldEn as any).field,
  service_orders: serviceOrdersEn,
  // Add installations translations with dotted notation for detailed translations
  ...installationsEn,
  ...salesEn,

  // Offers: keep scalar keys flattened and also expose dotted offers.* for the rest
  ...flattenNonObjects([offersEn || {}, offersListEn || {}, offersDetailEn || {}, offersAddEn || {}]),
  ...dottedFromMergedExcludingRoot({ ...(offersEn as any || {}), ...(offersListEn as any || {}), ...(offersDetailEn as any || {}), ...(offersAddEn as any || {}) }, 'offers'),

  ...(lookupsEn && (lookupsEn as any).lookups ? (lookupsEn as any).lookups : {}),
  lookups: (lookupsEn && (lookupsEn as any).lookups && (lookupsEn as any).lookups.title) ? (lookupsEn as any).lookups.title : 'Lookups',

  // Documents: merge and expose dotted keys
  ...documentsEn,
  ...documentsListEn,
  ...documentsPreviewEn,
  ...documentsUploadEn,
  ...dottedFromMergedExcludingRoot({ ...(documentsEn as any || {}), ...(documentsListEn as any || {}), ...(documentsPreviewEn as any || {}), ...(documentsUploadEn as any || {}) }, 'documents'),
  documents: (documentsEn && (documentsEn as any).documents) ? (documentsEn as any).documents : 'Documents',

  // Workflow
  ...(workflowEn as any || {}),
  ...dottedFromMergedExcludingRoot({ ...(workflowEn as any || {}) }, 'workflow'),
  workflow: (workflowEn && (workflowEn as any).workflow) ? (workflowEn as any).workflow : 'Workflow',

  // Dispatcher
  ...handleDispatcher(dispatcherEn),

  // Scheduling: combine flat and nested.scheduling under scheduling.*
  ...(() => {
    try {
      const flat = (schedulingEnDefault && typeof schedulingEnDefault === 'object') ? schedulingEnDefault : {};
      const nested = (schedulingEnNested && (schedulingEnNested as any).scheduling) ? (schedulingEnNested as any).scheduling : {};
      const out: Record<string, any> = {};
      Object.keys(flat).forEach(k => { out[`scheduling.${k}`] = (flat as any)[k]; });
      Object.keys(nested).forEach(k => { out[`scheduling.${k}`] = (nested as any)[k]; });
      return out;
    } catch { return {}; }
  })(),
};

// French merge
const frTranslation = {
  auth: { welcome: 'Bienvenue sur FlowSolution', signIn: 'Se connecter', signOut: 'Se déconnecter', signUp: 'S\'inscrire', email: 'Email', email_placeholder: 'Entrez votre email', password: 'Mot de passe', password_placeholder: 'Entrez votre mot de passe', confirm_password: 'Confirmer le mot de passe', confirm_password_placeholder: 'Confirmez votre mot de passe', rememberMe: 'Se souvenir de moi' },
  footer: { terms: 'Conditions', privacy: 'Confidentialité', faq: 'FAQ', all_rights_reserved: 'Tous droits réservés.' },
  loading: 'Chargement...', save: 'Enregistrer', cancel: 'Annuler', delete: 'Supprimer', edit: 'Modifier', add: 'Ajouter', search: 'Rechercher', filter: 'Filtrer', lightMode: 'Clair', darkMode: 'Sombre', back: 'Retour',
  contacts: 'Contacts', companies: 'Entreprises', deals: 'Affaires', tasks: 'Tâches', articles: 'Articles', dashboard: 'Tableau de bord', calendar: 'Calendrier',
  jobs: 'Interventions', technicians: 'Techniciens', customers: 'Clients', inventory: 'Inventaire', installations: 'Installations',
  settings: 'Paramètres', profile: 'Profil', preferences: 'Préférences', language: 'Langue', communication: 'Communication', automation: 'Automation', analytics: 'Analyses',
  ...dashboardFr,
  ...dottedFromKey('contacts', contactsFr),
  field: (fieldFr as any).field,
  service_orders: serviceOrdersFr,
  // Add installations translations with dotted notation for detailed translations
  ...installationsFr,
  ...salesFr,
  ...flattenNonObjects([offersFr || {}]),
  ...(lookupsFr && (lookupsFr as any).lookups ? (lookupsFr as any).lookups : {}),
  lookups: (lookupsFr && (lookupsFr as any).lookups && (lookupsFr as any).lookups.title) ? (lookupsFr as any).lookups.title : 'Lookups',
  documents: documentsFr,
  workflow: workflowFr,
  ...handleDispatcher(dispatcherFr),
  ...(() => {
    try {
      const flat = (schedulingEnDefault && typeof schedulingEnDefault === 'object') ? schedulingEnDefault : {};
      const nested = (schedulingEnNested && (schedulingEnNested as any).scheduling) ? (schedulingEnNested as any).scheduling : {};
      const out: Record<string, any> = {};
      Object.keys(flat).forEach(k => { out[`scheduling.${k}`] = (flat as any)[k]; });
      Object.keys(nested).forEach(k => { out[`scheduling.${k}`] = (nested as any)[k]; });
      return out;
  } catch { return {}; }
  })(),
};

const resources = { en: { translation: enTranslation }, fr: { translation: frTranslation } };

const savedLanguage = localStorage.getItem('language') || 'en';

i18n.use(initReactI18next).init({ resources, lng: savedLanguage, fallbackLng: 'en', interpolation: { escapeValue: false } });

// Register job-detail namespace separately so useTranslation('job-detail') resolves keys
i18n.addResourceBundle('en', 'job-detail', jobDetailEn, true, true);
i18n.addResourceBundle('fr', 'job-detail', jobDetailFr, true, true);
// Register dispatches module namespaces so per-component translations resolve
i18n.addResourceBundle('en', 'dispatches', dispatchesEn, true, true);
i18n.addResourceBundle('fr', 'dispatches', dispatchesFr, true, true);
i18n.addResourceBundle('en', 'attachments', attachmentsEn, true, true);
i18n.addResourceBundle('fr', 'attachments', attachmentsFr, true, true);
// Register time-expenses module namespaces
i18n.addResourceBundle('en', 'time-expenses', timeExpensesEn, true, true);
i18n.addResourceBundle('fr', 'time-expenses', timeExpensesFr, true, true);
i18n.addResourceBundle('en', 'notes', notesEn, true, true);
i18n.addResourceBundle('fr', 'notes', notesFr, true, true);
i18n.addResourceBundle('en', 'time-booking', timeBookingEn, true, true);
i18n.addResourceBundle('fr', 'time-booking', timeBookingFr, true, true);
i18n.addResourceBundle('en', 'technician', technicianEn, true, true);
i18n.addResourceBundle('fr', 'technician', technicianFr, true, true);
i18n.addResourceBundle('en', 'expense-booking', expenseBookingEn, true, true);
i18n.addResourceBundle('fr', 'expense-booking', expenseBookingFr, true, true);
// Dispatches 'common' namespace (module-scoped common translations)
i18n.addResourceBundle('en', 'common', dispatchCommonEn, true, true);
i18n.addResourceBundle('fr', 'common', dispatchCommonFr, true, true);
i18n.addResourceBundle('en', 'common', logsEn, true, true);
i18n.addResourceBundle('fr', 'common', logsFr, true, true);

// Register service orders namespace for proper translation resolution
i18n.addResourceBundle('en', 'service_orders', serviceOrdersEn, true, true);
i18n.addResourceBundle('fr', 'service_orders', serviceOrdersFr, true, true);

export default i18n;