(function (window, document) {

injectScript = function(url, options, callback) {
  var script = document.createElement('script');
  script.src = url;
  // Make sure the callback is a function​
  if (typeof callback === "function") {
    script.onload = function(){
    	callback(options);
    };
  }
  document.head.appendChild(script);
}

injectHTML = function(url, placeholder){
  localforage.getItem(url, function(err, value){
    if (err) {
      console.log(err);
    } else if (value === null) {
      $.ajaxSetup({
        crossOrigin: true,
        cache: true
      });
      $.get('http://alloworigin.com/get?url=' + 
        encodeURIComponent(url), function(response){
        if (response.contents !== undefined){
          // store in localstorage
          localforage.setItem(url, response.contents, function (err) {
            if (err) { console.log(err); }
          });
          $(placeholder).html(response.contents);
        }
      });
    } else {
      $(placeholder).html(value);
    }
  });
}

injectTemplate = function(name, data) {
  $.ajaxSetup({
    cache: false
  });
  if ($('#'+name+'-template').length == 0) {
    $.get('./assets/views/'+name+'.html', function(html){
      $('#'+name+'-placeholder').after(html); //use .after to see template, use .html to overwrite later
      renderTemplate(name, data);
    });
  } else {
    renderTemplate(name, data);
  }
}

renderTemplate = function(name, data){
  var source = $('#'+name+'-template').html();
  var template = Handlebars.compile( source );
  $('#'+name+'-placeholder').html( template( data ) ); 
}

}(this, this.document));