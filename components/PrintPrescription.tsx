import { Company } from "@/types";
import React from "react";

interface PrintPrescriptionProps {
  doctor: string;
  patient: string;
  date: string;
  diagnosis: string;
  treatment: string;
  notes: string;
  clinic?: Company;
}

export const PrintPrescription: React.FC<PrintPrescriptionProps> = ({
  doctor,
  patient,
  date,
  diagnosis,
  treatment,
  notes,
  clinic,
}) => (
  <div id="prescription-print" className="prescription-print">
    <div className="prescription-header">
      <h1 className="clinic-name">{clinic?.name || "Clínica Médica"}</h1>
      <p className="clinic-info">
        {clinic?.address || "Dirección"} • {clinic?.phones?.[0] || "Teléfono"}
      </p>
      <hr className="divider" />
    </div>
    <h2 className="prescription-title">Receta Médica</h2>
    <div className="prescription-section">
      <strong>Paciente:</strong> {patient}
    </div>
    <div className="prescription-section">
      <strong>Fecha:</strong> {date}
    </div>
    <div className="prescription-section">
      <strong>Doctor:</strong> {doctor}
    </div>
    <hr className="divider" />
    <div className="prescription-section">
      <strong>Diagnóstico:</strong>
      <p className="text-box">{diagnosis}</p>
    </div>
    <div className="prescription-section">
      <strong>Tratamiento/Plan:</strong>
      <p className="text-box">{treatment}</p>
    </div>
    <div className="prescription-section">
      <strong>Observaciones:</strong>
      <p className="text-box">{notes}</p>
    </div>
    <div className="signature-section">
      <span className="signature-line">Firma y Sello:</span>
      <br />
      <br />
      <span className="signature-space">_______________________________</span>
    </div>
    <div className="doctor-name">{doctor}</div>
    <style jsx global>{`
      .prescription-print {
        font-family: "Times New Roman", Times, serif;
        background: #fff;
        color: #222;
        width: 600px;
        margin: 40px auto;
        padding: 32px 40px;
        border: 4px double #3b82f6;
        box-shadow: 0 4px 32px rgba(0, 0, 0, 0.09);
      }
      .prescription-header {
        text-align: center;
        margin-bottom: 10px;
      }
      .clinic-name {
        font-size: 1.5rem;
        font-weight: bold;
        letter-spacing: 1px;
      }
      .clinic-info {
        font-size: 0.9rem;
        color: #555;
      }
      .divider {
        border: none;
        border-top: 2px solid #3b82f6;
        margin: 12px 0 16px 0;
      }
      .prescription-title {
        text-align: center;
        font-size: 1.3rem;
        font-weight: 700;
        margin-bottom: 18px;
        margin-top: 8px;
        color: #2563eb;
      }
      .prescription-section {
        margin-bottom: 16px;
        font-size: 1rem;
      }
      .text-box {
        background: #f3f4f6;
        border-left: 3px solid #3b82f6;
        padding: 6px 12px;
        margin-top: 4px;
        border-radius: 6px;
        font-size: 1rem;
      }
      .signature-section {
        margin-top: 32px;
        text-align: right;
        font-size: 1rem;
      }
      .signature-line {
        font-style: italic;
      }
      .signature-space {
        display: block;
        margin-top: 8px;
        font-size: 1.1rem;
      }
      .doctor-name {
        margin-top: 24px;
        text-align: right;
        font-weight: bold;
        font-size: 1.1rem;
        color: #2563eb;
      }
      @media print {
        body * {
          visibility: hidden !important;
        }
        #prescription-print,
        #prescription-print * {
          visibility: visible !important;
        }
        #prescription-print {
          position: absolute;
          left: 0;
          top: 0;
          width: 100vw;
          margin: 0;
          color: #000;
          background: #fff;
          box-shadow: none;
        }
      }
    `}</style>
  </div>
);
