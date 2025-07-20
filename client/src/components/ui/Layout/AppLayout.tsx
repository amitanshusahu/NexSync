import AsideLeft from "./AsideLeft";
import AsideRight from "./AsideRight";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="grid md:grid-cols-5 2xl:grid-cols-6 w-screen h-screen">
      <div className="col-span-1">
        <AsideLeft />
      </div>
      <div className="md:col-span-3 2xl:col-span-4 bg-white">
        {children}
      </div>
      <div className="col-span-1">
        <AsideRight />
      </div>
    </main>
  )
}