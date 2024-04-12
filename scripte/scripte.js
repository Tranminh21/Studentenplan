function showColumn(sw) {
  // bei Handy-Bildschirm wird die Spalte der nicht aktuellen Woche ausgeblendet
  var elements;
  if (sw == 0) {
    elements = document.querySelectorAll(".left-column-color");
  }
  if (sw == 1) {
    elements = document.querySelectorAll(".right-column-color");
  }
  for (var i = 0; i < elements.length; i++) {
    elements[i].style.height = "0px";
  }
}

function resetColumns() {
  // Zuruecksetzen der Zeilenhoehe beider Wochen-Spalten
  var elements = document.querySelectorAll(
    ".left-column-color, .right-column-color"
  );
  for (var i = 0; i < elements.length; i++) {
    elements[i].style.height = "unset";
  }
}

function eraseAllContent() {
  // Bei Nutzung eines statischen HTML-Geruests muessen der Inhalt
  // und die Farbe jedes Ausgabeelements zurueckgesetzt werden
  // weil sonst die alten Inhalte nicht aktualisierter Elemente erhalten
  // bleiben.
  // Beim dynamischen Erstellen des Geruests wird diese Funktion nicht mehr
  // benoetigt und kann in startSelection() auskommentiert werden.
  eraseContent(".lfach");
  eraseContent(".lprof");
  eraseContent(".lraum");
  eraseContent(".rfach");
  eraseContent(".rprof");
  eraseContent(".rraum");
  resetColorAll();
}

function eraseContent(element) {
  var elements = document.querySelectorAll(element);
  for (var i = 0; i < elements.length; i++) {
    elements[i].innerText = "";
  }
}

function resetColorAll() {
  var lcolor = document.querySelectorAll(".left-column-color");
  var rcolor = document.querySelectorAll(".right-column-color");

  // alle Instanzen durchgehen und letzte class (fuer Farbe) loeschen
  for (var x = 0; x < 70; x++) {
    arr = lcolor[x].className.split(" ");
    newarr = arr.slice(0, 3);
    lcolor[x].className = newarr.join(" ");

    arr = rcolor[x].className.split(" ");
    newarr = arr.slice(0, 3);
    rcolor[x].className = newarr.join(" ");
  }
}

function getScreenOrientation() {
  actWidth = window.outerWidth;
  //wenn Handy-Bildschirm
  if (window.outerWidth + 90 < window.outerHeight) {
    showColumn(evenOrNotEvenNow());
  } else {
    resetColumns();
  }
  if (actWidth != oldWidth) gotoWeekday();
  {
    oldWidth = actWidth;
  }
}

window.addEventListener("resize", function () {
  getScreenOrientation();
});

function countLvs(dataArray) {
  var rows = 0;
  for (var i = 0; i < dataArray.length; i++) {
    if (dataArray[i] == "BEGIN:VEVENT") {
      rows++;
    }
  }
  return rows;
}

function loadLessonPlan() {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      var text = xhttp.responseText;

      // alles in dataArray schreiben
      // Trenner sind Zeilenumbrueche
      dataArray = text.split(/\n|\r\n/g);

      //Tabs loeschen
      for (var i = 0; i < dataArray.length; i++) {
        dataArray[i] = dataArray[i].replace(/\t/g, "");
      }

      clearLessonPlan(dataArray);
    }
  };
  xhttp.open("GET", inputFile, true);
  xhttp.send();
}

function clearLessonPlan(dataArray) {
  var rows = countLvs(dataArray);
  var columns = 64;
  lvArray = create2dArr(rows, columns);
  var lvaRows = 0;
  var lvaColumns = 0;
  var write = 0;
  var excounter;

  // nur relevante Zeilen in lvArray schreiben
  // von BEGIN:VEVENT bis END:VEVENT
  for (var i = 0; i < dataArray.length; i++) {
    if (dataArray[i] == "BEGIN:VEVENT") {
      write = 1;
      excounter = 0;
    }
    if (write == 1) {
      if (dataArray[i].substring(0, 6) != "EXDATE") {
        //sinnlose und leere Zeilen nicht beachten
        if (
          dataArray[i] != "" &&
          dataArray[i] != "OPAL | HTW Dresden" &&
          dataArray[i] != "OnlineOPAL | HTW Dresden"
        ) {
          lvArray[lvaRows][lvaColumns] = String(dataArray[i]);
          lvaRows++;
        }
      } else {
        if (excounter < 2 && checkHollydays(dataArray[i]) == 0) {
          excounter++;
          lvArray[lvaRows][lvaColumns] = String(dataArray[i]);
          lvaRows++;
        }
      }
    }
    if (dataArray[i] == "END:VEVENT") {
      write = 0;
      lvaRows = 0;
      lvaColumns++;
    }
  }
  writeToGrid(lvArray, lvaColumns, lvaRows);
}

function writeToGrid(lvArray, lvaColumns, lvaRows) {
  var lfach = document.querySelectorAll(".lfach");
  var lprof = document.querySelectorAll(".lprof");
  var lraum = document.querySelectorAll(".lraum");
  var lcolor = document.querySelectorAll(".left-column-color");
  var rfach = document.querySelectorAll(".rfach");
  var rprof = document.querySelectorAll(".rprof");
  var rraum = document.querySelectorAll(".rraum");
  var rcolor = document.querySelectorAll(".right-column-color");

  for (var l = 0; l < lvaColumns; l++) {
    var daynr = getWeekday(l, lvArray);
    var st = starttimeLV(l, lvArray);
    var et = endtimeLV(l, lvArray);
    var stt = getTimex(st);
    var ett = getTimex(et);
    var lvnr = getLVNumber(stt);
    var lvnrend = getLVNumberEnd(ett);
    var zi = daynr * 7 + lvnr;
    var std = getDatex(st);
    var module = getModulNr(l, lvArray);

    // Wochennummer
    var wnr = calendarWeek(
      std.substring(0, 4),
      std.substring(4, 6),
      std.substring(6, 8)
    );
    // Wochennummer gerade/ungerade
    var ww = evenOrNotEven(wnr);
    // Turnus
    var delay = weekDelay(l, lvArray);
    lvcolor = getLVColor(getLVName(l, lvArray).trim());
    rvcolor = lvcolor;

    // falls LVs über mehrere Stunden gehen
    for (var w = lvnr; w <= lvnrend; w++) {
      // jede Woche
      if (delay == 1) {
        lfach[zi].innerText =
          getModulNr(l, lvArray) + " " + getLVName(l, lvArray);
        rfach[zi].innerText =
          getModulNr(l, lvArray) + " " + getLVName(l, lvArray);
        lraum[zi].innerText = getRoom(l, lvArray);
        lprof[zi].innerText = getProf(l, lvArray);
        rprof[zi].innerText = getProf(l, lvArray);
        rraum[zi].innerText = getRoom(l, lvArray);

        lcolor[2 * zi].className += " " + lvcolor;
        lcolor[2 * zi + 1].className += " " + lvcolor;
        rcolor[2 * zi].className += " " + rvcolor;
        rcolor[2 * zi + 1].className += " " + rvcolor;
      }

      // aller 2 Wochen
      if (delay == 2) {
        // ungerade, links
        if (ww == 1) {
          lfach[zi].innerText =
            getModulNr(l, lvArray) + " " + getLVName(l, lvArray);
          lraum[zi].innerText = getRoom(l, lvArray);
          lprof[zi].innerText = getProf(l, lvArray);
          lcolor[2 * zi].className += " " + lvcolor;
          lcolor[2 * zi + 1].className += " " + lvcolor;
        } else {
          // gerade, rechts
          rfach[zi].innerText =
            getModulNr(l, lvArray) + " " + getLVName(l, lvArray);
          rraum[zi].innerText = getRoom(l, lvArray);
          rprof[zi].innerText = getProf(l, lvArray);
          rcolor[2 * zi].className += " " + rvcolor;
          rcolor[2 * zi + 1].className += " " + rvcolor;
        }
      }
      zi++;
    } //for w
  } //for l
  printTitle(lvArray);
}

function getWeekdayName(col, lvArray) {
  var wDay = lvArray[6][col];
  var words = wDay.split("=");
  var x = words[4];
  return x;
}

function getWeekday(col, lvArray) {
  var wDay = lvArray[6][col];
  var words = wDay.split("=");
  var x = words[4];
  if (x == "MO") x = "0";
  if (x == "TU") x = "1";
  if (x == "WE") x = "2";
  if (x == "TH") x = "3";
  if (x == "FR") x = "4";
  return x;
}

function getLVNumber(inTime) {
  var startTime = ["0730", "0920", "1110", "1320", "1510", "1700", "1840"];
  for (var i = 0; i < 7; i++) {
    if (inTime == startTime[i]) return i;
    //Gremien-Blockzeit
    if (inTime == "1500") return 4;
    if (inTime == "1830") return 6;
  }
}

function getLVNumberEnd(inTime) {
  var endTime = ["0900", "1050", "1240", "1450", "1640", "1830", "2010"];
  for (var i = 0; i < 7; i++) {
    if (inTime == endTime[i]) return i;
    //Gremien-Blockzeit
    if (inTime > 2010) return 6;
  }
}

function makeEpoch(somedate) {
  //gibt den Abstand zwischen zwei Kalender-Daten in s zurueck
  var fdateyear = somedate.substring(0, 4);
  var fdatemonth = somedate.substring(4, 6);
  var fdateday = somedate.substring(6, 8);
  var myDate = new Date(fdateyear + "-" + fdatemonth + "-" + fdateday);
  return myDate.getTime() / 1000.0;
}

function weekDelay(col, lvArray) {
  //Wochenturnus einer LV
  //aller 2 Wochen return 2
  //jede Woche return 1
  var ret = 0;
  fdate = lvArray[7][col].substring(26, 34);
  fdateEpoch = makeEpoch(fdate);
  sdate = lvArray[8][col].substring(26, 34);
  sdateEpoch = makeEpoch(sdate);
  diffEpoch = sdateEpoch - fdateEpoch;
  days = diffEpoch / 3600 / 24;
  if (days % 14 == 0) ret = 2;
  else ret = 1;
  return ret;
}

function starttimeLV(col, lvArray) {
  //gibt die Startzeit einer LV zurueck
  //20230328T151001
  sTime = lvArray[4][col];
  words = sTime.split(":");
  var x = words[1];
  var y = x.substring(0, 13);
  return y;
}

function endtimeLV(col, lvArray) {
  //gibt die Endzeit einer LV zurueck
  //20230328T151001
  eTime = lvArray[5][col];
  words = eTime.split(":");
  var x = words[1];
  var y = x.substring(0, 13);
  return y;
}

function getDatex(inputstring) {
  //gibt das Datum zurueck
  //20230328T151001 -> 20230328
  words = inputstring.split("T");
  var x = words[0];
  return x;
}

function getTimex(inputstring) {
  //gibt die Uhrzeit zurueck
  //20230328T151001 -> 151001
  words = inputstring.split("T");
  var x = words[1];
  return x;
}

function getLVName(col, lvArray) {
  //gibt den Namen einer LV zurueck
  lvName = lvArray[3][col];
  if (lvName.includes("|")) {
    words = lvName.split("|");
    var x = words[0];
    var y = x.split(":");
    lv = y[1];
  } else {
    words = lvName.split(":");
    lv = words[1];
  }
  return lv;
}

function getRoom(col, lvArray) {
  //gibt die Raumnummer zurueck
  rName = lvArray[9][col];
  words = rName.split(":");
  if (words.length > 1) {
    var x = words[1];
    var y = x.split("|");
    ro = y[0];
    if (ro.includes("Online")) ro = "Online";
    return ro;
  } else {
    return 0;
  }
}

function getProf(col, lvArray) {
  //gibt den Namen des Prof. zurueck
  profName = lvArray[10][col];
  words = profName.split("|");
  if (words.length > 1) {
    var x = words[1];
    return x;
  } else {
    return "";
  }
}

function getModulNr(col, lvArray) {
  //gibt die Modulnr. zurueck
  modNr = lvArray[10][col];
  words = modNr.split(":");
  var x = words[1];
  var y = x.split(" ");
  if (y.length > 1) {
    return y[0];
  } else {
    return "";
  }
}

function create2dArr(x, y) {
  //Hilfsfunktion zur Erstellung eines 2-dimensionalen Arrays
  var arr = [[]];
  for (var i = 0; i < y; i++) {
    arr[i] = [];
  }
  return arr;
}

function evenOrNotEvenNow() {
  //Test der aktuellen Kalenderwoche auf gerade oder ungerade
  return calendarWeek() % 2;
}

function evenOrNotEven(week) {
  //Test einer bestimmten Kalenderwoche auf gerade oder ungerade
  return week % 2;
}

function removeClass(elem, ind, cn) {
  // Loeschen einer class im CSS
  elem[2 * ind].className = elem[2 * ind].className.replace(cn, "");
  elem[2 * ind + 1].className = elem[2 * ind + 1].className.replace(cn, "");
}

function closeMenu() {
  document.getElementById("head").style.width = "0";
}

function openMenu() {
  if (document.getElementById("head").offsetWidth != 0) {
    closeMenu();
  } else {
    document.getElementById("head").style.width = "100%";
  }
}

function openMenuOnly() {
  document.getElementById("head").style.width = "100%";
}
