//Various commonly referenced nodes
var scene=document.getElementById("builder-canvas");

//Draggable items data
var moduleData=[
		{
			w:26,
			h:8,
			dom:document.getElementById("shadow-rect"),
			module:null
		},
		{
			w:8,
			h:6,
			dom:document.getElementById("shadow-rhombus"),
			module:null
		},
		{
			w:8,
			h:8,
			dom:document.getElementById("shadow-circle"),
			module:null
		}
	],
	moveData=null;

//Scene variables
var buttonMeta=[];

//Canvas variables
var em=16,
	cOffset={
		x:-250,
		y:-10
	},
	curOffs=[];

//Mouse/touch events
var pressed=false,
	prevCoords=[0,0],
	prevRecord=[0,0],
	canDrag;
	};

//Mouse/touch events
var pressed=false,
	prevCoords=[0,0];

//Reroute event handlers
var route={
		none:{},
		dragScene:{
			context:scene,
			down:function(evt){
				prevCoords=pxToEm(getCoords(evt));
			},
			drag:dragScene,
			up:function(){
				scene.classList.remove("dragging");
			}
		},
		dragButton:{
			drag:dragButton,
			up:dropButton
		}
	},
	routeMode=route.dragScene;

//Various commonly referenced nodes
var scene=document.getElementById("builder-canvas");

//Add event listeners
function addEventListeners(){
	var buttons=document.querySelectorAll(".campaign-builder-controls button");

	for (var i=0;i<buttons.length;i++){
		(function(index){
			buttons[index].addEventListener("mousedown",selectButton);
			buttons[index].addEventListener("touchstart",selectButton);

			function selectButton(evt){
				moveData=moduleData[index];
				moveData.dom.style.display="block";
				routeMode=route.dragButton;
				dragButton(evt);
			}
		})(i);
	}

	document.body.addEventListener("mousedown",down);
	document.body.addEventListener("touchstart",down);
	document.body.addEventListener("mousemove",move);
	document.body.addEventListener("touchmove",move);
	document.body.addEventListener("mouseup",up);
	document.body.addEventListener("touchend",up);
	document.body.addEventListener("mousedown",down);
	document.body.addEventListener("mousedown",down);
	document.body.addEventListener("mousemove",move);
	document.body.addEventListener("mouseup",up);
	document.body.addEventListener("mouseup",up);
}

//Event handlers
function down(evt){
	pressed=true;
	canDrag=checkDraggable(evt);
	if (routeMode.down) routeMode.down(evt);
}

function move(evt){
	if (pressed&&canDrag) drag(evt);
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

function checkDraggable(evt){
	if (!routeMode.context) return true;
	var elem=evt.target;
	while (elem.tagName!="BODY"){
		if (elem==routeMode.context) return true;
		if (!elem.classList.contains("inert")) return false;
		elem=elem.parentElement;
	}
	return false;
}

//Get coordinates
function getCoords(evt){
	//We use prevRecord because touchend doesn't provide coordinates
	//whereas mouseup does and we need consistency.
	if (evt.touches&&evt.touches.length==0) return prevRecord;
	var arr=[(evt.touches || [evt])[0].clientX,(evt.touches || [evt])[0].clientY];
	prevRecord=arr;
	return arr;
//Get coordinates
function getCoords(evt){
	return [(evt.touches || [evt])[0].clientX,(evt.touches || [evt])[0].clientY];
}

//Get coordinates - relative to the graph area
function getCoordsOffs(evt){
	var bcr=document.getElementById("builder-frame").getBoundingClientRect(),
		arr=getCoords(evt);
	return [arr[0]-bcr.left,arr[1]-bcr.top];
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

function dragButton(evt){
	var pos=pxToEm(getCoordsOffs(evt)),
		dom=moveData.dom;

	dom.style.left=(Math.round(pos[0]-cOffset.x%1+3/em)+cOffset.x%1-3/em)+"em";
	dom.style.top=(Math.round(pos[1]-cOffset.y%1)+cOffset.y%1)+"em";
	checkValidPlace(moveData.dom);
}

function dropButton(evt){
	moveData.dom.classList.add("popout");
	setTimeout(function(){
		moveData.dom.style.display="none";
		moveData.dom.classList.remove("popout");
		routeMode=route.dragScene;
	},300);
}

function checkValidPlace(el){
	var top=el.getBoundingClientRect().top,
		elems=document.querySelectorAll("#builder-canvas svg + *");

	el.classList.add("error");
	for (var i=0;i<elems.length;i++){
		if (overlap(el,elems[i])>0) return false;
		var bcr=elems[i].getBoundingClientRect();
		if (top<bcr.top+bcr.height) return false;
	}
	el.classList.remove("error");
	return true;
}

function overlap(elem,elem2){
	var rect=elem.getBoundingClientRect(),rect2=elem2.getBoundingClientRect();
	var top=Math.max(rect.top,rect2.top),
	  	bottom=Math.min(rect.bottom,rect2.bottom),
	  	left=Math.max(rect.left,rect2.left),
	  	right=Math.min(rect.right,rect2.right);
  if (top>bottom||left>right) return 0;
  return (right-left)*(bottom-top);
}

//-------TO BE EXECUTED LAST ON LOAD-------
addEventListeners();
