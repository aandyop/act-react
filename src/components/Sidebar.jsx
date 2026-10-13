import logoBlanco from '../assets/logotipo-blanco.png'; // Importación de la imagen desde src/assets
import { 
  HiChartPie, 
  HiCube, 
  HiCollection, 
  HiPhotograph, 
  HiShoppingBag, 
  HiAdjustments 
} from 'react-icons/hi';

export default function Sidebar({ activeTab, setActiveTab }) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: HiChartPie },
    { id: 'productos', label: 'Productos', icon: HiCube },
    { id: 'colecciones', label: 'Colecciones', icon: HiCollection },
    { id: 'galeria', label: 'Galería', icon: HiPhotograph },
    { id: 'ventas', label: 'Ventas', icon: HiShoppingBag },
  ];

  return (
    <aside className="w-64 bg-slate-950 text-white min-h-screen p-5 flex flex-col justify-between shrink-0 shadow-xl">
      <div>
        {/* LOGOTIPO */}
        <div className="flex items-center gap-3 px-2 py-4 mb-6 border-b border-slate-800">
          <img 
            src={logoBlanco} 
            alt="ChronoReact Logo" 
            className="h-9 w-auto object-contain" 
          />
        </div>

        {/* NAVEGACIÓN */}
        <nav className="space-y-1.5">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                    : 'text-slate-400 hover:bg-slate-900 hover:text-white'
                }`}
              >
                <Icon className={`h-5 w-5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      <div className="px-2 pt-4 border-t border-slate-900 text-[11px] text-slate-500 text-center font-medium">
        ChronoReact Dashboard v1.0
      </div>
    </aside>
  );
}