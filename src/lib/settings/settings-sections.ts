import type { Component } from 'vue'
import {
  FileText,
  Info,
  Palette,
  Shield,
  FolderOpen,
} from '@lucide/vue'

export type SettingsSectionId =
  | 'appearance'
  | 'workspace'
  | 'editor'
  | 'privacy'
  | 'about'

export interface SettingsSection {
  id: SettingsSectionId
  label: string
  icon: Component
}

export const settingsSections: SettingsSection[] = [
  { id: 'appearance', label: 'Appearance', icon: Palette },
  { id: 'workspace', label: 'Workspace', icon: FolderOpen },
  { id: 'editor', label: 'Editor', icon: FileText },
  { id: 'privacy', label: 'Privacy & data', icon: Shield },
  { id: 'about', label: 'About', icon: Info },
]

export function getSettingsSection(id: SettingsSectionId): SettingsSection {
  const section = settingsSections.find((item) => item.id === id)
  if (!section) {
    throw new Error(`Unknown settings section: ${id}`)
  }
  return section
}
