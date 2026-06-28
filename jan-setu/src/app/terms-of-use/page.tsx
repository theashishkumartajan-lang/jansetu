import Link from "next/link";
import { ArrowLeft, FileText, Lock, Scale, ShieldCheck } from "lucide-react";
import { GlassCard } from "@/components/shared/GlassCard";

const termsSections = [
  {
    title: "Responsible Reporting",
    icon: ShieldCheck,
    content:
      "Citizens should submit accurate civic issue reports with clear descriptions, photos, voice notes, and location details. False, abusive, duplicate, or misleading reports may be hidden, flagged, or reviewed before action.",
  },
  {
    title: "Data Use",
    icon: Lock,
    content:
      "Jan Setu uses report details, GPS location, uploaded media, and status updates only to verify issues, route them to the correct department, prevent spam, and improve public service delivery.",
  },
  {
    title: "Smart Assistance",
    icon: FileText,
    content:
      "Smart guidance may help classify reports, answer support questions, estimate urgency, and suggest next steps. Final civic action remains subject to official review and field verification.",
  },
  {
    title: "Public Transparency",
    icon: Scale,
    content:
      "Aggregated civic data may be shown in analytics dashboards to improve accountability. Personal contact details and sensitive user information should not be displayed publicly.",
  },
];

export default function TermsOfUsePage() {
  return (
    <div className="min-h-screen bg-[#F6F9FC] pb-16">
      <section className="border-b border-slate-200 bg-white py-12">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-[#0A2540]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#00D4AA]/10 text-[#00D4AA]">
            <FileText className="h-6 w-6" />
          </div>
          <h1 className="mt-5 text-4xl font-bold tracking-tight text-[#0A2540]">Terms of Use</h1>
          <p className="mt-3 max-w-3xl text-lg leading-relaxed text-slate-600">
            These demo terms explain how Jan Setu should be used by citizens, officials, and support teams during civic issue reporting and resolution.
          </p>
        </div>
      </section>

      <main className="mx-auto mt-8 max-w-5xl space-y-6 px-4 sm:px-6 lg:px-8">
        {termsSections.map((section) => {
          const Icon = section.icon;
          return (
            <GlassCard key={section.title} className="border border-slate-100 bg-white">
              <div className="flex flex-col gap-4 sm:flex-row">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#00D4AA]/10 text-[#00A987]">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-[#0A2540]">{section.title}</h2>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{section.content}</p>
                </div>
              </div>
            </GlassCard>
          );
        })}

        <GlassCard className="border border-slate-100 bg-white">
          <h2 className="text-xl font-bold text-[#0A2540]">Support and Updates</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            For questions about reports, account access, location verification, or ticket status, use the Customer Help page. These terms are written for the hackathon demo and can be expanded before a real public launch.
          </p>
          <Link
            href="/customer-help"
            className="mt-4 inline-flex rounded-lg bg-[#00D4AA] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#00B896]"
          >
            Open Customer Help
          </Link>
        </GlassCard>
      </main>
    </div>
  );
}
