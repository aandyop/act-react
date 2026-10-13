import { useState } from 'react';
import { Card, Button, Badge, Modal, ModalHeader, ModalBody, TextInput } from 'flowbite-react';
import { HiPlus, HiPencil, HiTrash, HiEye, HiArrowLeft, HiChevronLeft, HiChevronRight, HiCollection } from 'react-icons/hi';

export default function CollectionsView({ colecciones = [], setColecciones = () => {}, productos = [], setProductos = () => {}, onBack }) {
  const [showModal, setShowModal] = useState(false);
  const [editingCollection, setEditingCollection] = useState(null);

  // Estados de paginación (máximo 20 por página)
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  const totalPages = Math.ceil(colecciones.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentCollections = colecciones.slice(startIndex, startIndex + itemsPerPage);

  const [form, setForm] = useState({
    nombre: '',
    anioFabricacion: '',
    descripcion: ''
  });

  const [selectedProductIds, setSelectedProductIds] = useState([]);

  const handleOpenCreate = () => {
    setEditingCollection(null);
    setForm({ nombre: '', anioFabricacion: '', descripcion: '' });
    setSelectedProductIds([]);
    setShowModal(true);
  };

  const handleOpenEdit = (col) => {
    setEditingCollection(col.id);
    setForm(col);
    const currentProducts = productos
      .filter(p => p.coleccionId === col.id)
      .map(p => p.id);
    setSelectedProductIds(currentProducts);
    setShowModal(true);
  };

  const handleDescriptionChange = (e) => {
    const text = e.target.value;
    const words = text.trim() ? text.trim().split(/\s+/) : [];
    if (words.length <= 300) {
      setForm({ ...form, descripcion: text });
    } else {
      setForm({ ...form, descripcion: words.slice(0, 300).join(' ') });
    }
  };

  const handleCheckboxChange = (productId) => {
    if (selectedProductIds.includes(productId)) {
      setSelectedProductIds(selectedProductIds.filter(id => id !== productId));
    } else {
      setSelectedProductIds([...selectedProductIds, productId]);
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    let targetCollectionId = editingCollection;

    if (editingCollection !== null) {
      setColecciones(colecciones.map(c => 
        c.id === editingCollection 
          ? { ...form, id: editingCollection, anioFabricacion: Number(form.anioFabricacion) } 
          : c
      ));
    } else {
      targetCollectionId = Date.now();
      const newCol = {
        ...form,
        id: targetCollectionId,
        anioFabricacion: Number(form.anioFabricacion)
      };
      setColecciones([newCol, ...colecciones]);
    }

    if (setProductos) {
      setProductos(productos.map(p => {
        if (selectedProductIds.includes(p.id)) {
          return { ...p, coleccionId: targetCollectionId };
        } else if (p.coleccionId === targetCollectionId) {
          return { ...p, coleccionId: 1 };
        }
        return p;
      }));
    }

    setShowModal(false);
  };

  const handleDelete = (id) => {
    if (confirm("¿Estás seguro de eliminar esta colección?")) {
      setColecciones(colecciones.filter(c => c.id !== id));
      setProductos(productos.map(p => p.coleccionId === id ? { ...p, coleccionId: 1 } : p));
    }
  };

  const wordCount = form.descripcion.trim() ? form.descripcion.trim().split(/\s+/).length : 0;

  return (
    <div className="space-y-6">
      {/* Cabecera de la vista */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl shadow-xs border border-slate-200">
        <div className="flex items-center gap-4">
          <Button color="gray" size="sm" onClick={onBack} className="cursor-pointer">
            <HiArrowLeft className="h-4 w-4 mr-1" /> Volver al Dashboard
          </Button>
          <div>
            <h1 className="text-xl font-black text-slate-800">Catálogo de Colecciones</h1>
            <p className="text-xs text-slate-500">Gestión de líneas de relojería, conceptos y asignación de piezas</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-2 rounded-lg border border-slate-200">
            Total: {colecciones.length} colecciones
          </span>
          <Button 
            onClick={handleOpenCreate} 
            className="bg-blue-600 hover:bg-blue-700 cursor-pointer font-bold text-xs"
          >
            <HiPlus className="h-4 w-4 mr-1" /> Nueva Colección
          </Button>
        </div>
      </div>

      {/* Lista de Colecciones en Cards de ancho completo (w-full) */}
      <div className="space-y-4">
        {currentCollections.length === 0 ? (
          <div className="py-16 text-center bg-white rounded-2xl border border-slate-200">
            <HiCollection className="h-12 w-12 text-slate-300 mx-auto mb-3" />
            <p className="text-sm font-bold text-slate-700">No hay colecciones registradas</p>
            <p className="text-xs text-slate-400 mt-1">Haz clic en "Nueva Colección" para crear la primera</p>
          </div>
        ) : (
          currentCollections.map((c) => {
            const relojesEnColeccion = productos.filter(p => p.coleccionId === c.id);

            return (
              <Card key={c.id} className="w-full shadow-xs border-slate-200 hover:shadow-md transition-shadow">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                  {/* Título, descripción, miniaturas de fotos y relojes incluidos */}
                  <div className="space-y-3 flex-grow">
                    <div className="flex items-center gap-3 flex-wrap">
                      <h3 className="text-base font-black text-slate-900">{c.nombre}</h3>
                      <Badge color="gray" size="sm">Año: {c.anioFabricacion}</Badge>
                    </div>
                    
                    <p className="text-xs text-slate-600 leading-relaxed">{c.descripcion || "Sin descripción disponible."}</p>

                    {/* FOTOS DE LOS PRODUCTOS PERTENECIENTES A LA COLECCIÓN */}
                    {relojesEnColeccion.length > 0 && (
                      <div className="pt-1">
                        <p className="text-[10px] uppercase font-bold text-slate-400 mb-1.5 tracking-wider">
                          Fotografías de Relojes Incluidos ({relojesEnColeccion.length})
                        </p>
                        <div className="flex items-center gap-3 flex-wrap">
                          {relojesEnColeccion.map((reloj) => (
                            <div key={reloj.id} className="flex items-center gap-2 bg-slate-50 border border-slate-200 p-1.5 rounded-lg">
                              <img 
                                src={reloj.imagen} 
                                alt={reloj.nombre} 
                                className="w-20 h-20 object-cover rounded-md border border-slate-200 shadow-xs" 
                              />
                              <div className="pr-1">
                                <p className="text-xs font-bold text-slate-800 line-clamp-1">{reloj.nombre}</p>
                                <p className="text-[10px] text-slate-500">{reloj.marca}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Botones al extremo derecho */}
                  <div className="flex items-start gap-2 self-start md:self-start shrink-0">
                    <Button 
                      size="xs" 
                      color="gray" 
                      onClick={() => alert(`Vista individual de la colección: ${c.nombre} (Próximamente)`)}
                      className="cursor-pointer"
                    >
                      <HiEye className="h-3.5 w-3.5 mr-1" /> Ver
                    </Button>
                    <Button 
                      size="xs" 
                      color="warning" 
                      onClick={() => handleOpenEdit(c)}
                      className="cursor-pointer"
                      title="Editar"
                    >
                      <HiPencil className="h-3.5 w-3.5 mr-1" /> Editar
                    </Button>
                    <Button 
                      size="xs" 
                      color="failure" 
                      onClick={() => handleDelete(c.id)}
                      className="cursor-pointer"
                      title="Eliminar"
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

      {/* Paginación si excede 20 colecciones */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-500 font-medium">
            Mostrando {startIndex + 1} - {Math.min(startIndex + itemsPerPage, colecciones.length)} de {colecciones.length} colecciones
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

      {/* Modal para Crear / Editar Colección */}
      <Modal show={showModal} onClose={() => setShowModal(false)} size="lg">
        <ModalHeader>
          {editingCollection !== null ? 'Editar Colección' : 'Registrar Nueva Colección'}
        </ModalHeader>
        <ModalBody>
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Nombre de la Colección
              </label>
              <TextInput 
                required 
                value={form.nombre} 
                onChange={(e) => setForm({...form, nombre: e.target.value})} 
                placeholder="Ej. Heritage Sport"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Año de Fabricación / Lanzamiento
              </label>
              <TextInput 
                required 
                type="number" 
                value={form.anioFabricacion} 
                onChange={(e) => setForm({...form, anioFabricacion: e.target.value})} 
                placeholder="2015"
              />
            </div>
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-xs font-bold text-slate-700 uppercase">
                  Descripción de la Colección
                </label>
                <span className={`text-xs font-semibold ${wordCount > 250 ? 'text-amber-600' : 'text-slate-400'}`}>
                  {wordCount} / 300 palabras
                </span>
              </div>
              <textarea 
                rows="3"
                value={form.descripcion} 
                onChange={handleDescriptionChange}
                placeholder="Detalles de la línea, concepto y acabados generales de la colección..."
                className="w-full p-3 text-sm text-slate-900 bg-white rounded-lg border border-slate-300 focus:ring-blue-500 focus:border-blue-500 resize-y outline-none"
              ></textarea>
            </div>

            {/* SECCIÓN DE SELECCIÓN DE PRODUCTOS */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                Seleccionar Relojes para esta Colección
              </label>
              <div className="max-h-40 overflow-y-auto border border-slate-300 rounded-lg p-3 bg-slate-50 space-y-2">
                {productos.length === 0 ? (
                  <p className="text-xs text-slate-400 text-center py-2">No hay productos registrados en el sistema.</p>
                ) : (
                  productos.map(p => {
                    const isChecked = selectedProductIds.includes(p.id);
                    return (
                      <label 
                        key={p.id} 
                        className={`flex items-center justify-between p-2 rounded-md border text-xs cursor-pointer transition-colors ${
                          isChecked ? 'bg-blue-50 border-blue-300 font-bold text-blue-900' : 'bg-white border-slate-200 text-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <input 
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => handleCheckboxChange(p.id)}
                            className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                          />
                          <span>{p.nombre} <span className="font-normal text-slate-500">({p.marca})</span></span>
                        </div>
                        <span className="text-[11px] text-slate-400">${p.precio?.toLocaleString()}</span>
                      </label>
                    );
                  })
                )}
              </div>
              <p className="text-[11px] text-slate-500 mt-1">Marca las casillas de los relojes que formarán parte de esta colección.</p>
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button color="gray" onClick={() => setShowModal(false)}>Cancelar</Button>
              <Button type="submit" className="bg-blue-600">Guardar Colección</Button>
            </div>
          </form>
        </ModalBody>
      </Modal>
    </div>
  );
}