import Link from "next/link";
import Icons from "../icons/icons";


export default function Footer() {
  const socialLinks = [
    {
      icon: Icons.GitHubMinimal,
      href: "https://github.com/aayushmaan-54",
      label: "Github",
    },
    {
      icon: Icons.X_TwitterMinimal,
      href: "https://x.com/aayushmaan54",
      label: "X/Twitter",
    },
    {
      icon: Icons.LinkedInMinimal,
      href: "https://www.linkedin.com/in/aayushmaan54",
      label: "LinkedIn",
    },
    {
      icon: Icons.AtSign,
      href: "mailto:aayushmaan.soni54@gmail.com",
      label: "GMail",
    },
  ]

  return (
    <>
      <footer className="w-full p-4 text-center text-sm text-muted-text border-t border-border flex flex-col items-center gap-2">
        <div className="flex justify-center gap-4 mt-2">
          {socialLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-text bg-quaternary p-1.5 rounded-sm border border-border hover:border-accent-border transition-colors duration-200"
              aria-label={link.label}
              title={link.label}
            >
              <link.icon className="size-5" />
            </Link>
          ))}
        </div>

        <div className="my-5">
          <Link
            href={'https://github.com/aayushmaan-54/SendIt'}
            className="text-primary-text bg-quaternary px-1.5 py-2 rounded-sm border border-border hover:border-accent-border transition-colors duration-200"
          >
            <span>📁 </span>
            <span>GitHub Repo</span>
          </Link>
        </div>

        <p>
          Made with ☕ by{" "}
          <Link
            href="https://linktr.ee/aayushmaan_soni"
            className="underline hover:text-muted-text/80 transition-colors duration-200"
          >
            Aayushmaan Soni
          </Link>
        </p>
      </footer>
    </>
  );
}
