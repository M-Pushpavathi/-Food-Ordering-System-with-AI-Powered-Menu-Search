import { Link } from "@tanstack/react-router";
import { FiInstagram, FiTwitter, FiFacebook, FiMail, FiPhone, FiMapPin } from "react-icons/fi";

export function Footer() {
  return (
    <footer id="contact" className="mt-24 border-t border-border/60 bg-dark-surface text-dark-surface-foreground">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 md:grid-cols-4 lg:px-8">
        <div>
          <Link to="/" className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-xl gradient-primary text-primary-foreground text-lg font-bold">S</span>
            <span className="font-display text-xl font-bold">Saffron.ai</span>
          </Link>
          <p className="mt-4 text-sm text-white/60">
            AI-powered fine dining, brought to your door. Every dish, hand-picked for your mood.
          </p>
          <div className="mt-6 flex gap-3">
            <SocialIcon href="#"><FiInstagram /></SocialIcon>
            <SocialIcon href="#"><FiTwitter /></SocialIcon>
            <SocialIcon href="#"><FiFacebook /></SocialIcon>
          </div>
        </div>
        <FooterCol title="Explore" links={[["Home","/"],["Menu","/menu"],["AI Search","/ai-search"],["About","/#about"]]} />
        <FooterCol title="Company" links={[["Services","/#services"],["Testimonials","/#testimonials"],["Contact","/#contact"],["Careers","#"]]} />
        <div>
          <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white/80">Contact</h4>
          <ul className="space-y-3 text-sm text-white/60">
            <li className="flex items-center gap-2"><FiMapPin className="text-primary" /> 12 Chef Street, Mumbai</li>
            <li className="flex items-center gap-2"><FiPhone className="text-primary" /> +91 90000 12345</li>
            <li className="flex items-center gap-2"><FiMail className="text-primary" /> hello@saffron.ai</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-6 text-center text-xs text-white/40">
        © {new Date().getFullYear()} Saffron.ai — All rights reserved.
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: [string, string][] }) {
  return (
    <div>
      <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white/80">{title}</h4>
      <ul className="space-y-2 text-sm text-white/60">
        {links.map(([label, href]) => (
          <li key={label}>
            <a href={href} className="transition-colors hover:text-primary">{label}</a>
          </li>
        ))}
      </ul>
    </div>
  );
}

function SocialIcon({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      className="grid h-9 w-9 place-items-center rounded-full border border-white/15 text-white/70 transition-all hover:border-primary hover:text-primary"
    >
      {children}
    </a>
  );
}