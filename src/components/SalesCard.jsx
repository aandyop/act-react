import { Card, Button, Badge } from 'flowbite-react';
import { HiTrendingUp, HiShoppingBag, HiCheckCircle, HiClock } from 'react-icons/hi';

export default function SalesCard({ ventas = [], onViewSales }) {
  const totalVentas = (ventas || []).reduce((acc, v) => acc + (v.total || 0), 0);
  const totalPedidos = (ventas || []).length;

  // Tomamos las últimas 3 órdenes registradas para la lista inferior
  const ultimasOrdenes = [...(ventas || [])].reverse().slice(0, 3);

  // Agrupar y sumar ventas por día para el gráfico de barras
  const ventasPorDia = {};
  (ventas || []).forEach(v => {
    let fechaStr = v.fecha || '';
    let diaKey = fechaStr.includes('T') 
      ? fechaStr.split('T')[0] 
      : fechaStr.includes(' ') 
        ? fechaStr.split(' ')[0] 
        : fechaStr;
        
    if (!diaKey) diaKey = 'General';

    if (!ventasPorDia[diaKey]) {
      ventasPorDia[diaKey] = 0;
    }
    ventasPorDia[diaKey] += Number(v.total || 0);
  });

  const diasStats = Object.keys(ventasPorDia)
    .sort()
    .map(dia => ({
      dia,
      total: ventasPorDia[dia]
    }))
    .slice(-7);

  const maxTotalDia = Math.max(...diasStats.map(d => d.total), 1);

  return (
    <Card className="shadow-sm border-none bg-white flex flex-col justify-between lg:col-span-2">
      <div>
        {/* Cabecera del reporte */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-6 border-b border-slate-100 pb-4">
          <div>
            <h5 className="text-lg font-black text-slate-800">Reporte de Ventas y Órdenes</h5>
            <p className="text-xs text-slate-500">
              Total de transacciones: <strong className="text-slate-700">{totalPedidos}</strong>
            </p>
          </div>
          <div className="text-right">
            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Ingresos Totales</p>
            <p className="text-xl font-black text-blue-600">${totalVentas.toLocaleString()} USD</p>
          </div>
        </div>

        {/* Gráfico de barras por día */}
        <div className="space-y-3 mb-6">
          <div className="h-36 flex items-end gap-2 pt-4 px-2 bg-slate-50 rounded-xl border border-slate-100">
            {diasStats.length === 0 ? (
              <p className="text-xs text-slate-400 w-full text-center my-auto">Sin datos de ventas</p>
            ) : (
              diasStats.map((item, index) => {
                const heightPercent = Math.round((item.total / maxTotalDia) * 100);
                const barHeight = Math.max(heightPercent, 12);

                return (
                  <div key={index} className="flex-1 flex flex-col items-center gap-1 group relative h-full justify-end">
                    <div className="absolute -top-7 bg-slate-900 text-white text-[10px] font-bold py-1 px-1.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-md pointer-events-none z-10">
                      ${item.total.toLocaleString()}
                    </div>

                    <div 
                      style={{ height: `${barHeight}%` }} 
                      className="w-full bg-blue-600 rounded-t-md transition-all duration-300 group-hover:bg-blue-700 shadow-xs"
                    ></div>

                    <span className="text-[9px] text-slate-500 truncate w-full text-center" title={item.dia}>
                      {item.dia.slice(5)}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Sección: Últimas Órdenes Registradas */}
        <div className="space-y-3 mb-6">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Últimas Órdenes Registradas
          </p>
          <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
            {ultimasOrdenes.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-4 bg-slate-50 rounded-lg">No hay órdenes registradas.</p>
            ) : (
              ultimasOrdenes.map((orden) => {
                const isCompleted = orden.estado === 'Completado';
                return (
                  <div key={orden.id} className="bg-slate-50 border border-slate-200/80 p-3.5 rounded-xl flex items-center justify-between gap-4 shadow-2xs hover:border-slate-300 transition-colors">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-slate-900">{orden.cliente}</span>
                        <Badge 
                          color={isCompleted ? 'success' : 'warning'} 
                          size="sm" 
                          className="font-bold py-0.5"
                        >
                          {orden.estado || 'Pendiente'}
                        </Badge>
                      </div>
                      <p className="text-xs text-slate-500">
                        Reloj adquirido: <span className="font-medium text-slate-700">{orden.items}</span> • Fecha: {orden.fecha}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-sm font-black text-slate-900">${orden.total?.toLocaleString()}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {onViewSales && (
          <Button 
            onClick={onViewSales}
            className="bg-blue-600 hover:bg-blue-700 font-bold text-xs w-full cursor-pointer"
          >
            Ver Gestión de Ventas
          </Button>
        )}
      </div>
    </Card>
  );
}