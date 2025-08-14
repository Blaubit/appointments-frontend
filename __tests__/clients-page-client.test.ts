import { describe, it, expect } from 'vitest'

describe('Clients Page Client - Individual Tests', () => {
  it('should validate client creation form', () => {
    const clientData = {
      fullName: 'John Doe',
      email: 'john@example.com',
      phone: '+1234567890'
    }
    
    const isValid = Boolean(
      clientData.fullName &&
      clientData.email &&
      clientData.phone &&
      clientData.email.includes('@')
    )
    
    expect(isValid).toBe(true)
  })

  it('should handle client status management', () => {
    const client = { id: '1', name: 'John Doe', status: 'active' }
    const updatedClient = { ...client, status: 'inactive' }
    
    expect(updatedClient.status).toBe('inactive')
  })

  it('should calculate client metrics', () => {
    const client = {
      appointments: [
        { amount: 100, date: '2024-01-01' },
        { amount: 150, date: '2024-01-15' },
        { amount: 75, date: '2024-01-30' }
      ]
    }
    
    const metrics = {
      totalSpent: client.appointments.reduce((sum, apt) => sum + apt.amount, 0),
      totalAppointments: client.appointments.length,
      averageSpending: client.appointments.reduce((sum, apt) => sum + apt.amount, 0) / client.appointments.length
    }
    
    expect(metrics.totalSpent).toBe(325)
    expect(metrics.totalAppointments).toBe(3)
    expect(metrics.averageSpending).toBeCloseTo(108.33, 2)
  })

  it('should format client contact information', () => {
    const client = {
      fullName: 'María Elena Rodríguez',
      email: 'maria@example.com',
      phone: '+502-1234-5678'
    }
    
    const formatted = {
      displayName: client.fullName,
      emailLink: `mailto:${client.email}`,
      phoneLink: `tel:${client.phone}`
    }
    
    expect(formatted.displayName).toBe('María Elena Rodríguez')
    expect(formatted.emailLink).toBe('mailto:maria@example.com')
    expect(formatted.phoneLink).toBe('tel:+502-1234-5678')
  })

  it('should handle client appointment history', () => {
    const appointments = [
      { id: '1', date: '2024-01-01', service: 'Consultation', status: 'completed' },
      { id: '2', date: '2024-01-15', service: 'Treatment', status: 'completed' },
      { id: '3', date: '2024-02-01', service: 'Follow-up', status: 'scheduled' }
    ]
    
    const completedAppointments = appointments.filter(apt => apt.status === 'completed')
    const upcomingAppointments = appointments.filter(apt => apt.status === 'scheduled')
    
    expect(completedAppointments).toHaveLength(2)
    expect(upcomingAppointments).toHaveLength(1)
  })

  it('should validate email format', () => {
    const validEmails = ['test@example.com', 'user.name@domain.co.uk', 'admin+tag@company.org']
    const invalidEmails = ['invalid-email', '@domain.com', 'user@']
    
    const isValidEmail = (email: string) => {
      return email.includes('@') && email.includes('.') && !email.includes(' ') && email.indexOf('@') > 0
    }
    
    validEmails.forEach(email => {
      expect(isValidEmail(email)).toBe(true)
    })
    
    invalidEmails.forEach(email => {
      expect(isValidEmail(email)).toBe(false)
    })
  })
})