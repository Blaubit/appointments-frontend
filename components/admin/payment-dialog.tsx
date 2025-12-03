import { useState, useEffect } from "react";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { CalendarIcon, CreditCard, Loader2 } from "lucide-react";
import { PaymentDto } from "@/types/dto/subscription/payment.dto";

interface PaymentDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (payment: PaymentDto) => Promise<boolean>;
  subscriptionId: string;
  defaultAmount?: number;
  isSubmitting?: boolean;
}

export function PaymentDialog({
  open,
  onClose,
  onSubmit,
  subscriptionId,
  defaultAmount = 9.99,
  isSubmitting = false,
}: PaymentDialogProps) {
  const [paymentDate, setPaymentDate] = useState<Date | undefined>();
  const [paymentMethod, setPaymentMethod] = useState<string>("card");
  const [amount, setAmount] = useState<number>(defaultAmount);
  const [reference, setReference] = useState<string | undefined>();

  useEffect(() => {
    if (open) {
      setPaymentDate(undefined);
      setPaymentMethod("card");
      setAmount(defaultAmount);
      setReference(undefined);
    }
  }, [open, defaultAmount]);

  const handleSubmit = async () => {
    if (!paymentDate || isSubmitting) return;

    await onSubmit({
      subscriptionId,
      amount,
      paymentDate: format(paymentDate, "yyyy-MM-dd"),
      paymentMethod,
      status: "completed",
      reference,
    });
  };

  const handleCancel = () => {
    if (isSubmitting) return;
    onClose();
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen && !isSubmitting) {
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        className="sm:max-w-[425px]"
        onInteractOutside={(e) => {
          if (isSubmitting) {
            e.preventDefault();
          }
        }}
        onEscapeKeyDown={(e) => {
          if (isSubmitting) {
            e.preventDefault();
          }
        }}
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Registrar Pago
          </DialogTitle>
          <DialogDescription>
            Complete los datos del pago para registrarlo en el sistema.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Fecha de pago</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={`w-full justify-start text-left font-normal ${
                    !paymentDate && "text-muted-foreground"
                  }`}
                  disabled={isSubmitting}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {paymentDate
                    ? format(paymentDate, "PPP", { locale: es })
                    : "Selecciona una fecha"}
                </Button>
              </PopoverTrigger>
              <PopoverContent align="start" className="w-auto p-0">
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

          <div className="space-y-2">
            <label className="text-sm font-medium">Método de pago</label>
            <Select
              value={paymentMethod}
              onValueChange={setPaymentMethod}
              disabled={isSubmitting}
            >
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

          <div className="space-y-2">
            <label className="text-sm font-medium">Monto</label>
            <Input
              type="number"
              min={0}
              step="0. 01"
              value={amount}
              onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Referencia (opcional)</label>
            <Input
              type="text"
              value={reference || ""}
              onChange={(e) => setReference(e.target.value)}
              placeholder="Referencia del pago"
              disabled={isSubmitting}
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button
            className="bg-green-600 hover:bg-green-700 text-white"
            onClick={handleSubmit}
            disabled={!paymentDate || isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Procesando...
              </>
            ) : (
              "Registrar pago"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
