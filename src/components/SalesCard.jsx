import { Card, Badge } from 'flowbite-react';
import { HiShoppingCart } from 'react-icons/hi';

export default function SalesCard({ ventas = [] }) {
  // Calculamos el total general de ingresos
  const totalIngresos = ventas.reduce((acc, curr) => acc + curr.total, 0);

  return (
    <Card className="shadow-sm border-none lg:col-span-2">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h5 className="text-lg font-bold text-slate-800">Reporte de Ventas y Órdenes</h5>
          <p className="text-xs text-slate-500">
            Total de transacciones: <span className="font-bold text-blue-600">{ventas.length}</span>
          </p>
        </div>
        <div className="text-right">
          <span className="text-xs text-slate-400 block">Ingresos Totales</span>
          <span className="text-xl font-black text-blue-600">${totalIngresos.toLocaleString()} USD</span>
        </div>
      </div>

      {/* Gráfico de barras dinámico basado en las ventas */}
      <div className="h-48 flex items-end justify-between gap-4 pt-6 px-4 bg-slate-50 rounded-xl border border-slate-200 mb-6">
        {ventas.length === 0 ? (
          <p className="text-xs text-slate-400 m-auto">No hay registros de ventas para mostrar en el gráfico.</p>
        ) : (
          ventas.map((v, index) => {
            // Altura relativa de la barra calculada sobre un estimado máximo (ej. $100,000)
            const porcentajeAltura = Math.min((v.total / 100000) * 100, 100);
            return (
              <div key={v.id || index} className="flex flex-col items-center flex-grow gap-2 h-full justify-end group">
                <span className="text-[10px] font-bold text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity">
                  ${v.total.toLocaleString()}
                </span>
                <div 
                  style={{ height: `${Math.max(porcentajeAltura, 12)}%` }} 
                  className="w-full bg-blue-600 rounded-t-md hover:bg-blue-700 transition-all shadow-sm"
                  title={`${v.cliente}: $${v.total.toLocaleString()}`}
                ></div>
                <span className="text-[10px] text-slate-500 truncate max-w-[60px]">{v.fecha}</span>
              </div>
            );
          })
        )}
      </div>

      {/* Lista reciente de ventas (Atributos: id, cliente, fecha, total, estado, items) */}
      <div className="space-y-3 max-h-48 overflow-y-auto pr-2">
        <h6 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Últimas Órdenes Registradas</h6>
        {ventas.map((v) => (
          <div key={v.id} className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg border border-slate-200">
            <div>
              <div className="flex items-center gap-2">
                <p className="text-sm font-bold text-slate-800">{v.cliente}</p>
                <Badge color={v.estado === 'Completado' ? 'success' : 'warning'} size="sm">
                  {v.estado}
                </Badge>
              </div>
              <p className="text-xs text-slate-500">
                Reloj adquirido: <span className="font-medium text-slate-700">{v.items}</span> • Fecha: {v.fecha}
              </p>
            </div>
            <span className="text-sm font-black text-slate-800">${v.total.toLocaleString()}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}