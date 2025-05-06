const getRegion = (region) => {
  const regions = {
    br1: "americas",
    eun1: "europe",
    euw1: "europe",
    la1: "americas",
    la2: "americas",
    na1: "americas",
    oc1: "americas",
    ru: "europe",
    tr1: "europe",
    jp1: "asia",
    kr: "asia",
    tw2: "asia",
    vn2: "asia",
    me1: "europe",
    sg2: "asia",
  };

  return regions[region];
};

module.exports = getRegion;
