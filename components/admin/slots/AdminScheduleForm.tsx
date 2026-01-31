"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { createSlots } from "@/app/admin/actions";
import {
  formatDateTimeLocalBerlin,
  parseBerlinDateTimeLocalToIso,
} from "@/lib/event/client";
import { Loader2, Plus, Trash2 } from "lucide-react";

const scheduleSlotSchema = z.object({
  clubName: z.string().min(1, "Club-Name ist erforderlich"),
  plannedStart: z.string().min(1, "Geplante Startzeit ist erforderlich"),
});

const scheduleFormSchema = z.object({
  slots: z.array(scheduleSlotSchema).min(1, "Mindestens ein Slot ist erforderlich"),
});

type ScheduleFormValues = z.infer<typeof scheduleFormSchema>;

type AdminScheduleFormProps = {
  eventId: string;
  title?: string;
  description?: string;
  hideHeader?: boolean;
  onSuccess?: () => void;
};

export function AdminScheduleForm({
  eventId,
  title = "Programm hinzufügen",
  description = "Slots mit Club-Name und geplanter Startzeit anlegen.",
  hideHeader = false,
  onSuccess,
}: AdminScheduleFormProps) {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const defaultSlot = (): { clubName: string; plannedStart: string } => ({
    clubName: "",
    plannedStart: formatDateTimeLocalBerlin(new Date().toISOString()),
  });

  const form = useForm<ScheduleFormValues>({
    resolver: zodResolver(scheduleFormSchema),
    defaultValues: {
      slots: [defaultSlot()],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "slots",
  });

  async function onSubmit(values: ScheduleFormValues) {
    setServerError(null);
    const slotsWithIso = values.slots.map((s) => ({
      ...s,
      plannedStart: parseBerlinDateTimeLocalToIso(s.plannedStart),
    }));
    const result = await createSlots(eventId, slotsWithIso);
    if (result?.error) {
      setServerError(result.error);
    } else {
      form.reset({ slots: [defaultSlot()] });
      router.refresh();
      onSuccess?.();
    }
  }

  return (
    <Card className="w-full ">
      {!hideHeader && (
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
      )}
      <CardContent className={hideHeader ? "pt-0" : undefined}>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
          >
            <div className="space-y-4">
              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="flex flex-col gap-4 rounded-lg border p-4 sm:flex-row sm:items-end"
                >
                  <div className="flex flex-1 flex-col gap-4 sm:flex-row sm:flex-2">
                    <FormField
                      control={form.control}
                      name={`slots.${index}.clubName`}
                      render={({ field: inputField }) => (
                        <FormItem className="flex-1">
                          <FormLabel>Club / Gruppe</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="z. B. Club Rot-Weiss"
                              {...inputField}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`slots.${index}.plannedStart`}
                      render={({ field: inputField }) => (
                        <FormItem className="flex-1 sm:min-w-[180px]">
                          <FormLabel>Geplante Startzeit</FormLabel>
                          <FormControl>
                            <Input type="datetime-local" {...inputField} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => remove(index)}
                    disabled={fields.length <= 1}
                    aria-label="Slot entfernen"
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={() => append(defaultSlot())}
                className="w-full sm:w-auto"
              >
                <Plus className="size-4" />
                Slot hinzufügen
              </Button>
            </div>
            {serverError && (
              <p className="text-sm text-destructive">{serverError}</p>
            )}
            <Button
              type="submit"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                "Programm speichern"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
