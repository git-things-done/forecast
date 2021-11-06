import * as github from '@actions/github'
import { getInput, warning } from '@actions/core'
import { exit } from 'process'
import fetch from 'node-fetch'

const slug = process.env.GITHUB_REPOSITORY!
const [owner, repo] = slug.split('/')
const issue_number = parseInt((getInput('today') || process.env.GTD_TODAY)!)
const token = getInput('token')!
const octokit = github.getOctokit(token)

const lat = getInput('latitude')
const lng = getInput('latitude')

if (lat == undefined || lng == undefined) {
  warning("latitude & longitude must be specified")
  exit(0)
}

interface Rsp1 {
  properties: {
    gridId: string
    gridX: number
    gridY: number
    forecast: string
  }
}

interface Rsp2 {
  properties: {
    periods: {
      number: number
      detailedForecast: string
    }[]
  }
}

const rsp1 = await fetch(`https://api.weather.gov/points/${lat},${lng}`).then(x => x.json()) as Rsp1
const rsp2 = await fetch(rsp1.properties.forecast).then(x => x.json()) as Rsp2

const forecast = rsp2.properties.periods.find(x => x.number == 1)?.detailedForecast

if (!forecast) {
  warning("No forecast found ¯\_(ツ)_/¯")
  exit(0)
}

let body = await octokit.rest.issues.get({ owner, repo, issue_number }).then(x => x.data.body)

body = `
${body}

### Forecast
${forecast}
`

await octokit.rest.issues.update({
  owner,
  repo,
  issue_number,
  body
})
