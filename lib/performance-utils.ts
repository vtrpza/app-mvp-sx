// Performance utilities for optimizing React components and data operations

import React, { useCallback, useRef, useMemo, ComponentType } from 'react'

// Debounce hook for search and filtering
export function useDebounce<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T {
  const timeoutRef = useRef<NodeJS.Timeout>()
  
  return useCallback((...args: Parameters<T>) => {
    clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(() => {
      callback(...args)
    }, delay)
  }, [callback, delay]) as T
}

// Throttle hook for expensive operations
export function useThrottle<T extends (...args: any[]) => any>(
  callback: T,
  limit: number
): T {
  const inThrottle = useRef(false)
  
  return useCallback((...args: Parameters<T>) => {
    if (!inThrottle.current) {
      callback(...args)
      inThrottle.current = true
      setTimeout(() => {
        inThrottle.current = false
      }, limit)
    }
  }, [callback, limit]) as T
}

// Memoized calculation hook
export function useMemoizedCalculation<T>(
  calculation: () => T,
  dependencies: React.DependencyList
): T {
  return useMemo(calculation, dependencies)
}

// Performance-optimized localStorage operations
export class PerformantStorage {
  private static cache = new Map<string, { data: any; timestamp: number; ttl: number }>()
  private static readonly DEFAULT_TTL = 5 * 60 * 1000 // 5 minutes

  static get<T>(key: string, ttl: number = this.DEFAULT_TTL): T | null {
    // Check cache first
    const cached = this.cache.get(key)
    if (cached && Date.now() - cached.timestamp < cached.ttl) {
      return cached.data
    }

    try {
      const item = localStorage.getItem(key)
      if (!item) return null
      
      const data = JSON.parse(item)
      
      // Update cache
      this.cache.set(key, {
        data,
        timestamp: Date.now(),
        ttl
      })
      
      return data
    } catch (error) {
      console.error(`Error reading from localStorage (${key}):`, error)
      return null
    }
  }

  static set<T>(key: string, value: T, ttl: number = this.DEFAULT_TTL): boolean {
    try {
      const serialized = JSON.stringify(value)
      localStorage.setItem(key, serialized)
      
      // Update cache
      this.cache.set(key, {
        data: value,
        timestamp: Date.now(),
        ttl
      })
      
      return true
    } catch (error) {
      console.error(`Error writing to localStorage (${key}):`, error)
      return false
    }
  }

  static remove(key: string): void {
    localStorage.removeItem(key)
    this.cache.delete(key)
  }

  static clearCache(): void {
    this.cache.clear()
  }

  static invalidateExpired(): void {
    const now = Date.now()
    for (const [key, cached] of this.cache.entries()) {
      if (now - cached.timestamp >= cached.ttl) {
        this.cache.delete(key)
      }
    }
  }
}

// Optimized array operations
export class ArrayUtils {
  static groupBy<T>(array: T[], keyFn: (item: T) => string | number): Record<string | number, T[]> {
    return array.reduce((groups, item) => {
      const key = keyFn(item)
      if (!groups[key]) {
        groups[key] = []
      }
      groups[key].push(item)
      return groups
    }, {} as Record<string | number, T[]>)
  }

  static sortBy<T>(array: T[], keyFn: (item: T) => any, direction: 'asc' | 'desc' = 'asc'): T[] {
    return [...array].sort((a, b) => {
      const aVal = keyFn(a)
      const bVal = keyFn(b)
      
      if (aVal < bVal) return direction === 'asc' ? -1 : 1
      if (aVal > bVal) return direction === 'asc' ? 1 : -1
      return 0
    })
  }

  static filterAndSort<T>(
    array: T[],
    filterFn: (item: T) => boolean,
    sortFn?: (item: T) => any,
    sortDirection: 'asc' | 'desc' = 'asc'
  ): T[] {
    let result = array.filter(filterFn)
    
    if (sortFn) {
      result = this.sortBy(result, sortFn, sortDirection)
    }
    
    return result
  }

  static paginate<T>(array: T[], page: number, pageSize: number): { data: T[]; totalPages: number; hasMore: boolean } {
    const startIndex = (page - 1) * pageSize
    const endIndex = startIndex + pageSize
    const data = array.slice(startIndex, endIndex)
    const totalPages = Math.ceil(array.length / pageSize)
    const hasMore = page < totalPages

    return { data, totalPages, hasMore }
  }
}

// Performance monitoring utilities
export class PerfMonitor {
  private static timers = new Map<string, number>()

  static start(label: string): void {
    this.timers.set(label, performance.now())
  }

  static end(label: string): number {
    const startTime = this.timers.get(label)
    if (!startTime) {
      console.warn(`No timer found for label: ${label}`)
      return 0
    }

    const duration = performance.now() - startTime
    this.timers.delete(label)
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`⏱️ ${label}:`, `${duration.toFixed(2)}ms`)
    }
    
    return duration
  }

  static measure<T>(label: string, fn: () => T): T {
    this.start(label)
    try {
      const result = fn()
      return result
    } finally {
      this.end(label)
    }
  }

  static async measureAsync<T>(label: string, fn: () => Promise<T>): Promise<T> {
    this.start(label)
    try {
      const result = await fn()
      return result
    } finally {
      this.end(label)
    }
  }
}

// Virtual scrolling utilities for large lists
export function useVirtualList<T>({
  items,
  itemHeight,
  containerHeight,
  overscan = 5
}: {
  items: T[]
  itemHeight: number
  containerHeight: number
  overscan?: number
}) {
  return useMemo(() => {
    const visibleCount = Math.ceil(containerHeight / itemHeight)
    const totalCount = items.length
    
    return {
      totalHeight: totalCount * itemHeight,
      visibleCount: visibleCount + overscan * 2,
      getVisibleItems: (scrollTop: number) => {
        const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan)
        const endIndex = Math.min(totalCount - 1, startIndex + visibleCount)
        
        return {
          startIndex,
          endIndex,
          items: items.slice(startIndex, endIndex + 1),
          offsetY: startIndex * itemHeight
        }
      }
    }
  }, [items, itemHeight, containerHeight, overscan])
}

// Intersection Observer hook for lazy loading
export function useIntersectionObserver(
  targetRef: React.RefObject<Element>,
  options: IntersectionObserverInit = {}
) {
  const isIntersecting = useRef(false)
  const observer = useRef<IntersectionObserver>()

  const observerCallback = useCallback((entries: IntersectionObserverEntry[]) => {
    entries.forEach((entry) => {
      isIntersecting.current = entry.isIntersecting
    })
  }, [])

  const startObserving = useCallback(() => {
    if (targetRef.current && !observer.current) {
      observer.current = new IntersectionObserver(observerCallback, options)
      observer.current.observe(targetRef.current)
    }
  }, [targetRef, observerCallback, options])

  const stopObserving = useCallback(() => {
    if (observer.current) {
      observer.current.disconnect()
      observer.current = undefined
    }
  }, [])

  return { isIntersecting, startObserving, stopObserving }
}

// Component performance profiling
export function withPerformanceProfiler<P extends {}>(
  WrappedComponent: ComponentType<P>,
  componentName: string
) {
  const ProfiledComponent = React.memo((props: P) => {
    return PerfMonitor.measure(`${componentName} render`, () => {
      return React.createElement(WrappedComponent, props)
    })
  })
  
  ProfiledComponent.displayName = `withPerformanceProfiler(${componentName})`
  
  return ProfiledComponent
}

// Memory leak prevention utilities
export class MemoryLeakPrevention {
  private static activeTimeouts = new Set<NodeJS.Timeout>()
  private static activeIntervals = new Set<NodeJS.Timeout>()
  private static eventListeners = new Map<Element, { event: string; handler: EventListener }[]>()

  static setTimeout(handler: () => void, timeout: number): NodeJS.Timeout {
    const id = setTimeout(() => {
      handler()
      this.activeTimeouts.delete(id)
    }, timeout)
    
    this.activeTimeouts.add(id)
    return id
  }

  static setInterval(handler: () => void, interval: number): NodeJS.Timeout {
    const id = setInterval(handler, interval)
    this.activeIntervals.add(id)
    return id
  }

  static clearTimeout(id: NodeJS.Timeout): void {
    clearTimeout(id)
    this.activeTimeouts.delete(id)
  }

  static clearInterval(id: NodeJS.Timeout): void {
    clearInterval(id)
    this.activeIntervals.delete(id)
  }

  static addEventListener(
    element: Element,
    event: string,
    handler: EventListener,
    options?: AddEventListenerOptions
  ): void {
    element.addEventListener(event, handler, options)
    
    if (!this.eventListeners.has(element)) {
      this.eventListeners.set(element, [])
    }
    
    this.eventListeners.get(element)!.push({ event, handler })
  }

  static removeEventListener(element: Element, event: string, handler: EventListener): void {
    element.removeEventListener(event, handler)
    
    const listeners = this.eventListeners.get(element)
    if (listeners) {
      const index = listeners.findIndex(l => l.event === event && l.handler === handler)
      if (index !== -1) {
        listeners.splice(index, 1)
      }
      
      if (listeners.length === 0) {
        this.eventListeners.delete(element)
      }
    }
  }

  static cleanup(): void {
    // Clear all active timeouts
    this.activeTimeouts.forEach(id => clearTimeout(id))
    this.activeTimeouts.clear()

    // Clear all active intervals
    this.activeIntervals.forEach(id => clearInterval(id))
    this.activeIntervals.clear()

    // Remove all event listeners
    this.eventListeners.forEach((listeners, element) => {
      listeners.forEach(({ event, handler }) => {
        element.removeEventListener(event, handler)
      })
    })
    this.eventListeners.clear()

    // Clear storage cache
    PerformantStorage.clearCache()
  }
}