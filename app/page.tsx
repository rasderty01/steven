import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function Page() {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                Simple Event Management Platform
              </h1>
              <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl">
                Create, manage, and track your events with ease. Perfect for
                organizations of all sizes.
              </p>
              <div className="space-x-4">
                <Button asChild>
                  <Link href="/login">Get Started</Link>
                </Button>
                <Button variant="outline">Learn More</Button>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter text-center mb-12">
              Features
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader>
                  <CardTitle>Event Creation</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>
                    Create and customize events in minutes with our intuitive
                    interface.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Registration</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>
                    Handle registrations and tickets with automated processes.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Analytics</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Track attendance and gather insights from your events.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Communications</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Send updates and notifications to all attendees easily.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <h2 className="text-3xl font-bold tracking-tighter">
                Ready to streamline your events?
              </h2>
              <p className="mx-auto max-w-[600px] text-gray-500 md:text-xl">
                Join thousands of organizations already using our platform.
              </p>
              <Button size="lg" asChild>
                <Link href="/signup">Start Free Trial</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full border-t py-6">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-sm text-gray-500">
              © 2024 EventFlow. All rights reserved.
            </p>
            <nav className="flex gap-4">
              <Link
                href="/about"
                className="text-sm text-gray-500 hover:underline"
              >
                About
              </Link>
              <Link
                href="/contact"
                className="text-sm text-gray-500 hover:underline"
              >
                Contact
              </Link>
              <Link
                href="/privacy"
                className="text-sm text-gray-500 hover:underline"
              >
                Privacy
              </Link>
            </nav>
          </div>
        </div>
      </footer>
    </div>
  );
}
