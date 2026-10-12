import { useState } from 'react';
import { Card, Button, Modal, TextInput, Label, Badge } from 'flowbite-react';
import { HiPlus, HiPencil, HiTrash } from 'react-icons/hi';

export default function CollectionCard({ colecciones, setColecciones }) {
  const [showModal, setShowModal] = useState(false);
  const [editingCollection, setEditingCollection] = useState(null); // null = creando, id = editando

  // Estado del formulario con los atributos exactos de la entidad Colecciones: id, nombre, anioFabricacion, descripcion
  const [form, setForm] = useState({
    nombre: '',
    anioFabricacion: '',
    descripcion: ''
  });

  // Abrir modal para crear una nueva colección
  const handleOpenCreate = () => {
    setEditingCollection(null);
    setForm({
      nombre: '',
      anioFabricacion: '',
      descripcion: ''
    });
    setShowModal(true);
  };

  // Abrir modal para editar una colección existente
  const handleOpenEdit = (col) => {
    setEditingCollection(col.id);
    setForm(col);
    setShowModal(true);
  };

  // Guardar cambios (Crear o Actualizar)
  const handleSave = (e) => {
    e.preventDefault();
    if (editingCollection !== null) {
      // Actualizar colección existente
      setColecciones(colecciones.map(c => 
        c.id === editingCollection 
          ? { 
              ...form, 
              id: editingCollection, 
              anioFabricacion: Number(form.anioFabricacion) 
            } 
          : c
      ));
    } else {
      // Crear nueva colección
      const newCol = {
        ...form,
        id: Date.now(),
        anioFabricacion: Number(form.anioFabricacion)
      };
      setColecciones([newCol, ...colecciones]);
    }
    setShowModal(false);
  };

  // Eliminar colección
  const handleDelete = (id) => {
    if (confirm("¿Estás seguro de eliminar esta colección?")) {
      setColecciones(colecciones.filter(c => c.id !== id));
    }
  };

  return (
    <>
      {/* Tarjeta contenedora principal del Dashboard */}
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

        {/* Lista previa de colecciones */}
        <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
          {colecciones.map(c => (
            <div key={c.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200">
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-bold text-slate-800">{c.nombre}</p>
                  <Badge color="gray" size="sm">Año: {c.anioFabricacion}</Badge>
                </div>
                <p className="text-xs text-slate-500 mt-1 line-clamp-1">{c.descripcion}</p>
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
          ))}
        </div>
      </Card>

      {/* Modal de Flowbite para Crear/Editar Colección */}
      <Modal show={showModal} onClose={() => setShowModal(false)}>
        <Modal.Header>
          {editingCollection !== null ? 'Editar Colección' : 'Registrar Nueva Colección'}
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <Label value="Nombre de la Colección" />
              <TextInput 
                required 
                value={form.nombre} 
                onChange={(e) => setForm({...form, nombre: e.target.value})} 
                placeholder="Ej. Heritage Sport"
              />
            </div>
            <div>
              <Label value="Año de Fabricación / Lanzamiento" />
              <TextInput 
                required 
                type="number" 
                value={form.anioFabricacion} 
                onChange={(e) => setForm({...form, anioFabricacion: e.target.value})} 
                placeholder="2015"
              />
            </div>
            <div>
              <Label value="Descripción" />
              <TextInput 
                value={form.descripcion} 
                onChange={(e) => setForm({...form, descripcion: e.target.value})} 
                placeholder="Detalles de la línea y concepto..."
              />
            </div>
            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button color="gray" onClick={() => setShowModal(false)}>Cancelar</Button>
              <Button type="submit" className="bg-blue-600">Guardar Colección</Button>
            </div>
          </form>
        </Modal.Body>
      </Modal>
    </>
  );
}