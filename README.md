<h1 align="center">FTLL</h1>

<div align="center">
 
<br />

[![GitHub Issues](https://img.shields.io/github/issues/danlikestocode/ftl-launcher.svg?style=flat-square&label=Issues&color=d77982)](https://github.com/danlikestocode/ftl-launcher/issues)
[![GitHub Stars](https://img.shields.io/github/stars/danlikestocode/ftl-launcher.svg?style=flat-square&label=Stars&color=8fbcbb)](https://github.com/danlikestocode/ftl-launcher/stars)
[![GitHub License](https://img.shields.io/github/license/danlikestocode/ftl-launcher.svg?style=flat-square&label=License&color=88c0d0)](https://github.com/danlikestocode/ftl-launcher/license)

</div>

## Description
Coming soon :)

### Todo List
- [x] prevent server duplication, maybe a faster way to handle that (hashmap)
- [x] resolve accurate server player count, many servers do not report accurate
player counts, the only way AFAIK to get player counts is to query the server's
query port. So yeah idk, battlemetrics has accurate player counts!
- [ ] need to take care of updating server information on the fly without sorting
- [ ] transiently update zustand store with response from server
- [ ] merge zustand store with local cache on exit? (afraid of data loss)
in general storing data on client ON EXIT does not seem like the most stable solution.
- [ ] add a way to launch steam if its not open, instead of closing :P
this is entirely possible, as we can reINIT the steam client API on the fly



