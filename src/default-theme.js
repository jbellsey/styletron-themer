let libraryMeta = {};

export function installLibraryMeta(t) {
  libraryMeta = t;
}

export default function getDefaultTheme() {
  return {meta: libraryMeta};
}
