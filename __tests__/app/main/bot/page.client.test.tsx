import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithProviders } from '../../../test-utils'
import WhatsAppBotClient from '@/app/(main)/bot/page.client'
import type { BotFlow, BotMessage, BotConversation, BotStats, BotConfig, User } from '@/types'

// Mock the Header component
vi.mock('@/components/header', () => ({
  Header: ({ title }: any) => (
    <div data-testid="header">
      <h1>{title}</h1>
    </div>
  )
}))

describe('WhatsAppBotClient', () => {
  const mockStats: BotStats = {
    totalMessages: 100,
    totalConversations: 50,
    activeFlows: 5,
    satisfactionScore: 4.5,
    responseRate: 85,
    conversionRate: 15,
    averageResponseTime: '2 min',
    totalMessageTemplates: 10,
    appointmentsThisMonth: 25
  }

  const mockBotConfig: BotConfig = {
    id: '1',
    name: 'Test Bot',
    autoReply: true,
    welcomeMessage: 'Bienvenido',
    isActive: true
  }

  const mockUser: User = {
    id: '1',
    email: 'test@example.com',
    firstName: 'Test',
    lastName: 'User',
    role: 'admin',
    companyId: 'company-1'
  }

  const mockFlows: BotFlow[] = [
    {
      id: '1',
      name: 'Appointment Flow',
      description: 'Flow for appointments',
      isActive: true,
      triggers: ['cita', 'appointment'],
      category: 'appointment'
    }
  ]

  const mockMessages: BotMessage[] = [
    {
      id: '1',
      content: 'Hello, how can I help you?',
      type: 'text',
      category: 'general',
      isActive: true
    }
  ]

  const mockConversations: BotConversation[] = [
    {
      id: '1',
      clientName: 'John Doe',
      clientPhone: '+1234567890',
      status: 'active',
      lastMessage: 'Hello',
      lastMessageTime: '2024-01-01T10:00:00Z',
      messagesCount: 5
    }
  ]

  const defaultProps = {
    flows: mockFlows,
    messages: mockMessages,
    conversations: mockConversations,
    stats: mockStats,
    botConfig: mockBotConfig,
    user: mockUser
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders bot page with header', () => {
    renderWithProviders(<WhatsAppBotClient {...defaultProps} />)
    
    expect(screen.getByTestId('header')).toBeInTheDocument()
    expect(screen.getByText('WhatsApp Bot')).toBeInTheDocument()
  })

  it('displays bot statistics correctly', () => {
    renderWithProviders(<WhatsAppBotClient {...defaultProps} />)
    
    expect(screen.getByText('100')).toBeInTheDocument() // Total Messages
    expect(screen.getByText('50')).toBeInTheDocument() // Total Conversations
    expect(screen.getByText('5')).toBeInTheDocument() // Active Flows
    expect(screen.getByText('4.5')).toBeInTheDocument() // Satisfaction Score
    expect(screen.getByText('85%')).toBeInTheDocument() // Response Rate
    expect(screen.getByText('15%')).toBeInTheDocument() // Conversion Rate
  })

  it('shows tabs for different sections', () => {
    renderWithProviders(<WhatsAppBotClient {...defaultProps} />)
    
    expect(screen.getByText('Resumen')).toBeInTheDocument()
    expect(screen.getByText('Flujos')).toBeInTheDocument()
    expect(screen.getByText('Mensajes')).toBeInTheDocument()
    expect(screen.getByText('Conversaciones')).toBeInTheDocument()
    expect(screen.getByText('Configuración')).toBeInTheDocument()
  })

  it('can switch between tabs', async () => {
    const user = userEvent.setup()
    renderWithProviders(<WhatsAppBotClient {...defaultProps} />)
    
    // Click on Flujos tab
    const flowsTab = screen.getByText('Flujos')
    await user.click(flowsTab)
    
    // Should show flows content
    expect(screen.getByText('Appointment Flow')).toBeInTheDocument()
  })

  it('displays bot configuration in config tab', async () => {
    const user = userEvent.setup()
    renderWithProviders(<WhatsAppBotClient {...defaultProps} />)
    
    // Click on Configuración tab
    const configTab = screen.getByText('Configuración')
    await user.click(configTab)
    
    // Should show config form
    expect(screen.getByText('Configuración del Bot')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Test Bot')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Bienvenido')).toBeInTheDocument()
  })

  it('can filter messages by category', async () => {
    const user = userEvent.setup()
    renderWithProviders(<WhatsAppBotClient {...defaultProps} />)
    
    // Click on Mensajes tab
    const messagesTab = screen.getByText('Mensajes')
    await user.click(messagesTab)
    
    // Find and click category filter
    const categorySelect = screen.getByRole('combobox')
    await user.click(categorySelect)
    
    // Should show category options
    expect(screen.getByText('Todas las categorías')).toBeInTheDocument()
    expect(screen.getByText('Citas')).toBeInTheDocument()
    expect(screen.getByText('Información')).toBeInTheDocument()
  })

  it('shows conversations in conversations tab', async () => {
    const user = userEvent.setup()
    renderWithProviders(<WhatsAppBotClient {...defaultProps} />)
    
    // Click on Conversaciones tab
    const conversationsTab = screen.getByText('Conversaciones')
    await user.click(conversationsTab)
    
    // Should show conversation data
    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.getByText('+1234567890')).toBeInTheDocument()
  })

  it('can search in messages', async () => {
    const user = userEvent.setup()
    renderWithProviders(<WhatsAppBotClient {...defaultProps} />)
    
    // Click on Mensajes tab
    const messagesTab = screen.getByText('Mensajes')
    await user.click(messagesTab)
    
    // Find search input
    const searchInput = screen.getByPlaceholderText('Buscar mensajes...')
    await user.type(searchInput, 'Hello')
    
    expect(searchInput).toHaveValue('Hello')
  })

  it('can toggle bot auto-reply setting', async () => {
    const user = userEvent.setup()
    renderWithProviders(<WhatsAppBotClient {...defaultProps} />)
    
    // Click on Configuración tab
    const configTab = screen.getByText('Configuración')
    await user.click(configTab)
    
    // Find auto-reply switch
    const autoReplySwitch = screen.getByRole('switch')
    expect(autoReplySwitch).toBeChecked()
    
    // Toggle it
    await user.click(autoReplySwitch)
    expect(autoReplySwitch).not.toBeChecked()
  })

  it('shows create message button', async () => {
    const user = userEvent.setup()
    renderWithProviders(<WhatsAppBotClient {...defaultProps} />)
    
    // Click on Mensajes tab
    const messagesTab = screen.getByText('Mensajes')
    await user.click(messagesTab)
    
    expect(screen.getByText('Nuevo Mensaje')).toBeInTheDocument()
  })

  it('shows create flow button', async () => {
    const user = userEvent.setup()
    renderWithProviders(<WhatsAppBotClient {...defaultProps} />)
    
    // Click on Flujos tab
    const flowsTab = screen.getByText('Flujos')
    await user.click(flowsTab)
    
    expect(screen.getByText('Nuevo Flujo')).toBeInTheDocument()
  })

  it('displays flow information correctly', async () => {
    const user = userEvent.setup()
    renderWithProviders(<WhatsAppBotClient {...defaultProps} />)
    
    // Click on Flujos tab
    const flowsTab = screen.getByText('Flujos')
    await user.click(flowsTab)
    
    expect(screen.getByText('Appointment Flow')).toBeInTheDocument()
    expect(screen.getByText('Flow for appointments')).toBeInTheDocument()
  })

  it('can update bot configuration', async () => {
    const user = userEvent.setup()
    renderWithProviders(<WhatsAppBotClient {...defaultProps} />)
    
    // Click on Configuración tab
    const configTab = screen.getByText('Configuración')
    await user.click(configTab)
    
    // Find bot name input and update it
    const nameInput = screen.getByDisplayValue('Test Bot')
    await user.clear(nameInput)
    await user.type(nameInput, 'Updated Bot')
    
    expect(nameInput).toHaveValue('Updated Bot')
  })
})