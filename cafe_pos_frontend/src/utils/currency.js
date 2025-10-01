 // PUBLIC_INTERFACE
export function formatUSD(cents) {
  /** Format cents into $X.XX string. */
  const dollars = (cents / 100).toFixed(2);
  return `$${dollars}`;
}
