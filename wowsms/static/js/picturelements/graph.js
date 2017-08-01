//Various commonly referenced nodes
var scene=document.getElementById("builder-canvas"),
	sBtn=document.getElementById("start-button-wrapper"),
	frame=document.getElementById("builder-frame");

//Draggable items data
var moduleData=[
		{
			name:"message",
			w:30,
			h:10,
			dom:document.getElementById("shadow-rect"),
			module:Message,
			preventEvents:true
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
			w:10,
			h:10,
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
var seq=new Sequence(sBtn),
	verticals=[];
sBtn.treeNode=seq;

//Misc module vars
var validTags=["firstname","First Name","lastname","Last Name","date/time","Date/Time","company","Company"];

//Mouse/touch events
var pressed=false,
	prevCoords=[0,0],
	prevRecord=[0,0],
	canDrag,
	oldMode,
	editMode="move";

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
		},
		resizeMessage:{
			drag:resizeMessage,
			up:endResize
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
				setEditMode("move");
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
	document.body.addEventListener("dblclick",dblclick);
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
	document.body.classList.add("mobile-drag");
	evt.preventDefault();
	if (routeMode.drag)
		routeMode.drag(evt);
}

function up(evt){
	pressed=false;
	scene.classList.remove("dragging");
	document.body.classList.remove("mobile-drag");
	if (routeMode.up)
		routeMode.up(evt);
	clearCE();
}

function dblclick(evt){
	if (editMode=="remove")
		removeElem(evt);
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

	dom.style.left=(Math.round(pos[0]-cOffset.x%1)+cOffset.x%1)+"em";
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
		elems=document.getElementsByClassName("module");

	clearCE();
		
	el.classList.add("error");
	for (var i=0;i<elems.length;i++){
		if (elems[i]==el)
			continue;
		if (overlap(el,elems[i]))
			return false;
		if (elems[i].classList.contains("message"))
			continue;
		/*var bcr=elems[i].getBoundingClientRect(),
			diff=top-(bcr.top+bcr.height);
		if (!onlyOverlap&&diff<-1*em)
			return false;*/
	}

	var ce=getClosestElem(el);
	if (!ce)
		return false;
	el.classList.remove("error");
	return ce;
}

function checkOverlap(elem,ignore,ignore2){
	var elems=document.getElementsByClassName("module");
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
  var maxSpacing=0;
  if (!shortTest&&top-bottom<maxSpacing&&left-right<maxSpacing) return true;
  return false
}

function checkInLine(){

}

function getClosestElem(elem){
	var elems=document.getElementsByClassName("module"),
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
			}
		if (data.vert>=0)
			candidates.push(data);
	}

	//Create an element and check if it can be placed between the two modules
	//without overlapping other elements. If it does, it means a line can 
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

function checkSlices(module){
	module.dom.classList.remove("error");
	var allClear=checkSlice(module);
	for (var i=0;i<module.children.length;i++){
		allClear&=checkSlices(module.children[i]);
	}
	return allClear;
}

function checkSlice(module){
	if (!module.coordinates)
		return true;
	var minX=module.coordinates[0],
		maxX=module.coordinates[0]+module.size[0],
		bottom=module.coordinates[1]+module.size[1]-1,
		slices=[];
	for (var i=0;i<verticals.length;i++){
		var vertX=verticals[i][0][0];
		if (vertX<=minX||vertX>=maxX)
			continue;
		var y1=Math.max(verticals[i][0][1],module.coordinates[1]+1),
			y2=Math.min(verticals[i][1][1],bottom);

		if (y1>=module.coordinates[1]&&y2<=bottom&&y2-y1>0){
			module.dom.classList.add("error");
			return false;
		}
	}
	return true;
}

function clearCE(){
	var closest=document.getElementsByClassName("closest-elem")[0];
	if (closest) closest.classList.remove("closest-elem");
	document.getElementById("guideline").style.display="none";
	scene.classList.remove("graph-error");
}

function connectPoints(){
	var svg=document.getElementById("line-area");
	verticals=[];
	svg.innerHTML="";
	connectModules(svg,seq);
}

function connectModules(svg,module){
	if (!module.children.length)
		return;

	var mbcr=relativeBCR(module.dom,scene),
		output=pxToEm([mbcr.left+mbcr.width/2,mbcr.top+mbcr.height-em]).map(Math.round),
		connections=[],
		minTop=Infinity,
		minLeft=output[0],
		maxRight=output[0];

	//Calculate connection points
	for (var i=0;i<module.children.length;i++){
		var bcr=relativeBCR(module.children[i].dom,scene),
			coords=pxToEm([bcr.left+bcr.width/2,bcr.top+em]).map(Math.round);
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
		verticals.push([c1,[c1[0],c1[1]+offs]]);
		d+="L"+c2[0]+" "+(c1[1]+offs);
		verticals.push([[c2[0],c1[1]+offs],c2]);
	}else if (c1[1]!=c2[1])
		verticals.push([c1,c2]);

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


//-----------utils-----------

Math.hypot2=function(a,b){
	return Math.sqrt(a*a+b*b);
};

Array.clone=function(arr){
	var out=[];
	for (var i=0;i<arr.length;i++){
		out.push(Array.isArray(arr[i])?Array.clone(arr[i]):arr[i]);
	}
	return out;
};


//----------------------MODULES----------------------

function Sequence(dom){
	this.children=[];
	this.dom=dom;
	this.parent=null;
}

function createModule(evt,md,parent){
	var module=new md.module();
	module.build(createWrapper(evt,md,module));
	module.parent=parent;
	module.children=[];
	module.dom.treeNode=module;
	parent.children.push(module);
	connectPoints();
}

function addFA(iconData){
	var iElem=document.createElement("i");
	iElem.className="fa "+iconData;
	console.log(iElem);
	return iElem;
}

function createWrapper(evt,md,module){
	var coords=pxToEm(getCoordsOffs(evt,scene)),
		wrapper=document.createElement("div");

	wrapper.className="module standard-module inert "+md.name;
	var x=(Math.round(coords[0])-md.w/2),
		y=(Math.round(coords[1])-md.h/2);
	wrapper.style.left=x+"em";
	wrapper.style.top=y+"em";
	module.coordinates=[x,y];
	module.size=[md.w,md.h];

	if (!md.preventEvents){
		wrapper.addEventListener("mousedown",function(evt){pickup(evt,module);});
		wrapper.addEventListener("touchstart",function(evt){pickup(evt,module);});
	}

	scene.appendChild(wrapper);
	return wrapper;
}

function pickup(evt,module){
	curOffs=pxToEm(getCoordsOffs(evt,module.dom)).map(Math.round);
	moveData=module;
	module.dom.style.zIndex="10000";
	routeMode=route.dragModule;
	prevCoords=Array.clone(module.coordinates);
	document.body.classList.add("mobile-drag");
}

function Message(){
	this.build=function(wrapper){
		var box=document.createElement("div"),
			module=this;
		box.className="msg-box blue-border";
		wrapper.appendChild(box);
		var content=document.createElement("div");
		content.className="msg-content";
		content.setAttribute("contenteditable","");
		box.appendChild(content);
		var resize=document.createElement("div");
		resize.className="resize";
		resize.addEventListener("mousedown",function(evt){startResize(evt,module);});
		resize.addEventListener("touchstart",function(evt){startResize(evt,module);});
		box.appendChild(resize);
		var btn=document.createElement("div");
		btn.className="settings-button rounded";
		btn.appendChild(addFA("fa-tag fa-lg"));
		wrapper.appendChild(btn);
		var mov=document.createElement("div");
		mov.className="settings-button movebox";
		mov.appendChild(addFA("fa-bars fa-lg"));
		mov.addEventListener("mousedown",function(evt){pickup(evt,module);});
		mov.addEventListener("touchstart",function(evt){pickup(evt,module);});
		wrapper.appendChild(mov);
		this.dom=wrapper;
		this.dom.addEventListener("keydown",function(){
			setTimeout(function(){
				addTag(module);
			},1);
		});
	};

	this.getContent=function(){
		var nodes=this.dom.getElementsByClassName("msg-content")[0].childNodes,
		out="";
		for (var i=0;i<nodes.length;i++){
			if (nodes[i].tagName)
				out+="<"+nodes[i].getAttribute("data-tag")+">";
			else
				out+=nodes[i].data;
		}
		this.plaintext=out;
		return out;
	};
}

function Wait(){
	this.build=function(wrapper){
		wrapper.innerHTML=document.getElementById("rhombus-buffer").innerHTML;
		var btn=document.createElement("div");
		btn.className="settings-button circle";
		btn.appendChild(addFA("fa-cog fa-lg"));
		btn.onclick=function(){alert("GOT HERE!");}
		wrapper.appendChild(btn);
		this.dom=wrapper;
	};
}

function Joiner(){
	this.build=function(wrapper){
		var circle=document.createElement("div");
		circle.className="blue-border inner-circle";
		wrapper.appendChild(circle);
		var btn=document.createElement("div");
		btn.className="settings-button circle";
		btn.appendChild(addFA("fa-cog fa-lg"));
		wrapper.appendChild(btn);
		this.dom=wrapper;
	};
}

function dragModule(evt){
	var offset=pxToEm(getCoordsOffs(evt,scene)).map(Math.round);
	var dx=offset[0]-curOffs[0]-moveData.coordinates[0],
		dy=offset[1]-curOffs[1]-moveData.coordinates[1];

	if (dx||dy){
		moveTree(moveData,dx,dy);
		checkAll(moveData);
	}
}

function checkAll(module){
	if (checkTree(module)){
		connectPoints();
		if (checkSlices(seq)){
			//Make sure the guideline refers to the move object.
			checkValidPlace(module.dom,true);
		}else{
			clearCE();
			scene.classList.add("graph-error");
		}
	}else{
		clearCE();
		scene.classList.add("graph-error");
	}
}

function moveTree(module,dx,dy){
	var mc=module.coordinates;
	mc[0]+=dx;
	mc[1]+=dy;

	module.dom.style.left=mc[0]+"em";
	module.dom.style.top=mc[1]+"em";

	for (var i=0;i<module.children.length;i++){
		moveTree(module.children[i],dx,dy);
	}
}

function checkTree(module){
	var valid=!!checkValidPlace(module.dom,true);
	for (var i=0;i<module.children.length;i++){
		valid&=checkTree(module.children[i]);
	}
	return valid;
}

function dropModule(evt){
	moveData.dom.style.zIndex=null;
	routeMode=route.dragScene
	if (scene.classList.contains("graph-error")){
		var mc=moveData.coordinates;
		moveTree(moveData,prevCoords[0]-mc[0],prevCoords[1]-mc[1]);
		var errors=document.getElementsByClassName("module error");
		for (var i=0;i<errors.length;i++)
			errors[i].classList.remove("error");
		connectPoints();
	}
}

//-------Message specific-------
Message.prototype.addTag=function(type){
	var tag=document.createElement("span");
	tag.className="msg-tag";
	tag.setAttribute("contenteditable",false);
	this.dom.getElementsByClassName("msg-content")[0].appendChild(tag);
};

function addTag(module){
	var ce=module.dom.getElementsByClassName("msg-content")[0];
	for (var i=0;i<validTags.length;i+=2){
		var span=" <span class='green-tag' id='added_span' data-tag='"+validTags[i]+"' contenteditable='false' spellcheck='false'>"+validTags[i+1]+"</span> ",
		reg=new RegExp("(\\s+)?&lt;"+validTags[i]+"&gt;\\1?","gi");
		if (reg.test(ce.innerHTML)){
			var range = document.createRange(),
				sel = window.getSelection();
			ce.innerHTML=ce.innerHTML.replace(reg,span);
			var spanEl=document.getElementById("added_span");
			range.setStart(spanEl.nextSibling,1);
			range.collapse(true);
			sel.removeAllRanges();
			sel.addRange(range);
			spanEl.removeAttribute("id");
		}
	}
}

function startResize(evt,module){
	oldMode=routeMode;
	routeMode=route.resizeMessage;
	moveData={
		module:module,
		startSize:Array.clone(module.size)
	};
	pressed=true;
	canDrag=true;
	module.dom.style.zIndex="10000";
	evt.stopPropagation();
}

function resizeMessage(evt){
	var coords=pxToEm(getCoordsOffs(evt,scene)).map(Math.round),
		cr=moveData.module.coordinates,
		w=Math.max(coords[0]-cr[0]+3,12),
		h=Math.max(coords[1]-cr[1]+1,6);

	setMsgSize(moveData.module,w,h);
	checkAll(moveData.module);
}

function setMsgSize(module,w,h){
	var dom=module.dom,
		ce=dom.getElementsByClassName("msg-box")[0];

	dom.style.width=w+"em";
	dom.style.height=h+"em";
	ce.style.width=(w-4)+"em";
	ce.style.height=(h-2)+"em";
	module.size=[w,h];
}

function endResize(){
	routeMode=oldMode;
	var errors=document.getElementsByClassName("module error");
	for (var i=0;i<errors.length;i++)
		errors[i].classList.remove("error");

	if (scene.classList.contains("graph-error")){
		var ss=moveData.startSize;
		setMsgSize(moveData.module,ss[0],ss[1]);
	}

	connectPoints();
	moveData.module.dom.style.zIndex=null;
}

//-------Edit mode specific-------
function setEditMode(mode){
	editMode=mode;
	frame.setAttribute("data-mode",mode);
	var sel=document.getElementsByClassName("mode-item selected")[0];
	if (sel)
		sel.classList.remove("selected");
	document.getElementById(mode+"-mode").classList.add("selected");
}

function removeElem(evt){
	if (evt.target.classList.contains("standard-module"))
		removeModule(evt.target.treeNode);
}

function removeModule(module){
	scene.removeChild(module.dom);
	var children=module.parent.children;
	for (var i=0;i<children.length;i++){
		if (children[i]==module){
			children.splice(i,1);
			break;
		}
	}
	for (var i=0;i<module.children.length;i++){
		module.children[i].parent=module.parent;
	}
	module.parent.children=children.concat(module.children);
	connectPoints();
}

//-------TO BE EXECUTED LAST ON LOAD-------
addEventListeners();
