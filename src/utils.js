
export function getDisplayName(Component) {
  let name = Component.displayName || Component.name;
  if (name)
    return name;

  if (typeof Component === 'string')
    return Component;

  if (typeof Component.type === 'string')
    return Component.type;

  if (typeof Component.type === 'function')
    return getDisplayName(Component.type);

  return 'Unknown';
}

export function isObject(item) {
  return (
    typeof item === "object"
        && !Array.isArray(item)
        && item !== null
  );
}
