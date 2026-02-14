import './globals.css';

export const metadata = {
  title: 'Workflow Builder Lite',
  description: 'AI-powered text processing workflows',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
