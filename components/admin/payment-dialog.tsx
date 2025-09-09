import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { CreditCard } from "lucide-react";

interface PaymentDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (payment: {
    subscriptionId: string;
    amount: number;
    paymentDate: string;
    paymentMethod: string;
    status: string;
  }) => void;
  subscriptionId: string;
  defaultAmount?: number;
}

export function PaymentDialog({
  open,
  onClose,
  onSubmit,
  subscriptionId,
  defaultAmount = 9.99,
}: PaymentDialogProps) {
  const [paymentDate, setPaymentDate] = useState<Date | undefined>();
  const [paymentMethod, setPaymentMethod] = useState<string>("card");
  const [amount, setAmount] = useState<number>(defaultAmount);

  const handleSubmit = () => {
    if (!paymentDate) return;
    onSubmit({
      subscriptionId,
      amount,
      paymentDate: format(paymentDate, "yyyy-MM-dd"),
      paymentMethod,
      status: "completed",
    });
    onClose();
    setPaymentDate(undefined);
    setPaymentMethod("card");
    setAmount(defaultAmount);
  };

  return (
    <Popover open={open} onOpenChange={onClose}>
      <PopoverTrigger asChild>
        <span />
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="space-y-4">
          <h4 className="text-lg font-medium mb-2 flex items-center gap-2">
            <CreditCard className="h-5 w-5" /> Registrar pago
          </h4>
          <div>
            <label className="block text-sm font-medium mb-1">
              Fecha de pago
            </label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={`w-full justify-start text-left ${paymentDate ? "" : "text-muted-foreground"}`}
                >
                  {paymentDate
                    ? format(paymentDate, "PPP", { locale: es })
                    : "Selecciona una fecha"}
                </Button>
              </PopoverTrigger>
              <PopoverContent align="start" className="p-0">
                <Calendar
                  mode="single"
                  locale={es}
                  selected={paymentDate}
                  onSelect={setPaymentDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Método de pago
            </label>
            <Select value={paymentMethod} onValueChange={setPaymentMethod}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Método de pago" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="card">Tarjeta</SelectItem>
                <SelectItem value="cash">Efectivo</SelectItem>
                <SelectItem value="transfer">Transferencia</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Monto</label>
            <Input
              type="number"
              min={0}
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
            />
          </div>
          <div className="flex gap-2 justify-end pt-2">
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button
              className="bg-green-600 hover:bg-green-700 text-white"
              onClick={handleSubmit}
              disabled={!paymentDate}
            >
              Registrar pago
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
