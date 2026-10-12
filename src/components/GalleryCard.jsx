import { Card, Button } from 'flowbite-react';
import { HiPhotograph } from 'react-icons/hi';

export default function GalleryCard({ onOpenGallery }) {
  return (
    <Card className="shadow-sm border-none bg-gradient-to-br from-slate-950 to-slate-900 text-white flex flex-col justify-between">
      <div>
        <div className="bg-amber-400/20 text-amber-400 p-3 rounded-xl w-fit mb-4">
          <HiPhotograph className="h-6 w-6" />
        </div>
        <h5 className="text-xl font-bold mb-2 text-white">Galería de Fotos</h5>
        <p className="text-xs text-slate-300 leading-relaxed">
          Administra las vistas detalladas, esferas y maquinarias secundarias de los relojes de alta gama.
        </p>
      </div>
      <Button 
        onClick={onOpenGallery}
        className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold mt-4 cursor-pointer border-none"
      >
        Ver Galería Completa
      </Button>
    </Card>
  );
}