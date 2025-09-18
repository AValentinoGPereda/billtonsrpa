// src/components/BarraLateral.jsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  HomeIcon, 
  ClipboardListIcon, 
  UserGroupIcon, 
  CubeIcon, 
  TruckIcon,
  LogoutIcon
} from "@heroicons/react/outline";

export default function BarraLateral() {
  const pathname = usePathname();

  // Lista de rutas donde no debe mostrarse la barra lateral
  const hiddenRoutes = ["/iniciar-sesion"];

  // Si la ruta actual está en la lista de rutas ocultas, no renderizar nada
  if (hiddenRoutes.includes(pathname)) {
    return null;
  }

  return (
    <nav className="w-16 bg-blue-900 min-h-screen flex flex-col items-center py-4 space-y-6">
      <Link href="/usuarios/registro" className="text-white hover:text-blue-300">
        <UserGroupIcon className="h-6 w-6" />
      </Link>
      <Link href="/pedidos/lista" className="text-white hover:text-blue-300">
        <ClipboardListIcon className="h-6 w-6" />
      </Link>
      <Link href="/clientes/lista" className="text-white hover:text-blue-300">
        <HomeIcon className="h-6 w-6" />
      </Link>
      <Link href="/pedidos/asignados" className="text-white hover:text-blue-300">
        <CubeIcon className="h-6 w-6" />
      </Link>
      <Link href="/inventario/ver" className="text-white hover:text-blue-300">
        <TruckIcon className="h-6 w-6" />
      </Link>

      <Link href="/iniciar-sesion" className="text-white hover:text-blue-300">
           <LogoutIcon className="h-6 w-6" />
      </Link>
    </nav>
  );
}