
export const generateElementId = (key: string, form?: string) => form ? `#${form}-${key}` : `#${key}`

export const generateRandomString = (length: number) => Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, length)
