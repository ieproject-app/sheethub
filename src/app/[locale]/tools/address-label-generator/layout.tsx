
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Address Label Generator | SheetHub Tools',
  description: 'Create and print shipping address labels quickly in PDF format.',
  robots: {
    index: false,
  },
};

export default function ToolLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
