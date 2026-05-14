"use client";

import Image from "next/image";
import { useState } from "react";

const benefits = [
  {
    key: "verified_badge",
    title: "Verified badge",
    description:
      "The badge means your profile was verified by Meta based on a number of authenticity signals and human review.",
    image: "/verified-badge.jpg",
  },
  {
    key: "impersonation_protection",
    title: "Impersonation protection",
    description:
      "Proactive monitoring helps find and remove accounts that might be copying your business.",
    image: "/impersonation.jpg",
  },
  {
    key: "enhanced_support",
    title: "Enhanced support",
    description:
      "Get access to human support agents to help troubleshoot account or billing issues faster.",
    image: "/enhanced-support.jpg",
  },
  {
    key: "upgraded_profile_features",
    title: "Upgraded profile features",
    description:
      "Unlock tools that make it easier to showcase your brand, connect with customers, and drive conversions.",
    image: "/profile-features.jpg",
  },
];

export function BenefitsSection() {
  const [expanded, setExpanded] = useState("verified_badge");
  const [hoveredBenefit, setHoveredBenefit] = useState<string | null>("verified_badge");

  const currentImage = benefits.find((b) => b.key === hoveredBenefit)?.image || benefits[0].image;
  const currentBenefitKey = hoveredBenefit || benefits[0].key;

  return (
    <section className="mx-auto mt-10 flex max-w-6xl flex-col gap-10 px-4 sm:px-6 lg:flex-row lg:gap-16 lg:px-12">
      <div className="flex-1 space-y-5">
        <h2 className="text-3xl font-semibold text-slate-900" data-i18n="meta_verified_benefits">Meta Verified benefits</h2>
        <div className="rounded-3xl bg-slate-50 p-6 shadow-card">
          <Image
            src={currentImage}
            alt={currentBenefitKey}
            width={600}
            height={400}
            className="rounded-2xl object-cover transition-opacity duration-300"
          />
          <div className="mt-4 flex items-center gap-3">
            <Image src="/ic_blue.svg" alt="Badge" width={28} height={28} />
            <p className="text-sm text-slate-500" data-i18n={currentBenefitKey}>{benefits.find(b => b.key === currentBenefitKey)?.title || benefits[0].title}</p>
            <span>—</span>
            <p className="text-sm text-slate-500" data-i18n="badge_preview">preview</p>
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-4 pt-12">
        {benefits.map((benefit) => {
          const isOpen = expanded === benefit.key;
          return (
            <button
              key={benefit.key}
              onClick={() => setExpanded(isOpen ? "" : benefit.key)}
              onMouseEnter={() => setHoveredBenefit(benefit.key)}
              onMouseLeave={() => setHoveredBenefit(expanded || benefits[0].key)}
              className="rounded-3xl border border-slate-200/80 bg-white p-6 text-left shadow-sm transition hover:border-slate-300"
            >
              <div className="flex items-center justify-between">
                <p className="text-lg font-semibold text-slate-900" data-i18n={benefit.key}>{benefit.title}</p>
                <span className="text-2xl font-semibold text-slate-400">{isOpen ? "−" : "+"}</span>
              </div>
              {isOpen ? (
                <p className="mt-4 text-sm text-slate-600" data-i18n={benefit.key + "_description"}>{benefit.description}</p>
              ) : null}
            </button>
          );
        })}
      </div>
    </section>
  );
}
