// components/shared/footer.tsx
import Link from "next/link";
import { PackageSearch, Mail } from "lucide-react";
import { FaInstagram, FaTwitter, FaFacebook } from "react-icons/fa";

const footerLinks = {
  Browse: [
    { label: "All Gear", href: "/gear" },
    { label: "Camping", href: "/gear?category=camping" },
    { label: "Cycling", href: "/gear?category=cycling" },
    { label: "Water Sports", href: "/gear?category=water-sports" },
    { label: "Winter Sports", href: "/gear?category=winter-sports" },
  ],
  Account: [
    { label: "Log in", href: "/login" },
    { label: "Sign up", href: "/register" },
    { label: "Become a provider", href: "/register" },
  ],
  Company: [
    { label: "How it works", href: "/#how-it-works" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Contact", href: "mailto:hello@gearup.com" },
  ],
};

const socials = [
  { label: "Instagram", icon: FaInstagram, href: "https://instagram.com" },
  { label: "Twitter", icon: FaTwitter, href: "https://twitter.com" },
  { label: "Facebook", icon: FaFacebook, href: "https://facebook.com" },
];

export function Footer() {
  return (
    <footer className="border-t border-sidebar-border bg-sidebar text-sidebar-foreground">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4 lg:grid-cols-5">
          {/* Brand column */}
          <div className="col-span-2 lg:col-span-2">
            <Link href="/" className="flex items-center gap-2">
              <PackageSearch className="h-6 w-6 text-sidebar-primary" />
              <span className="text-xl font-bold">GearUp</span>
            </Link>
            <p className="mt-3 max-w-xs text-sm text-sidebar-foreground/70">
              Rent sports and outdoor gear by the day, from real local
              providers. No buying what you will only use once.
            </p>

            {/* Social links */}
            <div className="mt-5 flex items-center gap-3">
              {socials.map(({ label, icon: Icon, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-sidebar-border text-sidebar-foreground/70 transition-colors hover:border-sidebar-primary hover:text-sidebar-primary"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([heading, links]) => (
            <div key={heading}>
              <h3 className="text-sm font-semibold text-sidebar-foreground">
                {heading}
              </h3>
              <ul className="mt-4 space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-sidebar-foreground/70 transition-colors hover:text-sidebar-primary"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col gap-4 border-t border-sidebar-border pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-sidebar-foreground/60">
            © {new Date().getFullYear()} GearUp. All rights reserved.
          </p>
          <a
            href="mailto:hello@gearup.com"
            className="flex items-center gap-1.5 text-xs text-sidebar-foreground/60 transition-colors hover:text-sidebar-primary"
          >
            <Mail className="h-3.5 w-3.5" />
            hello@gearup.com
          </a>
        </div>
      </div>
    </footer>
  );
}
