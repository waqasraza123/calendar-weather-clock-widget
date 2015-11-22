//gloabal variables
var currentWeather;
var forecastWeeather;

//******************************************************
//make the clock
//******************************************************
function clock(){

    //create date object and get current time
    var date = new Date();
    var currentMinutes = date.getMinutes();
    var currentHours = date.getHours();
    var currentSeconds = date.getSeconds();

    //padd zeroes
    currentMinutes = (currentMinutes < 10 ? "0" : "") + currentMinutes;
    currentSeconds = (currentSeconds < 10 ? "0" : "") + currentSeconds;

    //set the AM or PM if true then first option else the other
    var amPm = (currentHours < 12)? "AM" : "PM";

    //make the time 12 hours
    currentHours = (currentHours > 12)? currentHours-12 : currentHours;

    //if current time is zero make it 12
    currentHours = (currentHours == 0)? 12 : currentHours;

    //make a string to show the concatenated output
    var fullTime = currentHours + "<span class='dots'>:</span>" + currentMinutes + "<span class='dots'>:</span>" + currentSeconds + " " + "<span class='amPm'>"+amPm+"</span>";

    $("#clock").html(fullTime);
}

//======================================================================================================================

//======================== CLOCK        ENDS        HERE ************************************************

//======================================================================================================================
$(document).ready(function(){
    $(".view").hide();

    //run the clock function after every 1 second to make the timer running
    setInterval('clock()', 1000);//1000 = 1s
    $("#mini-calendar").html(dashboardSimpleCalendar());


    //*****************************************************
    // check if simple weather is stored in the localstorage
    //******************************************************
    if(localStorage.currentWeatherInStorage==null){
        $(".mini-weather").html('Loading...');
        //mini weather plugin
        $.simpleWeather({
            location: 'Pakistan, Islamabad',
            woeid: '',
            unit: 'c',
            success: function(weather) {
                html = '<p>'+weather.temp+'&deg;'+weather.units.temp+'</p>';
                currentWeather = html;
                localStorage.currentWeatherInStorage = currentWeather;
                $("#mini-weather").html(html);
            },
            error: function(error) {
                console.log(error);
            }
        });
    }
    else{
        $("#mini-weather").html(localStorage.currentWeatherInStorage);
    }

    //******************************************************
    //hide other cards while one is being shown
    //******************************************************

    $("#mini-calendar").click(function(e){

        $(this).siblings().toggle();
        $(this).toggle();
        $("#calendar").toggleClass("flip");
    });

    $("#calendar").click(function(){
        $(this).toggle();
        $(this).siblings().toggle();
        $("#calendar").toggleClass("flip");
    });

    $("[class^=mini]").click(function(){
        $("#calendar").toggle();
        $(this).toggleClass("flip vcenter-small");
        $(this).siblings().toggle();
        $(this).toggleClass('bb');
        $(".mini-weather").html('Loading...');


        //check if weather is already in localstorage
        if(localStorage.detailedWeather == null){
            //loading weather to insert in div
            $.simpleWeather({
                woeid: '',
                location: 'Islamabad, Pakistan',
                unit: 'c',
                success: function(weather) {
                    html = '<h2>'+weather.temp+'&deg;'+weather.units.temp+", "+weather.currently+ ", "+weather.city+'</h2>';
                    /*html += '<ul><li>'+weather.city+', '+weather.region+'</li>';
                     html += '<li class="currently">'+weather.currently+'</li>';
                     html += '<li>'+weather.alt.temp+'&deg;C</li></ul>';*/

                    for(var i=0;i<weather.forecast.length;i++) {
                        html += '<p class="forecast">'+weather.forecast[i].day+': '+weather.forecast[i].high+'&deg;'+weather.units.temp+'</p>';
                    }

                    forecastWeather = html;
                    localStorage.detailedWeather = forecastWeather;
                    if($(".mini-weather").hasClass("flip")){
                        $(".mini-weather").html(forecastWeather).slideDown('slow');
                    }
                    if($(".mini-weather").css("display")=="block" && !$(".mini-weather").hasClass("flip")){
                        $(".mini-weather").html(currentWeather).slideDown('slow');
                    }
                },
                error: function(error) {
                    console.log(error);
                }
            });//weather fetching ends here
        }//if con


        //******************************************************
        //if weather is already in the localstorage fetch it
        //******************************************************
        else{
            if($(".mini-weather").hasClass("flip")){
                $(".mini-weather").html(localStorage.detailedWeather).slideDown('slow');
            }
            if($(".mini-weather").css("display")=="block" && !$(".mini-weather").hasClass("flip")){
                $(".mini-weather").html(localStorage.currentWeatherInStorage).slideDown('slow');
            }
        }


    });//toggle ends here

});//document ready ends here


//======================================================================================================================
var app = angular.module("myApp", []);
var monthNames = ["Jan", "Feb", "March", "April", "May", "June",
    "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];


app.controller("myAppController",function($scope) {

    $scope.days = ["Mon","Tue","Wed","Thur","Fri","Sat","Sun"];

    $scope.getCalendar=function($scope,date){
        console.log(date.getMonth());
        //date = (typeof (date) === 'undefined')?new Date():new Date(date);
        var year = date.getFullYear();
        var month = date.getMonth();
        var dateNow = (new Date());
        var monthName = monthNames[month];
        var day = date.getDate();
        var dayInMon = (new Date(year, month + 1, 0)).getDate();
        var minusDate = 0;
        var weekIndex = 0;
        var monthStartDay = new Date(year,month, 1).getDay();
        $scope.currMonth = monthName + ", " + year.toString();
        $scope.dateNow = dateNow;
        $scope.weeks = new Array([],[],[],[],[],[],[]);
        monthStartDay= ( monthStartDay === 0 ) ?  7 : monthStartDay ;
        for(var i=monthStartDay - 1;i>0;i--){
            var preMonDate = new Date(year, month, minusDate--);
            var day = {};
            day.number = preMonDate.getDate();
            day.class = "disabled";
            day.data = day.number + "  ";
            $scope.weeks[weekIndex].push(day);
        }
        $scope.weeks[weekIndex].reverse();
        var weekRemaining = 7-$scope.weeks[0].length;
        if(weekRemaining<1){
            weekIndex++;
            weekRemaining = 7;
        }
        var count = monthStartDay;
        for (var dateIte = 1; dateIte < dayInMon + 1;  dateIte++) {
            var date = new Date(year, month, dateIte);
            var day = {};
            day.number = date.getDate();
            day.weather = ' ';
            day.data = day.number + " " + day.weather;
            if(dateNow.getDate() === date.getDate()){
                day.class = "today";
            }
            var weekRemaining = 7-$scope.weeks[weekIndex].length;
            if(weekRemaining<1){
                weekIndex++; weekRemaining = 7;
            }
            $scope.weeks[weekIndex].push(day);
            count++;
        }
        var count = count;
        var plusDate = 1;
        while (count < 43) {
            var nextMonDate = new Date(year, month + 1, plusDate++);
            var day = {};
            day.number = nextMonDate.getDate();
            day.class = "disabled";
            day.data = day.number + "";
            var weekRemaining = 7-$scope.weeks[weekIndex].length;
            if(weekRemaining<1){
                weekIndex++; weekRemaining = 7;
            }
            $scope.weeks[weekIndex].push(day);
            count++;
        }

    }
    var currentDate = new Date();
    var calendarDate = new Date(currentDate);
    $scope.getCalendar($scope,calendarDate);

    $scope.next=function(){
        calendarDate.setMonth(calendarDate.getMonth()+1);
        $scope.getCalendar($scope,calendarDate);
    }
    $scope.previous=function(){
        calendarDate.setMonth(calendarDate.getMonth()-1);
        $scope.getCalendar($scope,calendarDate);

    }

});
//======================================================================================================================


//**************** DASHBOARD        CALENDAR        STARTS        HERE **********************

//======================================================================================================================


function dashboardSimpleCalendar(){
    var date = new Date();
    var currentYear = date.getFullYear();
    var currentDate = date.getDate();
    var days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
    var currentDay = days[date.getDay()];

    return currentDay + "/" + currentDate + "/" + currentYear;
}