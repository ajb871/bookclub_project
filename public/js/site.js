var navOpen = true;
var chatOpen = true;

/* Set the width of the side navigation to 0 */
function closeNav() {
	if (navOpen === true){
		document.getElementById("mySidenav").style.width = "0px";
		document.getElementById("closebtn").style.left = "0px";
		document.getElementById("closebtn").innerHTML = "&#10095";

		navOpen = false;
	} else {
		document.getElementById("mySidenav").style.width = "10%";
		document.getElementById("closebtn").style.left = "10%";
		document.getElementById("closebtn").innerHTML = "&#10094";
		navOpen = true;
	}
}

function closeChat() {
	if (chatOpen === true){
		document.getElementById("chatSpace").style.width = "0px";
		document.getElementById("chatclosebtn").style.right = "0";
		document.getElementById("chatclosebtn").innerHTML = "&#10094";
		chatOpen = false;
	} else {
		document.getElementById("chatSpace").style.width = "16%";
		document.getElementById("chatclosebtn").style.right = "16%";
		document.getElementById("chatclosebtn").innerHTML = "&#10095";
		chatOpen = true;
	}
}