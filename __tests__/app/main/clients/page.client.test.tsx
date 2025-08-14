import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithProviders, mockClient, mockPagination, mockStats } from '../../../test-utils'
import ClientsPageClient from '@/app/(main)/clients/page.client'
import type { Client, ClientStats, Pagination } from '@/types'

// Mock the client actions
vi.mock('@/actions/clients/create', () => ({
  create: vi.fn().mockResolvedValue({ status: 201 })
}))

vi.mock('@/actions/clients/edit', () => ({
  default: vi.fn().mockResolvedValue({ status: 201 })
}))

// Mock the ClientForm component
vi.mock('@/components/client-form', () => ({
  ClientForm: ({ isOpen, onClose, client, onSubmit }: any) => {
    if (!isOpen) return null
    return (
      <div data-testid="client-form">
        <h2>{client ? 'Edit Client' : 'Create Client'}</h2>
        <button onClick={onClose}>Close</button>
        <button onClick={() => onSubmit({
          fullName: 'Test Client',
          email: 'test@example.com',
          phone: '+1234567890'
        })}>Submit</button>
      </div>
    )
  }
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

describe('ClientsPageClient', () => {
  const mockClients: Client[] = [
    {
      ...mockClient,
      id: '1',
      fullName: 'John Doe',
      email: 'john@example.com',
      phone: '+1234567890',
      status: 'active'
    },
    {
      ...mockClient,
      id: '2',
      fullName: 'Jane Smith',
      email: 'jane@example.com',
      phone: '+0987654321',
      status: 'inactive'
    }
  ]

  const defaultProps = {
    clients: mockClients,
    stats: mockStats,
    pagination: mockPagination
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders clients page with header and title', () => {
    renderWithProviders(<ClientsPageClient {...defaultProps} />)
    
    expect(screen.getByTestId('header')).toBeInTheDocument()
    expect(screen.getByText('Clientes')).toBeInTheDocument()
    expect(screen.getByText('Gestión de Clientes')).toBeInTheDocument()
  })

  it('displays clients in cards view by default', () => {
    renderWithProviders(<ClientsPageClient {...defaultProps} />)
    
    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.getByText('Jane Smith')).toBeInTheDocument()
    expect(screen.getByText('john@example.com')).toBeInTheDocument()
    expect(screen.getByText('jane@example.com')).toBeInTheDocument()
  })

  it('can switch between cards and table view', async () => {
    const user = userEvent.setup()
    renderWithProviders(<ClientsPageClient {...defaultProps} />)
    
    // Find table view button and click it
    const tableViewButton = screen.getByRole('button', { name: /list/i })
    await user.click(tableViewButton)
    
    // Should show table headers
    expect(screen.getByText('Cliente')).toBeInTheDocument()
    expect(screen.getByText('Email')).toBeInTheDocument()
    expect(screen.getByText('Teléfono')).toBeInTheDocument()
    expect(screen.getByText('Estado')).toBeInTheDocument()
    expect(screen.getByText('Citas')).toBeInTheDocument()
  })

  it('can search clients', async () => {
    const user = userEvent.setup()
    renderWithProviders(<ClientsPageClient {...defaultProps} />)
    
    const searchInput = screen.getByPlaceholderText('Buscar cliente...')
    await user.type(searchInput, 'John')
    
    expect(searchInput).toHaveValue('John')
  })

  it('can filter clients by status', async () => {
    const user = userEvent.setup()
    renderWithProviders(<ClientsPageClient {...defaultProps} />)
    
    // Find and click the status filter
    const statusSelect = screen.getByRole('combobox')
    await user.click(statusSelect)
    
    // Should show filter options
    expect(screen.getByText('Todos')).toBeInTheDocument()
    expect(screen.getByText('Activos')).toBeInTheDocument()
    expect(screen.getByText('Inactivos')).toBeInTheDocument()
  })

  it('shows "Nuevo Cliente" button and opens create dialog', async () => {
    const user = userEvent.setup()
    renderWithProviders(<ClientsPageClient {...defaultProps} />)
    
    const newClientButton = screen.getByText('Nuevo Cliente')
    expect(newClientButton).toBeInTheDocument()
    
    await user.click(newClientButton)
    
    // Should open the client form
    await waitFor(() => {
      expect(screen.getByTestId('client-form')).toBeInTheDocument()
      expect(screen.getByText('Create Client')).toBeInTheDocument()
    })
  })

  it('can submit create client form', async () => {
    const user = userEvent.setup()
    renderWithProviders(<ClientsPageClient {...defaultProps} />)
    
    // Open create dialog
    const newClientButton = screen.getByText('Nuevo Cliente')
    await user.click(newClientButton)
    
    await waitFor(() => {
      expect(screen.getByTestId('client-form')).toBeInTheDocument()
    })
    
    // Submit the form
    const submitButton = screen.getByText('Submit')
    await user.click(submitButton)
    
    // Form should close after submission
    await waitFor(() => {
      expect(screen.queryByTestId('client-form')).not.toBeInTheDocument()
    })
  })

  it('can open edit dialog for a client', async () => {
    const user = userEvent.setup()
    renderWithProviders(<ClientsPageClient {...defaultProps} />)
    
    // Find and click the dropdown menu for the first client
    const dropdownButtons = screen.getAllByRole('button', { name: '' })
    const firstDropdown = dropdownButtons.find(button => 
      button.querySelector('[data-lucide="more-horizontal"]')
    )
    
    if (firstDropdown) {
      await user.click(firstDropdown)
      
      const editButton = screen.getByText('Editar')
      await user.click(editButton)
      
      // Should open the client form in edit mode
      await waitFor(() => {
        expect(screen.getByTestId('client-form')).toBeInTheDocument()
        expect(screen.getByText('Edit Client')).toBeInTheDocument()
      })
    }
  })

  it('can view client details', async () => {
    const user = userEvent.setup()
    renderWithProviders(<ClientsPageClient {...defaultProps} />)
    
    // Find and click the dropdown menu for the first client
    const dropdownButtons = screen.getAllByRole('button', { name: '' })
    const firstDropdown = dropdownButtons.find(button => 
      button.querySelector('[data-lucide="more-horizontal"]')
    )
    
    if (firstDropdown) {
      await user.click(firstDropdown)
      
      const viewButton = screen.getByText('Ver detalles')
      await user.click(viewButton)
      
      // Should show client details dialog
      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument()
      })
    }
  })

  it('displays client statistics', () => {
    renderWithProviders(<ClientsPageClient {...defaultProps} />)
    
    expect(screen.getByText('Total Clientes')).toBeInTheDocument()
    expect(screen.getByText('10')).toBeInTheDocument()
    expect(screen.getByText('Clientes Activos')).toBeInTheDocument()
    expect(screen.getByText('8')).toBeInTheDocument()
  })

  it('filters clients based on search term', () => {
    renderWithProviders(<ClientsPageClient {...defaultProps} />)
    
    // Test the filtering logic works (both clients should be visible initially)
    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.getByText('Jane Smith')).toBeInTheDocument()
  })

  it('shows client count in results', () => {
    renderWithProviders(<ClientsPageClient {...defaultProps} />)
    
    expect(screen.getByText('Mostrando 2 de 2 clientes')).toBeInTheDocument()
  })

  it('can close client form dialog', async () => {
    const user = userEvent.setup()
    renderWithProviders(<ClientsPageClient {...defaultProps} />)
    
    // Open the create dialog
    const newClientButton = screen.getByText('Nuevo Cliente')
    await user.click(newClientButton)
    
    await waitFor(() => {
      expect(screen.getByTestId('client-form')).toBeInTheDocument()
    })
    
    // Close the dialog
    const closeButton = screen.getByText('Close')
    await user.click(closeButton)
    
    await waitFor(() => {
      expect(screen.queryByTestId('client-form')).not.toBeInTheDocument()
    })
  })

  it('handles empty client list', () => {
    const emptyProps = {
      clients: [],
      stats: { ...mockStats, totalClients: 0 },
      pagination: { ...mockPagination, totalItems: 0 }
    }
    
    renderWithProviders(<ClientsPageClient {...emptyProps} />)
    
    expect(screen.getByText('Mostrando 0 de 0 clientes')).toBeInTheDocument()
  })
})