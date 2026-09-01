export const metadata = {
  title: 'AuraMart API Backend',
  description: 'Production E-Commerce Backend Services',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
