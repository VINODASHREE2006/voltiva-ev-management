import Link from "next/link";
import {
  ArrowLeft,
  BatteryCharging,
  Car,
  CircleHelp,
  Mail,
  MessageCircle,
} from "lucide-react";

export default function SupportPage() {
  return (
    <main className="min-h-screen bg-[#f6f7f5] p-5 text-[#17201b] md:p-8">

      <div className="mx-auto max-w-5xl">

        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900"
        >
          <ArrowLeft size={16} />
          Back to dashboard
        </Link>

        <div className="mt-8">

          <p className="text-xs font-semibold uppercase tracking-wider text-emerald-600">
            Support
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight">
            How can we help?
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Get assistance with your vehicle, charging or Voltiva account.
          </p>

        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-3">

          <SupportCard
            icon={<Car size={21} />}
            title="Vehicle Help"
            description="Get help with vehicle connection and monitoring."
          />

          <SupportCard
            icon={<BatteryCharging size={21} />}
            title="Charging Help"
            description="Troubleshoot charging sessions and stations."
          />

          <SupportCard
            icon={<MessageCircle size={21} />}
            title="Contact Support"
            description="Talk to our support team for assistance."
          />

        </div>

        <div className="mt-6 rounded-3xl border border-[#e2e7e2] bg-white p-6">

          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#eef7f0] text-emerald-600">
            <CircleHelp size={21} />
          </div>

          <h2 className="mt-5 text-lg font-bold">
            Frequently asked questions
          </h2>

          <div className="mt-5 space-y-4">

            <div className="rounded-2xl bg-gray-50 p-4">
              <p className="text-sm font-semibold">
                How do I connect my EV?
              </p>
              <p className="mt-2 text-xs leading-5 text-gray-500">
                Connect your vehicle through the supported vehicle integration
                and its telemetry data will appear on your dashboard.
              </p>
            </div>

            <div className="rounded-2xl bg-gray-50 p-4">
              <p className="text-sm font-semibold">
                How can I find a charging station?
              </p>
              <p className="mt-2 text-xs leading-5 text-gray-500">
                Open the Stations section to view nearby charging stations.
              </p>
            </div>

          </div>

          <button className="mt-6 flex items-center gap-2 rounded-xl bg-[#17201b] px-5 py-3 text-sm font-semibold text-white">
            <Mail size={16} />
            Contact support
          </button>

        </div>

      </div>

    </main>
  );
}

function SupportCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-[#e2e7e2] bg-white p-5">

      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#eef7f0] text-emerald-600">
        {icon}
      </div>

      <h2 className="mt-5 text-sm font-bold">
        {title}
      </h2>

      <p className="mt-2 text-xs leading-5 text-gray-500">
        {description}
      </p>

    </div>
  );
}