"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Loader2, UserCheck } from "lucide-react";
import { toggleCheckInAction } from "@/features/guests/actions";
import { toast } from "sonner";

export function CheckInButton({ guestId, eventId, initialValue }: any) {
  const [loading, setLoading] = useState(false);
  const [checked, setChecked] = useState(initialValue);

  const handleToggle = async () => {
    setLoading(true);
    const res = await toggleCheckInAction(guestId, eventId);
    if (res.success) {
      setChecked(res.checkedIn);
      if (res.checkedIn) toast.success("Entrada registada!");
    } else {
      toast.error("Erro ao processar.");
    }
    setLoading(false);
  };

  return (
    <Button
      size="sm"
      variant={checked ? "default" : "outline"}
      className={checked ? "bg-green-600 hover:bg-green-700 text-white" : "border-slate-300 text-slate-500"}
      onClick={handleToggle}
      disabled={loading}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : checked ? (
        <CheckCircle2 className="w-4 h-4 mr-1.5" />
      ) : (
        <UserCheck className="w-4 h-4 mr-1.5" />
      )}
      {checked ? "Presente" : "Check-in"}
    </Button>
  );
}