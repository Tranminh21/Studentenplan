function getSpaceItem() {
  var divSpaceItem = document.createElement("div");
  divSpaceItem.className = "space-item grid-item";
  return divSpaceItem;
}

function getSpaceItemFullLine() {
  var divSpaceItemFullLine = document.createElement("div");
  divSpaceItemFullLine.className = "space-item-full-line";
  return divSpaceItemFullLine;
}

function getDayID(day) {
  var divDay = document.createElement("div");
  divDay.id = day;
  return divDay;
}

function getWeekDay(day) {
  var divWeekday = document.createElement("div");
  divWeekday.className = "grid-item weekday";
  divWeekday.innerHTML += `<p class="wd">${day}</p>`;
  return divWeekday;
}

function getUngerade() {
  var divUngerade = document.createElement("div");
  divUngerade.id = "ungerade";
  divUngerade.className = "grid-item";
  divUngerade.innerHTML += "<p>ungerade KW</p>";
  return divUngerade;
}

function getGerade() {
  var divGerade = document.createElement("div");
  divGerade.id = "gerade";
  divGerade.className = "grid-item";
  divGerade.innerHTML += "<p>ungerade KW</p>";
  return divGerade;
}

function getTime(time) {
  var divTime = document.createElement("div");
  divTime.className = "grid-item time-item";
  divTime.innerHTML += `<p>${time}</p>`;
  return divTime;
}

/***********
Left Column
************/
function getLeftItemLeftColumn() {
  var divLeftItemLeftColumn = document.createElement("div");
  divLeftItemLeftColumn.className = "grid-item left-item left-column-color";
  divLeftItemLeftColumn.appendChild(getLeftFach());
  divLeftItemLeftColumn.appendChild(getLeftProf());
  return divLeftItemLeftColumn;
}

function getRightItemLeftColumn() {
  var divRightItemLeftColumn = document.createElement("div");
  divRightItemLeftColumn.className = "grid-item right-item left-column-color";
  divRightItemLeftColumn.appendChild(getLeftRaum());
  return divRightItemLeftColumn;
}

function getLeftFach() {
  var divLeftFach = document.createElement("div");
  divLeftFach.className = "spacer";
  divLeftFach.innerHTML += `<p class="lfach"></p>`;
  return divLeftFach;
}

function getLeftProf() {
  var divLeftProf = document.createElement("div");
  divLeftProf.className = "spacer";
  divLeftProf.innerHTML += `<p class="lprof">`;
  return divLeftProf;
}

function getLeftRaum() {
  var divLeftRaum = document.createElement("div");
  divLeftRaum.className = "spacer";
  divLeftRaum.innerHTML += `<p class="lraum">`;
  return divLeftRaum;
}

/***********
Right Column
************/
function getLeftItemRightColumn() {
  var divLeftItemRightColumn = document.createElement("div");
  divLeftItemRightColumn.className = "grid-item left-item right-column-color";
  divLeftItemRightColumn.appendChild(getRightFach());
  divLeftItemRightColumn.appendChild(getRightProf());
  return divLeftItemRightColumn;
}

function getRightItemRightColumn() {
  var divRightItemRightColumn = document.createElement("div");
  divRightItemRightColumn.className = "grid-item right-item right-column-color";
  divRightItemRightColumn.appendChild(getRightRaum());
  return divRightItemRightColumn;
}

function getRightFach() {
  var divRightFach = document.createElement("div");
  divRightFach.className = "spacer";
  divRightFach.innerHTML += `<p class="rfach"></p>`;
  return divRightFach;
}

function getRightProf() {
  var divRightProf = document.createElement("div");
  divRightProf.className = "spacer";
  divRightProf.innerHTML += `<p class="rprof">`;
  return divRightProf;
}

function getRightRaum() {
  var divRightRaum = document.createElement("div");
  divRightRaum.className = "spacer";
  divRightRaum.innerHTML += `<p class="rraum">`;
  return divRightRaum;
}
