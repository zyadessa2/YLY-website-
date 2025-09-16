"use client";

export default function LoadingSpinner() {
  return (
    <div className="h-screen w-full flex items-center justify-center">
      <div className="relative flex h-10 w-10">
        <div className="animate-ping absolute h-full w-full rounded-full bg-primary opacity-75"></div>
        <div className="relative rounded-full h-10 w-10 bg-primary"></div>
      </div>
    </div>
  );
}
