import React from 'react'

const useScrollDisable = (disable: boolean, target?: HTMLElement | null) => {
  const hasDisabledRef = React.useRef(false)

  const resolveScrollContainer = (element?: HTMLElement | null): HTMLElement => {
    if (!element) return document.body

    const isScrollableElement = element.scrollHeight > element.clientHeight

    if (isScrollableElement) return element

    return resolveScrollContainer(element.parentElement)
  }

  const scrollContainer = resolveScrollContainer(target)

  React.useLayoutEffect(() => {
    if (disable) {
      hasDisabledRef.current = true
      scrollContainer.style.setProperty('overflow', 'hidden', 'important')
    } else if (hasDisabledRef.current) {
      hasDisabledRef.current = false
      scrollContainer.style.removeProperty('overflow')
    }
  }, [disable, scrollContainer])

  React.useEffect(() => {
    return () => {
      if (hasDisabledRef.current) {
        scrollContainer.style.removeProperty('overflow')
      }
    }
  }, [scrollContainer.style])
}

export default useScrollDisable
