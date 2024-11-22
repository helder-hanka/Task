interface IDate {
  date: Date;
}

export default {
  parse: (date: string): IDate | null | Date => {
    if (isNaN(Date.parse(date))) {
      return null;
    }
    return new Date(date);
  },
};
