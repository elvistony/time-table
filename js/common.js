//https://docs.google.com/spreadsheets/d/e/2PACX-1vQMZBPGbpYgJ1iOND9yMMOHK0WPkpy90Zp-963v5-5s2nEuRGxlQYRYgntoQETVLkEihcznfT3hEjOy/pub?output=csv
//links = https://docs.google.com/spreadsheets/d/e/2PACX-1vQMZBPGbpYgJ1iOND9yMMOHK0WPkpy90Zp-963v5-5s2nEuRGxlQYRYgntoQETVLkEihcznfT3hEjOy/pub?gid=546940971&single=true&output=csv
//tt = https://docs.google.com/spreadsheets/d/e/2PACX-1vQMZBPGbpYgJ1iOND9yMMOHK0WPkpy90Zp-963v5-5s2nEuRGxlQYRYgntoQETVLkEihcznfT3hEjOy/pub?gid=1414031351&single=true&output=csv

var status=document.getElementById('status')

function csvJSON(csv){
  var lines=csv.split("\n");
  var result = [];
  var headers=lines[0].split(",");
  for(var i=1;i<lines.length;i++){
	  var obj = {};
	  var currentline=lines[i].split(",");
	  for(var j=0;j<headers.length;j++){
      head = headers[j].substring(1, headers[j].length-1);
		  obj[head] = currentline[j].substring(1, currentline[j].length-1);
	  }
	  result.push(obj);
  }
  return result; //JSON
}

var Months=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sept","Oct","Nov","Dec"]
var DayName=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"]

function getTodayName() {
  var d = new Date();
  return DayName[d.getDay()]
}

function FetchToday(){
  var request = new XMLHttpRequest();
    request.open('GET', "https://docs.google.com/spreadsheets/d/1wdG2LWLWsCLCy1MPC3iydJlRKqM9ntYUacftEkW8VoY/gviz/tq?tqx=out:csv&sheet=0", true);
    request.send(null);
    request.onreadystatechange = function () {
        if (request.readyState === 4 && request.status === 200) {
          var data = csvJSON(request.responseText)
          data=data[data.length - 1]
          console.log(data);
          var times = new Date(Date.parse(data['Timestamp']))
          if(data['As Per Schedule ?']!="Yes"){
            document.getElementById('time').innerHTML="<span class='w3-button w3-border'><b class='w3-text-red '>Special </b>TimeTable: <i class='w3-bold'>"+DayName[times.getDay()]+","+Months[times.getMonth()]+" "+times.getDate()+" "+times.getFullYear()+"</b></span>"
            setTimetable(data['Period - 1'],data['Period - 2'],data['Period - 3'],data['Period - 4'])
            FetchLinks()
          }else{
            document.getElementById('time').innerHTML="<span class='w3-button w3-border'><b class='w3-text-red '>Regular </b>TimeTable: <i class='w3-large'>"+data['Timestamp']+"</b></span>"
            FetchTimeTable(getTodayName())
          }

        }
    }
}

var TT=[]
var Links={}
var Colors={}
var linkFetch=false;

function SetLinks() {
  var i=1
  //console.log(Links);
  for (var sub of TT) {
    document.getElementById('l'+i).href=Links[sub];
    i+=1;
  }
}

function SetColors() {
  var i=1
  //console.log(Colors);
  for (var sub of TT) {
    document.getElementById('c'+i).style.background=Colors[sub];
    i+=1;
  }
  closeNav()
}

function FetchLinks(){
    var request = new XMLHttpRequest();
    request.open('GET',"https://docs.google.com/spreadsheets/d/1wdG2LWLWsCLCy1MPC3iydJlRKqM9ntYUacftEkW8VoY/gviz/tq?tqx=out:csv&sheet=Links", true);
    request.send(null);
    request.onreadystatechange = function () {
        if (request.readyState === 4 && request.status === 200) {
                  var jsonn = csvJSON(request.responseText)
                  console.log(jsonn);
                  Links=jsonn[0];
                  Colors=jsonn[1];
                  SetLinks()
                  SetColors()
          }
      }
}


function FetchTimeTable(day){
  var request = new XMLHttpRequest();
    request.open('GET',"https://docs.google.com/spreadsheets/d/1wdG2LWLWsCLCy1MPC3iydJlRKqM9ntYUacftEkW8VoY/gviz/tq?tqx=out:csv&sheet=TimeTable", true);
    request.send(null);
    request.onreadystatechange = function () {
        if (request.readyState === 4 && request.status === 200) {
                var data = csvJSON(request.responseText)
                for (var pdays of data) {
                  if(pdays["Day"]==day){
                    console.log(pdays);
                    break;
                  }
                }
                setTimetable(pdays['p1'],pdays['p2'],pdays['p3'],pdays['p4'])
              FetchLinks()
        }
    }
}

function closeNav() {
  document.getElementById("myNav").style.opacity=0;
  setTimeout(function () {
    document.getElementById("myNav").outerHTML=""
  }, 1000);
}

function setTimetable(p1,p2,p3,p4) {
  TT=[p1,p2,p3,p4]
  document.getElementById('p1').innerText=p1
  document.getElementById('p2').innerText=p2
  document.getElementById('p3').innerText=p3
  document.getElementById('p4').innerText=p4
  // setLinks(p1,p2,p3,p4)
}

FetchToday()