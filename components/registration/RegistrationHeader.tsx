import { Calendar } from "lucide-react";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface RegistrationHeaderProps {
  currentStep: number;
  totalSteps: number;
  stepTitle: string;
  stepDescription: string;
}

export const RegistrationHeader = ({
  currentStep,
  totalSteps,
  stepTitle,
  stepDescription,
}: RegistrationHeaderProps) => {
  const progressPercentage = (currentStep / totalSteps) * 100;

  return (
    <Card className="shadow-2xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm mb-6">
      <CardHeader className="text-center space-y-4 px-4 sm:px-6">
        <div className="flex justify-center">
          <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full">
            <Calendar className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
          </div>
        </div>

        <div>
          <CardTitle className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            CitasFácil
          </CardTitle>
          <CardDescription className="text-base sm:text-lg text-muted-foreground mt-2 px-2">
            Registra tu empresa y comienza a gestionar citas de forma
            profesional
          </CardDescription>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>

        <div>
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
            {stepTitle}
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 px-2">
            {stepDescription}
          </p>
        </div>
      </CardHeader>
    </Card>
  );
};
