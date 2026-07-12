import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { FiArrowRight, FiSearch, FiTruck, FiCpu, FiClock, FiStar, FiCheckCircle } from "react-icons/fi";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { MenuCard } from "@/components/food/MenuCard";
import heroBanner from "@/assets/hero-banner.jpg";
import foodPizza from "@/assets/food-pizza.jpg";
import foodSushi from "@/assets/food-sushi.jpg";
import foodBurger from "@/assets/food-burger.jpg";
import foodPasta from "@/assets/food-pasta.jpg";
import foodSalad from "@/assets/food-salad.jpg";
import foodDessert from "@/assets/food-dessert.jpg";

export const Route = createFileRoute("/")({
  component: Index,
});

const CATEGORIES = [
  { name: "Pizza", emoji: "🍕", count: 24 },
  { name: "Sushi", emoji: "🍣", count: 18 },
  { name: "Burgers", emoji: "🍔", count: 12 },
  { name: "Pasta", emoji: "🍝", count: 16 },
  { name: "Salads", emoji: "🥗", count: 9 },
  { name: "Desserts", emoji: "🍰", count: 21 },
];

const FEATURED = [
  { id: 1, name: "Wood-Fired Margherita", description: "Buffalo mozzarella, San Marzano tomato, fresh basil", price: 349, image: foodPizza, category: "Pizza", is_veg: true },
  { id: 2, name: "Chef's Sushi Platter", description: "Salmon, tuna, and specialty rolls with wasabi & ginger", price: 899, image: foodSushi, category: "Japanese", is_veg: false },
  { id: 3, name: "Double Smash Burger", description: "Aged cheddar, caramelized onions, brioche bun, fries", price: 449, image: foodBurger, category: "Burgers", is_veg: false },
  { id: 4, name: "Truffle Tagliatelle", description: "House-made pasta, black truffle cream, aged parmesan", price: 599, image: foodPasta, category: "Pasta", is_veg: true },
  { id: 5, name: "Buddha Bowl", description: "Quinoa, avocado, roasted chickpeas, tahini", price: 329, image: foodSalad, category: "Healthy", is_veg: true },
  { id: 6, name: "Molten Chocolate", description: "Warm dark chocolate lava with vanilla ice cream", price: 249, image: foodDessert, category: "Dessert", is_veg: true },
];

const SERVICES = [
  { icon: <FiCpu />, title: "AI Menu Search", desc: "Describe your mood or craving — our AI finds the perfect dish for you." },
  { icon: <FiTruck />, title: "Fast Delivery", desc: "Piping-hot food at your door in under 30 minutes, guaranteed." },
  { icon: <FiCheckCircle />, title: "Fresh Ingredients", desc: "Sourced daily from local farms. Zero preservatives, ever." },
  { icon: <FiClock />, title: "Live Order Tracking", desc: "Follow every step from kitchen to doorstep in real time." },
];

const TESTIMONIALS = [
  { name: "Ananya S.", quote: "The AI search actually understood 'something warm and comforting for a rainy day'. Mind blown.", role: "Regular customer" },
  { name: "Rahul K.", quote: "Ordered a five-course dinner in 4 clicks. Arrived hot, tasted like the restaurant itself.", role: "Food blogger" },
  { name: "Meera V.", quote: "Beautiful app, real chefs, honest ingredients. My weeknight go-to.", role: "Home chef" },
];

function Index() {
  return (
    <AppShell>
      {/* HERO */}
      <section className="relative isolate overflow-hidden">
        <img src={heroBanner} alt="Gourmet restaurant table" className="absolute inset-0 -z-10 h-full w-full object-cover" width={1920} height={1080} />
        <div className="absolute inset-0 -z-10 gradient-hero-overlay" />
        <div className="mx-auto flex max-w-7xl flex-col items-start px-4 py-24 sm:px-6 lg:px-8 lg:py-36">
          <span className="animate-fade-up inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-white backdrop-blur">
            <FiCpu /> Powered by AI
          </span>
          <h1 className="animate-fade-up delay-100 mt-6 max-w-3xl font-display text-5xl font-bold leading-[1.05] text-white sm:text-6xl lg:text-7xl">
            Order Delicious Food <span className="text-primary-glow">with AI</span>
          </h1>
          <p className="animate-fade-up delay-200 mt-6 max-w-xl text-lg text-white/80">
            Just tell us what you're craving. Our AI curates dishes from top chefs, delivered fast — so every bite feels made for you.
          </p>
          <div className="animate-fade-up delay-300 mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg" className="gap-2 gradient-primary text-primary-foreground shadow-elegant">
              <Link to="/menu">Explore Menu <FiArrowRight /></Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="gap-2 border-white/40 bg-white/10 text-white backdrop-blur hover:bg-white/20 hover:text-white">
              <Link to="/ai-search"><FiSearch /> AI Search</Link>
            </Button>
          </div>
          <div className="animate-fade-up delay-400 mt-12 flex flex-wrap items-center gap-6 text-sm text-white/70">
            <div className="flex items-center gap-2"><FiStar className="text-primary-glow" /> 4.9 · 12k+ reviews</div>
            <div className="flex items-center gap-2"><FiTruck className="text-primary-glow" /> 30-min delivery</div>
            <div className="flex items-center gap-2"><FiCheckCircle className="text-primary-glow" /> Fresh daily</div>
          </div>
        </div>
      </section>

      {/* FEATURED CATEGORIES */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <SectionHeading eyebrow="Categories" title="Explore by craving" />
        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {CATEGORIES.map((c, i) => (
            <Link
              key={c.name}
              to="/menu"
              className="hover-lift group flex flex-col items-center rounded-2xl border border-border bg-card p-5 text-center shadow-card-soft animate-fade-up"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <span className="text-4xl transition-transform group-hover:scale-110">{c.emoji}</span>
              <div className="mt-3 font-display font-semibold">{c.name}</div>
              <div className="text-xs text-muted-foreground">{c.count} dishes</div>
            </Link>
          ))}
        </div>
      </section>

      {/* FEATURED DISHES */}
      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between">
          <SectionHeading eyebrow="Featured" title="This week's most-loved dishes" />
          <Button asChild variant="ghost" className="hidden gap-1 sm:inline-flex">
            <Link to="/menu">View all <FiArrowRight /></Link>
          </Button>
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURED.map((f) => (
            <MenuCard key={f.id} item={f} />
          ))}
        </div>
      </section>

      {/* WHY CHOOSE US / SERVICES */}
      <section id="services" className="bg-dark-surface py-24 text-dark-surface-foreground">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading eyebrow="Why Saffron.ai" title="Restaurant-grade dining. AI-powered ease." light />
          <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {SERVICES.map((s) => (
              <div key={s.title} className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur transition-all hover:border-primary/50 hover:bg-white/10">
                <div className="grid h-12 w-12 place-items-center rounded-xl gradient-primary text-primary-foreground text-xl">
                  {s.icon}
                </div>
                <h3 className="mt-5 font-display text-lg font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm text-white/60">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="mx-auto grid max-w-7xl gap-14 px-4 py-24 sm:px-6 lg:grid-cols-2 lg:px-8">
        <div>
          <img src={foodPasta} alt="Restaurant" className="aspect-[4/3] w-full rounded-3xl object-cover shadow-elegant" loading="lazy" />
        </div>
        <div className="flex flex-col justify-center">
          <span className="text-xs font-semibold uppercase tracking-widest text-primary">About Us</span>
          <h2 className="mt-3 font-display text-4xl font-bold leading-tight sm:text-5xl">
            A modern restaurant, reimagined for the AI era.
          </h2>
          <p className="mt-5 text-muted-foreground">
            Saffron.ai brings together chefs from across India and a smart AI assistant that understands taste. Whether you want something spicy, healthy, or comforting — just ask.
          </p>
          <ul className="mt-6 space-y-3 text-sm">
            {["150+ chef-crafted dishes", "AI-powered personal recommendations", "Locally sourced, seasonal ingredients", "Delivered in 30 minutes or less"].map((f) => (
              <li key={f} className="flex items-center gap-2 text-foreground">
                <FiCheckCircle className="text-primary" /> {f}
              </li>
            ))}
          </ul>
          <div className="mt-8">
            <Button asChild size="lg" className="gap-2"><Link to="/menu">Browse the menu <FiArrowRight /></Link></Button>
          </div>
        </div>
      </section>

      {/* AI SEARCH CTA */}
      <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl gradient-primary p-10 text-primary-foreground shadow-elegant sm:p-16">
          <div className="relative z-10 flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
            <div className="max-w-2xl">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-wider backdrop-blur">
                <FiCpu /> AI Powered Search
              </span>
              <h2 className="mt-4 font-display text-3xl font-bold sm:text-4xl">"I want something spicy under ₹300"</h2>
              <p className="mt-3 text-primary-foreground/80">Type what you feel like eating. We'll do the rest.</p>
            </div>
            <Button asChild size="lg" variant="secondary" className="gap-2 bg-white text-primary hover:bg-white/90">
              <Link to="/ai-search">Try AI Search <FiArrowRight /></Link>
            </Button>
          </div>
          <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-16 -left-10 h-56 w-56 rounded-full bg-white/10 blur-3xl" />
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section id="testimonials" className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
        <SectionHeading eyebrow="Loved by foodies" title="What our customers say" />
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <figure key={t.name} className="rounded-2xl border border-border bg-card p-6 shadow-card-soft">
              <div className="flex gap-1 text-primary">
                {Array.from({ length: 5 }).map((_, i) => <FiStar key={i} className="fill-current" />)}
              </div>
              <blockquote className="mt-4 font-display text-lg leading-relaxed">"{t.quote}"</blockquote>
              <figcaption className="mt-4 text-sm">
                <div className="font-semibold">{t.name}</div>
                <div className="text-muted-foreground">{t.role}</div>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>
    </AppShell>
  );
}

function SectionHeading({ eyebrow, title, light = false }: { eyebrow: string; title: string; light?: boolean }) {
  return (
    <div>
      <span className={`text-xs font-semibold uppercase tracking-widest ${light ? "text-primary-glow" : "text-primary"}`}>{eyebrow}</span>
      <h2 className={`mt-2 font-display text-3xl font-bold leading-tight sm:text-4xl ${light ? "text-white" : "text-foreground"}`}>{title}</h2>
    </div>
  );
}
