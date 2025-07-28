"use client";

import type React from "react";
import { logout } from "@/actions/auth/logout";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Calendar,
  Bell,
  Settings,
  LogOut,
  ArrowLeft,
  User as UserIcon,
  HelpCircle,
  CreditCard,
  Shield,
  ChevronDown,
  Menu,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { useUser } from "@/hooks/useUser"; // Ajusta la ruta según tu estructura
import { Role, User } from "@/types";
import { Company } from "@/types/company";

interface HeaderProps {
  title?: string;
  subtitle?: string;
  showBackButton?: boolean;
  backButtonText?: string;
  backButtonHref?: string;
  notifications?: {
    count: number;
    items?: Array<{
      id: string;
      title: string;
      message: string;
      time: string;
      read: boolean;
    }>;
  };
  actions?: React.ReactNode;
  className?: string;
}

export function Header({
  title = "CitasFácil",
  subtitle,
  showBackButton = false,
  backButtonText = "Dashboard",
  backButtonHref = "/dashboard",
  notifications = { count: 3 },
  actions,
  className = "",
}: HeaderProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  
  // Usar el hook para obtener el usuario
  const { user, loading, error } = useUser();
  // defatult company para usuario por defecto
  const defaultCompany:Company = {
    id: "default",
    name: "CitasFácil",
    company_type: "default",
    address: "Calle Falsa 123",
    city: "Ciudad",
    state: "Estado",
    postal_code: "12345",
    country: "País",
    description: "Empresa de citas por defecto",
    createdAt: "2023-01-01T00:00:00Z",
  }
  // defaul role para el usuario por defecto
  const defaultRole:Role = {
    id: "default",
    name: "Invitado",
    description: "Acceso limitado",
  };
  // Usuario por defecto si no hay usuario autenticado
  const defaultUser: User = {
    id: "default",
    fullName: "Invitado",
    email: "mail@mail.com",
    role: defaultRole,
    avatar: "Professional1.png",
    bio: "Usuario invitado sin acceso completo",
    createdAt: "2023-01-01T00:00:00Z",
    company: defaultCompany,
  };

  const currentUser = user || defaultUser;
  
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
  ];

  const notificationItems = notifications.items || defaultNotifications;

  return (
    <header
      className={`bg-white dark:bg-gray-800 shadow-sm border-b ${className}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left Section */}
          <div className="flex items-center space-x-2 sm:space-x-4 flex-1 min-w-0">
            {/* Back Button */}
            {showBackButton && (
              <Link href={backButtonHref}>
                <Button variant="ghost" size="sm" className="flex-shrink-0">
                  <ArrowLeft className="h-4 w-4" />
                  <span className="hidden sm:inline ml-2">
                    {backButtonText}
                  </span>
                </Button>
              </Link>
            )}

            {/* Logo and Title */}
            <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
              <div className="p-1.5 sm:p-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex-shrink-0">
                <Calendar className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white truncate">
                  {title}
                </h1>
                {subtitle && (
                  <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 truncate hidden sm:block">
                    {subtitle}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Right Section - Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Center Section - Actions */}
            {actions && (
              <div className="flex items-center space-x-4">{actions}</div>
            )}

            {/* Notifications */}
            <DropdownMenu
              open={showNotifications}
              onOpenChange={setShowNotifications}
            >
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
                      <DropdownMenuItem
                        key={notification.id}
                        className="flex flex-col items-start p-4 cursor-pointer"
                      >
                        <div className="flex items-start justify-between w-full">
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              {notification.title}
                            </p>
                            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                              {notification.message}
                            </p>
                            <p className="text-xs text-gray-500 mt-2">
                              {notification.time}
                            </p>
                          </div>
                          {!notification.read && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full mt-1 ml-2" />
                          )}
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
                  disabled={loading}
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={currentUser.avatar || "Professional1.png"}
                          alt={currentUser.fullName || "Usuario"}
                        />
                        <AvatarFallback>{currentUser.fullName}</AvatarFallback>
                      </Avatar>
                      <div className="text-left">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {currentUser.fullName}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {currentUser.role.name|| "Usuario"}
                        </p>
                      </div>
                      <ChevronDown className="h-4 w-4 text-gray-500" />
                    </>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">{currentUser.fullName}</p>
                    <p className="text-xs text-gray-500">{currentUser.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="flex items-center">
                    <UserIcon className="h-4 w-4 mr-2" />
                    Mi Perfil
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/settings" className="flex items-center">
                    <Settings className="h-4 w-4 mr-2" />
                    Configuración
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/billing" className="flex items-center">
                    <CreditCard className="h-4 w-4 mr-2" />
                    Facturación
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/security" className="flex items-center">
                    <Shield className="h-4 w-4 mr-2" />
                    Seguridad
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
                <DropdownMenuItem asChild
                 onClick={logout}
                >
                  <Link
                    href="/login"
                    className="flex items-center text-red-600 hover:text-red-700"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Cerrar Sesión
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Right Section - Mobile */}
          <div className="flex md:hidden items-center space-x-2">
            {/* Notifications - Mobile */}
            <DropdownMenu
              open={showNotifications}
              onOpenChange={setShowNotifications}
            >
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  {notifications.count > 0 && (
                    <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                      {notifications.count > 9 ? "9+" : notifications.count}
                    </span>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-80 max-w-[calc(100vw-2rem)]"
              >
                <DropdownMenuLabel className="flex items-center justify-between">
                  <span>Notificaciones</span>
                  {notifications.count > 0 && (
                    <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">
                      {notifications.count} nuevas
                    </span>
                  )}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div className="max-h-60 overflow-y-auto">
                  {notificationItems.length > 0 ? (
                    notificationItems.map((notification) => (
                      <DropdownMenuItem
                        key={notification.id}
                        className="flex flex-col items-start p-3 cursor-pointer"
                      >
                        <div className="flex items-start justify-between w-full">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                              {notification.title}
                            </p>
                            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                              {notification.message}
                            </p>
                            <p className="text-xs text-gray-500 mt-2">
                              {notification.time}
                            </p>
                          </div>
                          {!notification.read && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full mt-1 ml-2 flex-shrink-0" />
                          )}
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

            {/* Mobile Menu */}
            <DropdownMenu
              open={showMobileMenu}
              onOpenChange={setShowMobileMenu}
            >
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                {/* User Info */}
                <DropdownMenuLabel>
                  <div className="flex items-center space-x-3">
                    {loading ? (
                      <Loader2 className="h-8 w-8 animate-spin" />
                    ) : (
                      <>
                        <Avatar className="h-8 w-8">
                          <AvatarImage
                            src={currentUser.avatar || "Professional1.png"}
                            alt={currentUser.fullName || "Usuario"}
                          />
                          <AvatarFallback>{currentUser.fullName}</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col space-y-1 min-w-0">
                          <p className="text-sm font-medium truncate">
                            {currentUser.fullName}
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            {currentUser.role.name}
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />

                {/* Theme Toggle */}
                <DropdownMenuItem asChild>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center">
                      <Settings className="h-4 w-4 mr-2" />
                      Tema
                    </span>
                    <ThemeToggle variant="ghost" size="sm" />
                  </div>
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                {/* Navigation Items */}
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="flex items-center">
                    <UserIcon className="h-4 w-4 mr-2" />
                    Mi Perfil
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/settings" className="flex items-center">
                    <Settings className="h-4 w-4 mr-2" />
                    Configuración
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/billing" className="flex items-center">
                    <CreditCard className="h-4 w-4 mr-2" />
                    Facturación
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/security" className="flex items-center">
                    <Shield className="h-4 w-4 mr-2" />
                    Seguridad
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
                  <Link
                    href="/login"
                    className="flex items-center text-red-600 hover:text-red-700"
                  >
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
          <div className="md:hidden pb-4 border-t border-gray-200 dark:border-gray-700 mt-4 pt-4">
            <div className="flex flex-wrap gap-2">{actions}</div>
          </div>
        )}
      </div>
    </header>
  );
}