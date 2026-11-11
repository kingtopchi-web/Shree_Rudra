import './globals.css';

export const metadata = {
  title: 'Shree Rudra Power Systems - Bharat ki #1 Rooftop Solar Company',
  description: 'Discover the best rooftop solar panel system for your home with Shree Rudra Power Systems. PM Surya Ghar Muft Bijli Yojana subsidies up to ₹78,000, 0-EMI plans, cyclone-proof installation, and 25-year warranty.',
  icons: {
    icon: '/logo.png',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/logo.png" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}

