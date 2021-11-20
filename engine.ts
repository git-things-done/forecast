import { debug } from '@actions/core'
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
      periods: {
        number: number
        detailedForecast: string
      }[]
    },
    status: number
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

  return rsp2.properties.periods.find(x => x.number == 1)?.detailedForecast
}
