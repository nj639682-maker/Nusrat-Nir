import React from 'react';

interface NavigationProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ currentTab, onTabChange }) => {
  const tabs = [
    { id: 'catalog', label: 'Catalog', icon: 'storefront' },
    { id: 'categories', label: 'Categories', icon: 'grid_view' },
    { id: 'tracking', label: 'Tracking', icon: 'local_shipping' },
    { id: 'wa-help', label: 'WA Help', icon: 'support_agent', accentIcon: true },
    { id: 'admin', label: 'Admin', icon: 'store' },
  ];


  return (
    <nav className="fixed bottom-0 w-full z-50 pb-safe bg-[#faf8ff]/90 backdrop-blur-xl shadow-[0_-2px_12px_rgba(0,0,0,0.05)] border-t border-[#eaedff]">
      <div className="max-w-md mx-auto flex justify-around items-center h-16 px-1">
        {tabs.map((tab) => {
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center justify-center gap-0.5 min-w-[64px] min-h-[44px] py-1 transition-all cursor-pointer ${
                isActive
                  ? 'text-[#00685d] font-bold scale-105'
                  : 'text-[#3d4946] hover:text-[#131b2e]'
              }`}
            >
              <span
                className={`material-symbols-outlined text-xl transition-colors ${
                  tab.accentIcon && !isActive
                    ? 'text-[#006d2f]'
                    : isActive
                    ? 'text-[#00685d]'
                    : ''
                }`}
                style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
              >
                {tab.icon}
              </span>
              <span className="font-label-sm text-[11px] tracking-tight">{tab.label}</span>
              {isActive && (
                <span className="w-1 h-1 rounded-full bg-[#00685d] mt-[-2px]"></span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
