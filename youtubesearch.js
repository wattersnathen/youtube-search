"use strict"
$(document).ready(function() {

  var isWorking = 0;

  //_________________________show loading text when ajax starts
  $(document).bind('ajaxStart', function() {
    $("input[type='submit']").attr('value', '...loading');
  })
  //_________________________remove loading text when ajax stops
  .bind('ajaxStop', function() {
    $("input[type='submit']").attr('value', 'Submit');
  });

  //_________________________
  $(window).on('scroll', scrollDebounce(function(event) {
    var wintop = $(window).scrollTop(), 
        docHeight = $(document).height(),
        winHeight = $(window).height();
    var scrollTrigger = 0.90;

    if ((wintop / (docHeight - winHeight)) > scrollTrigger) {
      nextPage();
    } 
      
  }, 250));

  //_________________________initiate app on form submit event
  $(function() {
    $("#search-youtube").submit(function( event ) {
      event.preventDefault();   // don't refresh the page

      // push the form area to the top of the page
      $("div.start-middle").removeClass("start-middle").addClass("go-high");

      var searchTerm = $("#search-query").val();
      getResults(searchTerm);
    });
  });

  //_________________________make the $.getJSON call
  function getResults( searchTerm ) {
    var url = 'https://www.googleapis.com/youtube/v3/search'; // endpoint url
    var params = {
      part: 'snippet, id',          // required for YouTube v3 API request
      key: 'AIzaSyBIVxF2SP7ozlaVsOfTB8nj-1TJhkP3NsI',     // developer key
      type: 'video',
      videoEmbeddable: 'true',  // only return videos that can be embedded
      maxResults: 5,           // limit the search results to max of 10
      q: searchTerm             // query parameter
    };

    makeAjaxCall(url, params);
    
  }

});

function scrollDebounce(func, interval) {
  var lastcall = -1;
  return function() {
    clearTimeout(lastcall);
    var args = arguments;
    var self = this;
    lastcall = setTimeout(function() {
      func.apply(self, args);
    }, interval);
  };
}

function nextPage() {

  var token = $('#search-results').data('token');
  var query = $('#search-results').data('query');
  var dUrl  = $('#search-results').data('url');

  var parameters = {
    part: 'snippet, id',          // required for YouTube v3 API request
    key: 'AIzaSyBIVxF2SP7ozlaVsOfTB8nj-1TJhkP3NsI',     // developer key
    type: 'video',
    pageToken: token,
    videoEmbeddable: 'true',  // only return videos that can be embedded
    maxResults: 5,           // limit the search results to max of 10
    q: query             // query parameter
  };

  makeAjaxCall(dUrl, parameters);
}

function makeAjaxCall(url, params) {
  var nextPageToken;
  $.getJSON(url, params, function ( data ) {
    $("#search-results").data("token", data.nextPageToken);
    $("#search-results").data("query", params.q);
    $("#search-results").data("url", url);
    showResults(data.items);
  }).fail(function(jqxhr, textStatus, error){
    console.log("Error returned: " + textStatus + ", " + error);
  });
}

//_________________________add the results to the DOM
function showResults( results ) {

  var html = '';
  $.each(results, function( index, value ) {
    html += "<iframe src='http://www.youtube.com/embed/" + value.id.videoId + "' frameborder='0' allowfullscreen></iframe><br>";
  });
  $("#search-results").append(html);
}