const faqs = [
  {
    q: 'What is allig8or?',
    a: 'An AI office suite. Describe what you need — get a website, pitch deck, spreadsheet, Word doc, or PDF. Prompt in, file out.',
  },
  {
    q: 'What can I generate?',
    a: 'Live HTML websites, PowerPoint (.pptx), Excel (.xlsx), Word (.docx), and print-ready PDFs — all from plain-language prompts.',
  },
  {
    q: 'Is it free to start?',
    a: 'Yes. No credit card required. Create an account to save work and unlock signed-in daily limits.',
  },
  {
    q: 'Do I need design or coding skills?',
    a: 'No templates or Figma required. If you can describe the deliverable, allig8or builds it.',
  },
  {
    q: 'How is this different from ChatGPT?',
    a: 'allig8or outputs real office files — structured decks, spreadsheets, and downloadable documents — not just chat text.',
  },
  {
    q: 'When will paid plans be available?',
    a: 'Pro ($29/mo) and Team ($79/mo) launch when our payment store is approved. The free tier works today.',
  },
];

export default function Faq() {
  return (
    <section id="faq" className="border-t border-white/5 px-6 py-24" aria-labelledby="faq-heading">
      <div className="mx-auto max-w-3xl">
        <h2 id="faq-heading" className="text-center text-3xl font-bold text-white sm:text-4xl">
          Frequently asked questions
        </h2>
        <p className="mt-4 text-center text-zinc-400">
          AI document generator, presentation maker, and website builder — explained.
        </p>
        <dl className="mt-12 space-y-6">
          {faqs.map(({ q, a }) => (
            <div
              key={q}
              className="rounded-2xl border border-white/8 bg-zinc-900/30 p-6"
            >
              <dt className="text-base font-semibold text-white">{q}</dt>
              <dd className="mt-2 text-sm leading-relaxed text-zinc-400">{a}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
