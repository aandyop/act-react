import { useState } from 'react';
import Sidebar from '../components/Sidebar';
import ProductCard from '../components/ProductCard';
import ProductsView from '../components/ProductsView';
import CollectionCard from '../components/CollectionCard';
import CollectionsView from '../components/CollectionsView';
import SalesCard from '../components/SalesCard';
import SalesView from '../components/SalesView';
import GalleryCard from '../components/GalleryCard';
import GalleryView from '../components/GalleryView';
import StockCard from '../components/StockCard';
import { Badge } from 'flowbite-react';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const [productos, setProductos] = useState([
    { id: 1, nombre: "Submariner Date", marca: "Rolex", precio: 14500, anioFabricacion: 2020, descripcion: "Buceo", imagen: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800", galeriaId: 1, coleccionId: 1, stock: 5 },
    { id: 2, nombre: "Nautilus Chronograph", marca: "Patek Philippe", precio: 85000, anioFabricacion: 2018, descripcion: "Alta relojería", imagen: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800", galeriaId: 2, coleccionId: 2, stock: 1 },
    { id: 3, nombre: "Royal Oak Offshore", marca: "Audemars Piguet", precio: 32000, anioFabricacion: 2014, descripcion: "Deportivo", imagen: "https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?w=800", galeriaId: 3, coleccionId: 1, stock: 3 },
    { id: 4, nombre: "Speedmaster Professional", marca: "Omega", precio: 7500, anioFabricacion: 2016, descripcion: "Moonwatch", imagen: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800", galeriaId: 4, coleccionId: 3, stock: 8 }
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

  const [ventas, setVentas] = useState([
    { id: 1, cliente: "Alejandro Silva", fecha: "2026-05-01T10:00", total: 14500, estado: "Completado", items: "Submariner Date (x1)" },
    { id: 2, cliente: "Valeria Monteverde", fecha: "2026-05-05T14:30", total: 32000, estado: "Enviado", items: "Royal Oak Offshore (x1)" },
    { id: 3, cliente: "Carlos Ruiz", fecha: "2026-05-10T11:15", total: 8500, estado: "Completado", items: "Speedmaster (x1)" },
    { id: 4, cliente: "Sofía Benítez", fecha: "2026-05-15T16:00", total: 54000, estado: "Pendiente", items: "Nautilus Chronograph (x1)" }
  ]);

  const [galeria, setGaleria] = useState([
    { id: 1, productoId: 1, urlImagen: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800", orden: 1 },
    { id: 2, productoId: 2, urlImagen: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800", orden: 2 },
    { id: 3, productoId: 3, urlImagen: "https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?w=800", orden: 3 }
  ]);

  const getHeaderTitle = () => {
    if (activeTab === 'galeria') return 'Galería de Imágenes';
    if (activeTab === 'productos') return 'Catálogo de Productos';
    if (activeTab === 'colecciones') return 'Catálogo de Colecciones';
    if (activeTab === 'ventas') return 'Gestión de Ventas';
    return 'Panel de Control General';
  };

  const getHeaderSubtitle = () => {
    if (activeTab === 'galeria') return 'Visualización y control de registros gráficos';
    if (activeTab === 'productos') return 'Administración completa de relojes y especificaciones';
    if (activeTab === 'colecciones') return 'Administración de líneas y series de relojería';
    if (activeTab === 'ventas') return 'Administración de pedidos, montos y estados de entrega';
    return 'Resumen operativo y métricas de la tienda de lujo';
  };

  return (
    <div className="min-h-screen bg-slate-100 flex font-sans">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="flex-grow p-6 md:p-10 overflow-y-auto">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-black text-slate-800">{getHeaderTitle()}</h1>
            <p className="text-sm text-slate-500">{getHeaderSubtitle()}</p>
          </div>
          <Badge color="warning" className="px-3 py-1 text-sm font-bold">Sistema Activo</Badge>
        </header>

        {activeTab === 'galeria' ? (
          <GalleryView 
            galeria={galeria} 
            setGaleria={setGaleria} 
            productos={productos} 
            onBack={() => setActiveTab('dashboard')} 
          />
        ) : activeTab === 'productos' ? (
          <ProductsView 
            productos={productos} 
            setProductos={setProductos} 
            galeria={galeria} 
            setGaleria={setGaleria} 
            onBack={() => setActiveTab('dashboard')} 
          />
        ) : activeTab === 'colecciones' ? (
          <CollectionsView 
            colecciones={colecciones} 
            setColecciones={setColecciones} 
            productos={productos} 
            setProductos={setProductos} 
            onBack={() => setActiveTab('dashboard')} 
          />
        ) : activeTab === 'ventas' ? (
          <SalesView 
            ventas={ventas} 
            setVentas={setVentas} 
            productos={productos} 
            onBack={() => setActiveTab('dashboard')} 
          />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <SalesCard 
            ventas={ventas} 
            onViewSales={() => setActiveTab('ventas')} 
            />
            <GalleryCard 
              galeria={galeria} 
              onOpenGallery={() => setActiveTab('galeria')} 
            />
            <ProductCard 
              productos={productos} 
              setProductos={setProductos} 
              galeria={galeria} 
              setGaleria={setGaleria} 
            />
            <CollectionCard 
              colecciones={colecciones} 
              setColecciones={setColecciones} 
              productos={productos} 
              setProductos={setProductos} 
            />
            <StockCard productos={productos} ventas={ventas} />
          </div>
        )}
      </main>
    </div>
  );
}