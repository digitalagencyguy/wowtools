//Various commonly referenced nodes
var scene=document.getElementById("builder-canvas"),
	sBtn=document.getElementById("start-button"),
	frame=document.getElementById("builder-frame");

//Draggable items data
var moduleData=[
		{
			name:"message",
			w:28,
			h:8,
			dom:document.getElementById("shadow-rect"),
			module:Message
		},
		{
			name:"wait",
			w:10,
			h:8,
			dom:document.getElementById("shadow-rhombus"),
			module:Wait
		},
		{
			name:"joiner",
			w:8,
			h:8,
			dom:document.getElementById("shadow-circle"),
			module:Joiner
		}
	],
	moveData=null;

//Canvas variables
var em=16,
	cOffset={
		x:-250,
		y:-10
	},
	curOffs=[];

//Graph data structure
var seq=new Sequence(sBtn);
sBtn.treeNode=seq;

//Mouse/touch events
var pressed=false,
	prevCoords=[0,0],
	prevRecord=[0,0],
	canDrag;

//Reroute event handlers
var route={
		none:{},
		dragScene:{
			context:scene,
			down:function(evt){
				prevCoords=pxToEm(getCoords(evt));
			},
			drag:dragScene
		},
		dragButton:{
			drag:dragButton,
			up:dropButton
		},
		dragModule:{
			drag:dragModule,
			up:dropModule
		}
	},
	routeMode=route.dragScene;

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
				moveData.dom.border=true;
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
}

//Event handlers
function down(evt){
	pressed=true;
	canDrag=checkDraggable(evt);
	if (routeMode.down)
		routeMode.down(evt);
}

function move(evt){
	if (pressed&&canDrag)
		drag(evt);
	if (routeMode.move)
		routeMode.move(evt);
}

function drag(evt){
	//Update prevRecord
	getCoords(evt);
	scene.classList.add("dragging");
	if (routeMode.drag)
		routeMode.drag(evt);
}

function up(evt){
	pressed=false;
	scene.classList.remove("dragging");
	if (routeMode.up)
		routeMode.up(evt);
	clearCE();
}

function checkDraggable(evt){
	if (!routeMode.context) return true;
	var elem=evt.target;
	while (elem.tagName!="BODY"){
		if (elem==routeMode.context)
			return true;
		if (!elem.classList.contains("inert"))
			return false;
		elem=elem.parentElement;
	}
	return false;
}

//Get coordinates
function getCoords(evt){
	//We use prevRecord because touchend doesn't provide coordinates
	//whereas mouseup does and we need consistency.
	if (evt.touches&&evt.touches.length==0)
		return prevRecord;
	var arr=[(evt.touches || [evt])[0].clientX,(evt.touches || [evt])[0].clientY];
	prevRecord=arr;
	return arr;
}

//Get coordinates - relative to the graph area (or a specified element)
function getCoordsOffs(evt,elem){
	var bcr=(elem || frame).getBoundingClientRect(),
		arr=getCoords(evt);
	return [arr[0]-bcr.left,arr[1]-bcr.top];
}

//BoundingClientRect, but relative to a specified element
function relativeBCR(elem,offset){
	var ebcr=elem.getBoundingClientRect(),
		obcr=offset.getBoundingClientRect();

	var out={};
	for (var i in ebcr)
		out[i]=ebcr[i];

	out.left-=obcr.left;
	out.top-=obcr.top;
	return out;
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
	prevCoords=coords;
}

function dragButton(evt){
	var pos=pxToEm(getCoordsOffs(evt)),
		dom=moveData.dom;

	dom.style.left=(Math.round(pos[0]-cOffset.x%1)+cOffset.x%1-3/em)+"em";
	dom.style.top=(Math.round(pos[1]-cOffset.y%1)+cOffset.y%1)+"em";
	checkValidPlace(moveData.dom);
}

function dropButton(evt){
	var vp=checkValidPlace(moveData.dom);
	moveData.dom.classList.add("popout");
	setTimeout(function(){
		moveData.dom.style.display="none";
		moveData.dom.classList.remove("popout");
		routeMode=route.dragScene;
		if (vp)
			createModule(evt,moveData,vp.treeNode);
	},300);
}

function checkValidPlace(el,onlyOverlap){
	var top=el.getBoundingClientRect().top,
		elems=document.querySelectorAll("#start-button, .module");

	clearCE();
		
	el.classList.add("error");
	for (var i=0;i<elems.length;i++){
		if (elems[i]==el)
			continue;
		if (overlap(el,elems[i]))
			return false;
		if (elems[i].classList.contains("message"))
			continue;
		var bcr=elems[i].getBoundingClientRect(),
			diff=top-(bcr.top+bcr.height);
		if (!onlyOverlap&&diff<(el.border?-1:0)*em)
			return false;
	}
	var ce=getClosestElem(el);
	if (!ce)
		return false;
	el.classList.remove("error");
	return ce;
}

function checkOverlap(elem,ignore,ignore2){
	var elems=document.querySelectorAll("#start-button, .module");
	for (var i=0;i<elems.length;i++){
		if (elems[i]==ignore||elems[i]==ignore2)
			continue;
		if (overlap(elem,elems[i],true))
			return false;
	}
	return true;
}

function overlap(elem,elem2,shortTest){
	var rect=elem.getBoundingClientRect(),rect2=elem2.getBoundingClientRect();
	var top=Math.max(rect.top,rect2.top),
	  	bottom=Math.min(rect.bottom,rect2.bottom),
	  	left=Math.max(rect.left,rect2.left),
	  	right=Math.min(rect.right,rect2.right);
  if (shortTest&&top<bottom&&left<right)
  	return true;
  var maxSpacing=(2-(elem.border?1:0)-(elem2.border?1:0))*em;
  if (!shortTest&&top-bottom<maxSpacing&&left-right<maxSpacing) return true;
  return false
}

function checkInLine(){

}


function getClosestElem(elem){
	var elems=document.querySelectorAll("#start-button, .module"),
		bcr=elem.getBoundingClientRect(),
		candidates=[],
		finalCand=null,
		minLen=Infinity;

	//Find candidates by vertical position
	main:
	for (var i=0;i<elems.length;i++){
		if (elems[i]==elem)
			continue;
		var ebcr=elems[i].getBoundingClientRect(),
			data={
				dom:elems[i],
				vert:bcr.top-(ebcr.top+ebcr.height)
			},
			minSpacing=(2-(elem.border?1:0)-(elems[i].border?1:0))*em;
		if (data.vert>=minSpacing)
			candidates.push(data);
	}

	//Create an element and check if it can be placed between the two modules
	//without overlapping other elements,and if it does, it means a line can 
	//be drawn there.
	var testItem=document.createElement("div");
	testItem.id="testdiv";
	document.body.appendChild(testItem);
	for (var i=0;i<candidates.length;i++){
		var cbcr=candidates[i].dom.getBoundingClientRect(),
			halves=[bcr.left+bcr.width/2,cbcr.left+cbcr.width/2],
			w=Math.abs(halves[0]-halves[1]),
			h=candidates[i].vert;

		testItem.style.top=(cbcr.top+cbcr.height)+"px";
		testItem.style.left=Math.min.apply(this,halves)+"px";
		testItem.style.width=w+"px";
		testItem.style.height=h+"px";

		if (checkOverlap(testItem,candidates[i].dom,elem)&&Math.hypot2(w,h)<minLen){
			finalCand=candidates[i].dom;
			minLen=Math.hypot2(w,h);
		}
	}
	document.body.removeChild(testItem);

	if (finalCand){
		finalCand.classList.add("closest-elem");
		var guide=document.getElementById("guideline"),
			bcr=relativeBCR(finalCand,scene);
		guide.style.display="block";
		guide.style.top=Math.round((bcr.top+bcr.height/2)/em)+"em";
		guide.style.left=Math.round((bcr.left+bcr.width/2)/em)+"em";
		return finalCand;
	}
	return null;
}

function clearCE(){
	var closest=document.getElementsByClassName("closest-elem")[0];
	if (closest) closest.classList.remove("closest-elem");
	document.getElementById("guideline").style.display="none";
}

function connectPoints(){
	var svg=document.getElementById("line-area");
	svg.innerHTML="";
	connectModules(svg,seq);
}

function connectModules(svg,module){
	if (!module.children.length)
		return;

	var mbcr=relativeBCR(module.dom,scene),
		output=pxToEm([mbcr.left+mbcr.width/2,mbcr.top+mbcr.height-(module.dom.border?em:0)]).map(Math.round),
		connections=[],
		minTop=Infinity,
		minLeft=Infinity,
		maxRight=0;

	//Calculate connection points
	for (var i=0;i<module.children.length;i++){
		var bcr=relativeBCR(module.children[i].dom,scene),
			coords=pxToEm([bcr.left+bcr.width/2,bcr.top+(module.children[i].dom.border?em:0)]).map(Math.round);
		if (coords[1]<minTop)
			minTop=coords[1];

		connections.push(coords);
	}

	for (var i=0;i<connections.length;i++){
		var ci=connections[i][0];
		if (ci>maxRight)
			maxRight=ci;
		if (ci<minLeft)
			minLeft=ci;
	}

	if (module.children.length==1)
		drawPath(svg,output,connections[0]);
	else{
		var middle=output[1]+Math.round((minTop-output[1])/2);
		drawPath(svg,output,[output[0],middle]);
		drawPath(svg,[minLeft,middle],[maxRight,middle],[true,true]);
		for (var i=0;i<connections.length;i++){
			drawPath(svg,[connections[i][0],middle],connections[i],[true,false]);
		}
	}

	for (var i=0;i<module.children.length;i++){
		connectModules(svg,module.children[i]);
	}
}

function drawPath(svg,c1,c2,noDots){
	noDots=noDots || [false,false];
	if (!noDots[0])
		drawCircle(svg,c1);
	if (!noDots[1])
		drawCircle(svg,c2);
	var path=document.createElementNS("http://www.w3.org/2000/svg","path"),
		d="M"+c1[0]+" "+c1[1];

	if (c1[0]!=c2[0]&&c1[1]!=c2[1]){
		var offs=Math.round((c2[1]-c1[1])/2);
		d+="L"+c1[0]+" "+(c1[1]+offs);
		d+="L"+c2[0]+" "+(c1[1]+offs);
	}

	d+="L"+c2[0]+" "+c2[1];
	path.setAttribute("d",d);
	svg.appendChild(path);
}

function drawCircle(svg,coords){
	var c=document.createElementNS("http://www.w3.org/2000/svg","circle");
	c.setAttribute("cx",coords[0]);
	c.setAttribute("cy",coords[1]);
	c.setAttribute("r",0.25);
	svg.appendChild(c);
}

Math.hypot2=function(a,b){
	return Math.sqrt(a*a+b*b);
};


//----------------------MODULES----------------------

function Sequence(dom){
	this.children=[];
	this.dom=dom;
	this.parent=null;
}

function createModule(evt,md,parent){
	var module=new md.module();
	module.build(createWrapper(evt,md));
	module.parent=parent;
	module.children=[];
	module.dom.treeNode=module;
	parent.children.push(module);
	connectPoints();
}

function createWrapper(evt,md){
	var coords=pxToEm(getCoordsOffs(evt,scene)),
		wrapper=document.createElement("div");

	wrapper.className="module "+md.name;
	wrapper.style.left=(Math.round(coords[0])-md.w/2)+"em";
	wrapper.style.top=(Math.round(coords[1])-md.h/2)+"em";

	wrapper.addEventListener("mousedown",pickup);

	function pickup(evt){
		curOffs=pxToEm(getCoordsOffs(evt,wrapper)).map(Math.round);
		moveData={dom:wrapper};
		wrapper.style.zIndex="10000";
		routeMode=route.dragModule;
	}

	scene.appendChild(wrapper);
	return wrapper;
}

function Message(){
	this.build=function(wrapper){
		var box=document.createElement("div");
		box.className="msg-box blue-border";
		wrapper.appendChild(box);
		var content=document.createElement("div");
		content.className="msg-content";
		content.setAttribute("contenteditable","");
		box.appendChild(content);
		var btn=document.createElement("div");
		btn.className="settings-button rounded";
		wrapper.appendChild(btn);
		this.dom=wrapper;
	};
}

function Wait(){
	this.build=function(wrapper){
		wrapper.border=true;
		wrapper.innerHTML=document.getElementById("rhombus-buffer").innerHTML;
		var btn=document.createElement("div");
		btn.className="settings-button circle";
		btn.onclick=function(){alert("GOT HERE!");}
		wrapper.appendChild(btn);
		this.dom=wrapper;
	};
}

function Joiner(){
	this.build=function(wrapper){
		wrapper.classList.add("blue-border");
		var btn=document.createElement("div");
		btn.className="settings-button circle";
		wrapper.appendChild(btn);
		this.dom=wrapper;
	};
}

function dragModule(evt){
	var offset=pxToEm(getCoordsOffs(evt,scene)).map(Math.round);
	moveData.dom.style.left=offset[0]-curOffs[0]+"em";
	moveData.dom.style.top=offset[1]-curOffs[1]+"em";
	checkValidPlace(moveData.dom,true);
	connectPoints();
}

function dropModule(evt){
	moveData.dom.style.zIndex=null;
	routeMode=route.dragScene
}

//-------Message specific-------
Message.prototype.addTag=function(type){
	var tag=document.createElement("span");
	tag.className="msg-tag";
	tag.setAttribute("contenteditable",false);
	this.dom.getElementsByClassName("msg-content")[0].appendChild(tag);
};


//-------TO BE EXECUTED LAST ON LOAD-------
addEventListeners();
