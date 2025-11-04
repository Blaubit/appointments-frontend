"use client";

import { useState } from "react";
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
  const [amount, setAmount] = useState(total);
  const [method, setMethod] = useState("efectivo");

  const handlePay = () => {
    if (appointment && onPay) {
      onPay(appointment, { amount, method });
    }
    onClose();
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
              <strong>Monto total:</strong> {formatCurrency(total)}
            </p>
          </div>
          <div>
            <label className="block text-sm mb-1">Monto a pagar</label>
            <Input
              type="number"
              min={0}
              max={total}
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Método de pago</label>
            <Select value={method} onValueChange={setMethod}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona método" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="efectivo">Efectivo</SelectItem>
                <SelectItem value="tarjeta">Tarjeta</SelectItem>
                <SelectItem value="transferencia">Transferencia</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handlePay} disabled={amount <= 0 || amount > total}>
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
