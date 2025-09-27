import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ClerkProvider } from '@clerk/clerk-react'

// Import your Publishable Key
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

// Check if Clerk key is valid (should be longer than 50 chars and properly formatted)
// Check if Clerk key is valid (stricter: must look like a real Clerk key)
const isValidClerkKey =
  typeof PUBLISHABLE_KEY === 'string' &&
  /^pk_(test|live)_.{80,}$/.test(PUBLISHABLE_KEY);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {isValidClerkKey ? (
      <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
        <App />
      </ClerkProvider>
    ) : (
      <App />
    )}
  </StrictMode>,
)