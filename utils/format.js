// formate la date et de début et de fin de la période de partage
export const formatDate = (date) => {
  const options = { year: "numeric", month: "2-digit", day: "2-digit" };
  return new Date(date).toLocaleDateString("fr-FR", options);
};

// formate la date et l'heure de début et de fin de la période de partage
export const formatDateTime = (date) => {
  const options = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  };
  return new Date(date).toLocaleDateString("fr-FR", options);
};

// formate un tmiestamp en date relaive : il ya ... secondes, minutes, heures, jours, mois, ans
export function timeElapsed(ts) {
    var now = new Date().getTime();
    var difference = now - ts;
    var secondes = Math.floor(difference / 1000);
    var minutes = Math.floor(secondes / 60);
    var heures = Math.floor(minutes / 60);
    var jours = Math.floor(heures / 24);
    var mois = Math.floor(jours / 30);
    var ans = Math.floor(mois / 12);

    if (ans > 1) return ans + " ans"
    if (ans > 0) return ans + " an"
    if (mois > 0) return mois + " mois"
    if (jours > 1) return jours + " jours"
    if (jours > 0) return jours + " jour"
    if (heures > 1) return heures + " heures"
    if (heures > 0) return heures + " heure"
    if (minutes > 1) return minutes + " minutes"
    if (minutes > 0) return minutes + " minute"
    if (secondes > 1) return secondes + " secondes"
    return "1 seconde" 
}

// Renvoie l'url de icône correspondant au type id
export const typeIcon = (id, my) => {
  const obj = my.types.find(o => o.id === id)
  return obj ? obj.icon.path : ''
}
