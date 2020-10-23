//https://docs.google.com/spreadsheets/d/e/2PACX-1vQMZBPGbpYgJ1iOND9yMMOHK0WPkpy90Zp-963v5-5s2nEuRGxlQYRYgntoQETVLkEihcznfT3hEjOy/pub?output=csv
//links = https://docs.google.com/spreadsheets/d/e/2PACX-1vQMZBPGbpYgJ1iOND9yMMOHK0WPkpy90Zp-963v5-5s2nEuRGxlQYRYgntoQETVLkEihcznfT3hEjOy/pub?gid=546940971&single=true&output=csv
//tt = https://docs.google.com/spreadsheets/d/e/2PACX-1vQMZBPGbpYgJ1iOND9yMMOHK0WPkpy90Zp-963v5-5s2nEuRGxlQYRYgntoQETVLkEihcznfT3hEjOy/pub?gid=1414031351&single=true&output=csv

var status=document.getElementById('status')

console.log(`Welcome to TimeTable Console \n 

 __         __   __   ______    
/\\ \\       /\\ \\ / /  /\\___  \\   
\\ \\ \\____  \\ \\ \\'/   \\/_/  /__  
 \\ \\_____\\  \\ \\__|     /\\_____\\ 
  \\/_____/   \\/_/      \\/_____/ 
                                

Available Interfaces:
  > getTodayName()
  
  > setNotifVolume(a_vol)
      - value between 0 - 1
  
  > FetchTimeTable(day)
      - day must be like "Friday"
  
  > darkTheme(mode)
      - mode is True or False


`)

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
          //console.log(data);

          if(data['As Per Schedule ?']!="Yes"){
            var times = new Date(Date.parse(data['Date of Time Table']))
            document.getElementById('time').innerHTML="<span class='w3-padding w3-border'><b class='w3-text-red '>Special </b>TimeTable: <i class='w3-bold'>"+DayName[times.getDay()]+","+Months[times.getMonth()]+" "+times.getDate()+" "+times.getFullYear()+"</b></span>"
            if(getTodayName()=="Tuesday"){
              setTimetable(data['Period - 1'],data['Period - 2'],data['Period - 3'],data['Period - 4'],data['Period - 5'])
            }else{
              setTimetable(data['Period - 1'],data['Period - 2'],data['Period - 3'],data['Period - 4'],data['Period - 5'])
            }
            FetchLinks()
          }else{
            var d = new Date();
            if(DayName[d.getDay()]=="Sunday"){
              document.getElementById('time').innerHTML="<span class='w3-padding w3-border'><b class='w3-text-red '>Its Sunday | </b>TimeTable: <i>"+DayName[(d.getDay())+6]+","+Months[d.getMonth()]+" "+d.getDate()+" "+d.getFullYear()+"</b></span>";
            }else{
              document.getElementById('time').innerHTML="<span class='w3-padding w3-border'><b class='w3-text-red '>Regular </b>TimeTable: <i class='w3-bold'>"+DayName[d.getDay()]+","+Months[d.getMonth()]+" "+d.getDate()+" "+d.getFullYear()+"</b></span>"  
            }
            FetchTimeTable(getTodayName())
          }
        }
    }
}

var audio = document.getElementById('audio-not');


var vol = getCookie('volume');
var cur_mode="med";

if(vol!="no"){
  if(vol=="0.6"){
    audio.volume=0.6;
    cur_mode="high"
  }else if(vol=="0.4"){
    audio.volume=0.4;
    cur_mode="med"
  }else{
    audio.volume=0.2;
    cur_mode="med"
  }
}else{//Default
  audio.volume=0.4;
  cur_mode="med"
}


function setNotifVolume(a_vol){
  a_vol = a_vol*1;
  if(a_vol<1){
    document.getElementById('vol-'+cur_mode).classList.remove('w3-border');
    if(a_vol=="0.6"){
      document.getElementById('vol-high').classList.add('w3-border')
      cur_mode="high"
    }else if(a_vol=="0.4"){
      document.getElementById('vol-med').classList.add('w3-border')
      cur_mode="med"
    }else{
      document.getElementById('vol-low').classList.add('w3-border')
      cur_mode="low"
    }
    setCookie('volume',a_vol,100)
    audio.volume=a_vol;
  }else{
    console.log('setNotifVolume(value) \n value must be between 0 - 1');
  }
}


var TT=[]
var Links={}
var Meets={}
var Colors={}
var linkFetch=false;

var UserNo = 0

if(location.hash!=""){
  UserNo = location.hash[1]*1;
  setCookie("cur_user", location.hash[1]*1, 100);
  document.getElementById('gid'+UserNo).classList.add('w3-border')
}else{
  var n= getCookie("cur_user");
  if(n!="no"&&n!=null){
    UserNo = n;
    document.getElementById('gid'+n).classList.add('w3-border')
  }else{
    UserNo = 0;
    document.getElementById('gid0').classList.add('w3-border')
  }
}



function SetLinks() {
  var i=1
  //console.log(Links);
  for (var sub of TT) {
    document.getElementById('l'+i).href="https://classroom.google.com/u/"+UserNo+Links[sub];
    i+=1;
  }
}

function SetMeets() {
  var i=1
  //console.log(Links);
  for (var sub of TT) {
    document.getElementById('m'+i).href=Meets[sub]+"?authuser="+UserNo+"&hs=179";
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
                  //console.log(jsonn);
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
                    //console.log(pdays);
                    break;
                  }
                }
                setTimetable(pdays['p1'],pdays['p2'],pdays['p3'],pdays['p4'],pdays['p5'])
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
                  if(DayName[now.getDay()]=="Friday"){
                    //console.log("its friday");
                    continue;
                  }else
                    break;
                }
                perstart =  [pdays["p1"],pdays["p2"],pdays["p3"],pdays["p4"],pdays["p5"]];
                //console.log(perstart)
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
                  if(DayName[now.getDay()]=='Friday'){
                    continue;
                  }else
                    break;
                }
                perend =  [pdays["p1"],pdays["p2"],pdays["p3"],pdays["p4"],pdays["p5"]];
                //console.log(perend)
                InitialzeTimes()
                displayTimes()
        }
    }
}

function closeNav() {
  document.getElementById("myNav").style.opacity=0;
  setTimeout(function () {
    document.getElementById("myNav").outerHTML=""
  }, 1000);
}

function setTimetable(p1,p2,p3,p4,p5) {
  if(p5=="-"||p5==""){
    document.getElementById('labrow').style.display='none';
    TT=[p1,p2,p3,p4,"-"]
  }else{
    document.getElementById('p5').innerText=p5
    TT=[p1,p2,p3,p4,p5]
  }
  
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
  //console.log(perstart,perend);
  countDownTime = r_start[0]
  setTimeout(function(){RenewCounter()},1000) 

  document.getElementById('nowhr').innerText="Sleep"
  document.getElementById('nxthr').innerText=TT[0]
  document.getElementById('nowhr').parentElement.style.background='cadetblue';
  document.getElementById('nxthr').parentElement.style.background=Colors[TT[0]];
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
    if(TT[4]=="-"){
      document.getElementById("timeleft").innerHTML = "<p class='w3-small'>Classes Over!</p>";
    }else{
      document.getElementById("timeleft").innerHTML = "<p class='w3-small'>Today is Lab Day!</p>";

    }
    //console.log('all over');
    setNextPeriod(4)
  }
  conditionalBroad(n)
}
var notif_enabled=false;
function Ring(){
  if(notif_enabled){
    console.log("Rang Sound!");
    audio.play();
  }else{
    console.log("Silent Mode");
  }
}

function darkTheme(mode){
  var body = document.body;
  var topbar = document.getElementsByClassName('w3-top')[0];
  var redpanel = document.getElementById('warnpanel');

  if(mode){
    body.classList.remove('w3-white')
    body.classList.add('w3-dark')
    topbar.classList.remove('w3-white')
    topbar.classList.add('w3-dark')
    redpanel.classList.remove('w3-pale-red')
  }else{
    body.classList.add('w3-white')
    body.classList.remove('w3-dark')
    topbar.classList.add('w3-white')
    topbar.classList.remove('w3-dark')
    redpanel.classList.add('w3-pale-red')
  }
}



var onloadpage=true;

function setNextPeriod(i){
  if(!onloadpage){
    Ring()
  }
  onloadpage=false;
  if(i<0){
    document.getElementById('nowhr').innerText="Break"
    document.getElementById('nxthr').innerText=TT[(i*-1)]
    document.getElementById('nowhr').parentElement.style.background='biscuit';
    document.getElementById('nxthr').parentElement.style.background=Colors[TT[(i*-1)]];
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
    //console.log(n);
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

document.getElementById("audio-switch").checked = (getCookie("notif") != "no" ? true : false);
notif_enabled = (getCookie("notif") != "no" ? true : false);

document.getElementById("dark-switch").checked = (getCookie("dark") != "no" ? true : false);
darkTheme((getCookie("dark") != "no" ? true : false))

function saveNotifChange(ele){
  setCookie("notif", (ele.checked == true ? "yes":"no") , 10)
  notif_enabled = ele.checked;
}

function saveDarkChange(ele){
  setCookie("dark", (ele.checked == true ? "yes":"no") , 10)
  darkTheme(ele.checked);
}


// Cookie Support

function setCookie(key, cvalue, exdays) {
  console.log("Cookie - Setting "+key+" "+cvalue);
  var d = new Date();
  d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
  var expires = "expires="+d.toUTCString();
  document.cookie = key + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
  var name = cname + "=";
  var ca = document.cookie.split(';');
  for(var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "no";
}

function checkCookie(key) {
  var cvalue = getCookie(key);
  console.log("checked "+cvalue);
  if(cvalue!="no"){
    notif_enabled=true;
  }else{
    notif_enabled=false;true
  }
}


// Endof Cookies
