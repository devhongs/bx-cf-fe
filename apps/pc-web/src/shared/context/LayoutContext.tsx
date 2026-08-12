import { createContext, type ReactNode, useContext, useState } from 'react';

interface LayoutContextProps {
  navSidebarOpen: boolean;
  setNavSidebarOpen: (open: boolean) => void;
  settingsPanelOpen: boolean;
  setSettingsPanelOpen: (open: boolean) => void;
  toggleNavSidebar: () => void;
  toggleSettingsPanel: () => void;
}

const LayoutContext = createContext<LayoutContextProps | undefined>(undefined);

export function LayoutProvider({ children }: { children: ReactNode }) {
  const [navSidebarOpen, setNavSidebarOpen] = useState(true);
  const [settingsPanelOpen, setSettingsPanelOpen] = useState(false);

  const toggleNavSidebar = () => setNavSidebarOpen((prev) => !prev);
  const toggleSettingsPanel = () => setSettingsPanelOpen((prev) => !prev);

  return (
    <LayoutContext.Provider
      value={{
        navSidebarOpen,
        setNavSidebarOpen,
        settingsPanelOpen,
        setSettingsPanelOpen,
        toggleNavSidebar,
        toggleSettingsPanel,
      }}
    >
      {children}
    </LayoutContext.Provider>
  );
}

export function useLayout() {
  const context = useContext(LayoutContext);
  if (!context) {
    throw new Error('useLayout must be used within a LayoutProvider');
  }
  return context;
}
