<h1 align="center">FTL API</h1>

<br/>

<div align="center">

[![GitHub Issues](https://img.shields.io/github/issues/danlikestocode/ftl-api.svg?style=flat-square&label=Issues&color=d77982)](https://github.com/danlikestocode/ftl-api/issues)
[![GitHub Stars](https://img.shields.io/github/stars/danlikestocode/ftl-api.svg?style=flat-square&label=Stars&color=8fbcbb)](https://github.com/danlikestocode/ftl-api/stars)

</div>

## Description
Small GO REST API that provides a list of all DayZ Servers that are available.
This list usually hovers from 15,000 to 22,000 servers at any given time.
Unforuntately, the API is not able to provide advanced server details, most
importantly the server mod list. This is why writing a custom GO backend
that crawls every server with A2S UDP packets was necessary to provide full
functionality for FTLL.

## Installation
> This binary was never really meant for personal users to run, but if you want
to play with it in any capacity, feel free. Just keep in mind that the API
will change rapidly, and support for issues wont be in-depth.

- Make sure you have GO 1.22+ installed
- Clone the repository
- Run `go build` in the root directory
- Run the binary
- Scrape servers :P



