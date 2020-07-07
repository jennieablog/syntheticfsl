$(function () {
  $('[data-toggle="tooltip"]').tooltip()
})

function infoshow() {
	document.getElementById("instruct-info").show();
}

function input1(e) {
    var inputBox = document.getElementById("handshape-box");
    inputBox.value = inputBox.value + e.value;
}

function input2(e) {
    var inputBox = document.getElementById("fingerspecs-box");
    inputBox.value = inputBox.value + e.value;
}