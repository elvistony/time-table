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

          if(data['As Per Schedule ?']!="Yes"){
            var times = new Date(Date.parse(data['Date of Time Table']))
            document.getElementById('time').innerHTML="<span class='w3-padding w3-border'><b class='w3-text-red '>Special </b>TimeTable: <i class='w3-bold'>"+DayName[times.getDay()]+","+Months[times.getMonth()]+" "+times.getDate()+" "+times.getFullYear()+"</b></span>"
            setTimetable(data['Period - 1'],data['Period - 2'],data['Period - 3'],data['Period - 4'])
            FetchLinks()
          }else{
            var d = new Date();
            document.getElementById('time').innerHTML="<span class='w3-padding w3-border'><b class='w3-text-red '>Regular </b>TimeTable: <i class='w3-bold'>"+DayName[d.getDay()]+","+Months[d.getMonth()]+" "+d.getDate()+" "+d.getFullYear()+"</b></span>"
            FetchTimeTable(getTodayName())
          }

        }
    }
}

var TT=[]
var Links={}
var Meets={}
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

function SetMeets() {
  var i=1
  //console.log(Links);
  for (var sub of TT) {
    document.getElementById('m'+i).href=Meets[sub];
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
                  Meets=jsonn[2];
                  SetLinks()
                  SetColors()
                  FetchTimeStart(getTodayName())
                  SetMeets()
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

var times = []
var perstart = []
var perend = []
var now = new Date()
var ndate = (now).toDateString()

function FetchTimeStart(day){
  var request = new XMLHttpRequest();
    request.open('GET',"https://docs.google.com/spreadsheets/d/1wdG2LWLWsCLCy1MPC3iydJlRKqM9ntYUacftEkW8VoY/gviz/tq?tqx=out:csv&sheet=TimeStart", true);
    request.send(null);
    request.onreadystatechange = function () {
        if (request.readyState === 4 && request.status === 200) {
                var data = csvJSON(request.responseText)
                for (var pdays of data) {
                  if(DayName[now.getDay()]=='Friday' && pdays['Day']=='Friday'){
                    continue;
                  }else
                    break;
                }
                perstart =  [pdays["p1"],pdays["p2"],pdays["p3"],pdays["p4"]];
                console.log(perstart)
                FetchTimeEnd(day)
        }
    }
}

function FetchTimeEnd(day){
  var request = new XMLHttpRequest();
    request.open('GET',"https://docs.google.com/spreadsheets/d/1wdG2LWLWsCLCy1MPC3iydJlRKqM9ntYUacftEkW8VoY/gviz/tq?tqx=out:csv&sheet=TimeEnd", true);
    request.send(null);
    request.onreadystatechange = function () {
        if (request.readyState === 4 && request.status === 200) {
                var data = csvJSON(request.responseText)
                for (var pdays of data) {
                  if(DayName[now.getDay()]=='Friday' && pdays['Day']=='Friday'){
                    continue;
                  }else
                    break;
                }
                perend =  [pdays["p1"],pdays["p2"],pdays["p3"],pdays["p4"]];
                console.log(perend)
                InitialzeTimes()
                displayTimes()
        }
    }
}

function closeNav() {
  document.getElementById("myNav").style.opacity=0;
  setTimeout(function () {
    document.getElementById("myNav").outerHTML=""
  }, 500);
}

function setTimetable(p1,p2,p3,p4) {
  TT=[p1,p2,p3,p4]
  document.getElementById('p1').innerText=p1
  document.getElementById('p2').innerText=p2
  document.getElementById('p3').innerText=p3
  document.getElementById('p4').innerText=p4
  // setLinks(p1,p2,p3,p4)
}

//resolved values:
var r_start=[]
var r_end=[]
let countDownTime;

// Set the date we're counting down to

function displayTimes(){
  var i=1;
  for (const ps of perstart) {
    document.getElementById('s'+i).innerText=ps
    i+=1;
  }
  i=1;
  for (const pe of perend) {
    document.getElementById('e'+i).innerText=pe
    i+=1;
  }
}

function InitialzeTimes(){
  for (const ps of perstart) {
    r_start.push((new Date(ndate+" "+ps+":00")).getTime())
  }
  
  for (const pe of perend) {
    r_end.push((new Date(ndate+" "+pe+":00")).getTime())
  }
  console.log(perstart,perend);
  countDownTime = r_start[0]
  setTimeout(function(){RenewCounter()},1000) 
  setNextPeriod(0)
}





function CheckWatch(){
  ntime = (new Date()).getTime()
  n=r_start[0]
  if(ntime<r_start[0]){//Before 1st period
    n=r_start[0]
  }else if(ntime>r_start[0] && ntime<r_end[0]){ // In 1st period
    console.log('1st period');
    n=r_end[0]
    setNextPeriod(0)
  }else if(ntime<r_start[1] && ntime>r_end[0]){ // In 1st break
    n=r_start[1]
    console.log('first break');
    setNextPeriod(-1)
  }else if(ntime>r_start[1] && ntime<r_end[1]){ // In 2md period
    n=r_end[1]
    console.log('2nd period');
    setNextPeriod(1)
  }else if(ntime<r_start[2] && ntime>r_end[1]){ // In 2nd break
    n=r_start[2]
    console.log('2nd break');
    setNextPeriod(-2)
  }else if(ntime>r_start[2] && ntime<r_end[2]){ // In 3rd period
    n=r_end[2]
    console.log('3rd period');
    setNextPeriod(2)
  }else if(ntime<r_start[3] && ntime>r_end[2]){ // In 3rd break
    n=r_start[3]
    console.log('3rd break');
    setNextPeriod(-3)
  }else if(ntime>r_start[3] && ntime<r_end[3]){ // In 4th period
    n=r_end[3]
    console.log('4th period');
    setNextPeriod(3)
  }else{ // In 4st break
    n=r_end[3]
    clearInterval(timer);
    document.getElementById("timeleft").innerHTML = "<p class='w3-small'>Classes Over!</p>";
    console.log('all over');
    setNextPeriod(4)
  }
  conditionalBroad(n)
}

function setNextPeriod(i){
  if(i<0){
    document.getElementById('nowhr').innerText="Break"
    document.getElementById('nxthr').innerText=TT[(i*-1)-1]
    document.getElementById('nowhr').parentElement.style.background='biscuit';
    document.getElementById('nxthr').parentElement.style.background=Colors[TT[(i*-1)-1]];
  }else if(i==0){
    document.getElementById('nowhr').innerText="Sleep"
    document.getElementById('nxthr').innerText=TT[0]
    document.getElementById('nowhr').parentElement.style.background='orchid';
    document.getElementById('nxthr').parentElement.style.background=Colors[TT[i+1]];
  }else if(i==3){
    document.getElementById('nowhr').innerText=TT[i]
    document.getElementById('nxthr').innerText='Sleep'
    document.getElementById('nowhr').parentElement.style.background=Colors[TT[i]];
    document.getElementById('nxthr').parentElement.style.background='orchid';
  }else if(i>3){
    document.getElementById('nowhr').innerText="Sleep"
    document.getElementById('nxthr').innerText=""
    document.getElementById('nowhr').parentElement.style.background='orchid';
    document.getElementById('nxthr').parentElement.style.background='';
  }else{
    document.getElementById('nowhr').innerText=TT[i]
    document.getElementById('nxthr').innerText=TT[i+1]
    document.getElementById('nowhr').parentElement.style.background=Colors[TT[i]];
    document.getElementById('nxthr').parentElement.style.background=Colors[TT[i+1]];

  }
}

function conditionalBroad(n){
  if(countDownTime<n){
    console.log(n);
    countDownTime=n;
  }
}
let timer;
function RenewCounter(){
  clearInterval(timer)
   timer = setInterval(function() {
    var now = new Date().getTime();
    var distance = countDownTime - now;
    var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((distance % (1000 * 60)) / 1000);
    document.getElementById("timeleft").innerHTML = minutes + ":" + seconds + "";
    if (distance < 0) {
      CheckWatch()
      //document.getElementById("timeleft").innerHTML = "Over!";
    }
  }, 1000);

}



FetchToday()
