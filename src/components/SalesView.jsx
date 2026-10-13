import { useState } from 'react';
import { Card, Button, Badge, Modal, ModalHeader, ModalBody, TextInput } from 'flowbite-react';
import { HiPlus, HiPencil, HiTrash, HiArrowLeft, HiChevronLeft, HiChevronRight, HiShoppingBag, HiCheckCircle, HiClock } from 'react-icons/hi';

export default function SalesView({ ventas = [], setVentas = () => {}, productos = [], onBack }) {
  const [showModal, setShowModal] = useState(false);
  const [editingSale, setEditingSale] = useState(null);

  // Paginación de máximo 20 por página
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  const totalPages = Math.ceil((ventas?.length || 0) / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentSales = (ventas || []).slice(startIndex, startIndex + itemsPerPage);

  const [form, setForm] = useState({
    cliente: '',
    fecha: new Date().toISOString().slice(0, 16),
    estado: 'Pendiente'
  });

  const [selectedItems, setSelectedItems] = useState([{ productoId: productos[0]?.id || 1, cantidad: 1 }]);

  const handleOpenCreate = () => {
    setEditingSale(null);
    setForm({
      cliente: '',
      fecha: new Date().toISOString().slice(0, 16),
      estado: 'Pendiente'
    });
    setSelectedItems([{ productoId: productos[0]?.id || 1, cantidad: 1 }]);
    setShowModal(true);
  };

  const handleOpenEdit = (v) => {
    setEditingSale(v.id);
    setForm({
      cliente: v.cliente || '',
      fecha: v.fecha || new Date().toISOString().slice(0, 16),
      estado: v.estado || 'Pendiente'
    });

    if (v.itemsStruct && Array.isArray(v.itemsStruct) && v.itemsStruct.length > 0) {
      setSelectedItems(v.itemsStruct);
    } else {
      setSelectedItems([{ productoId: productos[0]?.id || 1, cantidad: 1 }]);
    }
    setShowModal(true);
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...selectedItems];
    newItems[index][field] = Number(value);
    setSelectedItems(newItems);
  };

  const handleAddItemRow = () => {
    setSelectedItems([...selectedItems, { productoId: productos[0]?.id || 1, cantidad: 1 }]);
  };

  const handleRemoveItemRow = (index) => {
    if (selectedItems.length > 1) {
      setSelectedItems(selectedItems.filter((_, i) => i !== index));
    }
  };

  const handleSave = (e) => {
    e.preventDefault();

    let calculatedTotal = 0;
    const itemsResumenArray = [];

    selectedItems.forEach(item => {
      const prod = productos.find(p => p.id === Number(item.productoId));
      if (prod) {
        calculatedTotal += (prod.precio || 0) * (item.cantidad || 1);
        itemsResumenArray.push(`${prod.nombre} (x${item.cantidad})`);
      }
    });

    const itemsResumenText = itemsResumenArray.join(', ') || "Producto genérico (x1)";

    if (editingSale !== null) {
      setVentas(ventas.map(v => 
        v.id === editingSale 
          ? { 
              ...v, 
              cliente: form.cliente,
              fecha: form.fecha,
              estado: form.estado,
              total: calculatedTotal > 0 ? calculatedTotal : v.total,
              items: itemsResumenText,
              itemsStruct: selectedItems
            } 
          : v
      ));
    } else {
      const newSale = {
        id: Date.now(),
        cliente: form.cliente,
        fecha: form.fecha,
        total: calculatedTotal > 0 ? calculatedTotal : 10000,
        estado: 'Pendiente',
        items: itemsResumenText,
        itemsStruct: selectedItems
      };
      setVentas([newSale, ...ventas]);
    }

    setShowModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Cabecera */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl shadow-xs border border-slate-200">
        <div className="flex items-center gap-4">
          <Button color="gray" size="sm" onClick={onBack} className="cursor-pointer">
            <HiArrowLeft className="h-4 w-4 mr-1" /> Volver al Dashboard
          </Button>
          <div>
            <h1 className="text-xl font-black text-slate-800">Gestión de Ventas y Pedidos</h1>
            <p className="text-xs text-slate-500">Control de órdenes, asignación de relojes, estados y seguimiento financiero</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-2 rounded-lg border border-slate-200">
            Total: {ventas.length} pedidos
          </span>
          <Button 
            onClick={handleOpenCreate} 
            className="bg-blue-600 hover:bg-blue-700 cursor-pointer font-bold text-xs"
          >
            <HiPlus className="h-4 w-4 mr-1" /> Nuevo Pedido
          </Button>
        </div>
      </div>

      {/* Lista de Pedidos */}
      <div className="space-y-4">
        {currentSales.length === 0 ? (
          <div className="py-16 text-center bg-white rounded-2xl border border-slate-200">
            <HiShoppingBag className="h-12 w-12 text-slate-300 mx-auto mb-3" />
            <p className="text-sm font-bold text-slate-700">No hay pedidos registrados</p>
            <p className="text-xs text-slate-400 mt-1">Haz clic en "Nuevo Pedido" para registrar la primera venta</p>
          </div>
        ) : (
          currentSales.map((v) => {
            const isCompleted = v.estado === 'Completado';
            const isShipped = v.estado === 'Enviado';

            return (
              <Card key={v.id} className="w-full shadow-xs border-slate-200 hover:shadow-md transition-shadow">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                  
                  <div className="space-y-2 flex-grow">
                    <div className="flex items-center gap-3 flex-wrap">
                      <h3 className="text-base font-black text-slate-900">{v.cliente}</h3>
                      <Badge 
                        color={isCompleted ? 'success' : isShipped ? 'info' : 'warning'} 
                        size="sm" 
                        className="font-bold flex items-center gap-1"
                      >
                        {isCompleted ? <HiCheckCircle className="h-3.5 w-3.5" /> : <HiClock className="h-3.5 w-3.5" />}
                        {v.estado || 'Pendiente'}
                      </Badge>
                      <span className="text-xs text-slate-400 font-medium">Fecha: {v.fecha}</span>
                    </div>

                    <p className="text-xs text-slate-600 font-medium">
                      <strong className="text-slate-800">Modelos solicitados:</strong> {v.items}
                    </p>

                    <p className="text-sm font-black text-slate-900">
                      Total: ${v.total?.toLocaleString()} <span className="text-[10px] font-normal text-slate-400">USD</span>
                    </p>
                  </div>

                  {/* Únicamente botón de Editar */}
                  <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                    <Button 
                      size="xs" 
                      color="warning" 
                      onClick={() => handleOpenEdit(v)}
                      className="cursor-pointer"
                      title="Editar Pedido"
                    >
                      <HiPencil className="h-3.5 w-3.5 mr-1" /> Editar
                    </Button>
                  </div>

                </div>
              </Card>
            );
          })
        )}
      </div>

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-500 font-medium">
            Mostrando {startIndex + 1} - {Math.min(startIndex + itemsPerPage, ventas.length)} de {ventas.length} pedidos
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

      {/* Modal */}
      <Modal show={showModal} onClose={() => setShowModal(false)} size="xl">
        <ModalHeader>
          {editingSale !== null ? 'Editar Pedido / Venta' : 'Registrar Nuevo Pedido'}
        </ModalHeader>
        <ModalBody>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nombre del Cliente
                </label>
                <TextInput 
                  required 
                  value={form.cliente} 
                  onChange={(e) => setForm({...form, cliente: e.target.value})} 
                  placeholder="Ej. Alejandro Silva"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Fecha y Hora del Pedido
                </label>
                <input 
                  type="datetime-local" 
                  required
                  value={form.fecha}
                  onChange={(e) => setForm({...form, fecha: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500 outline-none border-slate-300 text-slate-700"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Estado del Pedido (Actualizar a Completado, Enviado, etc.)
              </label>
              <select 
                value={form.estado}
                onChange={(e) => setForm({...form, estado: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500 outline-none border-slate-300 font-semibold text-slate-800"
              >
                <option value="Pendiente">Pendiente</option>
                <option value="Completado">Completado</option>
                <option value="Enviado">Enviado</option>
                <option value="Cancelado">Cancelado</option>
              </select>
            </div>

            <div className="space-y-3 pt-2 border-t">
              <div className="flex justify-between items-center">
                <label className="block text-xs font-bold text-slate-700">
                  Relojes y Cantidades del Pedido
                </label>
                <Button 
                  size="xs" 
                  color="light" 
                  onClick={handleAddItemRow}
                  className="cursor-pointer font-bold text-xs"
                >
                  <HiPlus className="h-3.5 w-3.5 mr-1" /> Agregar otro reloj
                </Button>
              </div>

              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {selectedItems.map((item, index) => (
                  <div key={index} className="flex items-center gap-3 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                    <div className="flex-grow">
                      <label className="block text-[10px] font-bold text-slate-400">Modelo de Reloj</label>
                      <select 
                        value={item.productoId}
                        onChange={(e) => handleItemChange(index, 'productoId', e.target.value)}
                        className="w-full px-2.5 py-1.5 border rounded-md text-xs bg-white focus:ring-2 focus:ring-blue-500 outline-none border-slate-300"
                      >
                        {productos.map(p => (
                          <option key={p.id} value={p.id}>
                            {p.nombre} ({p.marca}) - ${p.precio?.toLocaleString()} USD
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="w-28">
                      <label className="block text-[10px] font-bold text-slate-400">Cantidad</label>
                      <input 
                        type="number"
                        min="1"
                        value={item.cantidad}
                        onChange={(e) => handleItemChange(index, 'cantidad', e.target.value)}
                        className="w-full px-2.5 py-1.5 border rounded-md text-xs bg-white focus:ring-2 focus:ring-blue-500 outline-none border-slate-300"
                      />
                    </div>

                    {selectedItems.length > 1 && (
                      <button 
                        type="button" 
                        onClick={() => handleRemoveItemRow(index)}
                        className="text-red-500 hover:text-red-700 p-2 mt-4 cursor-pointer"
                        title="Quitar ítem"
                      >
                        <HiTrash className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button color="gray" onClick={() => setShowModal(false)}>Cancelar</Button>
              <Button type="submit" className="bg-blue-600">Guardar Pedido</Button>
            </div>
          </form>
        </ModalBody>
      </Modal>
    </div>
  );
}