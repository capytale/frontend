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

    if (ans > 0) return ans + " ans"
    if (mois > 0) return mois + " mois"
    if (jours > 0) return jours + " jours"
    if (heures > 0) return heures + " heures"
    if (minutes > 0) return minutes + " minutes"
    if (secondes > 0) return secondes + " secondes"
}