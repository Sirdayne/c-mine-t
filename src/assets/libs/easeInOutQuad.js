const easeInOutQuad = (currentTime, startValue, changeInValue, duration) => {
  let time = currentTime / (duration / 2);
  if (time < 1) {
    return (changeInValue / 2) * time * time + startValue;
  }
  time -= 1;
  return (-changeInValue / 2) * (time * (time - 2) - 1) + startValue;
};

export default easeInOutQuad;
