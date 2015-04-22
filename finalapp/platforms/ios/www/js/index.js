var loadRequirements = 0;
var deleteListener = '';
var deviceId = '';


    function init () {
        document.addEventListener("DOMContentLoaded", onDomReady);
        document.addEventListener("deviceready", onDeviceReady);
        var c, context, i, thumb, contextthumb;
    };
    function onDomReady () {
        loadRequirements++;
        if (loadRequirements === 2) {
            start();
        }
    };
    function onDeviceReady () {
    		loadRequirements++;
    		if(loadRequirements === 2){
    			start();
    		}
    	};
	
	
function start () {
    deviceId = device.uuid;
    fetchImg();
    var saveButton = document.getElementById('d');
    var hammerSave = new Hammer(saveButton).on('tap', savePicture);
    var thumbPage = document.querySelector('#pictures');
    var cameraPage = document.querySelector('#camera');    

    var leftbutton = document.querySelector('.buttonLeft'); 
 
    var rightButton = document.querySelector('.buttonRight');
    
    var rightbuttontime = new Hammer(rightButton).on('tap', function() {
            cameraPage.className = 'hidden';
            thumbPage.className = 'active';
            
            fetchImg();
        });
    var addtextbutton = document.getElementById("b"); 
    var hammertext = new Hammer(addtextbutton).on('tap', addText);
    var leftbuttontime = new Hammer(leftbutton).on('tap', function () {
        navigator.camera.getPicture(onSuccess, onFail, { quality: 50, destinationType: Camera.DestinationType.DATA_URL });
        cameraPage.className = 'active';
        thumbPage.className = 'hidden';
    });   
}
function onSuccess(imageData) {

    loadImage("data:image/jpeg;base64," + imageData);
}
function onFail(message) {
    console.log('Failed because: ' + message);
}
        
        function fetchImg(ev){
            var clearDiv = document.querySelector('.displayBox');
            clearDiv.innerHTML = '';

            var url = "http://faculty.edumedia.ca/griffis/mad9022/final-w15/list.php?dev=" + deviceId;
            sendRequest(url, imgReturned, null);
        }

        function imgReturned(xhr){
            var json = JSON.parse(xhr.responseText);
            console.log(json);
            for (var i=0; i<json.thumbnails.length; i++) {
                var thumbContainer = document.querySelector('.displayBox');

                var thumbDiv = document.createElement('div');
                thumbDiv.setAttribute('id', 'imgDiv');
                var thumbimg = document.createElement('img');
                thumbimg.innerHTML = '';
                thumbimg.src = json.thumbnails[i].data;
                thumbimg.setAttribute("id", json.thumbnails[i].id);
                var thumbDel = document.createElement('p');
                thumbDel.setAttribute("class", "deleteButton" + i);
                thumbDel.innerHTML = 'DELETE';
                thumbDel.setAttribute('id', json.thumbnails[i].id);
                var w = thumbimg.width;
                var h = thumbimg.height;
                
                thumbDiv.appendChild(thumbimg);
                thumbDiv.appendChild(thumbDel);
                thumbContainer.appendChild(thumbDiv);
                
                var deleteImg = document.querySelector('.deleteButton' + i);
                deleteListener = deleteImg.addEventListener('click', function(ev) {
                                                            deleteImage(ev.target.id);
                                                            
                                                            });
                

            }
        }


    function createAJAXObj() {
        try {
            return new XMLHttpRequest();
        } catch (er1) {
        console.log(er1)}

    }
function deleteImage(data){

    sendRequest("http://m.edumedia.ca/fora0027/mad9022/phpfinal/delete.php?dev=" + deviceId + "&img_id=" + data);
    alert('Your Image Has Been Deleted');
    
    
    fetchImg()
}

	function loadImage (data) {
        //fetch an image
        //image must be from the same domain as the HTML page or you will get a security error and this will fail
        //load it into the Canvas
        i = document.createElement("img");
        ithumb = document.createElement("img");
        c = document.getElementById('editCanvas');
	    thumb = document.getElementById('thumb');
        contextthumb = thumb.getContext('2d');
        context = c.getContext('2d');
        i.addEventListener("load", function(ev){

            var imgWidth = ev.currentTarget.width;
            var imgHeight = ev.currentTarget.height;
            var aspectRatio = imgWidth / imgHeight;
            //alert(aspectRatio)
            ev.currentTarget.height = c.height;
            ev.currentTarget.width = c.height * aspectRatio;
            var w = i.width;
            var h = i.height;
            console.log("width: ", w, " height: ", h, " aspect ratio: ", aspectRatio);
            
            //var tw = "180px";
            var tw = 180 * aspectRatio;
            thumb.width = tw;
            thumb.style.width = tw + "px";
            //var ctT = thumb.getContext('2d');
            contextthumb.drawImage(i, 0, 0, tw, 200);
            //c.width = w;
            //c.style.width = w + "px";
            context.drawImage(i, 0, 0, w, h);

        });
        
        i.src = data; 
        
        i.crossOrigin = "Anonymous";    
    }
    
function sendRequest(url, callback, postData) {
    'use strict';
    var req = createAJAXObj(), method = (postData) ? "POST" : "GET";
    if (!req) {
        return;
    }
    req.open(method, url, true);
    //req.setRequestHeader('User-Agent', 'XMLHTTP/1.0');
    if (postData) {
        req.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    }
    req.onreadystatechange = function () {
        if (req.readyState !== 4) {
            return;
        }
        if (req.status !== 200 && req.status !== 304) {
            return;
        }
        callback(req);
    }
    req.send(postData);
}    

function callback(req){
    console.log(req.responseText);
}

function savePicture(){
    var thumbpng = thumb.toDataURL("image/png");
    thumbpng = encodeURIComponent( thumbpng );
    var fullpng = c.toDataURL("image/png");
    fullpng = encodeURIComponent( fullpng );
    var url = "http://m.edumedia.ca/fora0027/mad9022/phpfinal/save.php";
    var postData = "dev=" + deviceId + "&thumb=" + thumbpng + "&img=" + fullpng;
    alert('Your Image Has Been Saved');
    sendRequest(url, callback, postData);

}

        function addText(ev){
        var topRadio = document.querySelector("#top");
        var bottomRadio = document.querySelector("#bottom");
            ev.preventDefault();
            var txt = document.getElementById("txt").value;
            if(txt != ""){
                if(topRadio.checked == true){
                //https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Drawing_text
                    //clear the canvas
                    context.clearRect(0, 0, c.w, c.h);
                    //reload the image
                    var w = i.width;
                    var h = i.height;
                    var wthumb = ithumb.width;
                    var hthumb = ithumb.height;
                    context.drawImage(i, 0, 0, w, h);
                    //THEN add the new text to the image
                    var middle = c.width / 2;
                    var bottom = c.height - 430;
                    context.font = "60px sans-serif";
                    context.fillStyle = "#CE5043";
                    context.strokeStyle = "#CE5043";
                    context.textAlign = "center";
                    context.fillText(txt, middle, bottom);
                    context.strokeText(txt, middle, bottom);
                    //thumb
                    contextthumb.clearRect(0, 0, thumb.w, thumb.h);
                    contextthumb.drawImage(ithumb, 0, 0, wthumb, hthumb);
                    var middlethumb = thumb.width / 2;
                    var bottomthumb = thumb.height - 130;
                    contextthumb.font = "20px sans-serif";
                    contextthumb.fillStyle = "#CE5043";
                    contextthumb.strokeStyle = "#CE5043";
                    contextthumb.textAlign = "center";
                    contextthumb.fillText(txt, middlethumb, bottomthumb);
                    contextthumb.strokeText(txt, middlethumb, bottomthumb);
          
        }
            else{
                //https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Drawing_text

                    //clear the canvas
                    context.clearRect(0, 0, c.w, c.h);
                    //reload the image
                    var w = i.width;
                    var h = i.height;
                    var wthumb = ithumb.width;
                    var hthumb = ithumb.height;
                    context.drawImage(i, 0, 0, w, h);
                    //THEN add the new text to the image
                    var middle = c.width / 2;
                    var top = c.height - 50;
                    context.font = "60px sans-serif";
                    context.fillStyle = "#CE5043";
                    context.strokeStyle = "#CE5043";
                    context.textAlign = "center";
                    context.fillText(txt, middle, top);
                    context.strokeText(txt, middle, top);
                    //thumb
                contextthumb.clearRect(0, 0, thumb.w, thumb.h);
                contextthumb.drawImage(ithumb, 0, 0, wthumb, hthumb);
                var middlethumb = thumb.width / 2;
                var bottomthumb = thumb.height - 10;
                contextthumb.font = "20px sans-serif";
                contextthumb.fillStyle = "#CE5043";
                contextthumb.strokeStyle = "#CE5043";
                contextthumb.textAlign = "center";
                contextthumb.fillText(txt, middlethumb, bottomthumb);
                contextthumb.strokeText(txt, middlethumb, bottomthumb);
            
            }
        }
    }

init();