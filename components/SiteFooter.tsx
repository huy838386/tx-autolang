const footerColumns = [
  {
    titleKey: "footer_meta_technologies",
    title: "Meta technologies",
    links: [
      { key: null, label: "Facebook" },
      { key: null, label: "Instagram" },
      { key: null, label: "Messenger" },
      { key: null, label: "WhatsApp" },
      { key: null, label: "Meta Quest" },
      { key: null, label: "Workplace" },
    ],
  },
  {
    titleKey: "footer_tools",
    title: "Tools",
    links: [
      { key: null, label: "Ads Manager" },
      { key: null, label: "Meta Business Suite" },
      { key: null, label: "Commerce Manager" },
      { key: null, label: "Events Manager" },
      { key: null, label: "Payments Hub" },
    ],
  },
  {
    titleKey: "footer_goals",
    title: "Goals",
    links: [
      { key: "footer_convert_leads", label: "Convert leads" },
      { key: "footer_grow_online_sales", label: "Grow online sales" },
      { key: "footer_instore_sales", label: "Drive in-store sales" },
      { key: "footer_brand_awareness", label: "Brand awareness" },
    ],
  },
  {
    titleKey: "footer_business_types",
    title: "Business types",
    links: [
      { key: "footer_small_business", label: "Small business" },
      { key: "footer_enterprise", label: "Enterprise" },
      { key: "footer_creators", label: "Creators" },
      { key: "footer_developers", label: "Developers" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="bg-slate-950 px-4 py-12 text-slate-400 sm:px-6 lg:px-12">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {footerColumns.map((column) => (
            <div key={column.titleKey}>
              <p className="text-sm font-semibold uppercase tracking-wide text-white" data-i18n={column.titleKey}>{column.title}</p>
              <ul className="mt-4 space-y-2 text-sm">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <a className="hover:text-white" href="#" data-i18n={link.key || undefined}>{link.label}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-10 flex flex-wrap items-center justify-between border-t border-white/10 pt-6 text-xs text-slate-500">
          <p data-i18n="meta_copyright">© {new Date().getFullYear()} Meta.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-white" data-i18n="footer_about">About</a>
            <a href="#" className="hover:text-white" data-i18n="footer_careers">Careers</a>
            <a href="#" className="hover:text-white" data-i18n="privacy_policy">Privacy</a>
            <a href="#" className="hover:text-white" data-i18n="terms_of_service">Terms</a>
            <a href="#" className="hover:text-white" data-i18n="footer_cookie_policy">Cookie policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
