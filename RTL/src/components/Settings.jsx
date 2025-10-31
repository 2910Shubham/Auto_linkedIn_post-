import React from 'react';
import { Settings as SettingsIcon, Moon, Sun, Type, Layout, MessageSquare, Bell, Save, Hash, Volume2, Clock } from 'lucide-react';
import { useSettings } from '../hooks/useSettings';

const SettingSection = ({ title, children }) => (
  <div className="mb-6">
    <h3 className="text-white text-sm font-semibold mb-3 flex items-center gap-2">{title}</h3>
    <div className="space-y-3">{children}</div>
  </div>
);

const ToggleOption = ({ icon: Icon, label, value, onChange }) => (
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-2 text-zinc-300">
      <Icon size={16} className="text-zinc-400" />
      <span className="text-sm">{label}</span>
    </div>
    <button
      onClick={() => onChange(!value)}
      className={`w-11 h-6 rounded-full transition-colors relative ${
        value ? 'bg-indigo-500' : 'bg-zinc-700'
      }`}
    >
      <div
        className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${
          value ? 'translate-x-5' : 'translate-x-0'
        }`}
      />
    </button>
  </div>
);

const SelectOption = ({ icon: Icon, label, value, options, onChange }) => (
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-2 text-zinc-300">
      <Icon size={16} className="text-zinc-400" />
      <span className="text-sm">{label}</span>
    </div>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="bg-zinc-800 text-zinc-300 text-sm rounded-lg px-3 py-1.5 border border-zinc-700 outline-none focus:border-indigo-500 transition-colors"
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </div>
);

const Settings = ({ onClose }) => {
  const { settings, updateSettings } = useSettings();

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-zinc-900 rounded-3xl border border-zinc-700/50 shadow-2xl max-w-lg w-full max-h-[80vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-zinc-700/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <SettingsIcon size={20} className="text-indigo-400" />
              <h2 className="text-white text-lg font-bold">Settings</h2>
            </div>
            <button
              onClick={onClose}
              className="text-zinc-400 hover:text-white transition-colors"
            >
              ×
            </button>
          </div>
        </div>

        {/* Settings Content */}
        <div className="p-6">
          {/* Display Settings */}
          <SettingSection title="Display">
            <ToggleOption
              icon={Moon}
              label="Dark Mode"
              value={settings.theme === 'dark'}
              onChange={(value) => updateSettings({ theme: value ? 'dark' : 'light' })}
            />
            <SelectOption
              icon={Type}
              label="Font Size"
              value={settings.fontSize}
              options={[
                { value: 'small', label: 'Small' },
                { value: 'normal', label: 'Normal' },
                { value: 'large', label: 'Large' }
              ]}
              onChange={(value) => updateSettings({ fontSize: value })}
            />
            <ToggleOption
              icon={Layout}
              label="Compact Mode"
              value={settings.compactMode}
              onChange={(value) => updateSettings({ compactMode: value })}
            />
          </SettingSection>

          {/* AI Response Settings */}
          <SettingSection title="AI Responses">
            <SelectOption
              icon={MessageSquare}
              label="Response Style"
              value={settings.responseStyle}
              options={[
                { value: 'professional', label: 'Professional' },
                { value: 'casual', label: 'Casual' },
                { value: 'creative', label: 'Creative' }
              ]}
              onChange={(value) => updateSettings({ responseStyle: value })}
            />
            <SelectOption
              icon={MessageSquare}
              label="Response Length"
              value={settings.responseLength}
              options={[
                { value: 'short', label: 'Short' },
                { value: 'medium', label: 'Medium' },
                { value: 'long', label: 'Long' }
              ]}
              onChange={(value) => updateSettings({ responseLength: value })}
            />
            <ToggleOption
              icon={Hash}
              label="Include Hashtags"
              value={settings.includeHashtags}
              onChange={(value) => updateSettings({ includeHashtags: value })}
            />
          </SettingSection>

          {/* Notification Settings */}
          <SettingSection title="Notifications">
            <ToggleOption
              icon={Bell}
              label="Enable Notifications"
              value={settings.enableNotifications}
              onChange={(value) => updateSettings({ enableNotifications: value })}
            />
            <ToggleOption
              icon={Volume2}
              label="Sound Effects"
              value={settings.soundEnabled}
              onChange={(value) => updateSettings({ soundEnabled: value })}
            />
          </SettingSection>

          {/* Auto-save Settings */}
          <SettingSection title="Auto-save">
            <ToggleOption
              icon={Save}
              label="Auto-save Drafts"
              value={settings.autoSaveDrafts}
              onChange={(value) => updateSettings({ autoSaveDrafts: value })}
            />
            <SelectOption
              icon={Clock}
              label="Save Interval"
              value={settings.draftInterval.toString()}
              options={[
                { value: '15', label: '15 seconds' },
                { value: '30', label: '30 seconds' },
                { value: '60', label: '1 minute' }
              ]}
              onChange={(value) => updateSettings({ draftInterval: parseInt(value) })}
            />
          </SettingSection>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-zinc-700/50 bg-zinc-900/50">
          <button
            onClick={onClose}
            className="w-full bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl py-2.5 font-semibold transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;