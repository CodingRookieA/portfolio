function MailIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="16"
      height="16"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="shrink-0 text-[var(--text-faint)] transition group-hover:text-accent-cyan"
    >
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </svg>
  );
}

function GithubIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="16"
      height="16"
      fill="currentColor"
      aria-hidden="true"
      className="shrink-0 text-[var(--text-faint)] transition group-hover:text-accent-cyan"
    >
      <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56 0-.27-.01-1-.02-1.96-3.2.69-3.88-1.54-3.88-1.54-.52-1.33-1.28-1.69-1.28-1.69-1.05-.72.08-.71.08-.71 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.71 1.26 3.37.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.7 0-1.26.45-2.29 1.18-3.1-.12-.29-.51-1.46.11-3.05 0 0 .97-.31 3.18 1.18.92-.26 1.91-.39 2.89-.39s1.97.13 2.89.39c2.21-1.49 3.18-1.18 3.18-1.18.62 1.59.23 2.76.11 3.05.74.81 1.18 1.84 1.18 3.1 0 4.43-2.7 5.41-5.27 5.69.41.36.78 1.06.78 2.13 0 1.54-.01 2.78-.01 3.16 0 .31.21.68.8.56C20.21 21.39 23.5 17.07 23.5 12 23.5 5.65 18.35.5 12 .5z" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="16"
      height="16"
      fill="currentColor"
      aria-hidden="true"
      className="shrink-0 text-[var(--text-faint)] transition group-hover:text-accent-cyan"
    >
      <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.13 1.45-2.13 2.94v5.67H9.37V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43c-1.14 0-2.06-.93-2.06-2.06 0-1.14.92-2.06 2.06-2.06 1.13 0 2.06.92 2.06 2.06 0 1.13-.93 2.06-2.06 2.06zm1.78 13.02H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0z" />
    </svg>
  );
}

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#050510]/95 py-12 text-sm text-[var(--text-muted)]">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 md:flex-row md:items-end md:justify-between md:gap-10 md:px-6">
        <div>
          <p className="font-display text-lg font-semibold text-white">Alexander Zhang</p>
          <div className="mt-4 flex flex-col gap-2">
            <a
              href="mailto:zhangalexander6@gmail.com"
              className="group inline-flex w-fit items-center gap-2.5 transition hover:text-white"
            >
              <MailIcon />
              zhangalexander6@gmail.com
            </a>
            <a
              href="https://github.com/CodingRookieA"
              target="_blank"
              rel="noreferrer"
              className="group inline-flex w-fit items-center gap-2.5 transition hover:text-white"
            >
              <GithubIcon />
              github.com/CodingRookieA
            </a>
            <a
              href="https://www.linkedin.com/in/azutsc/"
              target="_blank"
              rel="noreferrer"
              className="group inline-flex w-fit items-center gap-2.5 transition hover:text-white"
            >
              <LinkedInIcon />
              linkedin.com/in/azutsc
            </a>
          </div>
        </div>
        <p className="text-[var(--text-faint)] md:text-right">© {new Date().getFullYear()} · Built with Next.js</p>
      </div>
    </footer>
  );
}
