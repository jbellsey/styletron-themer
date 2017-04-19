
export function getDisplayName(Component) {
  return Component.displayName
    || Component.name
    || (typeof Component === 'string' ? Component : 'Component');
}

export function isObject(item) {
  return (
    typeof item === "object"
        && !Array.isArray(item)
        && item !== null
  );
}
