var buttonMeta=[];

//Canvas variables
var em=16,
	cOffset={
		x:-250,
		y:-10
	};

//Mouse/touch events
var pressed=false,
	prevCoords=[0,0];

//Reroute event handlers
var route={
		none:{},
		dragScene:{
			down:function(evt){
				prevCoords=pxToEm(getCoords(evt));
			},
			drag:dragScene,
			up:function(){
				scene.classList.remove("dragging");
			}
		}
	},
	routeMode=route.dragScene;

//Various commonly referenced nodes
var scene=document.getElementById("builder-canvas");

//Add event listeners
function addEventListeners(){
	var buttons=document.querySelectorAll(".campaign-builder-controls button");

	document.body.addEventListener("mousedown",down);
	document.body.addEventListener("mousedown",down);
	document.body.addEventListener("mousemove",move);
	document.body.addEventListener("mouseup",up);
	document.body.addEventListener("mouseup",up);
}

//Event handlers
function down(evt){
	pressed=true;
	if (routeMode.down) routeMode.down(evt);
}

function move(evt){
	if (pressed) drag(evt);
	if (routeMode.move) routeMode.move(evt);
}

function drag(evt){
	if (routeMode.drag) routeMode.drag(evt);
}

function up(evt){
	pressed=false;
	if (routeMode.up) routeMode.up(evt);
}

//Get coordinates
function getCoords(evt){
	return [(evt.touches || [evt])[0].clientX,(evt.touches || [evt])[0].clientY];
}

//Get coordinates - relative to the graph area
function getCoordsOffs(evt){
	var bcr=document.getElementById("builder-frame").getBoundingClientRect();
	return [(evt.touches || [evt])[0].clientX-bcr.left,(evt.touches || [evt])[0].clientY-bcr.top];
}

//Convert coordinates in pixels to current em
function pxToEm(coords){
	return [coords[0]*1/em,coords[1]*1/em];
}

function setPrevCoords(evt,map){
	prevCoords=map(evt);
}

function dragScene(evt){
	var coords=pxToEm(getCoords(evt));
	cOffset.x+=coords[0]-prevCoords[0];
	cOffset.y+=coords[1]-prevCoords[1];
	scene.style.left=cOffset.x+"em";
	scene.style.top=cOffset.y+"em";
	scene.classList.add("dragging");
	prevCoords=coords;
}

//-------TO BE EXECUTED LAST ON LOAD-------
addEventListeners();