import { useState } from 'react';
import { Button, Card } from 'flowbite-react';
import { HiArrowLeft, HiTrash, HiPhotograph, HiChevronLeft, HiChevronRight } from 'react-icons/hi';

export default function GalleryView({ galeria = [], setGaleria = () => {}, productos = [], onBack }) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20; // Límite exacto de 20 imágenes por página

  const totalPages = Math.ceil(galeria.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentImages = galeria.slice(startIndex, startIndex + itemsPerPage);

  const handleDelete = (id) => {
    if (confirm("¿Estás seguro de eliminar esta fotografía de la galería?")) {
      setGaleria(galeria.filter(item => item.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      {/* Barra superior con contador y botón de retorno */}
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-xs border border-slate-200">
        <div className="flex items-center gap-4">
          <Button color="gray" size="sm" onClick={onBack} className="cursor-pointer">
            <HiArrowLeft className="h-4 w-4 mr-1" /> Volver al Dashboard
          </Button>
          <div>
            <h1 className="text-xl font-black text-slate-800">Galería de Imágenes</h1>
            <p className="text-xs text-slate-500">Visualización de detalles y relaciones con el catálogo</p>
          </div>
        </div>
        <span className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
          Total: {galeria.length} {galeria.length === 1 ? 'imagen' : 'imágenes'}
        </span>
      </div>

      {/* Cuadrícula en Tarjetas (4 Columnas) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {currentImages.length === 0 ? (
          <div className="col-span-full py-16 text-center bg-white rounded-2xl border border-slate-200">
            <HiPhotograph className="h-12 w-12 text-slate-300 mx-auto mb-3" />
            <p className="text-sm font-bold text-slate-700">No hay imágenes en la galería</p>
          </div>
        ) : (
          currentImages.map((item) => {
            const productoAsociado = productos.find(p => p.id === Number(item.productoId));

            return (
              <Card key={item.id} className="shadow-xs border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
                <div className="h-48 -m-6 mb-3 bg-slate-900 overflow-hidden relative">
                  <img 
                    src={item.urlImagen} 
                    alt="Fotografía Reloj" 
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" 
                  />
                </div>

                <div className="space-y-2 pt-2">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Reloj Relacionado</span>
                    <p className="text-xs font-bold text-slate-800 truncate">
                      {productoAsociado ? `${productoAsociado.nombre}` : 'Sin Asignar'}
                    </p>
                    <p className="text-[11px] text-slate-500">{productoAsociado?.marca || 'Generico'}</p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex justify-end">
                    <Button 
                      size="xs" 
                      color="failure" 
                      onClick={() => handleDelete(item.id)}
                      className="cursor-pointer"
                    >
                      <HiTrash className="h-3.5 w-3.5 mr-1" /> Eliminar
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })
        )}
      </div>

      {/* Paginación (Se activa automáticamente al sobrepasar las 20 imágenes) */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-500 font-medium">
            Mostrando {startIndex + 1} - {Math.min(startIndex + itemsPerPage, galeria.length)} de {galeria.length} imágenes
          </span>
          <div className="flex items-center gap-2">
            <Button 
              size="sm" 
              color="gray" 
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              className="cursor-pointer"
            >
              <HiChevronLeft className="h-4 w-4 mr-1" /> Anterior
            </Button>
            <span className="text-xs font-bold text-slate-700 px-3">
              {currentPage} / {totalPages}
            </span>
            <Button 
              size="sm" 
              color="gray" 
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              className="cursor-pointer"
            >
              Siguiente <HiChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}