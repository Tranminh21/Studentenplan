function calendarWeek(yy,mm,dd) {
//get actual number of calendar week
  var mydate = new Date();
  if (!dd) {
    yy = mydate.getYear(); if (1900 > yy) yy +=1900;
    mm = mydate.getMonth(); dd = mydate.getDate();
  }
  else mm--;
  mydate = new Date(yy,mm,dd,0,0,1);
  var myday = mydate.getDay(); if (myday == 0) myday = 7;
  var d = new Date(2004,0,1).getTimezoneOffset();
  var summertime = (Date.UTC(yy,mm,dd,0,d,1) - Number(mydate)) /3600000;
  mydate.setTime(Number(mydate) + summertime*3600000 - (myday-1)*86400000);
  var myyear = mydate.getYear(); if (1900 > myyear) myyear +=1900;
  var cw = 1;
  if (new Date(myyear,11,29) > mydate) {
    var dstart = new Date(myyear,0,1);
    dstart = new Date(Number(dstart) + 86400000*(8-dstart.getDay()));
    if(dstart.getDate() > 4) dstart.setTime(Number(dstart) - 604800000);
    cw = Math.ceil((mydate.getTime() - dstart) /604800000);
  }
  return cw;
}

function checkHollydays(inLine) {
// EXDATE;TZID=Europe/Berlin:20211003T073001
// siehe auch https://www.schulferien.org/deutschland/feiertage/sachsen/
	var checkDate = inLine.substring(30,34);
	var myYear = inLine.substring(26,30);
	//statische Feiertage
	var hollyDays = ["0101","1003","1031","1225","1226"];
	//dynamische Feiertage
	//Buß- und Bettag
	var bubt = berechneBuB(myYear);
    //Karfreitag
    var kafr = karFreitag(osterSonntag(myYear));
    //Ostermontag
    var osmo = osterMontag(osterSonntag(myYear));
    //Himmelfahrt
    var hifa = himmelFahrt(osterSonntag(myYear));
    //Pfingstmontag
    var pfmo = pfingstMontag(osterSonntag(myYear));
    hollyDays.push(bubt,kafr,osmo,hifa,pfmo);
    //Ferien zum Jahreswechsel
    hollyDays.push("1224","1227","1228","1229","1230","1231");
    //Extras 
    hollyDays.push("1222","1223","0102","0103");
    //da unklar ist, wie lange die Ferien zum Jahreswechsel dauern,
    //wird vorsichtshalber der komplette Dezember und Januar gesperrt
    hollyDays.push("1201","1202","1203","1204","1205","1206","1207","1208","1209","1210","1211","1212","1213","1214","1215","1216","1217","1218","1219","1220","1221","1222","1223","1224","1225","1226","1227","1228","1229","1230","1231");
    hollyDays.push("0101","0102","0103","0104","0105","0106","0107","0108","0109","0110","0111","0112","0113","0114","0115","0116","0117","0118","0119","0120","0121","0122","0123","0124","0125","0126","0127","0128","0129","0130","0131");
    if (hollyDays.indexOf(checkDate) > -1) { return 1; } else {return 0;}
}

function daysToSeconds(howManyDays) {
		return howManyDays * 24 * 3600;
}

function berechneBuB(myYear) {
	//Buss- und Bettag fuer bestimmtes Jahr berechnen
	var myDate = new Date(myYear+"-12-25");
	var weekdays = myDate.getDay();
	//wenn der 25.12. ein Sonntag ist, dann müssen 7 Tage abgezogen werden, um zum 4. Advent zu kommen
	if (weekdays == 0) {weekdays = 7;}
	//4. Advent ist letzter Sonntag vor dem 25.12.
	var vierterAdvent = makeEpoch(myYear+"1225") - daysToSeconds(weekdays);
	//21 Tage vor 4. Advent ist 1. Advent
	var ersterAdvent = vierterAdvent - daysToSeconds(21);	
	//7 Tage vor 1. Advent ist Totensonntag
	var totenSonntag = ersterAdvent - daysToSeconds(7);
	//4 Tage vor Totensonntag ist Buss- und Bettag
	var bubTag = totenSonntag - daysToSeconds(4);
	return machTagesFormat(bubTag);
}

function osterSonntag(myYear) {
	//Gaußsche Osterformel
	var a = myYear % 19;
	var b = myYear % 4;
	var c = myYear % 7;
	var k = Math.floor(myYear / 100);
	var p = Math.floor((8 * k + 13) / 25);
	var q = Math.floor(k / 4);
	var m = (15 + k - p - q) % 30;
	var d = (19 * a + m) % 30;
	var n = (4 + k - q) % 7;
	var e = (2 * b + 4 * c + 6 * d + n) % 7;
	var ostern = 22 + d + e;
	var abzug = 305 - ostern + 1;
	var abzugSec = daysToSeconds(abzug);
	var silvesterEpoch = makeEpoch(myYear+"1231");
	var osoEpoch = silvesterEpoch - abzugSec;
	return osoEpoch;
}

function karFreitag(osoEpo) {
	//Karfreitag = Ostersonntag - 2
	var kfEpoch = osoEpo - daysToSeconds(2);
	return machTagesFormat(kfEpoch);
}

function osterMontag(osoEpo) {
	//Ostermontag = Ostersonntag + 1
	var omEpoch = osoEpo + daysToSeconds(1);
	return machTagesFormat(omEpoch);
}

function himmelFahrt(osoEpo) {
	//Himmelfahrt = Ostersonntag + 39
	var hfEpoch = osoEpo + daysToSeconds(39);
	return machTagesFormat(hfEpoch);
}

function pfingstMontag(osoEpo) {
	//Pfingstmontag = Ostersonntag + 50
	var pmEpoch = osoEpo + daysToSeconds(50);
	return machTagesFormat(pmEpoch);
}

function machTagesFormat(myEpoch) {
	var newd = new Date(myEpoch * 1000);
	var ds = ("00" + (newd.getMonth()+1)).slice (-2)+("00" + newd.getDate()).slice (-2);
	return ds;
}
