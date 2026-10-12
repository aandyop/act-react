import { useState } from 'react';
import { Card, Button, Badge, Modal, TextInput, Label } from 'flowbite-react';
import { 
  HiCube, HiCollection, HiPhotograph, HiArchive, 
  HiShoppingCart, HiUser, HiPlus, HiPencil, HiTrash, HiTrendingUp 
} from 'react-icons/hi';

export default function Dashboard() {
  // 1. ESTADOS PRINCIPALES (Mock Data inicial)
  const [productos, setProductos] = useState([
    { id: 1, nombre: "Submariner Date", marca: "Rolex", precio: 14500, anioFabricacion: 2020, descripcion: "Icónico reloj de buceo.", stock: 5 },
    { id: 2, nombre: "Nautilus Chronograph", marca: "Patek Philippe", precio: 85000, anioFabricacion: 2018, descripcion: "Alta relojería.", stock: 1 },
    { id: 3, nombre: "Royal Oak Offshore", marca: "Audemars Piguet", precio: 32000, anioFabricacion: 2014, descripcion: "Diseño octagonal.", stock: 3 },
    { id: 4, nombre: "Speedmaster Professional", marca: "Omega", precio: 7500, anioFabricacion: 2016, descripcion: "Moonwatch.", stock: 8 },
  ]);

  const [colecciones, setColecciones] = useState([
    { id: 1, nombre: "Heritage Sport", descripcion: "Línea deportiva." },
    { id: 2, nombre: "Grand Complication", descripcion: "Piezas maestras." },
  ]);

  const ventasData = [
    { fecha: "01 May", monto: 14500 },
    { fecha: "05 May", monto: 32000 },
    { fecha: "10 May", monto: 8500 },
    { fecha: "15 May", monto: 54000 },
  ];
  const totalVentas = ventasData.reduce((acc, curr) => acc + curr.monto, 0);

  // 2. ESTADOS PARA LOS MODALES Y FORMULARIOS DE PRODUCTOS
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null); // null = creando, objeto = editando
  const [productForm, setProductForm] = useState({ nombre: '', marca: '', precio: '', stock: '', anioFabricacion: '' });

  // 3. ESTADOS PARA LOS MODALES Y FORMULARIOS DE COLECCIONES
  const [showCollectionModal, setShowCollectionModal] = useState(false);
  const [editingCollection, setEditingCollection] = useState(null);
  const [collectionForm, setCollectionForm] = useState({ nombre: '', descripcion: '' });

  // --- HANDLERS PARA PRODUCTOS ---
  const handleOpenCreateProduct = () => {
    setEditingProduct(null);
    setProductForm({ nombre: '', marca: '', precio: '', stock: '', anioFabricacion: '' });
    setShowProductModal(true);
  };

  const handleOpenEditProduct = (prod) => {
    setEditingProduct(prod.id);
    setProductForm(prod);
    setShowProductModal(true);
  };

  const handleSaveProduct = (e) => {
    e.preventDefault();
    if (editingProduct !== null) {
      // Actualizar producto existente
      setProductos(productos.map(p => p.id === editingProduct ? { ...productForm, id: editingProduct, precio: Number(productForm.precio), stock: Number(productForm.stock) } : p));
    } else {
      // Crear nuevo producto
      const newProd = {
        ...productForm,
        id: Date.now(),
        precio: Number(productForm.precio),
        stock: Number(productForm.stock),
        anioFabricacion: Number(productForm.anioFabricacion || 2024),
        imagen: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500"
      };
      setProductos([newProd, ...productos]);
    }
    setShowProductModal(false);
  };

  const handleDeleteProduct = (id) => {
    if (confirm("¿Estás seguro de eliminar este reloj?")) {
      setProductos(productos.filter(p => p.id !== id));
    }
  };

  // --- HANDLERS PARA COLECCIONES ---
  const handleOpenCreateCollection = () => {
    setEditingCollection(null);
    setCollectionForm({ nombre: '', descripcion: '' });
    setShowCollectionModal(true);
  };

  const handleOpenEditCollection = (col) => {
    setEditingCollection(col.id);
    setCollectionForm(col);
    setShowCollectionModal(true);
  };

  const handleSaveCollection = (e) => {
    e.preventDefault();
    if (editingCollection !== null) {
      setColecciones(colecciones.map(c => c.id === editingCollection ? { ...collectionForm, id: editingCollection } : c));
    } else {
      const newCol = { ...collectionForm, id: Date.now() };
      setColecciones([...colecciones, newCol]);
    }
    setShowCollectionModal(false);
  };

  const handleDeleteCollection = (id) => {
    if (confirm("¿Estás seguro de eliminar esta colección?")) {
      setColecciones(colecciones.filter(c => c.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex font-sans">
      
      {/* SIDEBAR */}
      <aside className="w-64 bg-slate-900 text-slate-300 hidden md:flex flex-col justify-between p-6">
        <div>
          <h2 className="text-xl font-black text-amber-400 tracking-wider mb-8">CHRONOREACT</h2>
          <nav className="space-y-2 text-sm font-medium">
            <a href="#" className="flex items-center gap-3 p-3 bg-blue-600 text-white rounded-xl shadow-md">
              <HiTrendingUp className="h-5 w-5" /> Dashboard
            </a>
            <a href="#" className="flex items-center gap-3 p-3 hover:bg-slate-800 rounded-xl transition-colors">
              <HiCube className="h-5 w-5" /> Productos
            </a>
            <a href="#" className="flex items-center gap-3 p-3 hover:bg-slate-800 rounded-xl transition-colors">
              <HiCollection className="h-5 w-5" /> Colecciones
            </a>
            <a href="#" className="flex items-center gap-3 p-3 hover:bg-slate-800 rounded-xl transition-colors">
              <HiPhotograph className="h-5 w-5" /> Galería
            </a>
            <a href="#" className="flex items-center gap-3 p-3 hover:bg-slate-800 rounded-xl transition-colors">
              <HiArchive className="h-5 w-5" /> Stock
            </a>
            <a href="#" className="flex items-center gap-3 p-3 hover:bg-slate-800 rounded-xl transition-colors">
              <HiShoppingCart className="h-5 w-5" /> Ventas
            </a>
          </nav>
        </div>
        <div className="flex items-center gap-3 pt-6 border-t border-slate-800">
          <div className="bg-amber-400 text-slate-950 p-2 rounded-full font-bold">CM</div>
          <div>
            <p className="text-xs font-bold text-white">Carlos Master</p>
            <p className="text-[10px] text-slate-400">Administrador</p>
          </div>
        </div>
      </aside>

      {/* CONTENIDO PRINCIPAL */}
      <main className="flex-grow p-6 md:p-10 overflow-y-auto">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-black text-slate-800">Panel de Control General</h1>
            <p className="text-sm text-slate-500">Resumen operativo y métricas de la tienda de lujo</p>
          </div>
          <Badge color="warning" className="px-3 py-1 text-sm font-bold">Sistema Activo</Badge>
        </header>

        {/* GRID DE TARJETAS */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* TARJETA 1: VENTAS */}
          <Card className="lg:col-span-2 shadow-sm border-none">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h5 className="text-lg font-bold text-slate-800">Reporte de Ventas</h5>
                <p className="text-xs text-slate-500">Evolución de ingresos por fecha</p>
              </div>
              <span className="text-2xl font-black text-blue-600">${totalVentas.toLocaleString()} USD</span>
            </div>
            
            <div className="h-48 flex items-end justify-between gap-4 pt-6 px-4 bg-slate-50 rounded-xl border border-slate-200">
              {ventasData.map((item, index) => (
                <div key={index} className="flex flex-col items-center flex-grow gap-2">
                  <span className="text-[10px] font-bold text-slate-600">${item.monto}</span>
                  <div 
                    style={{ height: `${(item.monto / 60000) * 100}%` }} 
                    className="w-full bg-blue-600 rounded-t-md hover:bg-blue-700 transition-all"
                  ></div>
                  <span className="text-xs text-slate-500">{item.fecha}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* TARJETA 2: GALERÍA */}
          <Card className="shadow-sm border-none bg-gradient-to-br from-slate-900 to-slate-800 text-white flex flex-col justify-between">
            <div>
              <div className="bg-amber-400/20 text-amber-400 p-3 rounded-xl w-fit mb-4">
                <HiPhotograph className="h-6 w-6" />
              </div>
              <h5 className="text-xl font-bold mb-2">Galería de Fotos</h5>
              <p className="text-xs text-slate-300 leading-relaxed">
                Administra las vistas detalladas, esferas y maquinarias secundarias de los relojes de alta gama.
              </p>
            </div>
            <Button className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold mt-4">
              Ver Galería Completa
            </Button>
          </Card>

          {/* TARJETA 3: PRODUCTOS (CRUD Conectado) */}
          <Card className="shadow-sm border-none">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h5 className="text-lg font-bold text-slate-800">Catálogo de Productos</h5>
                <p className="text-xs text-slate-500">Publicados: <span className="font-bold text-blue-600">{productos.length}</span></p>
              </div>
              <button 
                onClick={handleOpenCreateProduct} 
                className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors cursor-pointer" 
                title="Agregar Reloj"
              >
                <HiPlus className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3 max-h-64 overflow-y-auto">
              {productos.map(p => (
                <div key={p.id} className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                  <div>
                    <p className="text-sm font-bold text-slate-800">{p.nombre}</p>
                    <p className="text-xs text-slate-500">{p.marca} • ${p.precio.toLocaleString()}</p>
                  </div>
                  <div className="flex gap-1">
                    <button 
                      onClick={() => handleOpenEditProduct(p)} 
                      className="p-1.5 text-amber-600 hover:bg-amber-50 rounded cursor-pointer" 
                      title="Editar"
                    >
                      <HiPencil className="h-4 w-4" />
                    </button>
                    <button 
                      onClick={() => handleDeleteProduct(p.id)} 
                      className="p-1.5 text-red-600 hover:bg-red-50 rounded cursor-pointer" 
                      title="Borrar"
                    >
                      <HiTrash className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* TARJETA 4: COLECCIONES (CRUD Conectado) */}
          <Card className="shadow-sm border-none">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h5 className="text-lg font-bold text-slate-800">Colecciones Activas</h5>
                <p className="text-xs text-slate-500">Total: {colecciones.length}</p>
              </div>
              <button 
                onClick={handleOpenCreateCollection} 
                className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors cursor-pointer" 
                title="Agregar Colección"
              >
                <HiPlus className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3 max-h-64 overflow-y-auto">
              {colecciones.map(c => (
                <div key={c.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <div>
                    <span className="text-sm font-semibold text-slate-700 block">{c.nombre}</span>
                    <span className="text-[11px] text-slate-500">{c.descripcion}</span>
                  </div>
                  <div className="flex gap-1">
                    <button 
                      onClick={() => handleOpenEditCollection(c)} 
                      className="p-1.5 text-amber-600 hover:bg-amber-50 rounded cursor-pointer" 
                      title="Editar"
                    >
                      <HiPencil className="h-4 w-4" />
                    </button>
                    <button 
                      onClick={() => handleDeleteCollection(c.id)} 
                      className="p-1.5 text-red-600 hover:bg-red-50 rounded cursor-pointer" 
                      title="Borrar"
                    >
                      <HiTrash className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* TARJETA 5: STOCK E INVENTARIO */}
          <Card className="shadow-sm border-none">
            <div className="mb-4">
              <h5 className="text-lg font-bold text-slate-800">Control de Stock</h5>
              <p className="text-xs text-slate-500">Inventario y umbrales críticos</p>
            </div>

            <div className="space-y-3 max-h-64 overflow-y-auto">
              {productos.map(p => {
                const stockBajo = p.stock <= 2;
                return (
                  <div 
                    key={p.id} 
                    className={`flex items-center justify-between p-3 rounded-lg border ${stockBajo ? 'bg-amber-50 border-amber-300' : 'bg-slate-50 border-slate-200'}`}
                  >
                    <div>
                      <p className="text-sm font-bold text-slate-800">{p.nombre}</p>
                      <p className="text-xs text-slate-500">Unidades: <span className="font-bold">{p.stock}</span></p>
                    </div>
                    {stockBajo && (
                      <span className="bg-amber-400 text-slate-950 text-[10px] font-black px-2 py-1 rounded shadow-sm animate-pulse">
                        ⚠️ Stock Bajo
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </Card>

        </div>
      </main>

      {/* ================= MODAL PARA PRODUCTOS ================= */}
      <Modal show={showProductModal} onClose={() => setShowProductModal(false)}>
        <Modal.Header>{editingProduct !== null ? 'Editar Reloj' : 'Agregar Nuevo Reloj'}</Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSaveProduct} className="space-y-4">
            <div>
              <Label value="Nombre del Reloj" />
              <TextInput 
                required 
                value={productForm.nombre} 
                onChange={(e) => setProductForm({...productForm, nombre: e.target.value})} 
                placeholder="Ej. Submariner Date"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label value="Marca" />
                <TextInput 
                  required 
                  value={productForm.marca} 
                  onChange={(e) => setProductForm({...productForm, marca: e.target.value})} 
                  placeholder="Ej. Rolex"
                />
              </div>
              <div>
                <Label value="Precio ($)" />
                <TextInput 
                  required 
                  type="number" 
                  value={productForm.precio} 
                  onChange={(e) => setProductForm({...productForm, precio: e.target.value})} 
                  placeholder="14500"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label value="Stock (Unidades)" />
                <TextInput 
                  required 
                  type="number" 
                  value={productForm.stock} 
                  onChange={(e) => setProductForm({...productForm, stock: e.target.value})} 
                  placeholder="5"
                />
              </div>
              <div>
                <Label value="Año de Fabricación" />
                <TextInput 
                  required 
                  type="number" 
                  value={productForm.anioFabricacion} 
                  onChange={(e) => setProductForm({...productForm, anioFabricacion: e.target.value})} 
                  placeholder="2020"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button color="gray" onClick={() => setShowProductModal(false)}>Cancelar</Button>
              <Button type="submit" className="bg-blue-600">Guardar</Button>
            </div>
          </form>
        </Modal.Body>
      </Modal>

      {/* ================= MODAL PARA COLECCIONES ================= */}
      <Modal show={showCollectionModal} onClose={() => setShowCollectionModal(false)}>
        <Modal.Header>{editingCollection !== null ? 'Editar Colección' : 'Agregar Nueva Colección'}</Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSaveCollection} className="space-y-4">
            <div>
              <Label value="Nombre de la Colección" />
              <TextInput 
                required 
                value={collectionForm.nombre} 
                onChange={(e) => setCollectionForm({...collectionForm, nombre: e.target.value})} 
                placeholder="Ej. Heritage Sport"
              />
            </div>
            <div>
              <Label value="Descripción" />
              <TextInput 
                value={collectionForm.descripcion} 
                onChange={(e) => setCollectionForm({...collectionForm, descripcion: e.target.value})} 
                placeholder="Detalles de la línea..."
              />
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button color="gray" onClick={() => setShowCollectionModal(false)}>Cancelar</Button>
              <Button type="submit" className="bg-blue-600">Guardar</Button>
            </div>
          </form>
        </Modal.Body>
      </Modal>

    </div>
  );
}