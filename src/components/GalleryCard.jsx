import { Card, Button } from 'flowbite-react';
import { HiPhotograph } from 'react-icons/hi';

export default function GalleryCard({ galeria = [], onOpenGallery }) {
  // Obtenemos las últimas 3 fotografías de la galería para el preview
  const ultimasFotos = galeria.slice(0, 3);

  return (
    <Card className="shadow-sm border-none bg-gradient-to-br from-slate-950 to-slate-900 text-white flex flex-col justify-between">
      <div>
        <div className="bg-amber-400/20 text-amber-400 p-3 rounded-xl w-fit mb-4">
          <HiPhotograph className="h-6 w-6" />
        </div>
        <h5 className="text-xl font-bold mb-2 text-white">Galería de Fotos</h5>
        <p className="text-xs text-slate-300 leading-relaxed mb-4">
          Administra las vistas detalladas, esferas y maquinarias secundarias de los relojes de alta gama.
        </p>

        <Button 
          onClick={onOpenGallery}
          className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold w-full cursor-pointer border-none mb-4"
        >
          Ver Galería Completa
        </Button>

        {/* Preview de las 3 imágenes recientes */}
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
            Vista Previa (Últimas 3 imágenes)
          </p>
          <div className="grid grid-cols-3 gap-2">
            {ultimasFotos.length === 0 ? (
              <p className="text-[11px] text-slate-500 col-span-3 text-center py-2">No hay imágenes en la galería.</p>
            ) : (
              ultimasFotos.map((foto) => (
                <div 
                  key={foto.id} 
                  onClick={onOpenGallery}
                  className="h-16 rounded-lg overflow-hidden border border-slate-800 cursor-pointer group hover:border-amber-400 transition-all shadow-xs"
                  title="Haz clic para abrir la galería"
                >
                  <img 
                    src={foto.urlImagen} 
                    alt="Preview" 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-200" 
                  />
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}