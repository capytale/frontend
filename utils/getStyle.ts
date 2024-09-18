export const getStyle = function (score, scoreMax) {
  // Couleurs de  ff0000 -> ffff00 -> 00ff00
  // pour Score/scoreMax de 
  //              0      -> 0.5    -> 1
    const r = Math.min(220, 510 - parseInt(510*score/scoreMax));
    const g = Math.min(220, parseInt(510*score/scoreMax));
    const b = 0;
    const idle = ''
    if (score != null) return `background-color: rgba(${r}, ${g}, ${b}, 0.7);`
    else
    return idle
  }