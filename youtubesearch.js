"use strict"
$(document).ready(function() {

  // Change submit button text when AJAX begins/is in progress
  $(document).bind('ajaxStart', function() {
    $("input[type='submit']").attr('value', '...loading');
  })
  // Change submit button text to 'Submit' when AJAX not in progress
  .bind('ajaxStop', function() {
    $("input[type='submit']").attr('value', 'Submit');
  });

  // hack to allow $.getJSON to work in IE
  $.support.cors = true;

  /*
   * Load more videos when the user scrolls to the bottom of the
   * current page. 'Infinite scroll effect'
   */
  $(window).on('scroll', scrollDebounce(function(event) {
    var wintop = $(window).scrollTop(), 
        docHeight = $(document).height(),
        winHeight = $(window).height();
    var scrollTrigger = 0.90;

    if ((wintop / (docHeight - winHeight)) > scrollTrigger) {
      nextPage();
    } 
      
  }, 100));

  /*
   * Scroll event calls the nextPage function for every scroll
   * detected within the designated vertical space. This results
   * in many AJAX calls within a very short amount of time. Use
   * this function as a wrapper to the scroll event handler to
   * prevent this behavior.
   */
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

  /*
   * Handler for form submit event. 
   */
  $(function() {
    $("#search-youtube").submit(function( event ) {
      event.preventDefault();   // don't refresh the page

      // push the form area to the top of the page
      $("div.start-middle").removeClass("start-middle").addClass("go-high");

      // clear out any old results
      $("#search-results").html('');

      var searchTerm = $("#search-query").val();
      getResults(searchTerm);
    });
  });

  /*
   * Setup the initial AJAX request. To be called when user submits the form.
   */
  function getResults( searchTerm ) {
    var url = 'https://www.googleapis.com/youtube/v3/search'; // endpoint url
    var params = {
      part: 'snippet, id',          // required for YouTube v3 API request
      key: 'AIzaSyBIVxF2SP7ozlaVsOfTB8nj-1TJhkP3NsI',     // developer key
      type: 'video',
      videoEmbeddable: 'true',  // only return videos that can be embedded
      maxResults: 5,           // limit the search results to max of 5
      q: searchTerm             // query parameter
    };

    makeAjaxCall(url, params); 
  }

  /*
   * Reusable function for making the AJAX request against the 
   * YouTube /v3 API. 
   */
  function makeAjaxCall(url, params) {
    var nextPageToken;

    // jQuery AJAX request
    $.getJSON(url, params, function ( data ) {

      // if the result set has additional videos
      // to search then add the query, url, and next page token
      // to the search-results div as data attributes
      if (data.nextPageToken) {
        $("#search-results").data("token", data.nextPageToken);
        $("#search-results").data("query", params.q);
        $("#search-results").data("url", url);
      }

      // display the result set to the user
      showResults(data.items);

    })
      // log failed AJAX request events
      .fail(function(jqxhr, textStatus, error){
        console.log("Error returned: " + textStatus + ", " + error);
    });
  }

  /*
   * Grab the next 'page' of results from the query. This function
   * gets called when the user scrolls towards the bottom of the page.
   */
  function nextPage() {

    // Get the query, url and nextPageToken from the search-results data attributes.
    var token = $('#search-results').data('token'); 
    var query = $('#search-results').data('query'); 
    var dUrl  = $('#search-results').data('url');

    // redefine YouTube v3 search parameters with added token
    var parameters = {
      part: 'snippet',          // required for YouTube v3 API request
      key: 'AIzaSyBIVxF2SP7ozlaVsOfTB8nj-1TJhkP3NsI',
      type: 'video',            // only want videos returned
      pageToken: token,         // next page of results
      videoEmbeddable: 'true',  // only return videos that can be embedded
      maxResults: 5,            // limit the search results to max of 5
      q: query
    };

    // make the request
    makeAjaxCall(dUrl, parameters);
  }

  /* 
   * Iterate through the results to create a HTML string then append
   * the string to the search-results div in the DOM.
   */
  function showResults( results ) {

    var html = '';
    $.each(results, function( index, value ) {
      html += "<iframe src='http://www.youtube.com/embed/" + value.id.videoId + "' frameborder='0' allowfullscreen></iframe><br>";
    });
    $("#search-results").append(html);
  }

});