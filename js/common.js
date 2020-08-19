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
		  obj[headers[j]] = currentline[j];
	  }
	  result.push(obj);
  }
  return result; //JSON
}


function FetchToday(){
  var request = new XMLHttpRequest();
    request.open('GET', "https://cors-anywhere.herokuapp.com/docs.google.com/spreadsheets/d/e/2PACX-1vQMZBPGbpYgJ1iOND9yMMOHK0WPkpy90Zp-963v5-5s2nEuRGxlQYRYgntoQETVLkEihcznfT3hEjOy/pub?output=csv", true);
    request.send(null);
    request.onreadystatechange = function () {
        if (request.readyState === 4 && request.status === 200) {
          var data = csvJSON(request.responseText)
          data=data[1]
          console.log(data);
          document.getElementById('time').innerHTML="TimeTable: <i class='w3-large'>"+data['Timestamp']+"</b>"
          if(data['As Per Schedule ?']!="Yes"){
            setTimetable(data['Period - 1'],data['Period - 2'],data['Period - 3'],data['Period - 4'])
            FetchLinks()
          }else{
            FetchTimeTable(data['Day'])

          }

        }
    }
}

var TT=[]
var Links={}
var linkFetch=false;

function SetLinks() {
  var i=1
  console.log(Links);
  for (var sub of TT) {
    document.getElementById('l'+i).href=Links[sub];
    i+=1;
  }
  closeNav()
}

function FetchLinks(){
    var request = new XMLHttpRequest();
    request.open('GET',"https://cors-anywhere.herokuapp.com/docs.google.com/spreadsheets/d/e/2PACX-1vQMZBPGbpYgJ1iOND9yMMOHK0WPkpy90Zp-963v5-5s2nEuRGxlQYRYgntoQETVLkEihcznfT3hEjOy/pub?gid=546940971&single=true&output=csv", true);
    request.send(null);
    request.onreadystatechange = function () {
        if (request.readyState === 4 && request.status === 200) {
                  var jsonn = csvJSON(request.responseText)
                  console.log(jsonn);
                  Links=jsonn[0];
                  SetLinks()
          }
      }
}


function FetchTimeTable(day){
  var request = new XMLHttpRequest();
    request.open('GET',"https://cors-anywhere.herokuapp.com/docs.google.com/spreadsheets/d/e/2PACX-1vQMZBPGbpYgJ1iOND9yMMOHK0WPkpy90Zp-963v5-5s2nEuRGxlQYRYgntoQETVLkEihcznfT3hEjOy/pub?gid=1414031351&single=true&output=csv", true);
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
