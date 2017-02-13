
export function getDisplayName(Component) {
  return Component.displayName
    || Component.name
    || (typeof Component === 'string' ? Component : 'Component');
}

const hasDocument = typeof document === 'object' && document !== null,
      hasWindow   = typeof window === 'object' && window !== null && window.self === window,
      isBrowser   = hasDocument && hasWindow;

export {isBrowser};

export function isObject(item) {
  return (
    typeof item === "object"
        && !Array.isArray(item)
        && item !== null
  );
}
