import { Card } from 'flowbite-react';
import { HiArchive, HiExclamation } from 'react-icons/hi';

export default function StockCard({ stock = [], productos = [] }) {
  return (
    <Card className="shadow-sm border-none">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h5 className="text-lg font-bold text-slate-800">Control de Stock</h5>
          <p className="text-xs text-slate-500">
            Inventario y umbrales críticos de la tienda
          </p>
        </div>
        <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
          <HiArchive className="h-5 w-5" />
        </div>
      </div>

      {/* Lista de inventario y stock */}
      <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
        {stock.length === 0 ? (
          <p className="text-xs text-slate-400 text-center py-4">No hay registros de stock disponibles.</p>
        ) : (
          stock.map((item) => {
            // Relacionamos el stock con el producto usando 'productoId'
            const producto = productos.find((p) => p.id === item.productoId);
            const nombreProducto = producto ? producto.nombre : `Reloj ID: ${item.productoId}`;
            
            // Verificamos si la cantidad actual es menor o igual al umbral de alerta
            const esStockBajo = item.cantidad <= item.alerta;

            return (
              <div 
                key={item.id} 
                className={`flex items-center justify-between p-3 rounded-lg border transition-all ${
                  esStockBajo 
                    ? 'bg-amber-50 border-amber-300 shadow-sm' 
                    : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div>
                  <p className="text-sm font-bold text-slate-800">{nombreProducto}</p>
                  <p className="text-xs text-slate-500">
                    Disponibles: <span className="font-semibold text-slate-700">{item.cantidad}</span> 
                    <span className="text-[10px] text-slate-400 ml-1">(Mínimo requerido: {item.alerta})</span>
                  </p>
                </div>

                {/* Alerta visual en amarillo si hay stock bajo */}
                {esStockBajo && (
                  <div className="flex items-center gap-1 bg-amber-400 text-slate-950 px-2.5 py-1 rounded-md text-[11px] font-black shadow-sm animate-pulse">
                    <HiExclamation className="h-3.5 w-3.5" /> Stock Bajo
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </Card>
  );
}