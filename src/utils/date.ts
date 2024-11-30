export default {
  parse: (date: string): Date | null => {
    const parseDate = Date.parse(date);
    return isNaN(parseDate) ? null : new Date(parseDate);
  },
};
