const TWELVE_HOUR_REGEX = /(\d{1,2})\s*:?\s*(\d{0,2})\s*(a\.?m\.?|p\.?m\.?)/i
const TWENTY_FOUR_HOUR_REGEX = /(\d{1,2})\s*:\s*(\d{1,2})/i

function getPeriod(hour: string) {
  if (parseInt(hour) >= 12) {
    return "PM"
  } else {
    return "AM"
  }
}

function toTwelveHourTime(time: string) {
  const match = time.match(TWENTY_FOUR_HOUR_REGEX)
  if (!match) return "INTL"

  // split at : and convert to number
  let hour: number | string = parseInt(match[1])
  let minute: number | string = parseInt(match[2])
  const period = getPeriod(hour.toString())

  // if hour is greater than 12, subtract 12 and set period to pm
  if (hour > 12) {
    hour -= 12
  }

  // back to strings :P
  hour = hour.toString()
  minute = minute.toString()

  // add leading zero if minute is less than 10
  if (minute.length === 1) {
    minute = `0${minute}`
  }

  // if hour is 0, set to 12 since its the AM
  if (hour === "0" && period === "AM") {
    hour = "12"
  }

  return `${hour}:${minute} ${period}`
}

export { toTwelveHourTime }
