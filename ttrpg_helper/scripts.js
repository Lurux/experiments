var Notebook = {
	_current: "Notebook",
	_loadToContext: "welcome",
	Players: {
		_loadToContext: "editor",
		_template: {
			HP: 0,
			Exp: 0,
			Stats: {
				Speed: 0,
				Strength: 0,
				Luck: 0,
				Intel: 0
			},
			Items: [
				"Test1",
				"Test2",
				{
					Test1: 1,
					Test2: 2
				}
			]
		},
		Player: {
			HP: 50,
			Exp: 0,
			Stats: {
				Speed: 0,
				Strength: 0,
				Luck: 0,
				Intel: 0
			},
			Items: []
		}
	},
	Places: {
		_template: {
			_loadToContext: "",
			_execOnLoad: "",
		}
	}
};

var contextWindow, navbar;
var current = {}, buildContext = {}, editor = {}, plugin = {};
var editing = false;

window.onload = function() {
	contextWindow = document.getElementById("context");
	navbar = document.getElementById("navbar");

	navigateTo(Notebook._current);
}

// Context

function setContext(context, args = Notebook._current) {
	current.context = context;
	current.arguments = args;
	contextWindow.innerHTML = eval("buildContext." + context + "('" + args + "', " + args + ")");
};

buildContext.editor = function(path, location, firstlevel = true) {
	var name =  path.substr(path.lastIndexOf('.') + 1);
	var details = firstlevel ? "<details open><summary>" : "<details><summary>";
	var content = "";

	if(location.constructor.name == "Object") {
		content += details + name + "</summary>";

		for(var element in location) {
			if(editing || element.charAt(0) != '_') {
				content += buildContext.editor(path + "." + element, location[element], false);
			}
		}

		content += editing ? "<div><i class=\"fas fa-plus\"></i> <input placeholder=\"Add property\" onkeypress=\"editor.addProp(this, event, '" + path + "')\"></div></details>" : "</details>";
	} else if(location.constructor.name == "Array") {
		content += details + name + "</summary>";

		for(var element in location) {
			content += buildContext.editor(path + "[" + element + "]", location[element], false);
		}

		content +=  "<div><i class=\"fas fa-plus\"></i> <input placeholder=\"Add item\" onkeypress=\"editor.addItem(this, event, '" + path + "')\"></div></details>";
	} else {
		content += "<div>" + name + ": <span contenteditable class=\"input\" onkeypress=\"editor.editVal(this, event, '" + path + "')\">" + location + "</span>";
		content += location.constructor.name == "Number" ? " <button onclick=\"editor.decrement(this, 1, '" + path + "')\">-</button> <button onclick=\"editor.decrement(this, -1, '" + path + "')\">+</button>" : " <button>" + location.constructor.name + "</button>";
		content += editing ? " <button onclick=\"editor.remove(this, '" + path + "')\">Remove</button></div>" : "</div>";
	}

	return content;
}

buildContext.welcome = function(path, location) {
	return "<div><b>Welcome to this TTRPG Helper !</b></div><div>You are currently visiting location: " + path.substr(path.lastIndexOf('.') + 1) + "</div>";
}

// Navbar

function navigateTo(path) {
	Notebook._current = path;
	var location = eval(path);

	navbar.innerHTML = buildNavbar(path, location);

	if(location._loadToContext) {
		setContext(location._loadToContext);
	} else {
		setContext(current.context);
	}
};

function buildNavbar(path, location) {
	if(path != "Notebook") {
		var content = "<button onclick=\"navigateTo('" + path.substr(0, path.lastIndexOf('.')) + "')\"><i class=\"fas fa-arrow-left\"></i> Back</button>";
	} else {
		var content = "<div><i class=\"fas fa-book\"></i> Home</div>";	
	}

	for(var element in location) {
		if(editing || element.charAt(0) != '_') {
			if(location[element].constructor.name == "Object") {
				content += "<button onclick=\"navigateTo('" + path + "." + element + "')\">" + element + "</button>";
			}
		}
	}

	if(editing) {
		content += "<div><i class=\"fas fa-plus\"></i> <input placeholder=\"Add object\" onkeypress=\"editor.addObj(this, event, '" + path + "')\"></div>";
	}

	return content;
};

// Content editors

editor.addObj = function(elm, event, path) {
	if(event.key == "Enter") {
		eval(path + "." + elm.value + " = " + path + "._template || {}");
		reloadContext();
	}
}

editor.addProp = function(elm, event, path) {
	if(event.key == "Enter") {
		eval(path + "." + elm.value + " = 0");
		elm.parentElement.insertAdjacentHTML("beforebegin", buildContext.editor(path + "." + elm.value, 0));
	}
}

editor.addItem = function(elm, event, path) {
	if(event.key == "Enter") {
		var location = eval(path);
		var value = isNaN(elm.value) ? elm.value : Number(elm.value);

		location.push(value); // modification on location only works for objects

		elm.parentElement.insertAdjacentHTML("beforebegin", buildContext.editor(path + "[" + (location.length - 1) + "]", value));
		elm.parentElement.classList.remove("unsaved");
		elm.value = "";
	} else {
		elm.parentElement.classList.add("unsaved");
	}
}

editor.editVal = function(elm, event, path) {
	if(event.key == "Enter") {
		if(elm.innerHTML == "" && /]$/.test(path)) {
			eval("delete " + path);	// leaves blank element in arrays, but allows skipping element reload
			elm.parentElement.remove();
		} else {
			var value = isNaN(elm.innerHTML) ? elm.innerHTML : Number(elm.innerHTML);
			eval(path + " = " + JSON.stringify(value)); // Gotcha ! Is this eficient, though ?

			elm.parentElement.outerHTML = buildContext.editor(path, value); // Gotcha again
		}
	} else {
		elm.parentElement.classList.add("unsaved");
	}
}

editor.decrement = function(elm, num, path) {
	eval(path + " -= " + num); //number
	elm.parentElement.children[0].innerHTML -= num; // Decrement to avoid concatenating
}

editor.remove = function(elm, path) {
	eval("delete " + path);
	elm.parentElement.remove();
}

// Plugins

plugin.dice = {};
plugin.dice.rolls = "";
plugin.dice.sum = 0;

plugin.dice.roll = function(num) {
	var result = document.getElementById("plugin-dice-result");
	var rolls = document.getElementById("plugin-dice-rolls");
	var roll = Math.floor(Math.random() * num) + 1;

	if( plugin.dice.rolls ) {
		plugin.dice.rolls += " + " + roll;
		rolls.innerHTML = plugin.dice.rolls;
		rolls.style.display = "block";
	} else {
		plugin.dice.rolls += roll;
		rolls.style.display = "none";
	}

	plugin.dice.sum += roll;
	result.innerHTML = plugin.dice.sum;

	result.classList.remove("flash");
	result.offsetWidth; // Reflow
	result.classList.add("flash");
	result.classList.add("reroll");

	clearTimeout(plugin.dice.timeout);

	plugin.dice.timeout = setTimeout( function() {
		plugin.dice.rolls = "";
		plugin.dice.sum = 0;
		result.classList.remove("reroll");
	}, 1000);
}

// Misc.

function toggleEdit() {
	editing = !editing;
	button = document.getElementById("edit")

	button.classList.toggle("editing");
	button.children[0].classList.toggle("fa-toggle-off");
	button.children[0].classList.toggle("fa-toggle-on");

	reloadContext();
}

function reloadContext() {
	contextWindow.innerHTML = eval("buildContext." + current.context + "('" + current.arguments + "', " + current.arguments + ")");
	navbar.innerHTML = buildNavbar(Notebook._current, eval(Notebook._current));
}
