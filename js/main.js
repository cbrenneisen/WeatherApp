/* Main JS file - contains all necessary backbone objects and events
 * Created by Carlos Brenneisen 12/13/2015
 */
$.ajaxSetup({
    // Disable AJAX caching - weather can change very drastically!
    cache: false
});

$(document).ready(function(){

    var app = {}; //app namespace

    //city model - contains name for display purposes and zipcode for querying purposes
    app.City = Backbone.Model.extend({
      defaults: {
        name: '',
        zipcode: '',
        selected: false
      }
    });

    //data section model - contains title and a list of values
    app.DataSection = Backbone.Model.extend({
      defaults: {
        title: '', //section values
        values: [] //keys and values
      }
    });

    //collection of cities
    app.CityList = Backbone.Collection.extend({
      model: app.City,
      localStorage: new Store("backbone-city")
    });

    //collection of data sections for which weather data has been retrieved
    app.DataSectionList = Backbone.Collection.extend({
      model: app.DataSection,
      localStorage: new Store("backbone-city")
    });

    //weather section model - contains city name and a collection of data sections
    app.WeatherSection = Backbone.Model.extend({
      defaults: {
        name: '', //city name
        description: '',
        datetime: '',
        lat: '',
        lon: '',
        url: '#',
        data: new app.DataSectionList
      }
    });

    //collection of cities for which weather data has been retrieved
    app.WeatherList = Backbone.Collection.extend({
      model: app.WeatherSection,
      localStorage: new Store("backbone-city")
    });

    //renders individual cities in the Listbox
    app.CityView = Backbone.View.extend({
      tagName: 'div',
      template: _.template($('#city-template').html()),
      events: {
        'click .checkbox': 'toggleCity'
      },
      render: function(){
        this.$el.html(this.template(this.model.toJSON()));
        return this; // enable chained calls
      },
      //user clicked the checkbox, so switch the icon and (de)select accordingly
      toggleCity: function(e){
        var button = $(e.target);
        if (button.hasClass("glyphicon-unchecked")){
            button.switchClass("glyphicon-unchecked", "glyphicon-check");
            button.siblings("input[name='city']").prop('checked', true);
            this.model.attributes.selected = true;
        }else{
            button.switchClass("glyphicon-checked", "glyphicon-unchecked");
            button.siblings("input[name='city']").prop('checked', false);
            this.model.attributes.selected = false;
        }
      }
    });

    //renders weather section cities in the WeatherBox
    app.WeatherSectionView = Backbone.View.extend({
      tagName: 'div',
      className: '',
      childCount: 0,
      template: _.template($('#weather-section-template').html()),
      render: function(){
        this.$el.html(this.template(this.model.toJSON()));
        this.childCount = this.$el.find('.data-div').children().length;

        that = this;
        jQuery.each(this.model.attributes.data, function() {
            var d = new app.DataSection(this);
            that.displayData(d);
        });

        return this;
      },
      displayData: function(weatherData){
        var view = new app.WeatherDataView({model: weatherData});
        this.$el.find('.data-div').first().append(view.render().el);
        var num = this.$el.find('.data-div').first().children().length - this.childCount;
        //force line breaks depending on the number of columns
        console.log(num);
        if (num % 4 == 0){
            this.$el.find('.data-div').first().append("<div class='clearfix visible-lg-block'></div>");
            this.childCount ++;
        }
        if (num % 3 == 0){
            this.$el.find('.data-div').first().append("<div class='clearfix visible-md-block'></div>");
            this.childCount ++;
        }
        if (num % 2 == 0){
            this.$el.find('.data-div').first().append("<div class='clearfix visible-sm-block'></div>");
            this.childCount ++;
        }
      }
    });

    //renders weather section cities in the WeatherBox
    app.WeatherDataView = Backbone.View.extend({
      tagName: 'div',
      className: 'col-xs-12 col-sm-6 col-md-4 col-lg-3',
      template: _.template($('#weather-data-template').html()),
      render: function(){
        this.$el.html(this.template(this.model.toJSON()));
        return this;
      },
    });

    //add default cities
    app.cityList = new app.CityList;
    app.weatherList = new app.WeatherList;
    var dataSectionList = new app.DataSectionList;
    app.cityList.add([{'name': 'Baltimore', 'zipcode': '21230'}, {'name': 'Washington DC', 'zipcode': '20001'},
                     {'name': 'Salt Lake City', 'zipcode': '84111'}, {'name': 'New York City', 'zipcode': '10001'},
                     {'name': 'Los Angeles', 'zipcode': '90001'}]);

    //view containing the entire ListBox widget
    var ListBoxView = Backbone.View.extend({
      el: '#listbox',
      template: _.template($('#listbox-template').html()),
      events: {
        'click #get-weather': 'getWeatherData'
      },
      //on initialization, add all cities
      initialize: function(){
        this.render();
        app.cityList.each(this.addCity, this);
      },
      render: function(){
        this.$el.html(this.template());
      },
      //add individual city by adding its corresponding view
      addCity: function(city){
        var view = new app.CityView({model: city});
        this.$el.find('.data-div').append(view.render().el);
      },
      getWeatherData: function(e){
        //get all selected cities by checking the model attributes
        var cities = [];
        app.cityList.each(function(city){
            if(city.attributes.selected){
                cities.push(city.attributes.zipcode);
            }
        });

        //if one city, pass string; otherwise pass array
        var zipcode = "";
        if (cities.length == 0){
            return;
        }
        else if (cities.length == 1){
            zipcode = cities[0];
        }else{
            zipcode = JSON.stringify(cities);
        }

        Backbone.ajax({
            dataType: "json",
            url: "http://localhost/weather/server/weather.php",
            data: "zipcode="+zipcode,
            success: function(data){
                app.WeatherBoxView.update(data);
            },
            error: function(e){
                console.log(e);
            }
        });
      }
    });

    //add ListBox widget
    var ListBoxView = new ListBoxView();

    //view containing the entire WeatherBox widget
    var WeatherBoxView = Backbone.View.extend({
      el: '#weatherbox',
      template: _.template($('#weatherbox-template').html()),
      //on initialization, make empty
      initialize: function(){
        this.render();
      },
      render: function(){
        this.$el.html(this.template());
      },
      update: function(json){
          this.$el.find(".data-div").empty();
          this.$el.find(".placeholder").hide();

          app.weatherList.reset();

          that = this;
          jQuery.each(json, function() {
            var w = new app.WeatherSection(this);
            app.weatherList.add(w);
            var view = new app.WeatherSectionView({model: w});
            $('#weather-div').append(view.render().el);
          });
      },
      //add individual city by adding its corresponding view
      addWeatherSection: function(weatherSection, that){
        var view = new app.WeatherSectionView({model: weatherSection});
        this[1].$el.find('.data-div').first().append(view.render().el);
      }
    });

    //initialize weather box
    app.WeatherBoxView = new WeatherBoxView;

});