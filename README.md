# “Forecast” for Git Things Done

An unsophisticated forecaster for [GitTD].
Possibly it only works in the US.

**Fork, fix & improve!**

```yaml
jobs:
  git-things-done:
    # [snip]
    - uses: git-things-done/porter@v1
    - uses: git-things-done/weather@v1
      with:
        latitude: …   # https://www.latlong.net
        longitude: …  # use ^^ to get your coordinates
      continue-on-error: true
      # ^^ HTTP can be flakey, let’s not fail the whole job
```

[GitTD]: https://github.com/git-things-done
