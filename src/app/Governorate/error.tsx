"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, RefreshCw, Home, MapPin } from "lucide-react";
import Link from "next/link";

interface Props {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GovernorateError({ error, reset }: Props) {
  useEffect(() => {
    // Log the error to console or error reporting service
    console.error("Governorate section error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <div className="relative">
              <MapPin className="w-8 h-8 text-red-600" />
              <AlertTriangle className="w-4 h-4 text-red-500 absolute -top-1 -right-1" />
            </div>
          </div>
          <CardTitle className="text-2xl text-gray-900">
            Governorate Page Error
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-gray-600">
            We encountered an error while loading the governorate information.
            This could be due to a temporary issue or missing data.
          </p>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>Possible causes:</strong>
            </p>
            <ul className="text-sm text-blue-700 mt-2 space-y-1 text-left">
              <li>• Invalid governorate name or slug</li>
              <li>• Temporary server connection issue</li>
              <li>• Missing governorate data</li>
            </ul>
          </div>

          {process.env.NODE_ENV === "development" && (
            <details className="text-left bg-gray-50 p-3 rounded-md">
              <summary className="font-semibold cursor-pointer text-gray-700">
                Technical Details (Development Mode)
              </summary>
              <pre className="mt-2 text-xs text-red-600 overflow-auto max-h-32">
                {error.message}
                {error.stack && "\n\nStack Trace:\n" + error.stack}
              </pre>
            </details>
          )}

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button onClick={reset} className="flex-1" variant="default">
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>

            <Button asChild variant="outline" className="flex-1">
              <Link href="/Governorate">
                <MapPin className="w-4 h-4 mr-2" />
                All Governorates
              </Link>
            </Button>

            <Button asChild variant="ghost" className="flex-1">
              <Link href="/">
                <Home className="w-4 h-4 mr-2" />
                Home
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
