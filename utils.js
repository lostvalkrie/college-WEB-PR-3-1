export const getRandom = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const withClickLimit = (limit, buttonName, callback) => {
  let clicks = 0;
  return (event) => {
    if (clicks < limit) {
      clicks++;
      const remaining = limit - clicks;
      console.log(`[${buttonName}] clicks made: ${clicks}. left: ${remaining}`);
      callback(event);
    } else {
      console.log(`[${buttonName}] Limit reached!`);
      event.currentTarget.disabled = true;
    }
  };
};
