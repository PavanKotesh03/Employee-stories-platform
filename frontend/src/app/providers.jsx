import { Theme } from '@radix-ui/themes'

export function AppProviders({ children }) {
  return (
    <Theme>
      {children}
    </Theme>
  )
}
