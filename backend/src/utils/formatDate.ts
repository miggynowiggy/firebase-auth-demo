import * as dayjs from 'dayjs';

export type dateFormats = 'YYYY-MM-DD';

export const formatDate = (
  date: Date | string = new Date(),
  format: dateFormats = 'YYYY-MM-DD',
) => dayjs(date).format(format);
