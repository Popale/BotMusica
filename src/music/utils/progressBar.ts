/**
 * Formats seconds into a human-readable string (mm:ss or hh:mm:ss).
 */
export function formatDuration(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) {
    return '00:00';
  }

  const sec = Math.floor(seconds % 60);
  const min = Math.floor((seconds / 60) % 60);
  const hrs = Math.floor(seconds / 3600);

  const paddedSec = sec.toString().padStart(2, '0');
  const paddedMin = min.toString().padStart(2, '0');

  if (hrs > 0) {
    const paddedHrs = hrs.toString().padStart(2, '0');
    return `${paddedHrs}:${paddedMin}:${paddedSec}`;
  }

  return `${paddedMin}:${paddedSec}`;
}

/**
 * Generates a clean unicode progress bar.
 * e.g. 🔘──────────────
 */
export function createProgressBar(
  currentSeconds: number,
  totalSeconds: number,
  barLength = 15,
  indicator = '🔘',
  line = '─'
): string {
  if (totalSeconds <= 0) {
    return `${indicator}${line.repeat(barLength - 1)}`;
  }

  const progress = Math.min(Math.max(currentSeconds / totalSeconds, 0), 1);
  const progressIndex = Math.round(progress * (barLength - 1));

  const before = line.repeat(progressIndex);
  const after = line.repeat(barLength - 1 - progressIndex);

  return `${before}${indicator}${after}`;
}

