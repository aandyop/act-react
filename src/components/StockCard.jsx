import { Card, Badge } from 'flowbite-react';
import { HiCube } from 'react-icons/hi';

export default function StockCard({ productos = [], ventas = [] }) {
  // Cálculo en tiempo real del stock disponible restando las unidades vendidas en los pedidos
  const stockCalculado = (productos || []).map(p => {
    let unidadesVendidas = 0;
    
    (ventas || []).forEach(v => {
      if (v.itemsStruct && Array.isArray(v.itemsStruct)) {
        v.itemsStruct.forEach(item => {
          if (Number(item.productoId) === Number(p.id)) {
            unidadesVendidas += Number(item.cantidad || 0);
          }
        });
      }
    });

    const stockBase = Number(p.stock || 0);
    const disponibles = Math.max(stockBase - unidadesVendidas, 0);
    const umbralAlerta = 2; // Umbral crítico para mostrar "Stock Bajo"

    return {
      ...p,
      disponibles,
      esStockBajo: disponibles <= umbralAlerta
    };
  });

  return (
    <Card className="shadow-sm border-none bg-white flex flex-col justify-between">
      <div>
        <div className="flex justify-between items-center mb-4">
          <div>
            <h5 className="text-lg font-bold text-slate-800">Control de Stock</h5>
            <p className="text-xs text-slate-500">Inventario y umbrales críticos de la tienda</p>
          </div>
          <div className="bg-amber-500/10 text-amber-600 p-3 rounded-xl w-fit">
            <HiCube className="h-6 w-6" />
          </div>
        </div>

        {/* Lista dinámica de stock */}
        <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
          {stockCalculado.length === 0 ? (
            <p className="text-xs text-slate-400 text-center py-6">No hay productos en inventario.</p>
          ) : (
            stockCalculado.map((item) => (
              <div 
                key={item.id} 
                className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 shadow-2xs"
              >
                <div>
                  <h6 className="text-sm font-bold text-slate-900">{item.nombre}</h6>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Disponibles: <strong className="text-slate-800">{item.disponibles}</strong> <span className="text-slate-400">({item.marca})</span>
                  </p>
                </div>

                {item.esStockBajo && (
                  <Badge color="warning" size="sm" className="font-bold py-1 px-2.5">
                    Stock Bajo
                  </Badge>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </Card>
  );
}