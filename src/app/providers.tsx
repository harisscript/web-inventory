import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { ThemeProvider } from 'next-themes'
import type { ReactNode } from 'react'

import { Toaster } from '@/shared/components/ui/sonner'
import { TooltipProvider } from '@/shared/components/ui/tooltip'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60,
      refetchOnWindowFocus: false,
      retry: 1,
    },
    mutations: {
      retry: 0,
    },
  },
})

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      storageKey="inventory.theme"
    >
      <QueryClientProvider client={queryClient}>
        <TooltipProvider delayDuration={150}>{children}</TooltipProvider>
        <Toaster richColors position="top-right" closeButton />
        {import.meta.env.DEV && (
          <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-left" />
        )}
      </QueryClientProvider>
    </ThemeProvider>
  )
}
