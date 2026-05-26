const tools = [
  { icon: '🌐', title: 'Website Builder', desc: 'Landing pages & portfolios' },
  { icon: '📊', title: 'AI Presentations', desc: 'Pitch decks & slide decks' },
  { icon: '📈', title: 'Smart Spreadsheets', desc: 'Budgets & financial models' },
  { icon: '📝', title: 'Document Writer', desc: 'Reports & proposals' },
  { icon: '📄', title: 'PDF Generator', desc: 'Invoices & formal docs' },
];

export default function DemoSection() {
  return (
    <section className="bg-white px-6 py-20">
      <div className="mx-auto max-w-5xl">
        <h2 className="mb-4 text-center text-3xl font-bold text-gray-900">
          One prompt. Five office tools.
        </h2>
        <p className="mb-12 text-center text-gray-600">
          AI replaces Microsoft 365 + Google Workspace. Prompt in → file out.
        </p>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {tools.map((tool) => (
            <div
              key={tool.title}
              className="rounded-2xl border border-gray-100 bg-gray-50 p-6 transition hover:border-blue-200 hover:shadow-md"
            >
              <div className="mb-3 text-3xl">{tool.icon}</div>
              <h3 className="mb-1 font-semibold text-gray-900">{tool.title}</h3>
              <p className="text-sm text-gray-600">{tool.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
