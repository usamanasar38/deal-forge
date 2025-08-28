import { AppHero } from "@/components/app-hero";

const links: { label: string; href: string }[] = [
  { label: "Solana Docs", href: "https://docs.solana.com/" },
  { label: "Solana Faucet", href: "https://faucet.solana.com/" },
  { label: "Solana Cookbook", href: "https://solana.com/developers/cookbook/" },
  { label: "Solana Stack Overflow", href: "https://solana.stackexchange.com/" },
  {
    label: "Solana Developers GitHub",
    href: "https://github.com/solana-developers/",
  },
];

export function DashboardFeature() {
  return (
    <div>
      <AppHero subtitle="Say hi to your new Solana app." title="gm" />
      <div className="mx-auto max-w-xl py-6 text-center sm:px-6 lg:px-8">
        <div className="space-y-2">
          <p>Here are some helpful links to get you started.</p>
          {links.map((link, index) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: This is fixed array
            <div key={index}>
              <a
                className="hover:text-gray-500 dark:hover:text-gray-300"
                href={link.href}
                rel="noopener noreferrer"
                target="_blank"
              >
                {link.label}
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
