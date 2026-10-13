import { useState } from 'react';
import { Card, Button, Badge, Modal, ModalHeader, ModalBody, TextInput } from 'flowbite-react';
import { HiPlus, HiPencil, HiTrash, HiEye, HiArrowLeft, HiUpload, HiChevronLeft, HiChevronRight, HiCube } from 'react-icons/hi';

export default function ProductsView({ productos = [], setProductos = () => {}, galeria = [], setGaleria = () => {}, onBack }) {
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // Estados de paginación (máximo 20 por página)
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  const totalPages = Math.ceil(productos.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentProducts = productos.slice(startIndex, startIndex + itemsPerPage);

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

  // Carga de imagen local
  const handleImageUpload = (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setForm((prev) => ({ ...prev, imagen: imageUrl }));
    }
  };

  // Límite de 500 palabras en descripción
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
      // Actualizar producto existente
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

      // Actualizar imagen en galería si aplica
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
      // Crear nuevo producto
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

      setProductos((prevProds) => [newProd, ...prevProds]);

      // Sincronizar con la galería
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
    <div className="space-y-6">
      {/* Cabecera de la vista */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl shadow-xs border border-slate-200">
        <div className="flex items-center gap-4">
          <Button color="gray" size="sm" onClick={onBack} className="cursor-pointer">
            <HiArrowLeft className="h-4 w-4 mr-1" /> Volver al Dashboard
          </Button>
          <div>
            <h1 className="text-xl font-black text-slate-800">Catálogo General de Productos</h1>
            <p className="text-xs text-slate-500">Gestión completa, precios, inventario y especificaciones de relojes</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-2 rounded-lg border border-slate-200">
            Total: {productos.length} relojes
          </span>
          <Button 
            onClick={handleOpenCreate} 
            className="bg-blue-600 hover:bg-blue-700 cursor-pointer font-bold text-xs"
          >
            <HiPlus className="h-4 w-4 mr-1" /> Nuevo Producto
          </Button>
        </div>
      </div>

      {/* Cuadrícula de Cards de Productos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {currentProducts.length === 0 ? (
          <div className="col-span-full py-16 text-center bg-white rounded-2xl border border-slate-200">
            <HiCube className="h-12 w-12 text-slate-300 mx-auto mb-3" />
            <p className="text-sm font-bold text-slate-700">No hay productos registrados en el catálogo</p>
            <p className="text-xs text-slate-400 mt-1">Haz clic en "Nuevo Producto" para agregar el primero</p>
          </div>
        ) : (
          currentProducts.map((p) => (
            <Card key={p.id} className="shadow-xs border-slate-200 overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow">
              <div>
                <div className="relative h-48 -m-6 mb-3 bg-slate-900 overflow-hidden">
                  <img src={p.imagen} alt={p.nombre} className="w-full h-full object-cover" />
                  <div className="absolute top-3 right-3">
                    <Badge color="info" size="sm" className="font-bold shadow-xs">{p.marca}</Badge>
                  </div>
                </div>

                <div className="space-y-1 mt-2">
                  <h3 className="text-sm font-bold text-slate-800 line-clamp-1">{p.nombre}</h3>
                  <div className="flex justify-between items-center text-xs text-slate-500">
                    <span>Año: <strong className="text-slate-700">{p.anioFabricacion}</strong></span>
                    <span>Stock: <strong className="text-blue-600">{p.stock} un.</strong></span>
                  </div>
                  <p className="text-base font-black text-slate-900 pt-1">
                    ${p.precio?.toLocaleString()} <span className="text-[10px] font-normal text-slate-400">USD</span>
                  </p>
                  <p className="text-xs text-slate-500 pt-2 line-clamp-2">{p.descripcion || "Sin descripción detallada."}</p>
                </div>
              </div>

              {/* Botones de acción por producto */}
              <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-100">
                <Button 
                  size="xs" 
                  color="gray" 
                  onClick={() => alert(`Vista individual del reloj: ${p.nombre} (Próximamente)`)}
                  className="cursor-pointer"
                >
                  <HiEye className="h-3.5 w-3.5 mr-1" /> Ver
                </Button>
                
                <div className="flex gap-1">
                  <Button 
                    size="xs" 
                    color="warning" 
                    onClick={() => handleOpenEdit(p)}
                    className="cursor-pointer"
                    title="Editar"
                  >
                    <HiPencil className="h-3.5 w-3.5" />
                  </Button>
                  <Button 
                    size="xs" 
                    color="failure" 
                    onClick={() => handleDelete(p.id)}
                    className="cursor-pointer"
                    title="Eliminar"
                  >
                    <HiTrash className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Paginación si excede los 20 productos */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-500 font-medium">
            Mostrando {startIndex + 1} - {Math.min(startIndex + itemsPerPage, productos.length)} de {productos.length} productos
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

      {/* Modal para Crear / Editar Producto */}
      <Modal show={showModal} onClose={() => setShowModal(false)} size="xl">
        <ModalHeader>
          {editingProduct !== null ? 'Editar Reloj de Lujo' : 'Registrar Nuevo Reloj'}
        </ModalHeader>
        <ModalBody>
          <form onSubmit={handleSave} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
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
                <label className="block text-xs font-bold text-slate-700 mb-1">
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
                <label className="block text-xs font-bold text-slate-700 mb-1">
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
                <label className="block text-xs font-bold text-slate-700 mb-1">
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
                <label className="block text-xs font-bold text-slate-700 mb-1">
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

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
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
                  <p className="text-[11px] text-slate-500 mt-1">Formatos admitidos: PNG, JPG o WEBP.</p>
                </div>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-xs font-bold text-slate-700">
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
    </div>
  );
}