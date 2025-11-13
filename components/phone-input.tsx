"use client";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Country {
  code: string;
  countryCode: string;
  name: string;
  format: (value: string) => string;
}

const COUNTRIES: Record<string, Country> = {
  GT: {
    code: "GT",
    countryCode: "+502",
    name: "Guatemala",
    format: (value: string) => {
      // Formato: 1234 5678
      if (value.length <= 4) {
        return value;
      }
      return `${value.slice(0, 4)} ${value.slice(4, 8)}`;
    },
  },
  US: {
    code: "US",
    countryCode: "+1",
    name: "United States",
    format: (value: string) => {
      // Formato: (123) 456-7890
      if (value.length <= 3) {
        return value;
      }
      if (value.length <= 6) {
        return `(${value.slice(0, 3)}) ${value.slice(3)}`;
      }
      return `(${value.slice(0, 3)}) ${value.slice(3, 6)}-${value.slice(6, 10)}`;
    },
  },
  MX: {
    code: "MX",
    countryCode: "+52",
    name: "Mexico",
    format: (value: string) => {
      // Formato: 12 3456 7890
      if (value.length <= 2) {
        return value;
      }
      if (value.length <= 6) {
        return `${value.slice(0, 2)} ${value.slice(2)}`;
      }
      return `${value.slice(0, 2)} ${value.slice(2, 6)} ${value.slice(6, 10)}`;
    },
  },
  SV: {
    code: "SV",
    countryCode: "+503",
    name: "El Salvador",
    format: (value: string) => {
      // Formato: 2222 3333
      if (value.length <= 4) {
        return value;
      }
      return `${value.slice(0, 4)} ${value.slice(4, 8)}`;
    },
  },
  HN: {
    code: "HN",
    countryCode: "+504",
    name: "Honduras",
    format: (value: string) => {
      // Formato: 2222 3333
      if (value.length <= 4) {
        return value;
      }
      return `${value.slice(0, 4)} ${value.slice(4, 8)}`;
    },
  },
};

interface PhoneInputProps {
  value: string;
  onChange: (phone: string, countryCode: string) => void;
  onCountryChange?: (country: Country) => void;
  label?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  id?: string;
}

export function PhoneInput({
  value,
  onChange,
  onCountryChange,
  label = "Teléfono",
  placeholder = "Ingrese su número",
  required = false,
  disabled = false,
  error,
  id = "phone-input",
}: PhoneInputProps) {
  const [selectedCountryCode, setSelectedCountryCode] = useState<string>("GT");
  const selectedCountry = COUNTRIES[selectedCountryCode];

  const handleCountryChange = (countryCode: string) => {
    setSelectedCountryCode(countryCode);
    const country = COUNTRIES[countryCode];
    if (onCountryChange) {
      onCountryChange(country);
    }
    // Limpiar el número cuando cambia el país
    onChange("", country.countryCode);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let phoneValue = e.target.value;

    // Remover caracteres no numéricos
    const digitsOnly = phoneValue.replace(/\D/g, "");

    // Limitar según el país
    let limitedDigits = digitsOnly;
    if (selectedCountryCode === "GT") {
      limitedDigits = digitsOnly.slice(0, 8);
    } else if (selectedCountryCode === "US") {
      limitedDigits = digitsOnly.slice(0, 10);
    } else if (selectedCountryCode === "MX") {
      limitedDigits = digitsOnly.slice(0, 10);
    } else if (selectedCountryCode === "SV" || selectedCountryCode === "HN") {
      limitedDigits = digitsOnly.slice(0, 8);
    }

    // Aplicar formato
    const formattedPhone = selectedCountry.format(limitedDigits);

    onChange(formattedPhone, selectedCountry.countryCode);
  };

  return (
    <div className="space-y-2">
      {label && (
        <Label htmlFor={id}>
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </Label>
      )}
      <div className="flex gap-2">
        <Select value={selectedCountryCode} onValueChange={handleCountryChange}>
          <SelectTrigger className="w-20 md:w-24">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(COUNTRIES).map(([code, country]) => (
              <SelectItem key={code} value={code}>
                <span className="flex items-center gap-2">
                  <span className="font-medium">{country.countryCode}</span>
                  <span className="text-gray-600">{country.name}</span>
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex-1 relative">
          <Input
            id={id}
            type="tel"
            value={value}
            onChange={handlePhoneChange}
            placeholder={placeholder}
            disabled={disabled}
            className={error ? "border-red-500" : ""}
            maxLength={
              selectedCountryCode === "GT" ||
              selectedCountryCode === "SV" ||
              selectedCountryCode === "HN"
                ? 9
                : 14
            }
          />
        </div>
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
