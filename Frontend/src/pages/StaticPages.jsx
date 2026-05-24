import { LifeBuoy, Settings } from "lucide-react";

export function SupportPage() {
  return (
    <div className="mx-auto max-w-lg rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
      <LifeBuoy className="mx-auto text-violet-600" size={40} />
      <h1 className="mt-4 text-xl font-bold text-slate-900">Support</h1>
      <p className="mt-2 text-sm text-slate-500">
        Need help? Reach out at support@playbox.app
      </p>
    </div>
  );
}

export function SettingsPage() {
  return (
    <div className="mx-auto max-w-lg rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
      <Settings className="mx-auto text-violet-600" size={40} />
      <h1 className="mt-4 text-xl font-bold text-slate-900">Settings</h1>
      <p className="mt-2 text-sm text-slate-500">
        Account settings coming soon.
      </p>
    </div>
  );
}
