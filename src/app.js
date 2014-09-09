/**
 * Welcome to Pebble.js!
 *
 * This is where you write your app.
 */

var UI = require('ui');
var ajax = require('ajax');
var vector2 = require('vector2');
var parseFeed = function(data, quantity){
  var items = [];
  for(var i =0; i < quantity; i++){
    var title = data.list[i].weather[0].main;
    title = title.charAt(0).toUpperCase() + title.substring(1);
    var time = data.list[i].dt_txt;
    time = time.substring(time.indexOf('-') + 1, time.indexOf(':') + 3);

    items.push({
      title:title,
      subtitle:time
    });
  }
  return items;
};
var splashWindow = new UI.Window({
  backroundColor:'white'
});
var text = new UI.Text({
  position: new vector2(0, 30),
  size: new vector2(144, 40),
  text: 'Downloading weather data...',
  font: 'GOTHIC_28_BOLD',
  color:'black',
  textOverflow:'wrap',
  textAlign:'center'
});

splashWindow.add(text);
splashWindow.show();

ajax(
  {
  url:'http://api.openweathermap.org/data/2.5/forecast?q=London',
  type:'json'
  },
  function(data) {
    
    var menuItems = parseFeed(data, 10);

    var resultsMenu = new UI.Menu({
      sections: [{
        title: 'Current Forecast',
        items: menuItems
      }]
    });
    resultsMenu.on('select', function(e){
      var forecast = data.list[e.itemIndex];
      var content = data.list[e.itemIndex].weather[0].description;
      content = content.charAt(0).toUpperCase() + content.substring(1);
      content += '\nTemperature: ' + Math.round(((data.main.temp - 273.15) * 1.8 ) + 32 ) + '°F' + '\nPressure: ' + Math.round(forecast.main.pressure) + ' mbar' + '\nWind: ' + Math.round(forecast.wind.speed) + ' mph, ' + Math.round(forecast.wind.deg) + '°';
      
      var detailCard = new UI.Card({
        title:'Details',
        subtitle:e.item.subtitle,
        body: content
      });
      detailCard.show();
    });
    resultsMenu.show();
    splashWindow.hide();
  },
  function (error) {
    console.log('Download failed: ' + error);
  }
);