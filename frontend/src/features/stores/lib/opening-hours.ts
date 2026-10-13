const MALL_TIME_ZONE = 'Asia/Phnom_Penh'

const clockFormat = new Intl.DateTimeFormat('en-GB', {
  timeZone: MALL_TIME_ZONE,
  hour: '2-digit',
  minute: '2-digit',
  hourCycle: 'h23',
})

export const mallClock = (now: Date = new Date()): string => clockFormat.format(now)

export const isOpenAt = (openTime: string, closeTime: string, time: string): boolean =>
  time >= openTime && time < closeTime

export const isOpenNow = (openTime: string, closeTime: string, now: Date = new Date()): boolean =>
  isOpenAt(openTime, closeTime, mallClock(now))
