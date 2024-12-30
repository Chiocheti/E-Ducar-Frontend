export function returnImageLink(imageLink: string | null) {
  if (!imageLink) return '';
  return `${import.meta.env.VITE_API_URL}/uploads/${imageLink}`
}