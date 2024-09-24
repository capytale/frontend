type Color = { r: number, g: number, b: number };

/** couleur pour 0/10 */
const nullColor = { r: 220, g: 20, b: 60 };
/** couleur pour 5/10 */
const midColor = { r: 255, g: 165, b: 0 };
/** couleur pour 10/10 */
const maxColor = { r: 0, g: 128, b: 0 };

function interpolColors(s: number, c1: Color, c2: Color): Color {
  return {
    r: c1.r + (c2.r - c1.r) * s,
    g: c1.g + (c2.g - c1.g) * s,
    b: c1.b + (c2.b - c1.b) * s
  }
}

/**
 * Retourne un style css pour afficher une couleur en fonction d'un score
 */
export function getStyle(score: number | null, scoreMax: number): string {
  if ((score == null) || (scoreMax == 0)) return 'background-color: AliceBlue; color: DarkGray;'
  /** score normalisé entre 0 et 2 */
  const normalizedScore = 2 * score / scoreMax;
  const c: Color = (normalizedScore < 1) ?
    interpolColors(normalizedScore, nullColor, midColor) :
    interpolColors((normalizedScore - 1), midColor, maxColor);
  const intensity = c.r * 0.299 + c.g * 0.587 + c.b * 0.114;
  const color = intensity > 186 ? 'black' : 'white';
  return `background-color: rgb(${Math.floor(c.r)}, ${Math.floor(c.g)}, ${Math.floor(c.b)}); color: ${color};`
}