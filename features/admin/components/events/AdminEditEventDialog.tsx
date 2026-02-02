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
import { updateEvent } from "@/features/admin/actions";

const editEventSchema = z.object({
  name: z.string().min(1, "Name ist erforderlich"),
  location: z.string().min(1, "Ort ist erforderlich"),
});

type EditEventValues = z.infer<typeof editEventSchema>;

type AdminEditEventDialogProps = {
  event: { id: string; name: string; location: string };
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function AdminEditEventDialog({
  event,
  open,
  onOpenChange,
}: AdminEditEventDialogProps) {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const form = useForm<EditEventValues>({
    resolver: zodResolver(editEventSchema),
    defaultValues: {
      name: event.name,
      location: event.location,
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({ name: event.name, location: event.location });
    }
  }, [form, open, event.id, event.name, event.location]);

  async function onSubmit(values: EditEventValues) {
    setServerError(null);
    const result = await updateEvent(event.id, values);
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
          <DialogTitle>Event bearbeiten</DialogTitle>
          <DialogDescription>
            Name und Ort des Events anpassen.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="z. B. Karneval Biwak 2025"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ort</FormLabel>
                  <FormControl>
                    <Input placeholder="z. B. Hauptbühne" {...field} />
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
