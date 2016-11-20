# WeatherApp - Web edition

This app uses PHP, so as long as this is run on a server running PHP everything should work smoothly!
Either: load project in a custom folder and open up index.html in the browser
OR: place project in your DocumentRoot and visit localhost to get going

All Tech used: PHP, Javascript, Backbone.js, CSS, Bootstrap, Underscore.js

If you're on a Mac, like me, then this tutorial is a great one for getting apache up and going:
http://jason.pureconcepts.net/2014/11/install-apache-php-mysql-mac-os-x-yosemite/

App Description:
Home page initializes all widgets on load. Right widget (WeatherBox) is initially blank as its corresponding collection
has no data yet. Left widget (ListBox) has a model for each city, each initially unselected. When a checkbox is 
selected, the corresponding model is marked as selected. When the weather button is pressed, the frontend checks for 
all selected cities and calls the appropriate webservice. If there is 1 zipcode selected, it sends a string, if there's
more than 1 it sends an array, and if none are selected the call is not made.

The appropriate webservice call is received by a PHP script. This makes the appropriate call to Yahoo Weather
depending on the data sent (string vs array). Once it receives the data, it parses the JSON and creates an object
called a WeatherObject. This object handles all the formatting, preparing it for passing to the frontend by
rearranging and removing data. Once all objects are made, the script returns a JSON array of all WeatherObjects.

When the data is received by the frontend, the WeatherBox widget is reset. A model is made of all the cities
for which data is returned, which are all part of a collection owned by the WeatherBox widget. Each of these entries
has some top level data and then a collection of data sections (Conditions, Wind, etc.) with even more data.
Corresponding views are drawn for all of the models resulting in the final view seen.


![Alt text](/webapp.png?raw=true "Screenshot")

