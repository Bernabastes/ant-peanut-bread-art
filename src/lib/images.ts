/** Sample catalog photos are illustrations until the owner uploads real jar photography. */
export function resolveProductImage(url: string | null | undefined) {
  if (!url) return "/images/jar-creamy.svg";
  return url.replace("/images/jar-creamy.jpg", "/images/jar-creamy.svg");
}
