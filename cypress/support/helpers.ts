
export const generateElementId = (key: string, form?: string) => form ? `#${form}-${key}` : `#${key}`
