import type { AppData } from '../types'
import { SEED_DATA } from './seed'

const STORAGE_KEY = 'learnspark_data'

export function loadData(): AppData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      return JSON.parse(raw) as AppData
    }
  } catch {
    // fall through to seed
  }
  return structuredClone(SEED_DATA)
}

export function saveData(data: AppData): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

export function generateId(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`
}
