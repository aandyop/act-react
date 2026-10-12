import { useState } from 'react';
import { Card, Button, Badge, Modal, ModalHeader, ModalBody, TextInput } from 'flowbite-react';
import { HiPlus, HiPencil, HiTrash, HiCheck } from 'react-icons/hi';

export default function CollectionCard({ colecciones, setColecciones, productos = [], setProductos }) {
  const [showModal, setShowModal] = useState(false);
  const [editingCollection, setEditingCollection] = useState(null);

  const [form, setForm] = useState({
    nombre: '',
    anioFabricacion: '',
    descripcion: ''
  });

  // Estado local para llevar el control de los IDs de los productos seleccionados en esta colección
  const [selectedProductIds, setSelectedProductIds] = useState([]);

  const handleOpenCreate = () => {
    setEditingCollection(null);
    setForm({ nombre: '', anioFabricacion: '', descripcion: '' });
    setSelectedProductIds([]); // Ningún producto seleccionado por defecto al crear
    setShowModal(true);
  };

  const handleOpenEdit = (col) => {
    setEditingCollection(col.id);
    setForm(col);
    // Seleccionamos automáticamente los productos que ya pertenecen a esta colección
    const currentProducts = productos
      .filter(p => p.coleccionId === col.id)
      .map(p => p.id);
    setSelectedProductIds(currentProducts);
    setShowModal(true);
  };

  // Manejador del textarea con límite de 300 palabras
  const handleDescriptionChange = (e) => {
    const text = e.target.value;
    const words = text.trim() ? text.trim().split(/\s+/) : [];
    
    if (words.length <= 300) {
      setForm({ ...form, descripcion: text });
    } else {
      const limitedText = words.slice(0, 300).join(' ');
      setForm({ ...form, descripcion: limitedText });
    }
  };

  // Manejar selección de productos mediante checkboxes
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
      // Actualizar colección existente
      setColecciones(colecciones.map(c => 
        c.id === editingCollection 
          ? { ...form, id: editingCollection, anioFabricacion: Number(form.anioFabricacion) } 
          : c
      ));
    } else {
      // Crear nueva colección
      targetCollectionId = Date.now();
      const newCol = {
        ...form,
        id: targetCollectionId,
        anioFabricacion: Number(form.anioFabricacion)
      };
      setColecciones([newCol, ...colecciones]);
    }

    // Actualizar la relación coleccionId en los productos seleccionados y deseleccionados
    if (setProductos) {
      setProductos(productos.map(p => {
        if (selectedProductIds.includes(p.id)) {
          return { ...p, coleccionId: targetCollectionId };
        } else if (p.coleccionId === targetCollectionId) {
          // Si antes pertenecía a esta colección pero fue desmarcado, removemos la relación (lo asignamos a null o 1 por defecto)
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
      // Desasociar los productos de esta colección eliminada
      setProductos(productos.map(p => p.coleccionId === id ? { ...p, coleccionId: 1 } : p));
    }
  };

  const wordCount = form.descripcion.trim() ? form.descripcion.trim().split(/\s+/).length : 0;

  return (
    <>
      <Card className="shadow-sm border-none">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h5 className="text-lg font-bold text-slate-800">Colecciones Activas</h5>
            <p className="text-xs text-slate-500">
              Total registradas: <span className="font-bold text-blue-600">{colecciones.length}</span>
            </p>
          </div>
          <Button 
            size="sm" 
            onClick={handleOpenCreate} 
            className="bg-blue-600 hover:bg-blue-700 cursor-pointer"
          >
            <HiPlus className="h-4 w-4 mr-1" /> Nueva
          </Button>
        </div>

        <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
          {colecciones.map(c => {
            // Contamos cuántos relojes pertenecen a esta colección
            const relojesEnColeccion = productos.filter(p => p.coleccionId === c.id);

            return (
              <div key={c.id} className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-bold text-slate-800">{c.nombre}</p>
                    <Badge color="gray" size="sm">Año: {c.anioFabricacion}</Badge>
                  </div>
                  <div className="flex gap-1">
                    <Button 
                      size="xs" 
                      color="warning" 
                      onClick={() => handleOpenEdit(c)}
                      className="cursor-pointer"
                      title="Editar"
                    >
                      <HiPencil className="h-3 w-3" />
                    </Button>
                    <Button 
                      size="xs" 
                      color="failure" 
                      onClick={() => handleDelete(c.id)}
                      className="cursor-pointer"
                      title="Eliminar"
                    >
                      <HiTrash className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                <p className="text-xs text-slate-500 mb-2 line-clamp-1">{c.descripcion}</p>
                <p className="text-[11px] font-semibold text-blue-600">
                  Relojes incluidos: {relojesEnColeccion.length > 0 ? relojesEnColeccion.map(r => r.nombre).join(', ') : 'Ninguno'}
                </p>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Modal con lista de selección de productos */}
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
                placeholder="Detalles de la línea y concepto..."
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
    </>
  );
}