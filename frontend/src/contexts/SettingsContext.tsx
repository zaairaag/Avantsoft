import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface Settings {
  notifications: boolean;
  emailAlerts: boolean;
  darkMode: boolean;
  language: string;
  autoSave: boolean;
  compactView: boolean;
  showTutorials: boolean;
}

interface SettingsContextType {
  settings: Settings;
  updateSettings: (newSettings: Partial<Settings>) => void;
  resetSettings: () => void;
  isLoading: boolean;
}

const defaultSettings: Settings = {
  notifications: true,
  emailAlerts: true,
  darkMode: false,
  language: 'pt-BR',
  autoSave: true,
  compactView: false,
  showTutorials: true,
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

interface SettingsProviderProps {
  children: ReactNode;
}

export const SettingsProvider: React.FC<SettingsProviderProps> = ({ children }) => {
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);

  // Carregar configurações do localStorage na inicialização
  useEffect(() => {
    const loadSettings = () => {
      try {
        const savedSettings = localStorage.getItem('reino-brinquedos-settings');
        if (savedSettings) {
          const parsedSettings = JSON.parse(savedSettings);
          setSettings({ ...defaultSettings, ...parsedSettings });
        }
      } catch (error) {
        console.error('Erro ao carregar configurações:', error);
        setSettings(defaultSettings);
      } finally {
        setIsLoading(false);
      }
    };

    loadSettings();
  }, []);

  // Salvar configurações no localStorage sempre que mudarem
  useEffect(() => {
    if (!isLoading) {
      try {
        localStorage.setItem('reino-brinquedos-settings', JSON.stringify(settings));
      } catch (error) {
        console.error('Erro ao salvar configurações:', error);
      }
    }
  }, [settings, isLoading]);

  const updateSettings = (newSettings: Partial<Settings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
    localStorage.removeItem('reino-brinquedos-settings');
  };

  const value: SettingsContextType = {
    settings,
    updateSettings,
    resetSettings,
    isLoading,
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = (): SettingsContextType => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings deve ser usado dentro de um SettingsProvider');
  }
  return context;
};

export default SettingsContext;
