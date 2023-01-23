
function plus() {
	document.getElementById("ddtect").style.width = parseInt(document.getElementById("ddtect").style.width) + 1 + "%";
	document.getElementById("disp").innerHTML = 10 - parseInt(document.getElementById("ddtect").style.width);
}

function less() {
	document.getElementById("ddtect").style.width = parseInt(document.getElementById("ddtect").style.width) - 1 + "%";
	document.getElementById("disp").innerHTML = 10 - parseInt(document.getElementById("ddtect").style.width);
}

var index = 0;
var currentfull = 0;

function wopen(win) {
	index++;
	document.getElementById(win).style.display = 'block';
	document.getElementById(win).style.zIndex = index;
	document.getElementById(win + "o").style.height ='40px';
	document.getElementById(win + "c").style.height ='0px';
}

function wclose(win) {
	document.getElementById(win).style.display = 'none';
	document.getElementById(win + "o").style.height ='0px';
	document.getElementById(win + "c").style.height ='40px';
}

function wbring(win) {
	index++;
	document.getElementById(win).style.zIndex = index;
	document.getElementById(win).style.width = null;
	document.getElementById(win).style.opacity = null;
}
function whide(win) {
	document.getElementById(win).style.width = '0';
	document.getElementById(win).style.opacity = '0';
}


function wtoggle(win) {
	elem = document.getElementById(win);
	if(elem.style.height) {
		wmin(win);
	} else {
		wmax(win);
	}
	console.log(currentfull);
	if(currentfull == 0) {
		document.getElementById('mainbar').style.top = '0px';
	} else {
		document.getElementById('mainbar').style.top = '-40px';
	}
}

function wmax(win) {
	document.getElementById(win).style.width = '100%';
	document.getElementById(win).style.height = '100%';
	document.getElementById(win).style.left = '0';
	document.getElementById(win).style.top = '0';
	document.getElementById(win).children[2].innerHTML = '';
	currentfull++;
}
function wmin(win) {
	document.getElementById(win).style.width = null;
	document.getElementById(win).style.height = null;
	document.getElementById(win).style.left = '50px';
	document.getElementById(win).style.top = '50px';
	document.getElementById(win).children[2].innerHTML = '';
	currentfull = currentfull - 1;
}

