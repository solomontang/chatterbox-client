// YOUR CODE HERE:
//{ url: 'http://parse.hrsf.hackreactor.com/chatterbox/classes/messages' };
var app = {
  url: 'http://parse.CAMPUS.hackreactor.com/chatterbox/classes/messages'
};

app.init = function() {
};

app.send = function(message) {
  $.ajax({
    url: this.url,
    type: 'POST',
    data: JSON.stringify(message),
    contentType: 'application/json',
    success: function(data) {
      console.log('chatterbox: Message sent');
    },
    error: function(data) {
      console.error('chatterbox: Failed to send message', data);
    }
  });
};

//app.fetch

