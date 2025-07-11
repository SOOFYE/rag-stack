import Sidebar from "../../components/Sidebar";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Sidebar/>
        <main className="ml-64 pt-[64px] min-h-screen bg-white px-6">
          {children}
        </main>
      </body>
    </html>
  );
}
