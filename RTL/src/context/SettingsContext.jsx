import React, { createContext, useState, useEffect } from 'react';

export const SettingsContext = createContext();

const defaultSettings = {
  // Display settings
  theme: 'dark',
  fontSize: 'normal',
  compactMode: false,
  
  // AI Response settings
  responseStyle: 'professional', // professional, casual, creative
  responseLength: 'medium', // short, medium, long
  includeHashtags: true,
  
  // Notification settings
  enableNotifications: true,
  soundEnabled: true,
  
  // Auto-save settings
  autoSaveDrafts: true,
  draftInterval: 30, // seconds
  
  // Conversation settings
  showTimestamps: true,
  showWordCount: true,
};

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(() => {
    // Load settings from localStorage if available
    const savedSettings = localStorage.getItem('rtl-settings');
    return savedSettings ? { ...defaultSettings, ...JSON.parse(savedSettings) } : defaultSettings;
  });

  // Save settings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('rtl-settings', JSON.stringify(settings));
  }, [settings]);

  const updateSettings = (newSettings) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};