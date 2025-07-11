import React, { useState, useEffect } from "react";
import { Sun, Moon, Monitor, Download } from "lucide-react";
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
  theme: "light" | "dark" | "system";
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
  const [appearanceSettings, setAppearanceSettings] =
    useState<AppearanceSettings>({
      theme: "light",
      language: "es",
      currency: "USD",
      dateFormat: "DD/MM/YYYY",
      timeFormat: "12h",
      ...initialSettings,
    });

  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Load initial theme from localStorage on component mount
  useEffect(() => {
    try {
      const savedSettings = localStorage.getItem("appearance-settings");
      if (savedSettings) {
        const parsedSettings = JSON.parse(savedSettings);
        setAppearanceSettings((prev) => ({
          ...prev,
          ...parsedSettings,
          ...initialSettings, // initialSettings override saved settings
        }));
      }
    } catch (error) {
      console.error("Error loading saved settings:", error);
    }
  }, []);

  // Apply theme to document
  useEffect(() => {
    const applyTheme = () => {
      const root = document.documentElement;

      if (appearanceSettings.theme === "dark") {
        root.classList.add("dark");
      } else if (appearanceSettings.theme === "light") {
        root.classList.remove("dark");
      } else {
        // system
        const systemPrefersDark = window.matchMedia(
          "(prefers-color-scheme: dark)",
        ).matches;
        if (systemPrefersDark) {
          root.classList.add("dark");
        } else {
          root.classList.remove("dark");
        }
      }
    };

    applyTheme();

    // Listen for system theme changes when using system theme
    if (appearanceSettings.theme === "system") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const handleChange = () => applyTheme();

      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }
  }, [appearanceSettings.theme]);

  const handleSaveAppearance = async (): Promise<void> => {
    setIsLoading(true);
    try {
      // Simular guardado
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Save to localStorage for persistence
      localStorage.setItem(
        "appearance-settings",
        JSON.stringify(appearanceSettings),
      );

      onSave?.(appearanceSettings);
      console.log("Configuración guardada:", appearanceSettings);
    } catch (error) {
      console.error("Error al guardar:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportData = (): void => {
    try {
      const dataToExport = {
        appearanceSettings,
        exportDate: new Date().toISOString(),
        version: "1.0",
      };

      const dataStr = JSON.stringify(dataToExport, null, 2);
      const dataUri =
        "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);

      const exportFileDefaultName = `configuracion_${new Date().toISOString().split("T")[0]}.json`;

      const linkElement = document.createElement("a");
      linkElement.setAttribute("href", dataUri);
      linkElement.setAttribute("download", exportFileDefaultName);
      linkElement.click();

      onExport?.();
    } catch (error) {
      console.error("Error al exportar datos:", error);
    }
  };

  const handleThemeChange = (newTheme: "light" | "dark" | "system") => {
    setAppearanceSettings((prev) => ({
      ...prev,
      theme: newTheme,
    }));
  };

  const themeOptions = [
    { value: "light", label: "Claro", icon: Sun },
    { value: "dark", label: "Oscuro", icon: Moon },
    { value: "system", label: "Sistema", icon: Monitor },
  ];

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
          <h4 className="font-medium">Tema</h4>
          <div className="grid grid-cols-3 gap-4">
            {themeOptions.map((option) => {
              const IconComponent = option.icon;
              return (
                <div
                  key={option.value}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    appearanceSettings.theme === option.value
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
              onValueChange={(value) =>
                setAppearanceSettings({
                  ...appearanceSettings,
                  language: value,
                })
              }
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
              onValueChange={(value) =>
                setAppearanceSettings({
                  ...appearanceSettings,
                  currency: value,
                })
              }
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
                setAppearanceSettings({
                  ...appearanceSettings,
                  dateFormat: value,
                })
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
                setAppearanceSettings({
                  ...appearanceSettings,
                  timeFormat: value,
                })
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

        <div className="space-y-4">
          <h4 className="font-medium">Exportar Datos</h4>
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <h5 className="font-medium">Descargar Datos</h5>
              <p className="text-sm text-gray-500">
                Exporta todos tus datos en formato JSON
              </p>
            </div>
            <Button variant="outline" onClick={handleExportData}>
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </Button>
          </div>
        </div>

        <div className="flex justify-end">
          <Button onClick={handleSaveAppearance} disabled={isLoading}>
            {isLoading ? "Guardando..." : "Guardar Cambios"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
