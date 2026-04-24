import { Suspense } from "react"
import Menu3D from "./components/Menu3D"

export default function Page() {
  return (
    <Suspense fallback={<div className="text-white p-10">Cargando...</div>}>
      <Menu3D />
    </Suspense>
  )
}