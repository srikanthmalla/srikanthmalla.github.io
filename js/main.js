var ALARM_URL = "/subs";
function refresh() {
  $.ajax({
  url: ALARM_URL,
  success: function(data) {
    $('#right').html(data);
  }
 });
}        
$(document).ready(function () {
  setInterval(function(){ refresh();}, 5000);
  // setInterval(function(){ alert("Hello"); }, 5000);
  console.log( "ready!" );
})

