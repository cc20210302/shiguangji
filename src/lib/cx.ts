export const cx = (...values: (string | false | null | undefined)[]): string =>
  values.filter(Boolean).join(' ')
