import { getForecast } from './engine.js'

const forecast = await getForecast(35.781300,  -78.641680)

console.debug(forecast)
