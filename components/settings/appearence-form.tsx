"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Sun, Moon, Monitor, Download } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

// Types
interface AppearanceSettings {
  theme: "light" | "dark" | "system" | string;
  language: string;
  currency: string;
  dateFormat: string;
  timeFormat: string;
}

interface Language {
  value: string;
  label: string;
}

interface Currency {
  value: string;
  label: string;
}

interface AppearanceSettingsProps {
  onSave?: (settings: AppearanceSettings) => void;
  onExport?: () => void;
  initialSettings?: Partial<AppearanceSettings>;
}

// Mock data
const languages: Language[] = [
  { value: "es", label: "Español" },
  { value: "en", label: "English" },
  { value: "fr", label: "Français" },
  { value: "de", label: "Deutsch" },
  { value: "it", label: "Italiano" },
  { value: "pt", label: "Português" },
];

const currencies: Currency[] = [
  { value: "USD", label: "USD - Dólar Estadounidense" },
  { value: "EUR", label: "EUR - Euro" },
  { value: "GBP", label: "GBP - Libra Esterlina" },
  { value: "JPY", label: "JPY - Yen Japonés" },
  { value: "GTQ", label: "GTQ - Quetzal Guatemalteco" },
  { value: "MXN", label: "MXN - Peso Mexicano" },
];

// Main component
export const AppearenceForm: React.FC<AppearanceSettingsProps> = ({
  onSave,
  onExport,
  initialSettings = {},
}) => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Default settings
  const defaultSettings: AppearanceSettings = {
    theme: "system",
    language: "es",
    currency: "USD",
    dateFormat: "DD/MM/YYYY",
    timeFormat: "12h",
  };

  const [appearanceSettings, setAppearanceSettings] =
    useState<AppearanceSettings>(defaultSettings);

  // Handle mounting state for next-themes
  useEffect(() => {
    setMounted(true);
  }, []);

  // Load initial settings only once when component mounts and is hydrated
  useEffect(() => {
    if (!mounted) return;

    let hasLoaded = false;

    const loadSettings = () => {
      if (hasLoaded) return;
      hasLoaded = true;

      try {
        const savedSettings = localStorage.getItem("appearance-settings");
        let parsedSettings = {};

        if (savedSettings) {
          parsedSettings = JSON.parse(savedSettings);
        }

        // Get current theme from next-themes
        const currentTheme = theme || "system";

        const finalSettings = {
          ...defaultSettings,
          ...parsedSettings,
          theme: currentTheme, // Always use current theme from next-themes
          ...initialSettings, // initialSettings override everything
        };

        setAppearanceSettings(finalSettings);
      } catch (error) {
        console.error("Error loading saved settings:", error);
        // Fallback with current theme
        setAppearanceSettings({
          ...defaultSettings,
          theme: theme || "system",
          ...initialSettings,
        });
      }
    };

    // Add a small delay to prevent hydration issues
    const timeoutId = setTimeout(loadSettings, 100);

    return () => clearTimeout(timeoutId);
  }, [mounted]);

  // Update theme in settings only when next-themes theme changes
  useEffect(() => {
    if (!mounted || !theme) return;

    setAppearanceSettings((prev) => {
      // Only update if theme actually changed
      if (prev.theme !== theme) {
        return { ...prev, theme: theme as "light" | "dark" | "system" };
      }
      return prev;
    });
  }, [theme, mounted]);

  // const handleSaveAppearance = useCallback(async (): Promise<void> => {
  //   setIsLoading(true);
  //   try {
  //     // Simulate save delay
  //     await new Promise((resolve) => setTimeout(resolve, 1000));

  //     // Save to localStorage for persistence
  //     localStorage.setItem(
  //       "appearance-settings",
  //       JSON.stringify(appearanceSettings),
  //     );

  //     onSave?.(appearanceSettings);
  //     console.log("Configuración guardada:", appearanceSettings);
  //   } catch (error) {
  //     console.error("Error al guardar:", error);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // }, [appearanceSettings, onSave]);

  // const handleExportData = useCallback((): void => {
  //   try {
  //     const dataToExport = {
  //       appearanceSettings,
  //       exportDate: new Date().toISOString(),
  //       version: "1.0",
  //     };

  //     const dataStr = JSON.stringify(dataToExport, null, 2);
  //     const dataUri =
  //       "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);

  //     const exportFileDefaultName = `configuracion_${new Date().toISOString().split("T")[0]}.json`;

  //     const linkElement = document.createElement("a");
  //     linkElement.setAttribute("href", dataUri);
  //     linkElement.setAttribute("download", exportFileDefaultName);
  //     linkElement.click();

  //     onExport?.();
  //   } catch (error) {
  //     console.error("Error al exportar datos:", error);
  //   }
  // }, [appearanceSettings, onExport]);

  const handleThemeChange = useCallback(
    (newTheme: "light" | "dark" | "system") => {
      // Apply theme immediately using next-themes
      setTheme(newTheme);

      // Update local state
      setAppearanceSettings((prev) => ({
        ...prev,
        theme: newTheme,
      }));
    },
    [setTheme],
  );

  const handleSettingChange = useCallback(
    (key: keyof AppearanceSettings, value: string) => {
      setAppearanceSettings((prev) => ({
        ...prev,
        [key]: value,
      }));
    },
    [],
  );

  const themeOptions = [
    { value: "light", label: "Claro", icon: Sun },
    { value: "dark", label: "Oscuro", icon: Moon },
    { value: "system", label: "Sistema", icon: Monitor },
  ];

  // Show loading state until mounted (next-themes requirement)
  if (!mounted) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Apariencia y Localización</CardTitle>
          <CardDescription>Cargando configuración...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Apariencia y Localización</CardTitle>
        <CardDescription>
          Personaliza la apariencia y configuración regional
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium">Tema</h4>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Actual:{" "}
              {theme === "light"
                ? "Claro"
                : theme === "dark"
                  ? "Oscuro"
                  : "Sistema"}
            </p>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {themeOptions.map((option) => {
              const IconComponent = option.icon;
              return (
                <div
                  key={option.value}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    theme === option.value
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                      : "border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600"
                  }`}
                  onClick={() =>
                    handleThemeChange(
                      option.value as "light" | "dark" | "system",
                    )
                  }
                >
                  <div className="flex items-center space-x-2">
                    <IconComponent className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                    <span className="text-gray-900 dark:text-gray-100">
                      {option.label}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <Separator />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="language">Idioma</Label>
            <Select
              value={appearanceSettings.language}
              onValueChange={(value) => handleSettingChange("language", value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {languages.map((lang) => (
                  <SelectItem key={lang.value} value={lang.value}>
                    {lang.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="currency">Moneda</Label>
            <Select
              value={appearanceSettings.currency}
              onValueChange={(value) => handleSettingChange("currency", value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {currencies.map((currency) => (
                  <SelectItem key={currency.value} value={currency.value}>
                    {currency.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="dateFormat">Formato de Fecha</Label>
            <Select
              value={appearanceSettings.dateFormat}
              onValueChange={(value) =>
                handleSettingChange("dateFormat", value)
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="timeFormat">Formato de Hora</Label>
            <Select
              value={appearanceSettings.timeFormat}
              onValueChange={(value) =>
                handleSettingChange("timeFormat", value)
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="12h">12 horas (AM/PM)</SelectItem>
                <SelectItem value="24h">24 horas</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Separator />
      </CardContent>
    </Card>
  );
};
