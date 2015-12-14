This app uses PHP, so as long as this is run on a server running PHP everything should work smoothly!

Description:
Page initializes all widgets on load. Right widget (WeatherBox) is initially blank as its corresponding collection
has no data yet. Left widget (ListBox) has a model for each city, each initially unselected. When a checkbox is selected,
the corresponding model is marked as selected. When the weather button is pressed, the frontend checks for all selected cities
and calls the appropriate webservice. If there is 1 zipcode selected, it sends a string, if there's more than 1 it
sends an array, and if none are selected the call is not made.

The appropriate webservice call is received by a PHP script. This makes the appropriate call to Yahoo Weather
depending on the data sent (string vs array). Once it receives the data, it parses the JSON and creates an object
called a weatherObject. This object handles all the formatting, preparing it for passing to the frontend by
rearranging and removing data. Once all objects are made, the script returns a JSON array of all weatherObjects.

When the data is received by the frontend, the WeatherBox widget is reset. A model is made of all the cities
for which data is returned, which are all part of a collection owned by the WeatherBox widget. Each of these entries
has some top level data and then a collection of data sections (Conditions, Wind, etc.) with even more data.
Corresponding views are drawn for all of the models resulting in the final view seen.


Technologies used and why (other than the obvious HTML, CSS, Javascript and jQuery):

PHP
Simple enough to create a script that returns the desired result given a zipcode or array of zipcodes.
No framework was used due to the simplicity of the operation - all I had to do was grab the data and then
alter it in the way it needed it to be. With more time I'd like to make this more REST-like (i.e., instead of
calling weather.php, I would call GET weather/zipcode/21220, etc).

Bootstrap
Easiest way to implement responsive web design. The grid system allows me to change the number of columns per device.
For example, on small and extra small devices the two main columns will stack, and on a large enough device
there will be four columns per row in the weather data section.

Backbone & Underscore
For a single page web app Backbone is very simple to quickly integrate and benefit from. The ListBox and WeatherBox
(right column) are treated as different views and their respective data sources are collections with different
models. This allows me to make templates for a ListBox row (city), a weather info section (also by city), and
a data column (wind, atmosphere, etc.). With more time and/or more complexity I would add RequireJS to
facilitate splitting Backbone objects and HTML templates into separate files.