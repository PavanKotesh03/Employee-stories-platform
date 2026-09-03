import { Theme } from '@radix-ui/themes'
import { MsalProvider } from '@azure/msal-react'
import { msalInstance } from '../config/authConfig'
import { AuthProvider } from '../contexts/AuthContext'

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <Theme>
      <MsalProvider instance={msalInstance}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </MsalProvider>
    </Theme>
  )
}
