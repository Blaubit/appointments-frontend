"use client";

import { useState } from "react";
import {
  create,
  RestrictionPreviewFormData,
} from "@/actions/user/restriction/previewRestriction";

type Professional = {
  id: string;
  name: string;
};

type RestrictionPreviewFormProps = {
  professionals: Professional[];
};

export default function RestrictionPreviewForm({
  professionals,
}: RestrictionPreviewFormProps) {
  const [formData, setFormData] = useState<RestrictionPreviewFormData>({
    professionalId: "",
    restrictionDate: [],
    startTime: "",
    endTime: "",
  });

  const [selectedDates, setSelectedDates] = useState<string[]>([]);
  const [currentDate, setCurrentDate] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewData, setPreviewData] = useState<any>(null);

  const handleAddDate = () => {
    if (currentDate && !selectedDates.includes(currentDate)) {
      const newDates = [...selectedDates, currentDate].sort();
      setSelectedDates(newDates);
      setFormData({ ...formData, restrictionDate: newDates });
      setCurrentDate("");
    }
  };

  const handleRemoveDate = (dateToRemove: string) => {
    const newDates = selectedDates.filter((date) => date !== dateToRemove);
    setSelectedDates(newDates);
    setFormData({ ...formData, restrictionDate: newDates });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setPreviewData(null);

    try {
      const result = await create({
        professionalId: formData.professionalId,
        restrictionDate: formData.restrictionDate,
        startTime: formData.startTime || undefined,
        endTime: formData.endTime || undefined,
      });

      if ("data" in result) {
        setPreviewData(result.data);
      } else {
        setError(result.message || "An error occurred");
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      professionalId: "",
      restrictionDate: [],
      startTime: "",
      endTime: "",
    });
    setSelectedDates([]);
    setCurrentDate("");
    setError(null);
    setPreviewData(null);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Create Restriction Preview
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Professional Selection */}
        <div>
          <label
            htmlFor="professional"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Professional *
          </label>
          <select
            id="professional"
            value={formData.professionalId}
            onChange={(e) =>
              setFormData({ ...formData, professionalId: e.target.value })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          >
            <option value="">Select a professional</option>
            {professionals.map((prof) => (
              <option key={prof.id} value={prof.id}>
                {prof.name}
              </option>
            ))}
          </select>
        </div>

        {/* Date Selection */}
        <div>
          <label
            htmlFor="date"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Restriction Dates *
          </label>
          <div className="flex gap-2">
            <input
              type="date"
              id="date"
              value={currentDate}
              onChange={(e) => setCurrentDate(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              type="button"
              onClick={handleAddDate}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
              disabled={!currentDate}
            >
              Add Date
            </button>
          </div>

          {/* Selected Dates */}
          {selectedDates.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {selectedDates.map((date) => (
                <span
                  key={date}
                  className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                >
                  {date}
                  <button
                    type="button"
                    onClick={() => handleRemoveDate(date)}
                    className="text-blue-600 hover:text-blue-800 font-bold"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Time Selection */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="startTime"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Start Time (Optional)
            </label>
            <input
              type="time"
              id="startTime"
              value={formData.startTime}
              onChange={(e) =>
                setFormData({ ...formData, startTime: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label
              htmlFor="endTime"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              End Time (Optional)
            </label>
            <input
              type="time"
              id="endTime"
              value={formData.endTime}
              onChange={(e) =>
                setFormData({ ...formData, endTime: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={
              loading || !formData.professionalId || selectedDates.length === 0
            }
            className="flex-1 px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? "Loading..." : "Generate Preview"}
          </button>

          <button
            type="button"
            onClick={handleReset}
            className="px-6 py-3 bg-gray-200 text-gray-800 font-medium rounded-md hover:bg-gray-300 transition-colors"
          >
            Reset
          </button>
        </div>
      </form>

      {/* Preview Results */}
      {previewData && (
        <div className="mt-8 p-6 bg-green-50 border border-green-200 rounded-md">
          <h3 className="text-lg font-semibold text-green-800 mb-4">
            Preview Generated Successfully
          </h3>
          <pre className="bg-white p-4 rounded border border-green-300 overflow-x-auto text-sm">
            {JSON.stringify(previewData, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
