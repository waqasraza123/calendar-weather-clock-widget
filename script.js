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
var app=angular.module("myApp",[]),monthNames=["Jan","Feb","March","April","May","June","Jul","Aug","Sept","Oct","Nov","Dec"];app.controller("myAppController",function(e){e.days=["Mon","Tue","Wed","Thur","Fri","Sat","Sun"],e.getCalendar=function(e,t){console.log(t.getMonth());var a=t.getFullYear(),n=t.getMonth(),r=new Date,o=monthNames[n],s=t.getDate(),g=new Date(a,n+1,0).getDate(),l=0,u=0,w=new Date(a,n,1).getDay();e.currMonth=o+", "+a.toString(),e.dateNow=r,e.weeks=new Array([],[],[],[],[],[],[]),w=0===w?7:w;for(var h=w-1;h>0;h--){var D=new Date(a,n,l--),s={};s.number=D.getDate(),s["class"]="disabled",s.data=s.number+"  ",e.weeks[u].push(s)}e.weeks[u].reverse();var d=7-e.weeks[0].length;1>d&&(u++,d=7);for(var v=w,p=1;g+1>p;p++){var t=new Date(a,n,p),s={};s.number=t.getDate(),s.weather=" ",s.data=s.number+" "+s.weather,r.getDate()===t.getDate()&&(s["class"]="today");var d=7-e.weeks[u].length;1>d&&(u++,d=7),e.weeks[u].push(s),v++}for(var v=v,c=1;43>v;){var m=new Date(a,n+1,c++),s={};s.number=m.getDate(),s["class"]="disabled",s.data=s.number+"";var d=7-e.weeks[u].length;1>d&&(u++,d=7),e.weeks[u].push(s),v++}};var t=new Date,a=new Date(t);e.getCalendar(e,a),e.next=function(){a.setMonth(a.getMonth()+1),e.getCalendar(e,a)},e.previous=function(){a.setMonth(a.getMonth()-1),e.getCalendar(e,a)}});
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