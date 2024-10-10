const getDurationInHoursAndMinutes = (startTime: number, stopTime: number) => {
  const startHours = Math.floor(startTime);
  const startMinutes = Math.round((startTime - startHours) * 100);

  const stopHours = Math.floor(stopTime);
  const stopMinutes = Math.round((stopTime - stopHours) * 100);

  const startDate = new Date();
  startDate.setHours(startHours, startMinutes, 0, 0);

  const stopDate = new Date();
  stopDate.setHours(stopHours, stopMinutes, 0, 0);

  let durationMs = stopDate.getTime() - startDate.getTime();

  if (durationMs < 0) {
    stopDate.setDate(stopDate.getDate() + 1);
    durationMs = stopDate.getTime() - startDate.getTime();
  }

  const durationHours = Math.floor(durationMs / (1000 * 60 * 60));
  const durationMinutes = Math.floor(
    (durationMs % (1000 * 60 * 60)) / (1000 * 60)
  );

  return `${durationHours}h ${durationMinutes}m`;
};

export const calculateDuration = (
  schedule: { startTime: number; stopTime: number; id: string | number }[]
) => {
  return schedule.map((sch) => {
    const duration = getDurationInHoursAndMinutes(sch.startTime, sch.stopTime);
    return { ...sch, duration };
  });
};
