import { createContext, useContext, useState, type ReactNode } from 'react';

interface LayoutContextProps {
  leftSidebarOpen: boolean;
  setLeftSidebarOpen: (open: boolean) => void;
  rightPanelOpen: boolean;
  setRightPanelOpen: (open: boolean) => void;
  toggleLeftSidebar: () => void;
  toggleRightPanel: () => void;
}

const LayoutContext = createContext<LayoutContextProps | undefined>(undefined);

export function LayoutProvider({ children }: { children: ReactNode }) {
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(true);
  const [rightPanelOpen, setRightPanelOpen] = useState(true);

  const toggleLeftSidebar = () => setLeftSidebarOpen((prev) => !prev);
  const toggleRightPanel = () => setRightPanelOpen((prev) => !prev);

  return (
    <LayoutContext.Provider
      value={{
        leftSidebarOpen,
        setLeftSidebarOpen,
        rightPanelOpen,
        setRightPanelOpen,
        toggleLeftSidebar,
        toggleRightPanel,
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
