/*
    OrbitJS - Copyright Luke St Jack - lukestjack.com

*/

var myRequestAnimationFrame =  window.requestAnimationFrame ||
              window.webkitRequestAnimationFrame ||
              window.mozRequestAnimationFrame    ||
              window.oRequestAnimationFrame      ||
              window.msRequestAnimationFrame     ||
              function(callback) {
                  window.setTimeout(callback, 60 / 1000);
               };
window.requestAnimationFrame=myRequestAnimationFrame;

OrbitJS = {}
OrbitJS.Nodes = {}
OrbitJS.Settings = {}

// settings
OrbitJS.Settings.MainNodeName = "Home";

OrbitJS.Settings.DrawOrbits = true;
OrbitJS.Settings.DrawOrbitsOnMouseOver = false;

OrbitJS.Settings.DrawSpokes = true;
OrbitJS.Settings.DrawSpokesOnMouseOver = false;
OrbitJS.Settings.MouseOverTimeRate = 5;
OrbitJS.Settings.RadiusGrowthRate = 100;
OrbitJS.Settings.ZoomApproachRate = 2;
OrbitJS.Settings.OrbitalRadius = 100;
OrbitJS.Settings.GrabbedTickerRate = 3;

OrbitJS.Settings.GlobalOrbitSpeed = 0.1;
OrbitJS.Settings.OrbitSpeedIncreasePerLevel = 1;

OrbitJS.Settings.SizeStepPerLevel = 3;

OrbitJS.Settings.MaximizedCircleRadius = 50;
OrbitJS.Settings.MinimizedCircleRadius = 15;

OrbitJS.Settings.CamSpeed = 2;

OrbitJS.Settings.PanelOpacityRate = 3;

OrbitJS.Settings.DrawShadows = true;
OrbitJS.Settings.ShadowWidth = 0.95;
OrbitJS.Settings.ShadowLength = 12;
OrbitJS.Settings.ShadowAlpha = 0.15;

OrbitJS.Settings.VeryRecentScrollTime = 1000;
OrbitJS.Settings.RecentScrollTime = 10000; // 10 seconds

OrbitJS.Settings.BackgroundColourInner = "rgb(190,190,190)";
OrbitJS.Settings.BackgroundColourOuter = "white"; //"rgb(220,220,220)";
OrbitJS.Settings.BackgroundGradientSize = 150;

OrbitJS.Settings.CircleLineColour = "#000" //"rgb(243,156,18)";
OrbitJS.Settings.DefaultCircleColour = "rgb(45,137,239)";
OrbitJS.Settings.CircleGradientAmount = 3;

OrbitJS.Settings.GrabberLineColourR = 185;
OrbitJS.Settings.GrabberLineColourG = 29;
OrbitJS.Settings.GrabberLineColourB = 71;

OrbitJS.Settings.OrbitLineColourR = 0;
OrbitJS.Settings.OrbitLineColourG = 0;
OrbitJS.Settings.OrbitLineColourB = 0;
OrbitJS.Settings.OrbitLineAlphaMult = 0.7;
OrbitJS.Settings.OrbitLineAlphaLevels = 10;



OrbitJS.GetGrabberLineStyle = function() {
    var grace = 0.2;
    
    var myTicker = Math.max(OrbitJS.GrabbedTicker - grace, 0) / (1-grace);
    
    return "rgba("+OrbitJS.Settings.GrabberLineColourR+","+OrbitJS.Settings.GrabberLineColourG+","+OrbitJS.Settings.GrabberLineColourB+"," + (OrbitJS.GrabbedTicker) + ")";
    // return "rgba(46, 204, 113," + (OrbitJS.GrabbedTicker) + ")";
    // return "rgba(220,110,10," + (OrbitJS.GrabbedTicker) + ")";
    //return "rgba(80,80,80," + (myTicker) + ")";
}

OrbitJS.GetOrbitAlpha = function(orbitMult) {
    var diff = Math.difference(orbitMult, OrbitJS.Current.orbitMult);
    
    var alpha = (1-Math.clamp(diff/OrbitJS.Settings.OrbitLineAlphaLevels, 0, 1)) * OrbitJS.Settings.OrbitLineAlphaMult;
    
    // console.log(alpha, (Math.floor(alpha*100)) * 0.01);
    
    return (Math.floor(alpha*100)) * 0.01;
    
}

OrbitJS.GetOrbitLineStyle = function(orbitMult) {
    
    return "rgba("+OrbitJS.Settings.OrbitLineColourR+","+OrbitJS.Settings.OrbitLineColourG+","+OrbitJS.Settings.OrbitLineColourB+"," + (OrbitJS.GetOrbitAlpha(orbitMult)) + ")";

}

OrbitJS.ShadowGradients = [];

OrbitJS.CurrentMouseOver = false

OrbitJS.CAMX = 0;
OrbitJS.CAMY = 0;

OrbitJS.Zoom = 1;

// OrbitJS.OrbitGlobal = 0;
OrbitJS.Previous = false;
OrbitJS.Grabbed = false;
OrbitJS.GrabbedX = 0;
OrbitJS.GrabbedY = 0;
OrbitJS.GrabbedOrbit = 0;
OrbitJS.GrabbedTicker = 0;
OrbitJS.GrabbedTickerTarget = false;
OrbitJS.totalSpun = 0;
OrbitJS.numSpins = 0;

OrbitJS.search_div = false;
OrbitJS.search_results_div = false;


OrbitJS.panelOpacity = 0;

OrbitJS.AspectRatio = 3 // 3 is for me

OrbitJS.MouseX = 0;
OrbitJS.MouseY = 0;
OrbitJS.mouseDown = false;
OrbitJS.mouseDownAt = false;
OrbitJS.middleMouseDown = false;
ScrW = 0;
ScrH = 0;

OrbitJS.panelID = false
OrbitJS.panelActive = false
OrbitJS.panelHovered = false

OrbitJS.desiredPanelID = false;
OrbitJS.desiredPanelContent = false;
OrbitJS.desiredPanelTitle = false;
OrbitJS.closeBeforeOpen = false;

OrbitJS.allNodes = [];

OrbitJS.CurrentDepth = 0.2;

OrbitJS.scrolledAt = 0;

OrbitJS.getRecentlyScrolled = function() {
    
    var diff = curTime() - OrbitJS.scrolledAt
    
    if (diff < OrbitJS.Settings.VeryRecentScrollTime) {
        return 0;
    }
    
    if (diff < OrbitJS.Settings.RecentScrollTime) {
        return (diff/OrbitJS.Settings.RecentScrollTime);
    }
    
    return 1;
}

Math.TAU = Math.PI * 2;

Math.difference = function(num1, num2) {
    if (num1>num2) {
        return num1-num2;
    }
    else if (num2>num1) {
        return num2-num1;
    }
    return 0;
}

Math.normalizeAngle = function(a) {
	return ( a + Math.PI/2 ) % Math.PI - Math.PI/2;
}



Math.angleDifference = function(a,b) {

    var res = a - b;
    if (res > Math.PI) { res -= Math.TAU; }
    if (res < -Math.PI) { res += Math.TAU; }
    
    return res;

}

Math.clamp = function(num, min, max) {

    if (num > max) {
        return max;
    }
    
    if (num < min) {
        return min;
    }
    
    return num;
}

Math.approach = function(cur, target, inc) {
    
    var temp = cur;
    
    if (cur > target) {
        temp = Math.max(temp - inc, target);
    }
    
    if (cur < target) {
        temp = Math.min(temp + inc, target);
    }
    
    return temp;
}

OrbitJS.GetCAMX = function() {
    
    return OrbitJS.CAMX; //* OrbitJS.CurrentDepth;
}

OrbitJS.GetCAMY = function() {
    
    return OrbitJS.CAMY; //* OrbitJS.CurrentDepth;
}

class Vector2 {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    
    add(vec) {
        if (vec.x && vec.y) {
            this.x = this.x + vec.x;
            this.y = this.y + vec.y;
        }
        return this;
    }
    
    sub(vec) {
        if (vec.x && vec.y) {
            this.x = this.x - vec.x;
            this.y = this.y - vec.y;
        }
        
        return this;
    }
    
    length() {
        return Math.sqrt(this.x*this.x + this.y*this.y);
    }
    
}

function toscreen(x, y) {
    
    return new Vector2(ScrW/2 + (x - OrbitJS.CAMX)*OrbitJS.Zoom, ScrH/2 + (y - OrbitJS.CAMY)*OrbitJS.Zoom);
    
}

OrbitJS.getMyColour = function(node) {
    if (node.colour) {
        return node.colour;
    }
    else if (node.parent) {
        return OrbitJS.getMyColour(node.parent);                
    }
    else {
        return OrbitJS.Settings.DefaultCircleColour;
    }
}

function isNodeParentOfNodeRecursive(node1, node2) { // is node1 parent of node2, or is node1 parent of node2's parent, etc
    if (node1 == node2.parent) {
        return true;
    }
    
    if (!node2.parent) {
        return false;
    }
    
    return isNodeParentOfNodeRecursive(node1, node2.parent);
}

class Node {
    constructor(id, loc) {
        this.id = id;
        this.loc = loc;
        this.name = id;
        this.orbit = Math.random() * 100;
        this.orbitVel = 0;
        this.x = 0;
        this.y = 0;
        this.depth = 1;
        this.showName = true;
        this.mouseOverTime = 0;
        this.isNodeParentOfCurrent = false;
        this.size = 1;
        this.colour = false; 
        this.parent = false;
        this.childNum = false;
        this.children = [];
        this.orbitalRadiusMult = 1;
        this.hideOrbit = false;
        this.hideSpoke = false;
        this.sin = 0;
        this.cos = 0;
        this.delta = 0;
        this.unsearchable = false;
        
        this.radius = OrbitJS.Settings.MinimizedCircleRadius;
        
        OrbitJS.allNodes[id] = this;
    }
    
    hasChild(node) {
        var checkNode;
        for (var i = 0; i < this.children.length; i++) {
            checkNode = this.children[i];
            
            if (checkNode && checkNode == node) {
                return i;
            }
        }
        
        return false;
    }
    
    addChild(node) {
        var loc = this.hasChild(node);
        if (!loc) {
            this.children.push(node);
            node.parent = this;
        }
    }
    
    removeChild(node) {
        var loc = this.hasChild(node);
        if (loc != false) {
            this.children.remove(loc); 
        }
    }
    
    isParentOfCurrent(recursive) {
        if (this.children && this.children.length > 0) {
            var checkNode;
            
            if (OrbitJS.Current.parent == this) {
                return true;
            }
            
            if (recursive) {
                
                return isNodeParentOfNodeRecursive(this, OrbitJS.Current);
                
                // for (var i = 0; i < this.children.length; i++) {
                    // checkNode = this.children[i];
                    
                    // if (recursive && checkNode.isParentOfCurrent(recursive)) {
                        // return true;
                    // }
                // }
            }
        }
        
        return false;
    }
    
    
    
    think(x, y, depth, myDelta, orbitMult) {
 
        this.delta = myDelta;
 
        // console.log(orbitMult)
        this.x = x
        this.y = y
        this.depth = depth;
        this.orbitMult = orbitMult;
        
        var radiusChildren = OrbitJS.Settings.OrbitalRadius / depth;
        
        if (OrbitJS.Current == this || OrbitJS.Current == this.parent || this.isNodeParentOfCurrent) { // minimized
            this.radius = Math.clamp(this.radius + OrbitJS.Settings.RadiusGrowthRate*OrbitJS.tickTime, OrbitJS.Settings.MinimizedCircleRadius, OrbitJS.Settings.MaximizedCircleRadius);
        }
        else {
            this.radius = Math.clamp(this.radius - OrbitJS.Settings.RadiusGrowthRate*OrbitJS.tickTime, OrbitJS.Settings.MinimizedCircleRadius, OrbitJS.Settings.MaximizedCircleRadius);
        }
        
        this.minimizedDelta = (this.radius - OrbitJS.Settings.MinimizedCircleRadius) / (OrbitJS.Settings.MaximizedCircleRadius - OrbitJS.Settings.MinimizedCircleRadius)
  
        
        
        if (OrbitJS.Grabbed && (OrbitJS.Grabbed.parent == this)) {
            
            
            var scr = toscreen(this.x, this.y);
            var grabbed_scr = toscreen(OrbitJS.Grabbed.x, OrbitJS.Grabbed.y);
            var distFromPrevPos = dist2d(OrbitJS.GrabbedX, OrbitJS.GrabbedY, scr.x, scr.y);
            var distFromCurPos = dist2d(OrbitJS.MouseX, OrbitJS.MouseY, scr.x, scr.y);
            
            var distFromGrabbedPos = dist2d(grabbed_scr.x, grabbed_scr.y, scr.x, scr.y);
            
            if (distFromPrevPos != 0 && distFromCurPos != 0 && distFromGrabbedPos != 0) {
                var dirToPrevPosX = (OrbitJS.GrabbedX - scr.x) / distFromPrevPos;
                var dirToPrevPosY = (OrbitJS.GrabbedY - scr.y) / distFromPrevPos;
            
                var dirToCurPosX = (OrbitJS.MouseX - scr.x) / distFromCurPos;
                var dirToCurPosY = (OrbitJS.MouseY - scr.y) / distFromCurPos;
            
                var dirToGrabbedTargetX = (grabbed_scr.x - scr.x) / distFromGrabbedPos;
                var dirToGrabbedTargetY = (grabbed_scr.y - scr.y) / distFromGrabbedPos;
            
            
                var angPrev = Math.atan2(dirToPrevPosY, dirToPrevPosX);
                var angCur = Math.atan2(dirToCurPosY, dirToCurPosX);
                var angGrabbed = Math.atan2(dirToGrabbedTargetY, dirToGrabbedTargetX);
                
            
                // console.log(angGrabbed, angCur, this.orbit);
            
                // if (OrbitJS.GrabbedTicker == 1) {
                    this.orbitVel = this.orbitVel + Math.angleDifference(angCur, angPrev)*-(OrbitJS.tickTime*6);
                    
                    this.orbitVel = this.orbitVel + Math.clamp(Math.angleDifference(angCur, angGrabbed) * -1, -Math.PI*0.3, Math.PI*0.3) * OrbitJS.tickTime*1;
                // }
                
                OrbitJS.GrabbedX = OrbitJS.MouseX;
                OrbitJS.GrabbedY = OrbitJS.MouseY;
                
                // this.orbit + distFromGrabbedPos*orbitMult;
            }
            
            
            // console.log(OrbitJS.MouseX, OrbitJS.MouseY, OrbitJS.GrabbedX, OrbitJS.GrabbedY)
            
            this.orbitVel = this.orbitVel * 0.9;
        }
        else {
            this.orbitVel = this.orbitVel * 0.98;
            
            if (this != OrbitJS.Current && this.parent != OrbitJS.Current && !this.isParentOfCurrent(false)) {
            }
            else {
                var dir = 1;
                
                if (orbitMult % 2 == 0) {
                    dir = -1;
                }
                
                this.orbit = this.orbit + (OrbitJS.tickTime*(orbitMult*OrbitJS.Settings.GlobalOrbitSpeed * dir));
            }
            
            
        }
        
        
        
        if (this.orbitVel != 0) {
            
            OrbitJS.totalSpun = OrbitJS.totalSpun + this.orbitVel;
            
            if (Math.abs(OrbitJS.totalSpun) > Math.TAU) {
                OrbitJS.numSpins = OrbitJS.numSpins + 1;
                OrbitJS.totalSpun = 0;
            }
        }
        
        // console.log(this.orbitVel > -0.000000001)
        
        if (this.orbitVel > -0.000000001 && this.orbitVel < 0.000000001) {
            this.orbitVel = 0;
            
            // console.log(this.orbitVel)
        }
        else {
            
        }
        
        this.orbit = this.orbit + this.orbitVel;
        
        
        
        
        
        
        
        
        
        
        this.isNodeParentOfCurrent = this.isParentOfCurrent(true);
        
        
        
  
        if (this.radius > OrbitJS.Settings.MinimizedCircleRadius) {

            for (var i = 0; i < this.children.length; i++) {
                var node = this.children[i]
                var minimized = false;
                var distFromParent = radiusChildren * node.orbitalRadiusMult * this.minimizedDelta;
                
                // if (this != OrbitJS.Current || this.isNodeParentOfCurrent) {
                    // distFromParent = distFromParent*2;
                // }
                
                var addDelta = this.orbit;
    
                var myDelta = (i / (this.children.length) * Math.TAU + addDelta) % Math.TAU;
                
                
                node.sin = Math.sin(myDelta);
                node.cos = Math.cos(myDelta);
                node.think(x + node.sin*distFromParent, y + node.cos*distFromParent, depth*OrbitJS.Settings.SizeStepPerLevel, myDelta, orbitMult+OrbitJS.Settings.OrbitSpeedIncreasePerLevel);
                
            }
        }
        
        
        if (this == OrbitJS.Current) {
            var targ_x = this.x; // -(x/OrbitJS.CurrentDepth);
            var targ_y = this.y; // -(y/OrbitJS.CurrentDepth);
            var len = dist2d(targ_x, targ_y, OrbitJS.CAMX, OrbitJS.CAMY);
            
            var diff_x = targ_x - OrbitJS.CAMX;
            var diff_y = targ_y - OrbitJS.CAMY;
            var len = Math.sqrt(diff_x*diff_x + diff_y*diff_y);
 
            var ZOOM_speedMult = OrbitJS.getRecentlyScrolled();
            OrbitJS.Zoom = Math.approach(OrbitJS.Zoom, depth*OrbitJS.AspectRatio, (OrbitJS.Zoom * OrbitJS.Settings.ZoomApproachRate * OrbitJS.tickTime) * ZOOM_speedMult);
      
            if (len > 0) {
                var dir_x = (diff_x) / len;
                var dir_y = (diff_y) / len;
                
                
                
                var speed = Math.min(len * (OrbitJS.tickTime*OrbitJS.Settings.CamSpeed), len);
                
                OrbitJS.CAMX = OrbitJS.CAMX + dir_x * speed;
                OrbitJS.CAMY = OrbitJS.CAMY + dir_y * speed;
                
            }
            
        }
        
    }
    
    draw(ctx) {
        
        var scr = toscreen(this.x, this.y)
        
        var dist = dist2d(OrbitJS.MouseX, OrbitJS.MouseY, scr.x, scr.y)

        var helpText = ""
        var myName = this.name; //this.id;
        
        var myZoom = OrbitJS.Zoom
        
        var isInCircle = false;
        
        myZoom = OrbitJS.Zoom * (1+0.9*this.mouseOverTime);
        
        
        if (dist < (50/this.depth)*OrbitJS.Zoom*this.size) {

            isInCircle = true;
            // if (OrbitJS.Current && OrbitJS.Current.depth < this.depth) {
                // myZoom = myZoom * 1.5
            // }
        }
        
        if (this.parent && !this.hideSpoke && (OrbitJS.Settings.DrawSpokes || (OrbitJS.CurrentMouseOver == this.parent && OrbitJS.Settings.DrawSpokesOnMouseOver))) { // spokes

            
            ctx.lineWidth = (1.5/this.parent.depth) * myZoom;
            
            ctx.strokeStyle = OrbitJS.GetOrbitLineStyle(this.parent.orbitMult);
            
            var pscr = toscreen(this.parent.x, this.parent.y)
            
            var distToParent = dist2d(this.x, this.y, this.parent.x, this.parent.y)
            var dir_x = (this.parent.x - this.x) / distToParent;
            var dir_y = (this.parent.y - this.y) / distToParent;
            
            var pushDist = ((OrbitJS.Settings.OrbitalRadius*this.orbitalRadiusMult-this.parent.radius)/this.parent.depth) * OrbitJS.Zoom * this.parent.size * this.parent.minimizedDelta
            
            // var pushDist = distToParent - this.parent.radius;;
            
            ctx.beginPath();
            ctx.moveTo(scr.x, scr.y);
            ctx.lineTo(scr.x + dir_x*pushDist, scr.y + dir_y*pushDist);
            ctx.stroke();
            ctx.closePath();
            
            
            if (OrbitJS.GrabbedTickerTarget && OrbitJS.GrabbedTickerTarget == this) {
                
                // var pushDist = (50/this.parent.depth) * ZOOM * this.parent.size * 0.975
            
                // ctx.beginPath();
                // ctx.moveTo(scr.x, scr.y);
                // ctx.lineTo(scr.x + dir_x*pushDist, scr.y + dir_y*pushDist);
                // ctx.closePath();
                    
                // ctx.lineWidth = (2/this.parent.depth) * myZoom * this.size
            
                // ctx.strokeStyle = OrbitJS.GetGrabberLineStyle();
                
                // ctx.stroke();
            }
        }
        
        
        
        if (isInCircle) {
            
            OrbitJS.CurrentMouseOver = this;
            
            this.mouseOverTime = Math.clamp(this.mouseOverTime + OrbitJS.Settings.MouseOverTimeRate*OrbitJS.tickTime, 0, 1);
            
            // if (OrbitJS.Current == this && this.parent) {
                // ctx.lineWidth = (3/this.depth) * ZOOM;
                // ctx.strokeStyle = "white"; //'#003300';
                
                // var pscr = toscreen(this.parent.x, this.parent.y)
                
                // ctx.setLineDash([3,6]);
               
                // ctx.beginPath();
                // ctx.moveTo(scr.x, scr.y);
                // ctx.lineTo(pscr.x, pscr.y);
                // ctx.stroke();
                
                // ctx.setLineDash([1,0]);
          
            
            if (this.parent && OrbitJS.mouseDown && !OrbitJS.Grabbed) {
                OrbitJS.Grabbed = this;
                OrbitJS.GrabbedX = OrbitJS.MouseX;
                OrbitJS.GrabbedY = OrbitJS.MouseY;
                OrbitJS.GrabbedOrbit = this.orbit;
                
            }
            
            if (((OrbitJS.GrabbedTicker < 1 && this == OrbitJS.Grabbed) || (!this.parent)) && mouseWasClicked()) {
                
                // if (OrbitJS.panelID == this.id) {
                    
                // }
                // else {
                    
                OrbitJS.closePanel();
                
                if (OrbitJS.Current == this && this.parent) {
                    OrbitJS.setCurrent(this.parent);
                    // OrbitJS.TargetDepth = this.depth
                }
                else {
                    // if (this.children && this.children.length > 0) {
                        // OrbitJS.Previous = OrbitJS.Current;
                        // OrbitJS.Current = this;
                        
                        OrbitJS.setCurrent(this);
                        
                        // OrbitJS.TeleportToCurrent = false;
                        // OrbitJS.TargetDepth = this.depth
                        
                        
                    // }
                    // else {
                        // OrbitJS.setPanelContent(this);
                    // }
                }
                // }
                
            }
        }
        else {
            // if (OrbitJS.panelID == this.id && OrbitJS.panelActive) {
                
            // }
            
            if (OrbitJS.CurrentMouseOver == this) {
                OrbitJS.CurrentMouseOver = false
            }
            
            this.mouseOverTime = Math.clamp(this.mouseOverTime - OrbitJS.Settings.MouseOverTimeRate*OrbitJS.tickTime, 0, 1);
        }
        
        // var radius = 50
            
        // if (!(OrbitJS.Current == this || OrbitJS.Current == this.parent || this.isNodeParentOfCurrent)) {
            // radius = 15
        // }
        
        if (OrbitJS.GrabbedTickerTarget == this ) {//|| OrbitJS.GrabbedTickerTarget.parent == this) {
            circle(ctx, scr.x, scr.y, ((this.radius/this.depth) + (10/OrbitJS.GrabbedTickerTarget.depth)) * OrbitJS.Zoom * this.size, false, OrbitJS.GetGrabberLineStyle(), 0, true)
        }
        
        if (OrbitJS.Grabbed == this && !OrbitJS.mouseDown) {
            OrbitJS.Grabbed = false;
        } 
        
        if (OrbitJS.Current == this || OrbitJS.Current == this.parent) {
            // this.orbit = this.orbit + 0.01*scale;
        }
        
        var radiusChildren = (OrbitJS.Settings.OrbitalRadius/this.depth) * OrbitJS.Zoom;
        var radiusChildrenDefault = radiusChildren
        
        
        if (this.parent && OrbitJS.Settings.DrawShadows) {
            
            var radius = (this.radius/this.depth) * OrbitJS.Zoom * this.size;
            var shadowLength = Math.ceil((OrbitJS.Settings.MinimizedCircleRadius/this.depth) * OrbitJS.Zoom * this.size * OrbitJS.Settings.ShadowLength);
            var shadowWidth = radius * OrbitJS.Settings.ShadowWidth;
            
            
            

            
            if (!OrbitJS.ShadowGradients[shadowLength]) {
                OrbitJS.ShadowGradients[shadowLength] = ctx.createLinearGradient(0,0,0,shadowLength*0.5);
                OrbitJS.ShadowGradients[shadowLength].addColorStop(0,"rgba(0,0,0,"+(OrbitJS.GetOrbitAlpha(this.orbitMult)*OrbitJS.Settings.ShadowAlpha)+")");
                OrbitJS.ShadowGradients[shadowLength].addColorStop(1,"rgba(0,0,0,0)");
            }
            
            
            
            
            
            
            ctx.save();
                
                var distToHome = Math.sqrt(this.x*this.x + this.y*this.y)
                var dirToHomeX = this.x / distToHome;
                var dirToHomeY = this.y / distToHome;
                
                var ang = Math.atan2(dirToHomeX, dirToHomeY);
            
                ctx.beginPath();
                ctx.translate( scr.x + dirToHomeX*shadowLength/2, scr.y + dirToHomeY*shadowLength/2);
                ctx.rotate(-ang);
                ctx.rect( -(shadowWidth), -shadowLength/2, shadowWidth*2, shadowLength);

                ctx.closePath();
                
                ctx.fillStyle=OrbitJS.ShadowGradients[shadowLength];
                ctx.fill();
                
                // ctx.translate( scr.x + dirToHomeX*shadowLength/2, scr.y + dirToHomeY*shadowLength/2);
                // ctx.rotate(-ang);
                
                // ctx.rect( -(shadowWidth), -shadowLength/2, shadowWidth*2, shadowLength);

                
                
                // ctx.fillStyle=OrbitJS.ShadowGradients[shadowLength];
                // ctx.fill();
                
            ctx.restore();
        }
    
        
    
    
        var myColour = OrbitJS.getMyColour(this);
    
        if (this.radius > OrbitJS.Settings.MinimizedCircleRadius) {
            
            if (this.children && this.children.length > 0) {
                var drawOrbit = true;
                this.orbitsDrawn = [];
                
                radiusChildren = radiusChildren * this.minimizedDelta;
                
                for (var n = 0; n < this.children.length; n++) {
                    if ((OrbitJS.Settings.DrawOrbits || (OrbitJS.CurrentMouseOver == this.children[n] && OrbitJS.Settings.DrawOrbitsOnMouseOver)) && !this.children[n].hideOrbit && !this.orbitsDrawn[this.children[n].orbitalRadiusMult]) {
                        
                        
                        circle(ctx, scr.x, scr.y, radiusChildren * this.children[n].orbitalRadiusMult, OrbitJS.GetOrbitLineStyle(this.orbitMult), false, (1/this.depth) * myZoom * this.size)
                        // drawOrbit = false;
                        
                        this.orbitsDrawn[this.children[n].orbitalRadiusMult] = true;
                    }
                } 
                
                
                
                if ((OrbitJS.Settings.DrawOrbits || (OrbitJS.CurrentMouseOver == this && OrbitJS.Settings.DrawOrbitsOnMouseOver))) {
                    if (OrbitJS.GrabbedTickerTarget && OrbitJS.GrabbedTickerTarget.parent == this) {
                        circle(ctx, scr.x, scr.y, radiusChildren * OrbitJS.GrabbedTickerTarget.orbitalRadiusMult, OrbitJS.GetGrabberLineStyle(), false, (2/this.depth) * OrbitJS.Zoom * this.size)
                    }
                    
                    
                    
                }
            }
                
            
        // console.log("asa")
        
            
            circle(ctx, scr.x, scr.y, (this.radius/this.depth) * OrbitJS.Zoom * this.size, OrbitJS.Settings.CircleLineColour, myColour, (2/this.depth) * myZoom * this.size)
           
           
            var fontHeight = (16/this.depth) * OrbitJS.Zoom * this.size
            //var shadowOffset = (fontHeight*0.02);
            
            if (this.showName) {
                ctx.textAlign = "center"
                ctx.font = (fontHeight) + "px Arial";
                
                
                //ctx.fillStyle = "rgba(0,0,0," + this.minimizedDelta + ")";
                //ctx.fillText(this.id, scr.x+shadowOffset, scr.y+fontHeight/4+shadowOffset);
                
                // ctx.fillStyle = "rgba(0,0,0," + this.minimizedDelta * 1 + ")";
                // ctx.fillText(this.id, scr.x + this.sin*(fontHeight*0.1), scr.y+fontHeight/4 + this.cos*(fontHeight*0.1));
                
                ctx.fillStyle = "rgba(255,255,255," + this.minimizedDelta + ")";
                ctx.fillText(this.name, scr.x, scr.y+fontHeight/4);
                
                
                
                
                
                if (OrbitJS.Current == this && this.parent && this.parent.id) {
                    var subFontHeight = (5/this.depth) * OrbitJS.Zoom * this.size
                    
                    
                    ctx.font = (subFontHeight) + "px Arial";
                    
                    // ctx.fillStyle = "rgba(0,0,0," + this.minimizedDelta * 1 + ")";
                    // ctx.fillText("Click to return to " + this.parent.name + "", scr.x + this.sin*(subFontHeight*0.1), scr.y + fontHeight/2 + subFontHeight/4 + 10 + this.cos*(subFontHeight*0.1));
                    
                    // ctx.fillStyle = "rgba(255,255,255," + this.minimizedDelta + ")";
                    ctx.fillText("Click to return to " + this.parent.name + "", scr.x, scr.y + fontHeight/2 + subFontHeight/4 + 10);
                    
                    
                }
            }
            
            
            
            if (this != OrbitJS.Current) {
                // radiusChildren = 50/draw_scale + minimizedRadius;
            }
            
            
                // var totalCircles = 6;
                // var numMouseCircles = Math.floor(this.mouseOverTime * totalCircles);
                
                // if (numMouseCircles > 0) {
                    
                    // var sin;
                    // var cos;
                    // var coolNum;
                    
                    // var push = (50/this.depth) * myZoom
                    
                    // for (var i = 1; i <= numMouseCircles; i++) {
                        // coolNum = (i/totalCircles) * Math.TAU;
                        // sin = Math.sin(coolNum)
                        // cos = Math.cos(coolNum)
                        
                        // circle(ctx, scr.x + sin*push, scr.y + cos*push, push*0.1, OrbitJS.Settings.CircleLineColour, this.colour)
                    // }
                // }
            // }
            
            if (this.children && this.children.length > 0) {
                for (var n = 0; n < this.children.length; n++) {
                    var node = this.children[n]
                    node.draw(ctx);
                }
            }
        }
        else {
            circle(ctx, scr.x, scr.y, (this.radius/this.depth) * OrbitJS.Zoom * this.size, OrbitJS.Settings.CircleLineColour, myColour, (2/this.depth) * myZoom * this.size);
        }
        
        
        
    }
}



OrbitJS.Init = function() {
    
}



OrbitJS.setPanelContent = function(node) {

    // if (node.id == OrbitJS.panelID) {
        // OrbitJS.closePanel();
        // OrbitJS.panelID = false;
        
        // return false;
    // }
    
    OrbitJS.closePanel();

    if (node.loc) {
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {

                OrbitJS.desiredPanelID = node.id;
                OrbitJS.desiredPanelContent = this.responseText;
                
                OrbitJS.closeBeforeOpen  = true;
            
            }
        };
        xmlhttp.open("GET", node.loc, true);
        xmlhttp.send();

        
        
    }
}

OrbitJS.closePanel = function() {
    OrbitJS.panelActive = false;
}

function curTime() {
    var d = new Date();
    return d.getTime();
}

function mouseWasClicked() {
    if (OrbitJS.mouseDownAt && OrbitJS.mouseDownAt + 100 > curTime()) {
        OrbitJS.mouseDownAt = false;
        return true;
    }
    return false;
}

OrbitJS.addNodesFromList = function(parent_node, list) {
    
    for (var i = 0; i < list.length; i++) {
        var nodeData = list[i];
        var node = new Node(nodeData.id, nodeData.loc);
        
        if (nodeData.children) {
            OrbitJS.addNodesFromList(node, nodeData.children);
        }
        
        if (nodeData.settings) {
            for (var k in nodeData.settings) {
                node[k] = nodeData.settings[k];
            }
        }
        
        parent_node.addChild(node);
    }
}

OrbitJS.LoadConfig = function() {
    
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            
            var comments_stripped = this.responseText.replace(/<!--[\s\S]*?-->/g, "");
            
            var parsed = JSON.parse(comments_stripped);

            for (var k in parsed) {
                OrbitJS.Settings[k] = parsed[k];
            }
            
            OrbitJS.startTime = Date.now();
            OrbitJS.Draw();
        }
    };
    xmlhttp.open("GET", "config.json", true);
    xmlhttp.send();
    
}

OrbitJS.Load = function(json_data) {
    
    OrbitJS.NodesJSON = json_data;
    
    OrbitJS.NodesList = JSON.parse(OrbitJS.NodesJSON);
    OrbitJS.Main = new Node(OrbitJS.Settings.MainNodeName, false);
    OrbitJS.addNodesFromList(OrbitJS.Main, OrbitJS.NodesList);

    OrbitJS.setCurrent(OrbitJS.Main);
    
    OrbitJS.LoadConfig();
    
    
}

OrbitJS.setCurrent = function(node) {
    OrbitJS.scrolledAt = 0;
    
    OrbitJS.TargetDepth = node.depth;
    
    if (node.children && node.children.length > 0) {
        OrbitJS.Current = node;
    }
    else if (node.parent) {
        OrbitJS.Current = node.parent;
        OrbitJS.setPanelContent(node);
        
        
    }
    
    
}

window.onload = function() {
    
    var canvas = document.getElementById("OrbitJSCanvas");
    
    canvas.onmousedown = function(evt) {
        if (evt.button == 0) {
            OrbitJS.mouseDown = true;
            
        }
        else if (evt.button == 1) {
            OrbitJS.middleMouseDown = true;
        }
        
        // console.log("click");
    }
    
    canvas.onmouseup = function(evt) {
        
        if (evt.button == 0) {
            OrbitJS.mouseDown = false;
            OrbitJS.mouseDownAt = curTime(); 
        }
        else if (evt.button == 1) {
            OrbitJS.middleMouseDown = false;
        }
        
        
    }
    
    canvas.onmousemove = function(evt) {
        var rect = canvas.getBoundingClientRect();
        
        OrbitJS.MouseX = evt.clientX - rect.left;
        OrbitJS.MouseY = evt.clientY - rect.top;
    };
    
    canvas.setAttribute("style","-ms-touch-action: manipulation;");
    canvas.setAttribute("style","touch-action: manipulation;");
    
    canvas.ontouchstart = function(evt) {
        OrbitJS.mouseDown = true;
        
        var rect = canvas.getBoundingClientRect();
        
        OrbitJS.MouseX = evt.touches[0].clientX - rect.left;
        OrbitJS.MouseY = evt.touches[0].clientY - rect.top;
        
        //evt.preventDefault()
    }
    
    canvas.ontouchend = function(evt) {
        OrbitJS.mouseDown = false;
        OrbitJS.mouseDownAt = curTime(); 
        
        var rect = canvas.getBoundingClientRect();
        
        OrbitJS.MouseX = evt.touches[0].clientX; - rect.left;
        OrbitJS.MouseY = evt.touches[0].clientY - rect.top;
        
        //evt.preventDefault()
    }
    
    canvas.ontouchmove = function(evt) {
        var rect = canvas.getBoundingClientRect();
        
        OrbitJS.MouseX = evt.touches[0].clientX - rect.left;
        OrbitJS.MouseY = evt.touches[0].clientY - rect.top;
        
        evt.preventDefault()
    }
    
    canvas.onmouseout = function() {
        OrbitJS.mouseDown = false;
        OrbitJS.middleMouseDown = false;
    }
    
    
    
    canvas.onwheel = function(evt) {  
        OrbitJS.scrolledAt = curTime();
        
        if (evt.deltaY > 0) {
            OrbitJS.Zoom = OrbitJS.Zoom - OrbitJS.Zoom*0.1; 
        }
        else if (evt.deltaY < 0) {
            OrbitJS.Zoom = OrbitJS.Zoom + OrbitJS.Zoom*0.1;     
        }
    } 
    
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            OrbitJS.Load(this.responseText);
        }
    };
    xmlhttp.open("GET", "getnodes.php", true);
    xmlhttp.send();
    
    
    
    OrbitJS.search_div = document.getElementById("OrbitJSSearch");
    OrbitJS.search_results_div = document.getElementById("OrbitJSSearchResults");
    
    if (OrbitJS.search_div) {
        
        OrbitJS.search_results_div.myOpacity = 0;
        OrbitJS.search_results_div.doDisplay = false;
        
        
        
        OrbitJS.search_div.onchange = function() {
            
            OrbitJS.search_results_div.found = OrbitJS.findNodesByKeyword(OrbitJS.search_div.value);
            
            if (OrbitJS.search_results_div.found) {
                
                var html = "";
                
                for (var i = 0; i < OrbitJS.search_results_div.found.length; i++) {
                    html = html + "<a href='javascript:void(0);' onclick='OrbitJS.setCurrent(OrbitJS.search_results_div.found["+i+"]);'><div class='search_result'>" + OrbitJS.search_results_div.found[i].name + "</div></a>";
                     
                }
                
                // var oldHeight = search_results.offsetHeight;
                // var oldWidth = search_results.offsetWidth;
                
                // search_results.height = oldHeight;
                // search_results.width = oldWidth;
                
                
                
                if (OrbitJS.search_results_div.innerHTML_next != html) {
                    OrbitJS.search_results_div.innerHTML_next = html;
                    OrbitJS.search_results_div.isCurrent = false;
                }
                
                
                
                
                
                // var newHeight = search_results.offsetHeight;
                // var newWidth = search_results.offsetWidth;
                
                // search_results.style["height"] = oldHeight + "px";
                // search_results.style["width"] = oldWidth + "px";
                // search_results.style["transition-property"] = "height";
                // search_results.style["transition-duration"] = "1s";
                
                // transition-property: background-color;
                // transition-duration: 3s;
                
                
                OrbitJS.search_results_div.doDisplay = true;
            }
            else {
                OrbitJS.search_results_div.doDisplay = false;
            }
            
        }
        
        OrbitJS.search_div.onkeypress = OrbitJS.search_div.onchange;
        
        OrbitJS.search_div.onpaste = OrbitJS.search_div.onchange;
        
        OrbitJS.search_div.oninput = OrbitJS.search_div.onchange;
    }
    
    
    
}

OrbitJS.createNode = function(id, src, colour, children) {
    
    if (!colour) {
        colour = OrbitJS.Settings.DefaultCircleColour;
    }
    
    var node = new Node(id, src, colour);
    
    if (children && children.length > 0) {
        for (var i = 0; i < children.length; i++) {
            // node.children.push(children[i]);
            
            node.addChild(children[i]);
        }
    }
    
    // OrbitJS.Nodes[id] = node;
    return node;
}

OrbitJS.deleteNode = function(id) {
    delete OrbitJS.Nodes[id];
}

OrbitJS.prevTick = 0;
OrbitJS.tickTime = 0;

OrbitJS.clearSearch = function() {
    OrbitJS.search_div.value = "";
    OrbitJS.search_results_div.found = [];
    OrbitJS.search_results_div.innerHTML = "";
    OrbitJS.search_results_div.doDisplay = false;
}

OrbitJS.Draw = function() {

    var cur = curTime();
    OrbitJS.tickTime = (cur - OrbitJS.prevTick) / 1000;
    OrbitJS.prevTick = cur;
    
    
    // OrbitJS.OrbitGlobal = OrbitJS.OrbitGlobal + 0.001;
    
    var canvas = document.getElementById("OrbitJSCanvas");
    
    var ctx = canvas.getContext("2d");
    
    
    
    var styleW = window.innerWidth;
    var styleH = window.innerHeight;
    
    canvas.style.width  = styleW + 'px';
    canvas.style.height = styleH + 'px';
    
    ctx.canvas.width  = styleW;
    ctx.canvas.height = styleH;
    
    
    // ctx.setLineDash([5,1]) ; //[5*OrbitJS.Zoom,0.5*OrbitJS.Zoom]);
    
    
    var whatToTest = ctx.canvas.height;
    
    if (ctx.canvas.height > ctx.canvas.width) {
        whatToTest = ctx.canvas.width;
    }
    
    OrbitJS.AspectRatio = (whatToTest / (8*OrbitJS.Settings.OrbitalRadius)) * 3;

    ScrW = ctx.canvas.width
    ScrH = ctx.canvas.height
    
    
    
    
    
    
    var panel = document.getElementById("OrbitJSPanel");
    var panel_closer = document.getElementById("OrbitJSPanelCloser");
    var panel_scroller = document.getElementById("OrbitJSPanelScroller");
    var panel_tester = document.getElementById("OrbitJSPanelSizeTester");
    
    if (OrbitJS.panelActive) {
        OrbitJS.panelOpacity = Math.clamp(OrbitJS.panelOpacity + OrbitJS.Settings.PanelOpacityRate * OrbitJS.tickTime, 0, 1);
    }
    else {
        OrbitJS.panelOpacity = Math.clamp(OrbitJS.panelOpacity - OrbitJS.Settings.PanelOpacityRate * OrbitJS.tickTime, 0, 1);
    }
    
    if (panel.style["opacity"] != OrbitJS.panelOpacity) {
        panel.style["opacity"] = OrbitJS.panelOpacity;
        panel_closer.style["opacity"] = OrbitJS.panelOpacity;
        // panel_title.style["opacity"] = OrbitJS.panelOpacity;
    }

    
    if (OrbitJS.panelOpacity > 0) {
        panel.style["left"] = Math.ceil(ScrW / 2 - panel.offsetWidth/2) + "px";
        panel.style["top"] = Math.ceil(ScrH / 2 - panel.offsetHeight/2) + "px";
        
        panel_rect = panel.getBoundingClientRect(),
        
        panel_closer.style["left"] = Math.ceil(panel_rect.left + panel.offsetWidth/2 - panel_closer.offsetWidth/2) + "px";
        panel_closer.style["top"] = Math.ceil(panel_rect.top + panel.offsetHeight + 5) + "px";
        
        
        panel_scroller.style["width"] = (panel_tester.offsetWidth) + "px";
            panel_scroller.style["height"] = (panel_tester.offsetHeight) + "px";
        
        // panel_title.style["left"] = Math.ceil(ScrW / 2 - panel_title.offsetWidth/2 - 6) + "px";
        // panel_title.style["top"] = Math.ceil(ScrH / 2 - panel.offsetHeight/2 - panel_title.offsetHeight) + "px";
        
    } else {
        panel.style["left"] = Math.ceil(-10000) + "px";
        panel.style["top"] = Math.ceil(0) + "px";
        
        panel_closer.style["left"] = Math.ceil(-10000) + "px";
        panel_closer.style["top"] = Math.ceil(0) + "px";
        
        // panel_title.style["left"] = Math.ceil(-10000) + "px";
        // panel_title.style["top"] = Math.ceil(0) + "px";
        
        if (OrbitJS.closeBeforeOpen) {
            
            panel_scroller.style["overflow-y"] = "auto";
            panel_scroller.style["overflow-x"] = "hidden";
            panel_scroller.style["-webkit-overflow-scrolling"] = "touch";
            panel_scroller.style["-ms-overflow-style"] = "-ms-autohiding-scrollbar";
            panel_scroller.style["-webkit-transform"] = "translateZ(0px)";
            panel_scroller.style["-webkit-transform"] = "translate3d(0,0,0)";
            panel_scroller.style["-webkit-perspective"] = "1000";
           
            OrbitJS.closeBeforeOpen = false;
            
            OrbitJS.panelID = OrbitJS.desiredPanelID;
            panel_scroller.innerHTML = OrbitJS.desiredPanelContent;
            panel_tester.innerHTML = OrbitJS.desiredPanelContent;
            
            OrbitJS.panelActive = true;
        }
    }
    
    // SEARCH THINGA
    
    
    OrbitJS.search_div = document.getElementById("OrbitJSSearch");
    OrbitJS.search_results_div = document.getElementById("OrbitJSSearchResults");
    
    var display = OrbitJS.search_results_div.doDisplay
    
    if (document.activeElement != OrbitJS.search_div) {
        display = false;
        
       // if (!OrbitJS.search_div.oldValue) {
        //    OrbitJS.search_div.oldValue = OrbitJS.search_div.value;
            
         //   OrbitJS.search_div.placeholder = "Search";
            //OrbitJS.search_div.value = "";
            // OrbitJS.search_results_div.found = [];
            // OrbitJS.search_results_div.innerHTML = "";
            
       // }
    }
    else {
        //OrbitJS.search_div.placeholder = "Search";
       // if (OrbitJS.search_div.oldValue) {
            
            // console.log(OrbitJS.search_div.oldValue);
            
            //OrbitJS.search_div.value = OrbitJS.search_div.oldValue;
           // OrbitJS.search_div.oldValue = false;
            
            //OrbitJS.search_div.onchange();
            
            // console.log(OrbitJS.search_div.value);
       // }
        
    }
    
    
    if (display && OrbitJS.search_results_div.myOpacity < 1 && OrbitJS.search_results_div.isCurrent) {
        OrbitJS.search_results_div.myOpacity = Math.clamp(OrbitJS.search_results_div.myOpacity + OrbitJS.Settings.PanelOpacityRate * OrbitJS.tickTime, 0, 1);
    }
    
    if ((!display || !OrbitJS.search_results_div.isCurrent) && OrbitJS.search_results_div.myOpacity > 0) {
        OrbitJS.search_results_div.myOpacity = Math.clamp(OrbitJS.search_results_div.myOpacity - OrbitJS.Settings.PanelOpacityRate * OrbitJS.tickTime, 0, 1);
    }
    
    if ((!display || !OrbitJS.search_results_div.isCurrent) && OrbitJS.search_results_div.myOpacity == 0) {
        OrbitJS.search_results_div.style["display"] = "none";
        
        if (!OrbitJS.search_results_div.isCurrent) {
            OrbitJS.search_results_div.innerHTML = OrbitJS.search_results_div.innerHTML_next;
            OrbitJS.search_results_div.isCurrent = true;
        }
    }
    else {
        OrbitJS.search_results_div.style["display"] = "block";
        OrbitJS.search_results_div.style["top"] = (42 - 10) + "px";
        OrbitJS.search_results_div.style["left"] = "10px";
    }
    
    if (OrbitJS.search_results_div.style["opacity"] != OrbitJS.search_results_div.myOpacity) {
        OrbitJS.search_results_div.style["opacity"] = OrbitJS.search_results_div.myOpacity;
    }
    
    
    
    // BG
        var inner_radius = 0;
        var outer_radius = OrbitJS.Settings.BackgroundGradientSize;
    
        var centre = toscreen(OrbitJS.Main.x, OrbitJS.Main.y)
        
        var grd=ctx.createRadialGradient(centre.x, centre.y, 0, centre.x, centre.y, outer_radius*OrbitJS.Zoom);
        // grd.addColorStop(0,"rgb(100,100,100)");
        // grd.addColorStop(0.4,"rgb(45,45,45)");
        // grd.addColorStop(0.55,"rgb(250,45,45)");
        // grd.addColorStop(0.65,"rgb(45,250,45)");
        // grd.addColorStop(0.80,"rgb(45,45,250)");
        // grd.addColorStop(0.95,"rgb(100,100,100)");
        
        // grd.addColorStop(0,"rgb(100,100,100)");
        // grd.addColorStop(1,"rgb(45,45,45)");
        
        // var time = curTime() * 0.001;
        
        // var r = Math.floor(Math.sin(time % Math.TAU) * 25);
        // var g = Math.floor(Math.cos(time % Math.TAU) * 25);
        // var b = Math.floor(Math.cos((time/2) % Math.TAU) * 25);
        
        ctx.fillStyle = "white";
        ctx.fillRect(0,0,ScrW,ScrH);
        
        grd.addColorStop(0,OrbitJS.Settings.BackgroundColourInner);
        grd.addColorStop(1,OrbitJS.Settings.BackgroundColourOuter);
        
        ctx.fillStyle = grd;
        ctx.fillRect(0,0,ScrW,ScrH); 
        
        // ctx.fillStyle = "#FFFFFF";
        // ctx.fillRect(0,0,ScrW,ScrH);
    
    
    ////
    
    if (OrbitJS.Main != undefined && OrbitJS.Main.id) {
        
        if (OrbitJS.Main.name != OrbitJS.Settings.MainNodeName) {
            OrbitJS.Main.name = OrbitJS.Settings.MainNodeName;
        }
        
        OrbitJS.Main.think(0, 0, 1, 0, 1);
        OrbitJS.Main.draw(ctx);
    }
    
    if (OrbitJS.Grabbed && OrbitJS.GrabbedTicker < 1) {
        OrbitJS.GrabbedTickerTarget = OrbitJS.Grabbed;
        OrbitJS.GrabbedTicker = Math.clamp(OrbitJS.GrabbedTicker + OrbitJS.Settings.GrabbedTickerRate*OrbitJS.tickTime, 0, 1);
    }
    else if (!OrbitJS.Grabbed && OrbitJS.GrabbedTicker > 0) {
        OrbitJS.GrabbedTicker = Math.clamp(OrbitJS.GrabbedTicker - OrbitJS.Settings.GrabbedTickerRate*OrbitJS.tickTime, 0, 1);
    }
    
    if (!OrbitJS.Grabbed && OrbitJS.GrabbedTicker == 0) {
        OrbitJS.GrabbedTickerTarget = false;
    }
    
    var text_height = 12;
    
    var text_x = 5;
    var text_y = text_height + 5
    
    // ctx.font = (text_height) + "px Arial";
    // ctx.textAlign = "left"
    // ctx.fillStyle = "black";;
    // ctx.fillText("OrbitJS by Luke St Jack", text_x, ScrH - text_y);
    
    // var fullspins = Math.floor(OrbitJS.totalSpun / Math.PI);
    
    if (OrbitJS.numSpins > 10) {
        
        // text_y = text_y + text_height + 5;
        ctx.font = (text_height) + "px Arial";
        ctx.textAlign = "left"
        ctx.fillStyle = "black";;
        ctx.fillText(OrbitJS.numSpins, text_x, ScrH - text_y);
    }
    
    requestAnimationFrame(OrbitJS.Draw);
}

document.onkeydown = keyDown;

function recursiveNodeFinder(keyword, node, found) {

    if (node.name.toLowerCase().indexOf(keyword.toLowerCase()) != -1) {
        found.push(node);
    }
    
    if (node.children && node.children.length > 0) {
        for (var i = 0; i < node.children.length; i++) {
            if (!node.children[i].unsearchable) {
                recursiveNodeFinder(keyword, node.children[i], found);
            }
        }
    }
}

OrbitJS.findNodesByKeyword = function(keyword) {
    
    var found = [];
    
    recursiveNodeFinder(keyword, OrbitJS.Main, found);
    
    
    if (keyword == "" || found.length == 0) {
        return false;
    }
    
    return found;
    
}

function keyDown(e) {



}

function dist2d(x1,y1,x2,y2) {
    
    return Math.sqrt((x1-x2)*(x1-x2) + (y1-y2)*(y1-y2));
    
}

var line_dashed = [10,20];
var line_solid = [1,0];

function circle(ctx, x, y, radius, lineStyle, fillStyle, lineThick, noGrad) {

    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
    ctx.closePath();
    
    if (fillStyle) {
        
        if (noGrad) {
            ctx.fillStyle = fillStyle;
        }
        else {
            var grd=ctx.createRadialGradient(x,y, 0, x, y, radius*OrbitJS.Settings.CircleGradientAmount);
            grd.addColorStop(0,fillStyle);
            grd.addColorStop(1,"black");
            
            ctx.fillStyle = grd; //fillStyle; //'green';
        }
        
        
        ctx.fill();
    }
    
    if (lineStyle) {
        // ctx.setLineDash(line_solid);
        ctx.lineWidth = lineThick; //radius*0.025;
        ctx.strokeStyle = lineStyle; //'#003300';
        ctx.stroke();
        
        // ctx.beginPath();
        // ctx.arc(x, y, radius*1.05, 0, 2 * Math.PI, false);
        // ctx.closePath();
        
        // ctx.lineWidth = radius*0.01;
        // ctx.strokeStyle = lineStyle; //'#003300';
        // ctx.stroke();
        
        
        
        // ctx.beginPath();
        // ctx.arc(x, y, radius*0.95, 0, 2 * Math.PI, false);
        // ctx.closePath();
        
        // ctx.lineWidth = radius*0.01;
        // ctx.strokeStyle = lineStyle; //'#003300';
        // ctx.stroke();
        
      
        
        
    }
}


/*
    OrbitJS - Copyright Luke St Jack - lukestjack.com

*/
