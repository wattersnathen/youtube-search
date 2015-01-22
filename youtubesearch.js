"use strict"
$(document).ready(function() {

  //_________________________show loading text when ajax starts
  $(document).bind('ajaxStart', function() {
    $("input[type='submit']").attr('value', '...loading');
  })
  //_________________________remove loading text when ajax stops
  .bind('ajaxStop', function() {
    $("input[type='submit']").attr('value', 'Submit');
  });

  //_________________________initiate app on form submit event
  $(function() {
    $("#search-youtube").submit(function( event ) {
      event.preventDefault();   // don't refresh the page

      // push the form area to the top of the page
      $("form").removeClass("start-middle").addClass("go-high");

      var searchTerm = $("#search-query").val();
      getResults(searchTerm);
    });
  });

  //_________________________make the $.getJSON call
  function getResults( searchTerm ) {
    var params = {
      part: 'snippet',          // required for YouTube v3 API request
      key: 'AIzaSyBIVxF2SP7ozlaVsOfTB8nj-1TJhkP3NsI',     // developer key
      type: 'video',            // only want videos, not playlists or channels
      videoEmbeddable: 'true',  // only return videos that can be embedded
      maxResults: 10,           // limit the search results to max of 10
      q: searchTerm             // query parameter
    },
    url = 'https://www.googleapis.com/youtube/v3/search'; // endpoint url

    $.getJSON(url, params, function ( data ) {
      showResults(data.items);
    });
  }

  //_________________________add the results to the DOM
  function showResults( results ) {
    var html = '';
    $.each(results, function( index, value ) {
      html += "<iframe src='http://www.youtube.com/embed/" + value.id.videoId + "' frameborder='0' allowfullscreen></iframe><br>";
    });
    $("#search-results").detach().html(html).appendTo(".container");
  }

});