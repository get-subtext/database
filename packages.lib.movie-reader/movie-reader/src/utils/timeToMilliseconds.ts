export const timeToMilliseconds = (time: string): number => {
  try {
    const [hours, minutes, seconds] = time.split(':');
    const [sec, millis] = seconds.split(',');

    const h = parseInt(hours, 10);
    const m = parseInt(minutes, 10);
    const s = parseInt(sec, 10);
    const ms = parseInt(millis, 10);

    return (h * 3600 + m * 60 + s) * 1000 + ms;
  } catch (err) {
    // console.log(err, time)
    return 0;
  }
};
