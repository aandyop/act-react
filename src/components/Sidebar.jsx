import { HiTrendingUp, HiCube, HiCollection, HiPhotograph, HiArchive, HiShoppingCart } from 'react-icons/hi';

export default function Sidebar({ activeTab, setActiveTab }) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: HiTrendingUp },
    { id: 'productos', label: 'Productos', icon: HiCube },
    { id: 'colecciones', label: 'Colecciones', icon: HiCollection },
    { id: 'galeria', label: 'Galería', icon: HiPhotograph },
    { id: 'stock', label: 'Stock', icon: HiArchive },
    { id: 'ventas', label: 'Ventas', icon: HiShoppingCart },
  ];

  return (
    <aside className="w-64 bg-slate-950 text-slate-300 hidden md:flex flex-col justify-between p-6 select-none shrink-0 border-r border-slate-900">
      <div>
        <h2 className="text-xl font-black text-amber-400 tracking-wider mb-8">CHRONOREACT</h2>
        <nav className="space-y-1 text-sm font-medium">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all cursor-pointer ${
                  isActive 
                    ? 'bg-blue-600 text-white shadow-md font-bold' 
                    : 'hover:bg-slate-900 text-slate-300'
                }`}
              >
                <Icon className="h-5 w-5" /> {item.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Perfil del Administrador al pie del Sidebar */}
      <div className="flex items-center gap-3 pt-6 border-t border-slate-900">
        <div className="bg-amber-400 text-slate-950 w-10 h-10 rounded-full flex items-center justify-center font-black">
          CM
        </div>
        <div>
          <p className="text-xs font-bold text-white">Carlos Master</p>
          <p className="text-[10px] text-slate-400">Administrador</p>
        </div>
      </div>
    </aside>
  );
}