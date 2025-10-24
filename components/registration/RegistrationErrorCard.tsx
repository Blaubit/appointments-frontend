import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { RegistrationErrorState } from "@/hooks/UseRegistrationError";

interface RegistrationErrorCardProps {
  error: RegistrationErrorState;
  onClose: () => void;
  onRetry?: () => void;
  isLoading?: boolean;
  showRetryInStep4?: boolean;
  currentStep?: number;
}

export const RegistrationErrorCard = ({
  error,
  onClose,
  onRetry,
  isLoading = false,
  showRetryInStep4 = false,
  currentStep = 0,
}: RegistrationErrorCardProps) => {
  if (!error.show) return null;

  const showRetry = showRetryInStep4 && currentStep === 4 && error.canRetry;

  return (
    <Card className="shadow-2xl border-0 bg-red-50 dark:bg-red-900/20 backdrop-blur-sm mb-6 border-red-200 dark:border-red-800">
      <CardContent className="p-6">
        <div className="flex items-start space-x-4">
          <div className="p-2 bg-red-100 dark:bg-red-900/40 rounded-full flex-shrink-0">
            <error.icon className="h-6 w-6 text-red-600 dark:text-red-400" />
          </div>

          <div className="flex-1 space-y-3">
            <div>
              <h3 className="text-lg font-semibold text-red-800 dark:text-red-300 flex items-center gap-2">
                {error.title}
                <div className="flex gap-1">
                  {error.statusCode && (
                    <span className="text-xs px-2 py-1 bg-red-200 dark:bg-red-800 rounded-full">
                      {error.statusCode}
                    </span>
                  )}
                  {error.code && (
                    <span className="text-xs px-2 py-1 bg-red-300 dark:bg-red-700 rounded-full">
                      {error.code}
                    </span>
                  )}
                </div>
              </h3>
              <p className="text-sm text-red-700 dark:text-red-400 mt-1">
                {error.message}
              </p>
            </div>

            {error.details && (
              <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-lg">
                <p className="text-xs text-red-600 dark:text-red-400">
                  {error.details}
                </p>
              </div>
            )}

            <div className="flex flex-wrap gap-2 pt-2">
              {showRetry && (
                <Button
                  onClick={onRetry}
                  disabled={isLoading}
                  size="sm"
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Reintentando...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Reintentar
                    </>
                  )}
                </Button>
              )}

              {error.actions?.map((action, index) => (
                <Button
                  key={index}
                  variant={action.variant || "outline"}
                  size="sm"
                  onClick={action.action}
                  className={
                    action.variant === "outline"
                      ? "border-red-300 text-red-700 hover:bg-red-50 dark:border-red-700 dark:text-red-400 dark:hover:bg-red-900/20"
                      : ""
                  }
                >
                  {action.label}
                </Button>
              ))}

              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="text-red-600 hover:bg-red-100 dark:text-red-400 dark:hover:bg-red-900/20"
              >
                Cerrar
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
