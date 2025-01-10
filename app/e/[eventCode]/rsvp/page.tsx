import { Suspense } from "react";

interface PageProps {
  params: {
    eventCode: string;
  };
}

export default async function EventPage({ params }: PageProps) {
  const { eventCode } = await params;

  return (
    <main className="flex min-h-screen flex-col items-center p-8">
      <Suspense fallback={<div>Loading...</div>}>
        <div className="w-full max-w-4xl">
          <h1 className="text-3xl font-bold mb-6">Event: {eventCode}</h1>

          <div className="bg-white rounded-lg shadow p-6">
            {/* Event details will go here */}
            <p className="text-gray-600">Event details are loading...</p>
          </div>
        </div>
      </Suspense>
    </main>
  );
}

export async function generateMetadata({ params }: PageProps) {
  const { eventCode } = await params;
  return {
    title: `Event ${eventCode}`,
    description: `Details for event ${eventCode}`,
  };
}
