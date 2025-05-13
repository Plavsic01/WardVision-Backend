const getNextRotationDate = () => {
  const today = new Date();
  const nextTuesday = new Date(today);

  // Računamo koliko dana do idućeg utorka (2 je utorak jer nedelja = 0)
  const daysUntilTuesday = (2 - today.getDay() + 7) % 7 || 7;

  nextTuesday.setDate(today.getDate() + daysUntilTuesday);

  // Formatiranje datuma (npr. "21. maj 2025.")
  return nextTuesday.toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
  });
};

module.exports = getNextRotationDate;
