// app/not-found.tsx
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { HomeIcon, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <div className="mx-auto max-w-md text-center">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
          404
        </h1>
        <h2 className="mt-4 text-lg font-semibold text-gray-900">
          Page not found
        </h2>
        <p className="mt-2 text-sm leading-7 text-gray-600">
          Sorry, we couldn't find the page you're looking for. Please check the
          URL or navigate back.
        </p>
        <div className="mt-8 flex items-center justify-center gap-4">
          <Button asChild variant="outline">
            <Link href="/">
              <HomeIcon className="mr-2 h-4 w-4" />
              Home
            </Link>
          </Button>
          <Button asChild>
            <Link href="#" onClick={() => window.history.back()}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Go Back
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
