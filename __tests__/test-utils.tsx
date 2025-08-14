import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { ReactElement } from 'react'

// Common test utilities and mock data

// Mock data generators
export const mockService = {
  id: '1',
  companyId: 'company-1',
  name: 'Test Service',
  durationMinutes: 60,
  price: '100.00',
  createdAt: '2024-01-01T00:00:00Z',
  company: {
    id: 'company-1',
    name: 'Test Company',
  }
}

export const mockClient = {
  id: '1',
  fullName: 'John Doe',
  email: 'john@example.com',
  phone: '+1234567890',
  status: 'active' as const,
  avatar: undefined,
  totalAppointments: 5,
  totalSpent: 500,
  rating: 4.5,
  lastAppointment: '2024-01-01T00:00:00Z',
  createdAt: '2024-01-01T00:00:00Z',
  tags: ['VIP'],
  notes: 'Good client'
}

export const mockPagination = {
  totalItems: 10,
  totalPages: 1,
  page: 1
}

export const mockStats = {
  totalClients: 10,
  activeClients: 8,
  newThisMonth: 2,
  averageRating: 4.5
}

// Custom render function with common providers
export function renderWithProviders(ui: ReactElement) {
  return render(ui)
}

// Helper function to find elements by text content
export const findByTextContent = (container: HTMLElement, text: string) => {
  return Array.from(container.querySelectorAll('*')).find(
    element => element.textContent === text
  )
}

// Export common testing utilities
export { render, screen, fireEvent, waitFor, userEvent }