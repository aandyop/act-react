import { useState } from 'react';
import { Card, Button, Modal, TextInput, Label, Badge } from 'flowbite-react';
import { HiPlus, HiPencil, HiTrash } from 'react-icons/hi';

export default function ProductCard({ productos, setProductos, colecciones = [] }) {
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null); // null = creando, id = editando

  // Estado del formulario con todos los atributos de la entidad Productos
  const [form, setForm] = useState({
    nombre: '',
    marca: '',
    precio: '',
    anioFabricacion: '',
    descripcion: '',
    imagen: '',
    galeriaId: '',
    coleccionId: '',
    stock: ''
  });

  // Abrir modal para crear un nuevo reloj
  const handleOpenCreate = () => {
    setEditingProduct(null);
    setForm({
      nombre: '',
      marca: '',
      precio: '',
      anioFabricacion: '',
      descripcion: '',
      imagen: '',
      galeriaId: '',
      coleccionId: colecciones[0]?.id || 1,
      stock: ''
    });
    setShowModal(true);
  };

  // Abrir modal para editar un reloj existente
  const handleOpenEdit = (p) => {
    setEditingProduct(p.id);
    setForm(p);
    setShowModal(true);
  };

  // Guardar cambios (Crear o Actualizar)
  const handleSave = (e) => {
    e.preventDefault();
    if (editingProduct !== null) {
      // Actualizar producto existente
      setProductos(productos.map(p => 
        p.id === editingProduct 
          ? { 
              ...form, 
              id: editingProduct, 
              precio: Number(form.precio), 
              anioFabricacion: Number(form.anioFabricacion),
              galeriaId: Number(form.galeriaId),
              coleccionId: Number(form.coleccionId),
              stock: Number(form.stock) 
            } 
          : p
      ));
    } else {
      // Crear nuevo producto con los campos especificados
      const newProd = {
        ...form,
        id: Date.now(),
        precio: Number(form.precio),
        anioFabricacion: Number(form.anioFabricacion),
        galeriaId: Number(form.galeriaId || Date.now()),
        coleccionId: Number(form.coleccionId || 1),
        stock: Number(form.stock),
        imagen: form.imagen || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500"
      };
      setProductos([newProd, ...productos]);
    }
    setShowModal(false);
  };

  // Eliminar producto
  const handleDelete = (id) => {
    if (confirm("¿Estás seguro de eliminar este reloj del catálogo?")) {
      setProductos(productos.filter(p => p.id !== id));
    }
  };

  return (
    <>
      {/* Tarjeta contenedora del Dashboard */}
      <Card className="shadow-sm border-none lg:col-span-1">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h5 className="text-lg font-bold text-slate-800">Catálogo de Productos (Relojes)</h5>
            <p className="text-xs text-slate-500">
              Total registrados: <span className="font-bold text-blue-600">{productos.length}</span>
            </p>
          </div>
          <Button 
            size="sm" 
            onClick={handleOpenCreate} 
            className="bg-blue-600 hover:bg-blue-700 cursor-pointer"
          >
            <HiPlus className="h-4 w-4 mr-1" /> Nuevo Reloj
          </Button>
        </div>

        {/* Lista previa detallada de productos */}
        <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
          {productos.map(p => (
            <div key={p.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200">
              <div className="flex items-center gap-3">
                <img src={p.imagen} alt={p.nombre} className="w-12 h-12 object-cover rounded-md border" />
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-bold text-slate-800">{p.nombre}</p>
                    <Badge color="info" size="sm">{p.marca}</Badge>
                  </div>
                  <p className="text-xs text-slate-500">
                    Año: {p.anioFabricacion} • Precio: <span className="font-semibold text-slate-700">${p.precio.toLocaleString()}</span> • Stock: <span className="font-semibold">{p.stock}</span>
                  </p>
                </div>
              </div>

              <div className="flex gap-1">
                <Button 
                  size="xs" 
                  color="warning" 
                  onClick={() => handleOpenEdit(p)}
                  className="cursor-pointer"
                  title="Editar"
                >
                  <HiPencil className="h-3 w-3" />
                </Button>
                <Button 
                  size="xs" 
                  color="failure" 
                  onClick={() => handleDelete(p.id)}
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

      {/* Modal de Flowbite para el Formulario CRUD completo */}
      <Modal show={showModal} onClose={() => setShowModal(false)} size="lg">
        <Modal.Header>
          {editingProduct !== null ? 'Editar Reloj de Lujo' : 'Registrar Nuevo Reloj'}
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSave} className="space-y-4">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label value="Nombre del Reloj" />
                <TextInput 
                  required 
                  value={form.nombre} 
                  onChange={(e) => setForm({...form, nombre: e.target.value})} 
                  placeholder="Ej. Submariner Date"
                />
              </div>
              <div>
                <Label value="Marca" />
                <TextInput 
                  required 
                  value={form.marca} 
                  onChange={(e) => setForm({...form, marca: e.target.value})} 
                  placeholder="Ej. Rolex"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label value="Precio ($)" />
                <TextInput 
                  required 
                  type="number" 
                  value={form.precio} 
                  onChange={(e) => setForm({...form, precio: e.target.value})} 
                  placeholder="14500"
                />
              </div>
              <div>
                <Label value="Año Fabricación" />
                <TextInput 
                  required 
                  type="number" 
                  value={form.anioFabricacion} 
                  onChange={(e) => setForm({...form, anioFabricacion: e.target.value})} 
                  placeholder="2020"
                />
              </div>
              <div>
                <Label value="Stock Inicial" />
                <TextInput 
                  required 
                  type="number" 
                  value={form.stock} 
                  onChange={(e) => setForm({...form, stock: e.target.value})} 
                  placeholder="5"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label value="ID Colección (Relación)" />
                <TextInput 
                  required 
                  type="number"
                  value={form.coleccionId} 
                  onChange={(e) => setForm({...form, coleccionId: e.target.value})} 
                  placeholder="1"
                />
              </div>
              <div>
                <Label value="ID Galería (Relación)" />
                <TextInput 
                  required 
                  type="number"
                  value={form.galeriaId} 
                  onChange={(e) => setForm({...form, galeriaId: e.target.value})} 
                  placeholder="1"
                />
              </div>
            </div>

            <div>
              <Label value="URL de la Imagen Principal" />
              <TextInput 
                value={form.imagen} 
                onChange={(e) => setForm({...form, imagen: e.target.value})} 
                placeholder="https://images.unsplash.com/..."
              />
            </div>

            <div>
              <Label value="Descripción" />
              <TextInput 
                value={form.descripcion} 
                onChange={(e) => setForm({...form, descripcion: e.target.value})} 
                placeholder="Detalles de materiales, maquinaria y acabados..."
              />
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button color="gray" onClick={() => setShowModal(false)}>Cancelar</Button>
              <Button type="submit" className="bg-blue-600">Guardar Reloj</Button>
            </div>
          </form>
        </Modal.Body>
      </Modal>
    </>
  );
}