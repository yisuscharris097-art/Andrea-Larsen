'use client';
import Image from 'next/image';
import { motion, type Variants } from 'framer-motion';
import { agent } from './agent-data';

const reveal: Variants = {
  hidden: { opacity: 0, y: 40 },
  show: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.8, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] } }),
};
const vp = { once: true, amount: 0.3 } as const;

const actions = [
  { label: 'Call', href: `tel:${agent.contact.phone}` },
  { label: 'Text', href: `sms:${agent.contact.sms}` },
  { label: 'Email', href: `mailto:${agent.contact.email}` },
  { label: 'Calendar', href: agent.contact.calendly },
  { label: 'vCard', href: agent.contact.vcard },
];

export const AgentSection = () => {
  return (
    <section className="bg-paper px-4 md:px-8 py-24 md:py-36" aria-labelledby="agent-name">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-[0.9fr_1.1fr] gap-14 lg:gap-20 items-center">
        {/* ── Foto ── */}
        <motion.div initial="hidden" whileInView="show" viewport={vp} variants={reveal} className="relative">
          <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-[#e7e0d6] shadow-[0_44px_100px_-44px_rgba(26,23,20,0.5)]">
            <Image src={agent.photo} alt={agent.name} fill sizes="(max-width:1024px) 90vw, 45vw" className="object-cover object-center" />
            <div className="absolute inset-0 rounded-[2rem] ring-1 ring-inset ring-white/10" />
          </div>
          {agent.photoIsPlaceholder && (
            <span className="absolute top-4 left-4 text-[0.58rem] uppercase tracking-widest bg-ink/80 text-white/90 rounded-full px-3 py-1">
              Foto temporal · reemplazar
            </span>
          )}
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={vp}
            variants={reveal}
            custom={2}
            className="absolute -bottom-6 right-6 hidden md:flex gap-6 bg-paper rounded-2xl px-6 py-4 shadow-[0_28px_70px_-34px_rgba(26,23,20,0.5)]"
          >
            <div>
              <p className="font-serif text-4xl text-ink leading-none">27</p>
              <p className="text-[0.58rem] uppercase tracking-widest text-ink/50 mt-1">Years</p>
            </div>
            <div className="w-px bg-ox/30" />
            <div>
              <p className="font-serif text-4xl text-ox leading-none">Top 1%</p>
              <p className="text-[0.58rem] uppercase tracking-widest text-ink/50 mt-1">In State</p>
            </div>
          </motion.div>
        </motion.div>

        {/* ── Contenido ── */}
        <div>
          <motion.span initial="hidden" whileInView="show" viewport={vp} variants={reveal} className="inline-flex items-center gap-3 text-ox font-bold uppercase tracking-[0.26em] text-[0.72rem] font-sans">
            <span className="w-8 h-px bg-ox" /> Meet Your Agent
          </motion.span>
          <motion.h2 id="agent-name" initial="hidden" whileInView="show" viewport={vp} variants={reveal} custom={1} className="font-serif text-5xl md:text-7xl text-ink mt-4 leading-[0.95]">
            {agent.name}
          </motion.h2>
          <motion.p initial="hidden" whileInView="show" viewport={vp} variants={reveal} custom={2} className="font-sans text-ox/90 mt-3 text-sm uppercase tracking-[0.18em]">
            {agent.brand} · {agent.tagline}
          </motion.p>

          <motion.div initial="hidden" whileInView="show" viewport={vp} variants={reveal} custom={3} className="flex flex-wrap gap-2 mt-7">
            {[agent.experience, agent.rank, 'Licensed AZ · FL · NJ', ...agent.titles.slice(0, 2)].map((c) => (
              <span key={c} className="text-xs font-sans text-ink/70 border border-ink/15 rounded-full px-3.5 py-1.5">
                {c}
              </span>
            ))}
          </motion.div>

          <motion.p initial="hidden" whileInView="show" viewport={vp} variants={reveal} custom={4} className="font-sans text-ink/70 text-base md:text-lg leading-relaxed mt-7 max-w-2xl">
            {agent.bio}
          </motion.p>

          <motion.div initial="hidden" whileInView="show" viewport={vp} variants={reveal} custom={5} className="flex flex-wrap gap-3 mt-9">
            {actions.map((a, i) => (
              <a
                key={a.label}
                href={a.href}
                target={a.href.startsWith('http') ? '_blank' : undefined}
                rel="noopener noreferrer"
                className={`font-sans text-sm font-bold tracking-[0.08em] uppercase rounded-full px-6 py-3 transition-all duration-300 ${
                  i === 0 ? 'bg-ox text-white hover:bg-ink' : 'border border-ink/20 text-ink hover:border-ox hover:text-ox'
                }`}
              >
                {a.label}
              </a>
            ))}
          </motion.div>

          <motion.div initial="hidden" whileInView="show" viewport={vp} variants={reveal} custom={6} className="flex flex-wrap gap-x-6 gap-y-3 mt-8 pt-7 border-t border-ink/10">
            {Object.entries(agent.social).map(([name, href]) => (
              <a key={name} href={href} target="_blank" rel="noopener noreferrer" className="font-sans text-xs uppercase tracking-[0.16em] text-ink/55 hover:text-ox transition-colors">
                {name}
              </a>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};
