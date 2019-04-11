window.onload = () => {
  var width = 962,
      height = 600;

  var projection = d3.geoMercator()
    .scale(125)
    .translate([width / 2.5, height / 1.4]);

  var svg = d3.select("#map").append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("class", "mapSVG");

  var path = d3.geoPath()
    .projection(projection);

  //Spotify DATA READ IN
  d3.csv("./Book3.csv").then(function (tempData) {
    const addMoreData = () => {
      if (tempData[0].region2 !== undefined) return
      const data = []
      let lastDate = null
      let index = -1

      tempData.forEach(song => {
          const { region, trackName, date } = song
          let region2, color

          if (trackName === 'Shape of You') color = '#EC6967'
          else if (trackName === 'Despacito - Remix') color ='#F4B1B2'
          else if (trackName === 'Starboy') color = '#FFA764'
          else if (trackName === 'Rockstar') color = '#FED19B'
          else if (trackName === 'Mi Gente') color = '#78BD70'
          else if (trackName === 'Felices los 4') color = '#C9E8AC'
          else if (trackName === 'Look What You Made Me Do') color = '#69A2CB'
          else if (trackName === 'Criminal') color = '#C0DCE8'
          else if (trackName === 'Something Just Like This') color = '#987284'
          else if (trackName === 'Me RehÃºso') color = '#D8C8E0'

          if (region === 'ar') region2 = 'ARG'
          else if (region === 'at') region2 = 'AUT'
          else if (region === 'au') region2 = 'AUS'
          else if (region === 'be') region2 = 'BEL'
          else if (region === 'bo') region2 = 'BOL'
          else if (region === 'br') region2 = 'BRA'
          else if (region === 'ca') region2 = 'CAN'
          else if (region === 'ch') region2 = 'CHE'
          else if (region === 'cl') region2 = 'CHL'
          else if (region === 'co') region2 = 'COL'
          else if (region === 'cr') region2 = 'CRI'
          else if (region === 'cz') region2 = 'CZE'
          else if (region === 'cz') region2 = 'CZE'
          else if (region === 'de') region2 = 'DEU'
          else if (region === 'dk') region2 = 'DNK'
          else if (region === 'do') region2 = 'DMA'
          else if (region === 'ec') region2 = 'ECU'
          else if (region === 'ee') region2 = 'ETH'
          else if (region === 'es') region2 = 'ESP'
          else if (region === 'fi') region2 = 'FIN'
          else if (region === 'fr') region2 = 'FRA'
          else if (region === 'gb') region2 = 'GBR'
          else if (region === 'gr') region2 = 'GRC'
          else if (region === 'gt') region2 = 'GTM'
          else if (region === 'hk') region2 = 'HKG'
          else if (region === 'hn') region2 = 'HND'
          else if (region === 'hu') region2 = 'HUN'
          else if (region === 'id') region2 = 'IDN'
          else if (region === 'ie') region2 = 'IRL'
          else if (region === 'is') region2 = 'ISL'
          else if (region === 'it') region2 = 'ITA'
          else if (region === 'jp') region2 = 'JPN'
          else if (region === 'lt') region2 = 'LTU'
          else if (region === 'lu') region2 = 'LUX'
          else if (region === 'lv') region2 = 'LVA'
          else if (region === 'mx') region2 = 'MEX'
          else if (region === 'my') region2 = 'MYS'
          else if (region === 'nl') region2 = 'NLD'
          else if (region === 'no') region2 = 'NOR'
          else if (region === 'nz') region2 = 'NZL'
          else if (region === 'pa') region2 = 'PAN'
          else if (region === 'pe') region2 = 'PER'
          else if (region === 'ph') region2 = 'PHL'
          else if (region === 'pl') region2 = 'POL'
          else if (region === 'pt') region2 = 'PR1'
          else if (region === 'py') region2 = 'PRY'
          else if (region === 'se') region2 = 'SWE'
          else if (region === 'sk') region2 = 'SVK'
          else if (region === 'sv') region2 = 'SLV'
          else if (region === 'tr') region2 = 'TUR'
          else if (region === 'tw') region2 = 'TWN'
          else if (region === 'us') region2 = 'USA'
          else if (region === 'uy') region2 = 'URY'

          const songObj = {
            ...song,
              region2,
              color
          }
          if (date === lastDate) {
            const arrOfDate = data[index]
            arrOfDate.push(songObj)
          } else {
              data.push([songObj])
            index++
          }

          lastDate = date
      });

      return data
    }
    const spotifyData = addMoreData();
    console.log(spotifyData);

    // PROMISE FOR COUNTRIES AND FILL
    d3.json("combined2.json").then(function (world) {
      const changeCountryColor = (sliderValue) => {
        svg.selectAll('path')
        .attr('song', d => {
          const countryID = d.id
          const listSongsOnDate = spotifyData[sliderValue]
          let trackName;

          if (listSongsOnDate !== undefined && listSongsOnDate[0].trackName !== null) {
            listSongsOnDate.forEach(song => {
              if (song.region2 === countryID) {
                trackName = song.trackName
              }
            })
          }
          
          return trackName
        })
        .style("fill", function (d) {
          const countryID = d.id
          let colorReturn = d3.rgb('#000');

          const listSongsOnDate = spotifyData[sliderValue]

          if (listSongsOnDate !== undefined && listSongsOnDate[0].trackName !== null) {
            listSongsOnDate.forEach(song => {
              if (song.region2 === countryID) {
                colorReturn = song.color
              }
            })
          }

          return colorReturn
        })
        .attr("d", path);
      }

      svg.selectAll('path')
        .data(topojson.feature(world, world.objects.countries).features)
        .enter().append("path")
        .on("mousemove", mouseOnPlot)
        .on("mouseout", mouseLeavesPlot)
        .on('click', countryClicked)
        .attr("name", function (d) { return d.properties.name; })
        .attr("id", function (d) { return d.id; })

      d3.select('.slider').on('input', function () {
        changeCountryColor(this.value)
        
        d3.selectAll('.date').text(spotifyData[this.value][0]['date'])
      })

      changeCountryColor(1)
      d3.selectAll('.date')
          .text(spotifyData[0][0]['date'])
    });
  });

  let clicked = false

  var tooltip = d3.select("#mapContainer")
                  .append("div")
                  .attr("id", "tooltip")
                  .attr("class", "tooltip")
                  .style("opacity", 0);

  function mouseOnPlot() {
    // Move the tooltip
    if (!clicked) {
      const x = (event.clientX) + 'px'
      const y = (event.clientY) + 'px'
      tooltip.style("left", x);
      tooltip.style("top", y);

      // Clear whatever is there
      tooltip.html("");

      // Give the tooltip a country labels
      let country = d3.select(this);

      const countryName = country.attr('name');

      tooltip.append("div").text(countryName)

      let song = d3.select(this);
      const countrySong = song.attr('song');
      tooltip.append("div").text(countrySong);

      let artist = d3.select(this);
      const countryArtist = artist.attr('artist');
      tooltip.append("div").text(countryArtist);

      const spotifyFrame = document.createElement('iframe')
      spotifyFrame.src = 'https://open.spotify.com/embed/album/1DFixLWuPkv3KT3TnV35m3'
      //document.body.append(spotifyFrame)  
      //document.getElementById('tooltip').appendChild(spotifyFrame)

      const aTag = document.createElement('a')
      aTag.setAttribute('href', 'google.com')
      aTag.innerHTML = 'link text'
      document.getElementById('tooltip').appendChild(aTag)

      // tooltip.append('foreignObject')
      //   .append('iframe')
      //   .attr('src', 'https://open.spotify.com/embed/album/1DFixLWuPkv3KT3TnV35m3')

      // Show the tooltip!
      tooltip.style("opacity",1);
    }
  }

  function mouseLeavesPlot() {
    if (!clicked)
      tooltip.style("opacity",0);
  }

  function countryClicked() {
    clicked = true
    tooltip.style('opacity', 1)
  }
}