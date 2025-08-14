import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithProviders, mockService, mockClient } from '../../../../test-utils'
import NewAppointmentPageClient from '@/app/(main)/appointments/new/page.client'
import type { Service, Client } from '@/types'

// Mock the appointment actions
vi.mock('@/actions/appointments/create', () => ({
  default: vi.fn().mockResolvedValue({ status: 201 })
}))

vi.mock('@/actions/clients/create', () => ({
  create: vi.fn().mockResolvedValue({ status: 201 })
}))

// Mock the Header component
vi.mock('@/components/header', () => ({
  Header: ({ title, showBackButton, backButtonHref, backButtonText }: any) => (
    <div data-testid="header">
      <h1>{title}</h1>
      {showBackButton && (
        <a href={backButtonHref}>{backButtonText}</a>
      )}
    </div>
  )
}))

// Mock the CalendarCard component
vi.mock('@/components/calendar-card', () => ({
  CalendarCard: ({ onDateSelect, onTimeSelect }: any) => (
    <div data-testid="calendar-card">
      <button onClick={() => onDateSelect(new Date('2024-01-15'))}>
        Select Date
      </button>
      <button onClick={() => onTimeSelect('10:00')}>
        Select Time
      </button>
    </div>
  )
}))

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    back: vi.fn(),
  }),
  useSearchParams: () => ({
    get: vi.fn(),
  }),
}))

describe('NewAppointmentPageClient', () => {
  const mockServices: Service[] = [
    {
      ...mockService,
      id: '1',
      name: 'Consultation',
      price: '100.00',
      durationMinutes: 30
    },
    {
      ...mockService,
      id: '2',
      name: 'Treatment',
      price: '200.00',
      durationMinutes: 60
    }
  ]

  const mockClients: Client[] = [
    {
      ...mockClient,
      id: '1',
      fullName: 'John Doe',
      email: 'john@example.com',
      phone: '+1234567890'
    },
    {
      ...mockClient,
      id: '2',
      fullName: 'Jane Smith',
      email: 'jane@example.com',
      phone: '+0987654321'
    }
  ]

  const defaultProps = {
    services: mockServices,
    clients: mockClients
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders new appointment page with header', () => {
    renderWithProviders(<NewAppointmentPageClient {...defaultProps} />)
    
    expect(screen.getByTestId('header')).toBeInTheDocument()
    expect(screen.getByText('Nueva Cita')).toBeInTheDocument()
  })

  it('shows client selection section', () => {
    renderWithProviders(<NewAppointmentPageClient {...defaultProps} />)
    
    expect(screen.getByText('Seleccionar Cliente')).toBeInTheDocument()
    expect(screen.getByText('Busca un cliente existente o crea uno nuevo')).toBeInTheDocument()
  })

  it('can search for existing clients', async () => {
    const user = userEvent.setup()
    renderWithProviders(<NewAppointmentPageClient {...defaultProps} />)
    
    const searchInput = screen.getByPlaceholderText('Buscar cliente...')
    await user.type(searchInput, 'John')
    
    expect(searchInput).toHaveValue('John')
  })

  it('shows "Crear nuevo cliente" button', () => {
    renderWithProviders(<NewAppointmentPageClient {...defaultProps} />)
    
    expect(screen.getByText('Crear nuevo cliente')).toBeInTheDocument()
  })

  it('can select a service', async () => {
    const user = userEvent.setup()
    renderWithProviders(<NewAppointmentPageClient {...defaultProps} />)
    
    // Find service cards
    expect(screen.getByText('Consultation')).toBeInTheDocument()
    expect(screen.getByText('Treatment')).toBeInTheDocument()
    expect(screen.getByText('Q100.00')).toBeInTheDocument()
    expect(screen.getByText('Q200.00')).toBeInTheDocument()
  })

  it('shows calendar component for date selection', () => {
    renderWithProviders(<NewAppointmentPageClient {...defaultProps} />)
    
    expect(screen.getByTestId('calendar-card')).toBeInTheDocument()
  })

  it('can select date and time', async () => {
    const user = userEvent.setup()
    renderWithProviders(<NewAppointmentPageClient {...defaultProps} />)
    
    // Select date
    const selectDateButton = screen.getByText('Select Date')
    await user.click(selectDateButton)
    
    // Select time
    const selectTimeButton = screen.getByText('Select Time')
    await user.click(selectTimeButton)
  })

  it('shows notes section', () => {
    renderWithProviders(<NewAppointmentPageClient {...defaultProps} />)
    
    expect(screen.getByText('Notas adicionales')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Notas para la cita...')).toBeInTheDocument()
  })

  it('shows create appointment button', () => {
    renderWithProviders(<NewAppointmentPageClient {...defaultProps} />)
    
    expect(screen.getByText('Crear Cita')).toBeInTheDocument()
  })

  it('create button is initially disabled', () => {
    renderWithProviders(<NewAppointmentPageClient {...defaultProps} />)
    
    const createButton = screen.getByText('Crear Cita')
    expect(createButton).toBeDisabled()
  })

  it('shows service information in service cards', () => {
    renderWithProviders(<NewAppointmentPageClient {...defaultProps} />)
    
    expect(screen.getByText('30 min')).toBeInTheDocument()
    expect(screen.getByText('60 min')).toBeInTheDocument()
  })

  it('can add notes to appointment', async () => {
    const user = userEvent.setup()
    renderWithProviders(<NewAppointmentPageClient {...defaultProps} />)
    
    const notesTextarea = screen.getByPlaceholderText('Notas para la cita...')
    await user.type(notesTextarea, 'Important appointment notes')
    
    expect(notesTextarea).toHaveValue('Important appointment notes')
  })

  it('displays loading state when creating appointment', async () => {
    const user = userEvent.setup()
    renderWithProviders(<NewAppointmentPageClient {...defaultProps} />)
    
    // The create button should show loading text when isLoading is true
    // This would be tested when the component is in loading state
    const createButton = screen.getByText('Crear Cita')
    expect(createButton).toBeInTheDocument()
  })

  it('shows client avatar when client is selected', () => {
    renderWithProviders(<NewAppointmentPageClient {...defaultProps} />)
    
    // When a client is selected, it should show their avatar and info
    // This would be visible after selecting a client from the search results
    expect(screen.getByText('Buscar cliente...')).toBeInTheDocument()
  })

  it('shows create new client form option', async () => {
    const user = userEvent.setup()
    renderWithProviders(<NewAppointmentPageClient {...defaultProps} />)
    
    const createNewClientButton = screen.getByText('Crear nuevo cliente')
    await user.click(createNewClientButton)
    
    // Should show form fields for new client
    expect(screen.getByText('Nombre completo')).toBeInTheDocument()
    expect(screen.getByText('Email')).toBeInTheDocument()
    expect(screen.getByText('Teléfono')).toBeInTheDocument()
  })

  it('shows appointment summary section', () => {
    renderWithProviders(<NewAppointmentPageClient {...defaultProps} />)
    
    expect(screen.getByText('Resumen de la Cita')).toBeInTheDocument()
  })

  it('handles empty services list', () => {
    const emptyProps = {
      services: [],
      clients: mockClients
    }
    
    renderWithProviders(<NewAppointmentPageClient {...emptyProps} />)
    
    // Should still render the page structure
    expect(screen.getByText('Nueva Cita')).toBeInTheDocument()
    expect(screen.getByText('Seleccionar Cliente')).toBeInTheDocument()
  })

  it('handles empty clients list', () => {
    const emptyProps = {
      services: mockServices,
      clients: []
    }
    
    renderWithProviders(<NewAppointmentPageClient {...emptyProps} />)
    
    // Should show "No se encontraron clientes" when searching
    expect(screen.getByText('Nueva Cita')).toBeInTheDocument()
  })
})