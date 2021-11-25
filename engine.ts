import { debug } from '@actions/core'
import moment from 'moment'
import fetch from 'node-fetch'

export async function getForecast(lat: string | number, lng: string | number): Promise<string | undefined> {
  interface Rsp1 {
    properties: {
      gridId: string
      gridX: number
      gridY: number
      forecast: string
    },
    status?: number
  }
  interface Rsp2 {
    properties: {
      periods: Period[]
    },
    status: number
  }
  interface Period {
    number: number
    startTime: string
    endTime: string
    detailedForecast: string
  }

  const rsp1 = await fetch(`https://api.weather.gov/points/${lat},${lng}`).then(x => x.json()) as Rsp1

  if (!(rsp1.status === undefined || rsp1.status == 200)) {
    throw new Error(JSON.stringify(rsp1, null, 2))
  }

  const rsp2 = await fetch(rsp1.properties.forecast).then(x => x.json()) as Rsp2

  if (!(rsp2.status === undefined || rsp2.status == 200)) {
    throw new Error(JSON.stringify(rsp1, null, 2))
  }

  debug(`out: ${JSON.stringify(rsp2, null, 2)}`)

  const noon = moment().startOf('day').hour(12)
  const day = (period: Period) => {
    const start = moment(period.startTime)
    const end = moment(period.endTime)
    if (start.isBefore(noon) && end.isAfter(noon)) {
      return period
    }
  }

  return rsp2.properties.periods.find(day)?.detailedForecast
}
