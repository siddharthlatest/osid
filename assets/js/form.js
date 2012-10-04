$(document).ready(function() {
  if ($('#githubHandleJ').val() !== 'undefined')
    $('#githubHandle').val($('#githubHandleJ').val());
  if ($('#twitterHandleJ').val() !== 'undefined') {
    $('#twitterHandle').val($('#twitterHandleJ').val());
  }
  if ($('#organizationJ').val() !== 'undefined')
    $('#organization').val($('#organizationJ').val());
  if ($('#cellJ').val() !== 'undefined')
    $('#cell').val($('#cellJ').val());
  if ($('#emailJ').val() !== 'undefined')
    $('#email').val($('#emailJ').val());
  if ($('#firstnameJ').val() !== 'undefined')
    $('#firstname').val($('#firstnameJ').val());
  if ($('#lastnameJ').val() !== 'undefined')
    $('#lastname').val($('#lastnameJ').val());
  if ($('#hacklinkJ').val() !== 'undefined')
    $('#hacklink').val($('#hacklinkJ').val());
  if ($('#hackdescJ').val() !== 'undefined')
    $('#hackdesc').val($('#hackdescJ').val());
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
