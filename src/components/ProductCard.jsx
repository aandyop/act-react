import { useState } from 'react';
import { Card, Button, Badge, Modal, ModalHeader, ModalBody, TextInput } from 'flowbite-react';
import { HiPlus, HiPencil, HiTrash, HiUpload } from 'react-icons/hi';

export default function ProductCard({ productos = [], setProductos, galeria = [], setGaleria }) {
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const [form, setForm] = useState({
    nombre: '',
    marca: '',
    precio: '',
    anioFabricacion: '',
    descripcion: '',
    imagen: '',
    stock: ''
  });

  const handleOpenCreate = () => {
    setEditingProduct(null);
    setForm({
      nombre: '', 
      marca: '', 
      precio: '', 
      anioFabricacion: '', 
      descripcion: '', 
      imagen: '', 
      stock: ''
    });
    setShowModal(true);
  };

  const handleOpenEdit = (p) => {
    setEditingProduct(p.id);
    setForm(p);
    setShowModal(true);
  };

  // Carga de la imagen local
  const handleImageUpload = (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setForm((prev) => ({ ...prev, imagen: imageUrl }));
    }
  };

  const handleDescriptionChange = (e) => {
    const text = e.target.value;
    const words = text.trim() ? text.trim().split(/\s+/) : [];
    if (words.length <= 500) {
      setForm((prev) => ({ ...prev, descripcion: text }));
    } else {
      setForm((prev) => ({ ...prev, descripcion: words.slice(0, 500).join(' ') }));
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    const imagenFinal = form.imagen || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800";

    if (editingProduct !== null) {
      // 1. Actualizar el producto existente
      setProductos((prevProds) => 
        prevProds.map(p => 
          p.id === editingProduct 
            ? { 
                ...form, 
                id: editingProduct, 
                precio: Number(form.precio), 
                anioFabricacion: Number(form.anioFabricacion),
                stock: Number(form.stock),
                imagen: imagenFinal
              } 
            : p
        )
      );

      // 2. Actualizar la imagen en la Galería si cambió
      if (setGaleria) {
        setGaleria((prevGal) => 
          prevGal.map(g => 
            g.productoId === editingProduct 
              ? { ...g, urlImagen: imagenFinal } 
              : g
          )
        );
      }
    } else {
      // 1. Crear nuevo ID único para el reloj
      const newProductId = Date.now();
      const newProd = {
        ...form,
        id: newProductId,
        precio: Number(form.precio),
        anioFabricacion: Number(form.anioFabricacion),
        stock: Number(form.stock),
        coleccionId: 1,
        galeriaId: newProductId,
        imagen: imagenFinal
      };

      // Agregar el nuevo producto al inicio de la lista
      setProductos((prevProds) => [newProd, ...prevProds]);

      // 2. AGREGAR LA NUEVA FOTO DIRECTAMENTE AL INICIO DE LA GALERÍA
      if (setGaleria) {
        const nuevaFotoGaleria = {
          id: Date.now() + 1,
          productoId: newProductId,
          urlImagen: imagenFinal,
          orden: galeria.length + 1
        };
        setGaleria((prevGal) => [nuevaFotoGaleria, ...prevGal]);
      }
    }

    setShowModal(false);
  };

  const handleDelete = (id) => {
    if (confirm("¿Estás seguro de eliminar este reloj del catálogo?")) {
      setProductos((prev) => prev.filter(p => p.id !== id));
      if (setGaleria) {
        setGaleria((prev) => prev.filter(g => g.productoId !== id));
      }
    }
  };

  const wordCount = form.descripcion.trim() ? form.descripcion.trim().split(/\s+/).length : 0;

  return (
    <>
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
            <HiPlus className="h-4 w-4 mr-1" /> Nuevo
          </Button>
        </div>

        <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
          {productos.map(p => (
            <div key={p.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200">
              <div className="flex items-center gap-3">
                <img src={p.imagen} alt={p.nombre} className="w-10 h-10 object-cover rounded-md border" />
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-bold text-slate-800">{p.nombre}</p>
                    <Badge color="info" size="sm">{p.marca}</Badge>
                  </div>
                  <p className="text-xs text-slate-500">
                    Año: {p.anioFabricacion} • ${p.precio.toLocaleString()} • Stock: {p.stock}
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

      {/* Modal para Crear y Editar Reloj */}
      <Modal show={showModal} onClose={() => setShowModal(false)} size="xl">
        <ModalHeader>
          {editingProduct !== null ? 'Editar Reloj de Lujo' : 'Registrar Nuevo Reloj'}
        </ModalHeader>
        <ModalBody>
          <form onSubmit={handleSave} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Nombre o Modelo del Reloj
                </label>
                <TextInput 
                  required 
                  value={form.nombre} 
                  onChange={(e) => setForm({...form, nombre: e.target.value})} 
                  placeholder="Ej. Submariner Date"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Marca del Reloj
                </label>
                <TextInput 
                  required 
                  value={form.marca} 
                  onChange={(e) => setForm({...form, marca: e.target.value})} 
                  placeholder="Ej. Rolex, Patek Philippe"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Precio ($ USD)
                </label>
                <TextInput 
                  required 
                  type="number" 
                  value={form.precio} 
                  onChange={(e) => setForm({...form, precio: e.target.value})} 
                  placeholder="14500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Año de Fabricación
                </label>
                <TextInput 
                  required 
                  type="number" 
                  value={form.anioFabricacion} 
                  onChange={(e) => setForm({...form, anioFabricacion: e.target.value})} 
                  placeholder="2020"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Stock (Unidades)
                </label>
                <TextInput 
                  required 
                  type="number" 
                  value={form.stock} 
                  onChange={(e) => setForm({...form, stock: e.target.value})} 
                  placeholder="5"
                />
              </div>
            </div>

            {/* SECCIÓN SUBIR IMAGEN */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Imagen Principal del Reloj
              </label>
              <div className="flex items-center gap-4 p-3 bg-slate-50 border border-slate-200 rounded-lg">
                {form.imagen ? (
                  <img src={form.imagen} alt="Vista previa" className="w-16 h-16 object-cover rounded-md border shadow-xs" />
                ) : (
                  <div className="w-16 h-16 bg-slate-200 rounded-md flex items-center justify-center text-xs text-slate-400 font-bold">
                    Sin foto
                  </div>
                )}
                <div className="flex-grow">
                  <label className="cursor-pointer bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold py-2.5 px-4 rounded-lg inline-flex items-center gap-2 transition-colors">
                    <HiUpload className="h-4 w-4" /> Seleccionar Imagen
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleImageUpload} 
                      className="hidden" 
                    />
                  </label>
                  <p className="text-[11px] text-slate-500 mt-1">Formatos admitidos: PNG, JPG o WEBP (Una sola imagen).</p>
                </div>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-xs font-bold text-slate-700 uppercase">
                  Descripción detallada del reloj
                </label>
                <span className={`text-xs font-semibold ${wordCount > 450 ? 'text-amber-600' : 'text-slate-400'}`}>
                  {wordCount} / 500 palabras
                </span>
              </div>
              <textarea 
                rows="4"
                value={form.descripcion} 
                onChange={handleDescriptionChange}
                placeholder="Mencione materiales, tipo de movimiento, cristal de zafiro y características principales..."
                className="w-full p-3 text-sm text-slate-900 bg-white rounded-lg border border-slate-300 focus:ring-blue-500 focus:border-blue-500 resize-y outline-none"
              ></textarea>
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button color="gray" onClick={() => setShowModal(false)}>Cancelar</Button>
              <Button type="submit" className="bg-blue-600">Guardar Reloj</Button>
            </div>
          </form>
        </ModalBody>
      </Modal>
    </>
  );
}