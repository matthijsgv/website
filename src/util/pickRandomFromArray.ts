export const pickRandomFromArray = <T>(arr: T[]): T => {
  if (!arr.length) throw new Error("Array is empty");

  const uint32 = new Uint32Array(1);
  crypto.getRandomValues(uint32); // built-in in browsers
  const index = uint32[0] % arr.length;
  return arr[index];
};