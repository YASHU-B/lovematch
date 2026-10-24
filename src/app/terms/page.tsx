import React from "react";
import Link from "next/link";
import { Scale, ArrowLeft } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-pink-300 hover:text-white mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to LoveMatch</span>
      </Link>

      <div className="glass-panel rounded-3xl p-6 sm:p-10 border border-pink-500/30 shadow-2xl space-y-8">
        <div className="border-b border-pink-500/20 pb-6">
          <div className="flex items-center gap-2 text-pink-400 mb-2">
            <Scale className="w-6 h-6" />
            <span className="text-xs font-bold uppercase tracking-wider">User Agreement</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            Terms & Conditions
          </h1>
          <p className="text-xs sm:text-sm text-pink-200/70 mt-1">
            Last updated: October 2026.
          </p>
        </div>

        <section className="space-y-3 text-xs sm:text-sm text-pink-100/90 leading-relaxed">
          <h2 className="text-lg font-bold text-white">1. Entertainment & Bonding Purpose</h2>
          <p>
            LoveMatch is designed as a playful, romantic, and engaging quiz for couples and friends. The Love Sync Score and result titles (such as &quot;Mind Readers&quot; or &quot;Plot Twist!&quot;) are generated solely for entertainment and conversation-sparking purposes. They do not constitute psychological, relationship, or marital counseling.
          </p>
        </section>

        <section className="space-y-3 text-xs sm:text-sm text-pink-100/90 leading-relaxed">
          <h2 className="text-lg font-bold text-white">2. Acceptable Conduct</h2>
          <p>
            Users agree to use LoveMatch respectfully. When entering custom answers or nicknames, you must not submit content that is unlawful, abusive, harassing, defamatory, obscene, or infringing on the rights of others.
          </p>
        </section>

        <section className="space-y-3 text-xs sm:text-sm text-pink-100/90 leading-relaxed">
          <h2 className="text-lg font-bold text-white">3. Intellectual Property</h2>
          <p>
            All original questions, branding, designs, software, logos, and illustrations on LoveMatch are the proprietary property of LoveMatch. You are welcome to download and share your personalized result cards on social networks.
          </p>
        </section>

        <section className="space-y-3 text-xs sm:text-sm text-pink-100/90 leading-relaxed">
          <h2 className="text-lg font-bold text-white">4. Limitation of Liability</h2>
          <p>
            LoveMatch is provided on an &quot;as-is&quot; and &quot;as-available&quot; basis without warranties of any kind. We are not liable for any disputes, relationship disagreements, or outcomes arising from game responses.
          </p>
        </section>

        <div className="pt-4 border-t border-pink-500/20 text-xs text-pink-300/70">
          Questions regarding these Terms can be addressed to <span className="text-pink-300 font-semibold">legal@lovematch.app</span>.
        </div>
      </div>
    </div>
  );
}
