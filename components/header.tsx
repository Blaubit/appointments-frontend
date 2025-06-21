"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ThemeToggle } from "@/components/theme-toggle"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Calendar,
  Bell,
  Settings,
  LogOut,
  ArrowLeft,
  User,
  HelpCircle,
  CreditCard,
  Shield,
  ChevronDown,
} from "lucide-react"
import Link from "next/link"

interface HeaderProps {
  title?: string
  subtitle?: string
  showBackButton?: boolean
  backButtonText?: string
  backButtonHref?: string
  user?: {
    name: string
    email: string
    role: string
    avatar?: string
    initials?: string
  }
  notifications?: {
    count: number
    items?: Array<{
      id: string
      title: string
      message: string
      time: string
      read: boolean
    }>
  }
  actions?: React.ReactNode
  className?: string
}

export function Header({
  title = "Planit",
  subtitle,
  showBackButton = false,
  backButtonText = "Dashboard",
  backButtonHref = "/dashboard",
  user = {
    name: "Dr. Roberto Silva",
    email: "roberto.silva@email.com",
    role: "Médico General",
    avatar: "/placeholder.svg?height=32&width=32",
    initials: "DR",
  },
  notifications = { count: 3 },
  actions,
  className = "",
}: HeaderProps) {
  const [showNotifications, setShowNotifications] = useState(false)

  const defaultNotifications = [
    {
      id: "1",
      title: "Nueva cita programada",
      message: "María González reservó una cita para mañana a las 10:00",
      time: "Hace 5 min",
      read: false,
    },
    {
      id: "2",
      title: "Recordatorio de cita",
      message: "Cita con Carlos Rodríguez en 30 minutos",
      time: "Hace 25 min",
      read: false,
    },
    {
      id: "3",
      title: "Cita cancelada",
      message: "Ana Martínez canceló su cita de esta tarde",
      time: "Hace 1 hora",
      read: true,
    },
  ]

  const notificationItems = notifications.items || defaultNotifications

  return (
    <header className={`bg-white dark:bg-gray-800 shadow-sm border-b ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left Section */}
          <div className="flex items-center space-x-4">
            {/* Back Button */}
            {showBackButton && (
              <Link href={backButtonHref}>
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">{backButtonText}</span>
                </Button>
              </Link>
            )}

            {/* Logo and Title */}
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg">
                <Calendar className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">{title}</h1>
                {subtitle && <p className="text-sm text-gray-500 dark:text-gray-400">{subtitle}</p>}
              </div>
            </div>
          </div>

          {/* Center Section - Actions */}
          {actions && <div className="hidden md:flex items-center space-x-4">{actions}</div>}

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <DropdownMenu open={showNotifications} onOpenChange={setShowNotifications}>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  {notifications.count > 0 && (
                    <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                      {notifications.count > 9 ? "9+" : notifications.count}
                    </span>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel className="flex items-center justify-between">
                  <span>Notificaciones</span>
                  {notifications.count > 0 && (
                    <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">
                      {notifications.count} nuevas
                    </span>
                  )}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div className="max-h-80 overflow-y-auto">
                  {notificationItems.length > 0 ? (
                    notificationItems.map((notification) => (
                      <DropdownMenuItem key={notification.id} className="flex flex-col items-start p-4 cursor-pointer">
                        <div className="flex items-start justify-between w-full">
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900 dark:text-white">{notification.title}</p>
                            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{notification.message}</p>
                            <p className="text-xs text-gray-500 mt-2">{notification.time}</p>
                          </div>
                          {!notification.read && <div className="w-2 h-2 bg-blue-500 rounded-full mt-1 ml-2" />}
                        </div>
                      </DropdownMenuItem>
                    ))
                  ) : (
                    <div className="p-4 text-center text-gray-500">
                      <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No hay notificaciones</p>
                    </div>
                  )}
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-center text-blue-600 hover:text-blue-700">
                  Ver todas las notificaciones
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Theme Toggle */}
            <ThemeToggle variant="ghost" />

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex items-center space-x-3 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                    <AvatarFallback>{user.initials}</AvatarFallback>
                  </Avatar>
                  <div className="hidden md:block text-left">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{user.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{user.role}</p>
                  </div>
                  <ChevronDown className="h-4 w-4 text-gray-500" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">{user.name}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="flex items-center">
                    <User className="h-4 w-4 mr-2" />
                    Mi Perfil
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/settings" className="flex items-center">
                    <Settings className="h-4 w-4 mr-2" />
                    Configuración
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/help" className="flex items-center">
                    <HelpCircle className="h-4 w-4 mr-2" />
                    Ayuda y Soporte
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/login" className="flex items-center text-red-600 hover:text-red-700">
                    <LogOut className="h-4 w-4 mr-2" />
                    Cerrar Sesión
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Mobile Actions */}
        {actions && (
          <div className="md:hidden pb-4 border-t border-gray-200 dark:border-gray-700 mt-4 pt-4">{actions}</div>
        )}
      </div>
    </header>
  )
}
