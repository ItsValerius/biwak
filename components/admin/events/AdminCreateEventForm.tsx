"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
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
import { Loader2 } from "lucide-react";
import { createEvent } from "@/app/admin/actions";

const createEventSchema = z.object({
  name: z.string().min(1, "Name ist erforderlich"),
  location: z.string().min(1, "Ort ist erforderlich"),
});

type CreateEventValues = z.infer<typeof createEventSchema>;

type AdminCreateEventFormProps = {
  title?: string;
  description?: string;
};

export function AdminCreateEventForm({
  title = "Event erstellen",
  description = "Name und Ort für das neue Event eingeben.",
}: AdminCreateEventFormProps) {
  const [serverError, setServerError] = useState<string | null>(null);

  const form = useForm<CreateEventValues>({
    resolver: zodResolver(createEventSchema),
    defaultValues: {
      name: "",
      location: "",
    },
  });

  async function onSubmit(values: CreateEventValues) {
    setServerError(null);
    const result = await createEvent(values);
    if (result?.error) {
      setServerError(result.error);
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="z. B. Karneval Biwak 2025" {...field} />
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
                "Event erstellen"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
