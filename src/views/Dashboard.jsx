import { useState } from 'react';
import Sidebar from '../components/Sidebar';
import ProductCard from '../components/ProductCard';
import CollectionCard from '../components/CollectionCard';
import StockCard from '../components/StockCard';
import SalesCard from '../components/SalesCard';
import GalleryCard from '../components/GalleryCard';
import { Badge } from 'flowbite-react';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');

  // Estados completos basados en las entidades de la tienda
  const [productos, setProductos] = useState([
    { id: 1, nombre: "Submariner Date", marca: "Rolex", precio: 14500, anioFabricacion: 2020, descripcion: "Buceo", imagen: "...", galeriaId: 1, coleccionId: 1, stock: 5 },
    { id: 2, nombre: "Nautilus Chronograph", marca: "Patek Philippe", precio: 85000, anioFabricacion: 2018, descripcion: "Alta relojería", imagen: "...", galeriaId: 2, coleccionId: 2, stock: 1 },
    { id: 3, nombre: "Royal Oak Offshore", marca: "Audemars Piguet", precio: 32000, anioFabricacion: 2014, descripcion: "Deportivo", imagen: "...", galeriaId: 3, coleccionId: 1, stock: 3 },
    { id: 4, nombre: "Speedmaster Professional", marca: "Omega", precio: 7500, anioFabricacion: 2016, descripcion: "Moonwatch", imagen: "...", galeriaId: 4, coleccionId: 3, stock: 8 }
  ]);

  const [colecciones, setColecciones] = useState([
    { id: 1, nombre: "Heritage Sport", anioFabricacion: 2015, descripcion: "Línea deportiva." },
    { id: 2, nombre: "Grand Complication", anioFabricacion: 2018, descripcion: "Piezas maestras." }
  ]);

  const [stock] = useState([
    { id: 1, productoId: 1, cantidad: 5, alerta: 2 },
    { id: 2, productoId: 2, cantidad: 1, alerta: 2 },
    { id: 3, productoId: 3, cantidad: 3, alerta: 2 },
    { id: 4, productoId: 4, cantidad: 8, alerta: 2 }
  ]);

  const [ventas] = useState([
    { id: 1, cliente: "Alejandro Silva", fecha: "01 May", total: 14500, estado: "Completado", items: "Submariner Date" },
    { id: 2, cliente: "Valeria Monteverde", fecha: "05 May", total: 32000, estado: "Enviado", items: "Royal Oak Offshore" },
    { id: 3, cliente: "Carlos Ruiz", fecha: "10 May", total: 8500, estado: "Completado", items: "Speedmaster" },
    { id: 4, cliente: "Sofía Benítez", fecha: "15 May", total: 54000, estado: "Completado", items: "Nautilus" }
  ]);

  return (
    <div className="min-h-screen bg-slate-100 flex font-sans">
      {/* Sidebar dinámico */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Contenido principal del Dashboard */}
      <main className="flex-grow p-6 md:p-10 overflow-y-auto">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-black text-slate-800">Panel de Control General</h1>
            <p className="text-sm text-slate-500">Resumen operativo y métricas de la tienda de lujo</p>
          </div>
          <Badge color="warning" className="px-3 py-1 text-sm font-bold">Sistema Activo</Badge>
        </header>

        {/* Cuadrícula de tarjetas idéntica al diseño de referencia */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <SalesCard ventas={ventas} />
          <GalleryCard onOpenGallery={() => setActiveTab('galeria')} />
          <ProductCard productos={productos} setProductos={setProductos} />
          <CollectionCard colecciones={colecciones} setColecciones={setColecciones} />
          <StockCard stock={stock} productos={productos} />
        </div>
      </main>
    </div>
  );
}