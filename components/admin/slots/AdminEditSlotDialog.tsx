"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { updateSlot } from "@/app/admin/actions";

const editSlotSchema = z.object({
  clubName: z.string().min(1, "Club-Name ist erforderlich"),
  plannedStart: z.string().min(1, "Geplante Startzeit ist erforderlich"),
});

type EditSlotValues = z.infer<typeof editSlotSchema>;

function formatDateTimeLocal(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  const h = String(date.getHours()).padStart(2, "0");
  const min = String(date.getMinutes()).padStart(2, "0");
  return `${y}-${m}-${d}T${h}:${min}`;
}

function parseToDateTimeLocal(isoString: string): string {
  const date = new Date(isoString);
  return formatDateTimeLocal(date);
}

type AdminEditSlotDialogProps = {
  slot: { id: string; clubName: string; plannedStart: string };
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function AdminEditSlotDialog({
  slot,
  open,
  onOpenChange,
}: AdminEditSlotDialogProps) {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const form = useForm<EditSlotValues>({
    resolver: zodResolver(editSlotSchema),
    defaultValues: {
      clubName: slot.clubName,
      plannedStart: parseToDateTimeLocal(slot.plannedStart),
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        clubName: slot.clubName,
        plannedStart: parseToDateTimeLocal(slot.plannedStart),
      });
    }
  }, [form, open, slot.id, slot.clubName, slot.plannedStart]);

  async function onSubmit(values: EditSlotValues) {
    setServerError(null);
    const result = await updateSlot(slot.id, values);
    if (result?.error) {
      setServerError(result.error);
    } else {
      onOpenChange(false);
      router.refresh();
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Slot bearbeiten</DialogTitle>
          <DialogDescription>
            Club-Name und geplante Startzeit anpassen.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="clubName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Club / Gruppe</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="z. B. Club Rot-Weiss"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="plannedStart"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Geplante Startzeit</FormLabel>
                  <FormControl>
                    <Input type="datetime-local" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {serverError && (
              <p className="text-sm text-destructive">{serverError}</p>
            )}
            <Button
              type="submit"
              className="w-full"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? "…" : "Speichern"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
