export function useLocalStorage<T>(key: string) {
  const load = (): T | null => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : null
    } catch (error) {
      console.error(`Error loading ${key} from localStorage:`, error)
      return null
    }
  }

  const save = (value: T): void => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.error(`Error saving ${key} to localStorage:`, error)
    }
  }

  const remove = (): void => {
    try {
      window.localStorage.removeItem(key)
    } catch (error) {
      console.error(`Error removing ${key} from localStorage:`, error)
    }
  }

  return { load, save, remove }
}
