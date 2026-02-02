"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { importSlotsFromCsv } from "@/features/admin/actions";
import { formatDateLocalBerlin } from "@/features/events/lib/client";
import { FileUp, Loader2 } from "lucide-react";

type AdminImportCsvProps = {
  eventId: string;
  onSuccess?: () => void;
};

const csvExample = `name, time
Club Rot-Weiss, 14:00
Närrische Garde, 14:15
Tanzgruppe Blau, 14:30`;

export function AdminImportCsv({ eventId, onSuccess }: AdminImportCsvProps) {
  const router = useRouter();
  const [csvText, setCsvText] = useState("");
  const [baseDate, setBaseDate] = useState(formatDateLocalBerlin());
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);
    const text = await file.text();
    setCsvText(text);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    const result = await importSlotsFromCsv(eventId, csvText, baseDate || undefined);
    setSubmitting(false);
    if (result?.error) {
      setError(result.error);
      return;
    }
    setCsvText("");
    router.refresh();
    onSuccess?.();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="csv-file">CSV-Datei (name, time)</Label>
        <Input
          id="csv-file"
          type="file"
          accept=".csv,text/csv"
          onChange={handleFileChange}
          className="cursor-pointer"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="csv-paste">Oder CSV hier einfügen</Label>
        <textarea
          id="csv-paste"
          value={csvText}
          onChange={(e) => {
            setCsvText(e.target.value);
            setError(null);
          }}
          placeholder={csvExample}
          rows={6}
          className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="base-date">
          Basis-Datum für reine Uhrzeiten (z. B. 14:00)
        </Label>
        <Input
          id="base-date"
          type="date"
          value={baseDate}
          onChange={(e) => setBaseDate(e.target.value)}
        />
      </div>
      {error && (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      )}
      <Button type="submit" disabled={!csvText.trim() || submitting}>
        {submitting ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <>
            <FileUp className="size-4" aria-hidden />
            Aus CSV importieren
          </>
        )}
      </Button>
    </form>
  );
}
