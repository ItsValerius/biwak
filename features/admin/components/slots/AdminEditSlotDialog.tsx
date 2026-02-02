"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/ui/form";
import { Loader2 } from "lucide-react";
import { updateSlot } from "@/features/admin/actions";
import {
  formatDateTimeLocalBerlin,
  parseBerlinDateTimeLocalToIso,
} from "@/features/events/lib/client";

const editSlotSchema = z.object({
  clubName: z.string().min(1, "Club-Name ist erforderlich"),
  plannedStart: z.string().min(1, "Geplante Startzeit ist erforderlich"),
});

type EditSlotValues = z.infer<typeof editSlotSchema>;

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
      plannedStart: formatDateTimeLocalBerlin(slot.plannedStart),
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        clubName: slot.clubName,
        plannedStart: formatDateTimeLocalBerlin(slot.plannedStart),
      });
    }
  }, [form, open, slot.id, slot.clubName, slot.plannedStart]);

  async function onSubmit(values: EditSlotValues) {
    setServerError(null);
    const result = await updateSlot(slot.id, {
      ...values,
      plannedStart: parseBerlinDateTimeLocalToIso(values.plannedStart),
    });
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
              {form.formState.isSubmitting ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                "Speichern"
              )}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
