// YOUR CODE HERE:
//{ url: 'http://parse.hrsf.hackreactor.com/chatterbox/classes/messages' };
$(document).ready( function () {
  console.log('inside doc ready');
  app.init();
  $('.username').on('click', app.handleUsernameClick);
  $('#send .submit').on('submit', app.handleSubmit);
});


var app = {
  server: 'http://parse.sfm6.hackreactor.com/chatterbox/classes/messages'
};

app.init = function() {
  // this.renderRoom();
  // this.query();
  console.log('init');
  this.fetch();
};

app.send = function(message) {
  //TODO: attach app.send functionality to 'submit' action
  //console.log('send');
  $.ajax({
    url: this.server,
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

app.fetch = function() {
  console.log('fetch');
  let that = this;
  $.ajax({
    url: this.server,
    type: 'GET',
    contentType: 'application/json',
    success: function(data) {
      console.log('chatterbox: Message received');
      //TODO: app.renderMessage for each element in the fetched array
      data = that.scrubXSS(data);
      that.renderAll(data);
    },
    error: function(data) {
      console.error('chatterbox: Failed to receive message', data);
    }
  });
};

app.clearMessages = function() {
  $('#chats').empty();
};

app.renderAll = function(data) {
  //loop that builds each message
  var that = this;
  var roomList = [];
  data.results.forEach((message) => {
    that.renderMessage(message);
    if (!roomList.includes(message.roomname)) {
      roomList.push(message.roomname);    
    }
  });
  console.log('roomList', roomList);
  for (room of roomList) {
    that.renderRoom(room);
  }
};

app.scrubXSS = function(data) {
  console.log('scrub');
  data.results.forEach( function(message) {
    for (var key in message) {
      message[key] = xssFilters.inHTMLData(message[key]);
    }
  });
  return data;
};


app.renderMessage = function(message) {
  let {username, text, roomname} = message;

  let $messageWrapper = $('<div></div>');
  $messageWrapper.attr('class', 'chat');

  let $usernameEl = $(`<p>${username}:</p>`);
  $usernameEl.attr('class', 'username');

  let $messageBodyEl = $(`<p>${text}</p>`);
  $messageBodyEl.attr('class', 'messageBody');

  $messageWrapper.append($usernameEl, $messageBodyEl);
  $('#chats').append($messageWrapper);
  //$('#chats').append(`<div><p class="${username}"></p><p><${text}</p></div>`);
};

app.renderRoom = function(roomName = '') {
  console.log('renderRoom');
  //--------consider whether this replaces old selector-----
  var $roomSelector;
  // console.log('roomSelect.length', $('.roomSelect').length);
  $roomSelector = $('.roomSelect');
  let $option = $('<option></option>');
  $option.attr('value', roomName);
  $option.text(roomName);
  $roomSelector.append($option);
};

app.handleUsernameClick = function() {
  console.log('Username clicked');
  //create friend's list?
};

app.handleSubmit = function() {
  console.log('submit clicked');
  //$('#send .submit').on('submit', this.handleSubmit.call(this));
  console.log('submit value', $('#send .submit').value);
};

//app.filterFeed = function(data) {}
//use renderFeed
//TODO: should filter the fetched array messages by selected room for display
//property on app that is updated to current room upon selection
