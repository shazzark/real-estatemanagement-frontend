"use client";

import { CheckCircle } from "lucide-react";
import { Button } from "../_components/_ui/button";
import { Card } from "../_components/_ui/card";
import { useRouter } from "next/navigation";

export default function BookingSuccessModal({ isOpen, onClose }) {
  const router = useRouter();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
      <Card className="w-full max-w-md rounded-xl p-6 space-y-6">
        <div className="flex justify-center">
          <CheckCircle className="w-14 h-14 text-green-500" />
        </div>

        <div className="text-center space-y-2">
          <h2 className="text-xl font-semibold">Booking Successful</h2>
          <p className="text-sm text-muted-foreground">
            Your property tour has been scheduled successfully.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <Button
            onClick={() => router.push("/dashboard?section=bookings")}
            className="w-full"
          >
            View My Bookings
          </Button>
          <Button variant="outline" onClick={onClose} className="w-full">
            Close
          </Button>
        </div>
      </Card>
    </div>
  );
}
