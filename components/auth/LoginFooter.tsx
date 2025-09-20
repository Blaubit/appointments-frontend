"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

interface ServerMetadata {
  timestamp: string;
  environment: string;
  version: string;
}

interface LoginFooterProps {
  serverMetadata: ServerMetadata;
  isLoading: boolean;
}

export function LoginFooter({ serverMetadata, isLoading }: LoginFooterProps) {
  return (
    <div className="mt-8 text-center text-xs text-gray-500 dark:text-gray-400">
      <div className="flex justify-center space-x-6">
        <Link href="/policies">
          <Button
            variant="link"
            className="p-0 h-auto text-xs text-gray-500 hover:text-blue-600"
            disabled={isLoading}
          >
            Ayuda
          </Button>
        </Link>
        <Link href="/policies">
          <Button
            variant="link"
            className="p-0 h-auto text-xs text-gray-500 hover:text-blue-600"
            disabled={isLoading}
          >
            Privacidad
          </Button>
        </Link>
        <Link href="/policies">
          <Button
            variant="link"
            className="p-0 h-auto text-xs text-gray-500 hover:text-blue-600"
            disabled={isLoading}
          >
            Términos
          </Button>
        </Link>
      </div>

      {/* Debug info en desarrollo */}
      {serverMetadata.environment === "development" && (
        <div className="mt-4 text-xs opacity-50">
          v{serverMetadata.version} •{" "}
          {new Date(serverMetadata.timestamp).toLocaleTimeString()}
        </div>
      )}
    </div>
  );
}
