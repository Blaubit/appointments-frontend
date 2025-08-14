import '@testing-library/jest-dom'
import React from 'react'

// Mock Next.js router
const mockPush = vi.fn()
const mockBack = vi.fn()
const mockForward = vi.fn()
const mockRefresh = vi.fn()
const mockReplace = vi.fn()

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    back: mockBack,
    forward: mockForward,
    refresh: mockRefresh,
    replace: mockReplace,
  }),
  useSearchParams: () => ({
    get: vi.fn(),
  }),
  usePathname: () => '/test-path',
}))

// Mock Next.js image
vi.mock('next/image', () => ({
  default: ({ src, alt, ...props }: any) => React.createElement('img', { src, alt, ...props }),
}))

// Mock lucide-react icons
vi.mock('lucide-react', () => {
  const mockIcon = ({ children, ...props }: any) => React.createElement('div', props, children)
  return new Proxy({}, {
    get: () => mockIcon,
  })
})