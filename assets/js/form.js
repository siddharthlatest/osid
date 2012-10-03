$(document).ready(function() {
  $('#hackinfo').popover({
    trigger:'hover',
    delay: {show: 100, hide: 3000}
  });
  $('#githubhandleinfo').popover({
    trigger:'hover',
    delay: {show: 100, hide: 3000}
  });
  $('#register').submit(function() {
    $.post('/register', $('#register').serialize(), function(data) {
      console.log(data);
      $('#topOfContent').append('<div class="alert alert-block alert-success fade in" style=""><button type="button" class="close" data-dismiss="alert">&times;</button><p class="alert-heading">Registration successful.</p></div>');
    });
    return false;  // Stop from submitting again
  });
});