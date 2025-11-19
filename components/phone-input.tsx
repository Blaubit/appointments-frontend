"use client";
import React, { useEffect, useState } from "react";
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
  // value expected by parent can be:
  // - raw full: "+50232470635" (best, this will be preserved as the form value)
  // - or display formatted like "3247 0635" (component will normalize)
  value: string;
  // onChange will be called with (rawFullPhone, countryCode)
  // rawFullPhone should be concatenated as "+50232470635" (no spaces)
  onChange: (phone: string, countryCode: string) => void;
  onCountryChange?: (country: Country) => void;
  label?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  id?: string;
}

function parseIncomingValue(value: string): {
  countryCode?: string;
  localDigits: string;
} {
  if (!value) return { countryCode: undefined, localDigits: "" };

  // If value starts with +, try to match known country prefixes (longest match)
  if (value.startsWith("+")) {
    const digitsOnly = value.replace(/\D/g, "");
    // Build list of known country digits
    const prefixes = Object.values(COUNTRIES)
      .map((c) => c.countryCode.replace("+", ""))
      .sort((a, b) => b.length - a.length); // longest first
    for (const prefix of prefixes) {
      if (digitsOnly.startsWith(prefix)) {
        const local = digitsOnly.slice(prefix.length);
        return { countryCode: `+${prefix}`, localDigits: local };
      }
    }
    // If no known prefix, just strip + and return
    return { countryCode: "+" + digitsOnly, localDigits: "" };
  }

  // Otherwise treat value as local: strip non-digits
  const localDigits = value.replace(/\D/g, "");
  return { countryCode: undefined, localDigits };
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
  const parsed = parseIncomingValue(value);
  // Determine initial selected country from incoming value if present
  const initialCountryCode =
    parsed.countryCode &&
    Object.values(COUNTRIES).some((c) => c.countryCode === parsed.countryCode)
      ? Object.values(COUNTRIES).find(
          (c) => c.countryCode === parsed.countryCode
        )!.code
      : "GT";

  const [selectedCountryCode, setSelectedCountryCode] =
    useState<string>(initialCountryCode);
  const selectedCountry = COUNTRIES[selectedCountryCode];

  // Sync selected country when parent value changes and contains a country code
  useEffect(() => {
    if (parsed.countryCode) {
      const found = Object.values(COUNTRIES).find(
        (c) => c.countryCode === parsed.countryCode
      );
      if (found && found.code !== selectedCountryCode) {
        setSelectedCountryCode(found.code);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  // Compute display value from incoming value and selected country
  const computeDisplayValue = (): string => {
    // If incoming value had an explicit countryCode, use its localDigits and format according to selected country
    const { localDigits } = parsed;
    return selectedCountry.format(localDigits);
  };

  const displayValue = computeDisplayValue();

  const getLocalLimit = (code: string) => {
    if (code === "GT") return 8;
    if (code === "US") return 10;
    if (code === "MX") return 10;
    if (code === "SV") return 8;
    if (code === "HN") return 8;
    return 10;
  };

  const handleCountryChange = (countryCode: string) => {
    const country = COUNTRIES[countryCode];
    setSelectedCountryCode(countryCode);
    if (onCountryChange) {
      onCountryChange(country);
    }

    // Preserve local digits if any from current value, and re-emit with new country
    const currentParsed = parseIncomingValue(value);
    const local = currentParsed.localDigits || "";
    const limited = local.slice(0, getLocalLimit(countryCode));
    const rawFull = limited ? `${country.countryCode}${limited}` : "";
    // Emit raw full phone (concatenated) and the country code
    onChange(rawFull, country.countryCode);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let phoneValue = e.target.value;

    // Remove non-numeric
    const digitsOnly = phoneValue.replace(/\D/g, "");

    // Limit according to current country
    const limit = getLocalLimit(selectedCountryCode);
    const limitedDigits = digitsOnly.slice(0, limit);

    // Build raw full (country code + digits, no spaces)
    const rawFull = limitedDigits
      ? `${selectedCountry.countryCode}${limitedDigits}`
      : "";

    // Call onChange with raw full + countryCode so parent stores the raw form value
    onChange(rawFull, selectedCountry.countryCode);
  };

  // Determine maxLength for input (visual), approximate taking separators into account
  const visualMaxLength =
    selectedCountryCode === "GT" ||
    selectedCountryCode === "SV" ||
    selectedCountryCode === "HN"
      ? 9
      : selectedCountryCode === "US"
        ? 14
        : 14; // MX etc.

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
            value={displayValue}
            onChange={handlePhoneChange}
            placeholder={placeholder}
            disabled={disabled}
            className={error ? "border-red-500" : ""}
            maxLength={visualMaxLength}
          />
        </div>
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
