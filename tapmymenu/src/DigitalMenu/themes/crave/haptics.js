// A tiny vibration on taps that change something (crave, add, remove).
// Android Chrome supports it; iOS Safari ignores it. Never throws.
export default function haptic(pattern = 12) {
  try {
    if (navigator.vibrate) navigator.vibrate(pattern);
  } catch (e) {
    // not supported
  }
}
