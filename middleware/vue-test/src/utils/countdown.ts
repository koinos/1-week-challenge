export function countdown(countDownToTime: number) {
  const timeNow = new Date().getTime();
  const timeDifference = countDownToTime - timeNow;
  const millisecondsInOneSecond = 1000;
  const millisecondsInOneMinute = millisecondsInOneSecond * 60;
  const millisecondsInOneHour = millisecondsInOneMinute * 60;
  const millisecondsInOneDay = millisecondsInOneHour * 24;
  const differenceInDays = timeDifference / millisecondsInOneDay;
  const remainderDifferenceInHours =
    (timeDifference % millisecondsInOneDay) / millisecondsInOneHour;
  const remainderDifferenceInMinutes =
    (timeDifference % millisecondsInOneHour) / millisecondsInOneMinute;
  const remainderDifferenceInSeconds =
    (timeDifference % millisecondsInOneMinute) / millisecondsInOneSecond;
  const remainingDays = Math.floor(differenceInDays);
  const remainingHours = Math.floor(remainderDifferenceInHours);
  const remainingMinutes = Math.floor(remainderDifferenceInMinutes);
  const remainingSeconds = Math.floor(remainderDifferenceInSeconds);

  return (
    remainingDays +
    ' Days ' +
    ': ' +
    remainingHours +
    ' Hours ' +
    ': ' +
    remainingMinutes +
    ' Minutes ' +
    ': ' +
    remainingSeconds +
    ' Seconds'
  );
}
