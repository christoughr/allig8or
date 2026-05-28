const faqs = [
  {
    q: 'What is allig8tor?',
    a: 'An AI office suite. Describe what you need — get a website, pitch deck, spreadsheet, Word doc, or PDF. Prompt in, file out.',
  },
  {
    q: 'What can I generate?',
    a: 'Live HTML websites, PowerPoint (.pptx), Excel (.xlsx), Word (.docx), and print-ready PDFs — all from plain-language prompts.',
  },
  {
    q: 'Is it free to start?',
    a: 'Yes. No credit card required. Free includes 1 generation per month for evaluation.',
  },
  {
    q: 'Do I need design or coding skills?',
    a: 'No templates or Figma required. If you can describe the deliverable, allig8tor builds it.',
  },
  {
    q: 'How is this different from ChatGPT?',
    a: 'allig8tor outputs real office files — structured decks, spreadsheets, and downloadable documents — not just chat text.',
  },
  {
    q: 'When will paid plans be available?',
    a: 'Starter ($149/mo), Pro ($399/mo), and Team ($999/mo) are usage-limited monthly plans. Paid billing launches when our payment store is approved. The free tier works today.',
  },
  {
    q: 'Why is pricing higher than typical AI tools?',
    a: 'allig8tor is priced as a production tool that outputs client-ready files, not just text. Pricing is designed to replace manual deck/doc/sheet production time while keeping hard monthly caps.',
  },
  {
    q: 'What is your risk-reversal policy?',
    a: 'No annual lock-in. Plans are monthly and cancel anytime, so teams can validate ROI before scaling usage.',
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
