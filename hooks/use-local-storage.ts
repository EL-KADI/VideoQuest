"use client"

import { useState, useEffect, useRef } from "react"

export function useLocalStorage<T>(key: string, initialValue: T) {

  const [storedValue, setStoredValue] = useState<T>(initialValue)

 
  const isFirstRender = useRef(true)

  useEffect(() => {
    if (!isFirstRender.current) {
      return 
    }

    isFirstRender.current = false

    try {
     
      if (typeof window !== "undefined") {
        const item = window.localStorage.getItem(key)
      
        if (item) {
          setStoredValue(JSON.parse(item))
        }
      }
    } catch (error) {
    
      console.error("Error reading from localStorage:", error)
    }
  }, [key]) 


  const setValue = (value: T | ((val: T) => T)) => {
    try {
    
      const valueToStore = value instanceof Function ? value(storedValue) : value

      
      setStoredValue(valueToStore)

      
      if (typeof window !== "undefined") {
        window.localStorage.setItem(key, JSON.stringify(valueToStore))
      }
    } catch (error) {
      console.error("Error saving to localStorage:", error)
    }
  }

  return [storedValue, setValue] as const
}
