# Log analyser

<p align="center"><img src="http://i.imgur.com/SLUqV4s.png" alt="Log analyser logo" /></p>

Analyse web server logs getting statistics about the last 7 days URLs, view all requests and filter them.  
Written in **Electron**, **NodeJS** and **VueJS**, for all links and documentation see the end of readme.

### Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload
npm run dev

# build electron application for production
npm run build

# lint all JS/Vue component files in `src/`
npm run lint

```

### Screenshots

![Log analyser upload file](http://i.imgur.com/3FLvgdY.png)  

![Log analyser processing file](http://i.imgur.com/NW5WyZz.png)  

![Log analyser overview](http://i.imgur.com/PZvcT11.png)  

![Log analyser urls](http://i.imgur.com/0cQnjTd.png)  

### Todo

- [x] [Overview] Last 7 days errors line chart
- [x] [Overview] Errors bar chart
- [ ] [Overview] Last 7 days bots/spiders line chart
- [ ] [URLs] Filter by method

---

This project was generated with [electron-vue](https://github.com/SimulatedGREG/electron-vue)@[8f74b22](https://github.com/SimulatedGREG/electron-vue/tree/8f74b22cc8464f6ec75920774d9e859725dc3236) using [vue-cli](https://github.com/vuejs/vue-cli). Documentation about the original structure can be found [here](https://simulatedgreg.gitbooks.io/electron-vue/content/index.html).