$(function () {
  $('[data-toggle="tooltip"]').tooltip()
})

function infoshow() {
	document.getElementById("instruct-info").show();
}

function input(e) {
    var inputBox = document.getElementById("hs_transcription");
    inputBox.value = inputBox.value + e.value;
}
