import * as github from '@actions/github'
import { debug, getInput, warning } from '@actions/core'
import { exit } from 'process'
import { getForecast } from './engine'

const slug = process.env.GITHUB_REPOSITORY!
const [owner, repo] = slug.split('/')
const issue_number = parseInt((getInput('today') || process.env.GTD_TODAY)!)
const token = getInput('token')!
const octokit = github.getOctokit(token)

const lat = getInput('latitude')
const lng = getInput('longitude')

if (lat == undefined || lng == undefined) {
  warning("latitude & longitude must be specified")
  exit(0)
}

debug(`lat: ${lat}\nlng: ${lng}`)

const forecast = getForecast(lat, lng)

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
