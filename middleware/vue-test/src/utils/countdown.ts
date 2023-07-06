export function countdown(countDownToTime: number) {
  let difference = Math.floor(Date.now() / 1000) - Math.floor(countDownToTime / 1000);
  let output = ``;

  if (difference < 0) {
    difference = difference - difference - difference;
  }

  if (difference < 60) {
    // Less than a minute has passed:
    output = `${difference} seconds`;
  } else if (difference < 3600) {
    // Less than an hour has passed:
    output = `${Math.floor(difference / 60)} minutes`;
  } else if (difference < 86400) {
    // Less than a day has passed:
    output = `${Math.floor(difference / 3600)} hours`;
  } else if (difference < 2620800) {
    // Less than a month has passed:
    output = `${Math.floor(difference / 86400)} days`;
  } else if (difference < 31449600) {
    // Less than a year has passed:
    output = `${Math.floor(difference / 2620800)} months`;
  } else {
    // More than a year has passed:
    output = `${Math.floor(difference / 31449600)} years`;
  }

  return output;
}
