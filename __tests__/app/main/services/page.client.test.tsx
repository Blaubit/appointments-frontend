import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import type { Service } from '@/types'

// Mock the dependencies more simply
vi.mock('@/components/header', () => ({
  Header: () => <div data-testid="header">Services Header</div>
}))

vi.mock('@/components/service-form', () => ({
  ServiceForm: () => <div data-testid="service-form">Service Form</div>
}))

vi.mock('@/actions/services/delete', () => ({
  default: vi.fn()
}))

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    refresh: vi.fn(),
  }),
}))

// Import the component after mocking dependencies
const ServicesPageClient = await import('@/app/(main)/services/page.client').then(m => m.default)

describe('ServicesPageClient', () => {
  const mockServices: Service[] = [
    {
      id: '1',
      companyId: 'company-1',
      name: 'Consultation',
      durationMinutes: 30,
      price: '100.00',
      createdAt: '2024-01-01T00:00:00Z',
      company: {
        id: 'company-1',
        name: 'Test Company',
      }
    }
  ]

  const defaultProps = {
    services: mockServices,
    pagination: {
      totalItems: 1,
      totalPages: 1,
      page: 1
    }
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders services page with header', () => {
    render(<ServicesPageClient {...defaultProps} />)
    
    expect(screen.getByTestId('header')).toBeInTheDocument()
    expect(screen.getByText('Services Header')).toBeInTheDocument()
  })

  it('displays service information', () => {
    render(<ServicesPageClient {...defaultProps} />)
    
    expect(screen.getByText('Consultation')).toBeInTheDocument()
    expect(screen.getByText('Q100.00')).toBeInTheDocument()
    expect(screen.getByText('30 minutos')).toBeInTheDocument()
  })

  it('shows new service button', () => {
    render(<ServicesPageClient {...defaultProps} />)
    
    expect(screen.getByText('Nuevo Servicio')).toBeInTheDocument()
  })

  it('shows search input', () => {
    render(<ServicesPageClient {...defaultProps} />)
    
    expect(screen.getByPlaceholderText('Buscar servicio...')).toBeInTheDocument()
  })

  it('displays service count', () => {
    render(<ServicesPageClient {...defaultProps} />)
    
    expect(screen.getByText('Mostrando 1 de 1 servicios')).toBeInTheDocument()
  })
})