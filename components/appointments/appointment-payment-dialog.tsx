"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import type { Appointment } from "@/types";
import formatCurrency from "@/utils/functions/formatCurrency"; // Usa tu propio formatCurrency

type Props = {
  appointment?: Appointment | null;
  isOpen: boolean;
  onClose: () => void;
  onPay?: (
    appointment: Appointment,
    paymentData: { amount: number; method: string }
  ) => void;
};

export function AppointmentPaymentDialog({
  appointment,
  isOpen,
  onClose,
  onPay,
}: Props) {
  const total =
    appointment?.services?.reduce(
      (acc: number, s: any) => acc + (Number(s.price) || 0),
      0
    ) ?? 0;

  const totalPaid = Number(appointment?.payment?.paidAmount) || 0;
  const remaining = Math.max(0, Number((total - totalPaid).toFixed(2)));

  // Use a string state so user can delete the input (avoid numeric input auto-converting to 0)
  const [amountStr, setAmountStr] = useState<string>(remaining.toString());
  const [method, setMethod] = useState("cash");

  // When dialog opens or appointment changes, reset the amount to the remaining amount
  useEffect(() => {
    if (isOpen) {
      setAmountStr(remaining.toString());
      setMethod("cash");
    }
  }, [isOpen, remaining]);

  // Helper to sanitize user input allowing numbers and single decimal point
  const sanitizeInput = (value: string) => {
    // Allow empty string to let user delete and re-type
    if (value === "") return "";

    // Replace commas with dots (in case user types comma)
    let v = value.replace(/,/g, ".");
    // Remove any character that is not digit or dot
    v = v.replace(/[^0-9.]/g, "");
    // Remove additional dots (keep only the first)
    const parts = v.split(".");
    if (parts.length > 1) {
      v = parts[0] + "." + parts.slice(1).join("");
    }
    return v;
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    const cleaned = sanitizeInput(raw);

    // If cleaned is empty, allow the empty string so the user can type fresh number
    if (cleaned === "") {
      setAmountStr("");
      return;
    }

    // Parse number to enforce max (remaining)
    const parsed = parseFloat(cleaned);
    if (Number.isNaN(parsed)) {
      setAmountStr("");
      return;
    }

    // If parsed > remaining, cap to remaining
    if (parsed > remaining) {
      // Keep format consistent: remove trailing zeros if possible
      const capped =
        remaining % 1 === 0 ? String(remaining) : String(remaining.toFixed(2));
      setAmountStr(capped);
    } else {
      // Avoid leading zeros like "01" being awkward: if user types "01" we keep it as "1"
      if (/^0\d+/.test(cleaned) && !cleaned.includes(".")) {
        setAmountStr(String(parseInt(cleaned, 10)));
      } else {
        setAmountStr(cleaned);
      }
    }
  };

  const parsedAmount = parseFloat(amountStr || "0") || 0;
  const isConfirmDisabled = parsedAmount <= 0 || parsedAmount > remaining;

  const handlePay = () => {
    if (!appointment) return;
    // Ensure amount is within bounds
    const amountToPay = Math.min(parsedAmount, remaining);
    if (onPay) {
      onPay(appointment, { amount: amountToPay, method });
    }
    // Do NOT call onClose() here: parent (onPay) is expected to control dialog closing.
    // If you prefer the dialog to be closed here, uncomment the next line:
    // onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Pagar cita</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-600">
              paciente: <strong>{appointment?.client?.fullName}</strong>
            </p>
            <div>
              <span className="text-sm text-gray-600">Servicios:</span>
              <ul className="list-disc pl-5">
                {appointment?.services?.map((s: any) => (
                  <li key={s.id}>
                    {s.name} ({formatCurrency(Number(s.price) || 0)})
                  </li>
                ))}
              </ul>
            </div>
            <p className="text-sm mt-2">
              <strong>Total a pagar:</strong> {formatCurrency(total)}
            </p>
            <p className="text-sm">
              <strong>Total pagado:</strong> {formatCurrency(totalPaid)}
            </p>
            <p className="text-sm">
              <strong>Restante:</strong> {formatCurrency(remaining)}
            </p>
          </div>

          <div>
            <label className="block text-sm mb-1">Monto a pagar</label>
            <Input
              // Use text input while keeping numeric validation ourselves
              type="text"
              inputMode="decimal"
              pattern="[0-9]*"
              placeholder={remaining.toString()}
              value={amountStr}
              onChange={handleAmountChange}
            />
            <p className="text-xs text-gray-500 mt-1">
              El monto no puede ser mayor al restante (
              {formatCurrency(remaining)}).
            </p>
          </div>

          <div>
            <label className="block text-sm mb-1">Método de pago</label>
            <Select value={method} onValueChange={setMethod}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona método" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cash">Efectivo</SelectItem>
                <SelectItem value="card">Tarjeta</SelectItem>
                <SelectItem value="transfer">Transferencia</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button onClick={handlePay} disabled={isConfirmDisabled}>
            Confirmar pago
          </Button>
          <DialogClose asChild>
            <Button variant="outline">Cancelar</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
