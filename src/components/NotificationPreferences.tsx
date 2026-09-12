"use client";

import { useEffect, useState } from "react";
import { Bell, Mail, MessageCircle, Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";
import Card, { CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { preferencesAPI, type NotificationPreferences } from "@/lib/api";

/**
 * Where a user's alerts are delivered.
 *
 * Security alerts (a new sign-in, a KYC decision) are deliberately absent from
 * this panel: they always go to email and cannot be switched off, because
 * someone who has silenced everything cannot see an account takeover
 * happening. Only money-movement alerts are optional, which is what the copy
 * below says rather than implying total control.
 */
export default function NotificationPreferencesPanel() {
  const [prefs, setPrefs] = useState<NotificationPreferences | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    preferencesAPI
      .get()
      .then((res) => {
        if (cancelled) return;
        const d = res.data ?? {};
        setPrefs({
          notificationsEnabled: d.notificationsEnabled ?? false,
          emailNotificationsEnabled: d.emailNotificationsEnabled ?? true,
          whatsappNotificationsEnabled: d.whatsappNotificationsEnabled ?? false,
          whatsappAvailable: d.whatsappAvailable ?? false,
        });
      })
      .catch(() => {
        if (!cancelled) toast.error("Could not load your notification settings.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  async function update(key: keyof NotificationPreferences, value: boolean) {
    if (!prefs) return;
    const previous = prefs;
    // Optimistic: a toggle that waits on a round trip feels broken.
    setPrefs({ ...prefs, [key]: value });
    setSaving(key);
    try {
      await preferencesAPI.update({ [key]: value });
    } catch {
      setPrefs(previous);
      toast.error("That did not save. Please try again.");
    } finally {
      setSaving(null);
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3 py-6 text-muted-foreground">
            <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
            <span>Loading your settings…</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!prefs) return null;

  const channelsDisabled = !prefs.notificationsEnabled;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notifications</CardTitle>
      </CardHeader>
      <CardContent className="space-y-1">
        <p className="text-sm text-muted-foreground pb-4">
          Choose where alerts about money moving in and out of your wallet are
          sent. Security alerts — a new sign-in, or a change to your
          verification — always go to your email.
        </p>

        <Toggle
          icon={<Bell className="w-5 h-5" aria-hidden="true" />}
          title="Transaction alerts"
          description="Tell me when money enters or leaves my wallet."
          checked={prefs.notificationsEnabled}
          busy={saving === "notificationsEnabled"}
          onChange={(v) => update("notificationsEnabled", v)}
        />

        <Toggle
          icon={<Mail className="w-5 h-5" aria-hidden="true" />}
          title="Email"
          description={
            channelsDisabled
              ? "Turn on transaction alerts to choose this."
              : "Send those alerts to my email address."
          }
          checked={prefs.emailNotificationsEnabled}
          disabled={channelsDisabled}
          busy={saving === "emailNotificationsEnabled"}
          onChange={(v) => update("emailNotificationsEnabled", v)}
        />

        <Toggle
          icon={<MessageCircle className="w-5 h-5" aria-hidden="true" />}
          title="WhatsApp"
          description={
            !prefs.whatsappAvailable
              ? "Verify your phone number to receive alerts on WhatsApp."
              : channelsDisabled
                ? "Turn on transaction alerts to choose this."
                : "Send those alerts to my WhatsApp number."
          }
          checked={prefs.whatsappNotificationsEnabled}
          disabled={channelsDisabled || !prefs.whatsappAvailable}
          busy={saving === "whatsappNotificationsEnabled"}
          onChange={(v) => update("whatsappNotificationsEnabled", v)}
        />
      </CardContent>
    </Card>
  );
}

function Toggle({
  icon,
  title,
  description,
  checked,
  disabled = false,
  busy = false,
  onChange,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  checked: boolean;
  disabled?: boolean;
  busy?: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <label
      className={`flex items-start gap-4 py-4 border-b border-border last:border-0 ${
        disabled ? "opacity-60" : "cursor-pointer"
      }`}
    >
      <span className="text-muted-foreground mt-0.5 shrink-0">{icon}</span>

      <span className="flex-1 min-w-0">
        <span className="block font-medium text-foreground">{title}</span>
        <span className="block text-sm text-muted-foreground text-pretty">
          {description}
        </span>
      </span>

      <span className="shrink-0 mt-1">
        {busy ? (
          <Loader2
            className="w-5 h-5 animate-spin text-muted-foreground"
            aria-hidden="true"
          />
        ) : (
          <input
            type="checkbox"
            role="switch"
            className="sr-only peer"
            checked={checked}
            disabled={disabled}
            onChange={(e) => onChange(e.target.checked)}
          />
        )}
        {!busy && (
          <span
            aria-hidden="true"
            className="block w-11 h-6 rounded-full bg-muted peer-checked:bg-primary transition-colors relative
                       peer-focus-visible:ring-2 peer-focus-visible:ring-primary peer-focus-visible:ring-offset-2
                       after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:w-5 after:h-5
                       after:rounded-full after:bg-white after:transition-transform
                       peer-checked:after:translate-x-5"
          />
        )}
      </span>
    </label>
  );
}
