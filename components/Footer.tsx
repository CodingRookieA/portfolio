export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#050510]/95 py-12 text-sm text-[var(--text-muted)]">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-4 md:flex-row md:items-end md:justify-between md:px-6">
        <div>
          <p className="font-display text-lg font-semibold text-white">Alexander Zhang</p>
          <div className="mt-4 flex flex-col gap-2">
            <a href="mailto:alexander@example.com" className="w-fit transition hover:text-white">
              alexander@example.com
            </a>
            <a
              href="https://github.com/CodingRookieA"
              target="_blank"
              rel="noreferrer"
              className="w-fit transition hover:text-white"
            >
              github.com/CodingRookieA
            </a>
            <a
              href="https://www.linkedin.com/in/azutsc/"
              target="_blank"
              rel="noreferrer"
              className="w-fit transition hover:text-white"
            >
              https://www.linkedin.com/in/azutsc/
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
