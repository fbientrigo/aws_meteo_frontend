
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import App from '../App'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// Mock generic components to avoid deep rendering issues
// This is a smoke test just to check mounting
const queryClient = new QueryClient()

describe('App Smoke Test', () => {
    it('renders without crashing', () => {
        render(
            <QueryClientProvider client={queryClient}>
                <BrowserRouter>
                    <App />
                </BrowserRouter>
            </QueryClientProvider>
        )
        // Since we don't know exact text content, just check if body exists
        expect(document.body).toBeTruthy()
    })
})
