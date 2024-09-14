<div align="center">
    <img src="https://i.imgur.com/ogh1Dx6.png" width="" align="center" />
</div>

<div align="center">
  <a href="https://github.com/avvo-na/ftl-launcher?tab=readme-ov-file#-info">Info</a>
  <span> • </span>
  <a href="https://github.com/avvo-na/ftl-launcher?tab=readme-ov-file#%EF%B8%8F--install">Install</a>
  <span> • </span>
  <a href="https://ftl-launcher.com">Website</a>
  <span> • </span>
  <a href="https://discord.gg/xujqFZsEac">Discord</a>
</div>

<br />

<div align="center">

![GitHub Repo stars](https://img.shields.io/github/stars/avvo-na/ftl-launcher)
[![GitHub Issues](https://img.shields.io/github/issues/avvo-na/ftl-launcher.svg?style=flat-square&label=Issues&color=d77982)](https://github.com/avvo-na/ftl-launcher/issues)
[![GitHub Actions Workflow Status](https://img.shields.io/github/actions/workflow/status/avvo-na/ftl-launcher/build&release.yml?label=Build)](https://github.com/avvo-na/ftl-launcher/commits/main/)
[![Discord](https://img.shields.io/discord/1232581330106322954?logo=discord&label=Discord)](https://discord.gg/xujqFZsEac)


</div>

## 🔍 Info

### ⚠️ NOTICES ⚠️
> 9/14/2024: The dev server hosting the backend for this application was taken down by a DDOS
attack... This server was not meant for production use as FTLL is still not publicly released.
I love doing development in public, but I will have to take the dev server down for now until
I have time to implement more extensive rate-limiting/compression & ip-banning etc etc. <3

> 9/7/2024: Hello! This project is in a really solid state however currently depends on
Tauri, and that version is still in beta. On August 1st, 2024 the Tauri team wrote a post
about a Tauri RC, so we are getting there! Once Tauri 2.0 comes out there will be a migration
process and FTLL will move into beta.

FTLL is a simple and small mod launcher & manager for DayZ, built with Rust,
[Tauri](https://tauri.app), React and modern tools. Completely open-source and
always will be. FTLL uses your systems native web-view to render a beautiful UI,
which lets us keep our bundle size extremely small. *Blazing* fast caching and loading
of the most popular servers in the DayZ community. Try it out!

Although this project *was* built with Linux compatability in mind, I don't have
a Linux machine to test that, and disabling secure boot to dualboot Linux is a
non-starter. *Theoretically*, Tauri provides us with everything we need to push
a build out for Linux, but the difference in packaging amongst all the dozens
of distributions makes it a nightmare for a small developer.

### Features
- Playerlists for connected servers
- Accurate player counts
- *Blazing* fast Rust based server caching
- Intuitive UI
- Multithreaded server updating
- Open source
- And much more!

## ⚙️  Install

### Windows
- [Download](https://github.com/avvo-na/ftll/releases/latest) the latest `x64-setup.exe`
- Run the setup file & choose an install location
- Done! Get the latest news [here](https://ftll.io)

> If you run into any issues please feel free to join our [Discord](https://discord.gg/xujqFZsEac)
### Linux
- Coming soon!

## 💻 Development

### New Changes
You can stay up to date with the latest in the development process right here on our github page!
All of the latest builds will be pushed to the [main](https://github.com/avvo-na/ftll)
branch and automatically released. Latest development changes & nightly builds will be pushed
to the [nightly](https://github.com/avvo-na/ftll/tree/nightly) branch and tested there.
Any new changes will be also available on our [website](https://ftll.io).

### Contributing
Contributions are very welcome, currently I develop this on my own, just for my own
enjoyment, however if you want to contribute feel free to open an issue first, or contact
me on discord!

