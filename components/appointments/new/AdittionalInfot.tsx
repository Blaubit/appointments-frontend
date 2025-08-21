import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type FormData = {
  notes: string;
};

type Props = {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
};

export const AdditionalInfo: React.FC<Props> = ({ formData, setFormData }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Información Adicional</CardTitle>
        <CardDescription>
          Notas y detalles especiales para la cita
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="notes">Notas</Label>
          <Textarea
            id="notes"
            value={formData.notes}
            onChange={(e) =>
              setFormData({ ...formData, notes: e.target.value })
            }
            placeholder="Información adicional, instrucciones especiales, etc."
            rows={3}
          />
        </div>
      </CardContent>
    </Card>
  );
};
