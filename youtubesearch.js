"use strict"
$(document).ready(function() {

  $(document).bind('ajaxStart', function() {
    $("input[type='submit']").attr('value', '...loading');
  }).bind('ajaxStop', function() {
    $("input[type='submit']").attr('value', 'Submit');
  });

  $(function() {
    $("#search-youtube").submit(function( event ) {
      event.preventDefault();
      $("form").removeClass("start-middle").addClass("go-high");
      var searchTerm = $("#search-query").val();
      getResults(searchTerm);
    });
  });

  function getResults( searchTerm ) {
    var params = {
      part: 'snippet',
      key: 'AIzaSyBIVxF2SP7ozlaVsOfTB8nj-1TJhkP3NsI',
      type: 'video',
      videoEmbeddable: 'true',
      maxResults: 10,
      q: searchTerm
    },
    url = 'https://www.googleapis.com/youtube/v3/search';

    $.getJSON(url, params, function ( data ) {
      showResults(data.items);
    });
  }

  function showResults( results ) {
    console.log(results);
    var html = '';
    $.each(results, function( index, value ) {
      html += "<iframe src='http://www.youtube.com/embed/" + value.id.videoId + "' frameborder='0' allowfullscreen></iframe><br>";
    });
    $("#search-results").html(html);
  }

});