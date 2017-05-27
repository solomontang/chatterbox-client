// YOUR CODE HERE:
//{ url: 'http://parse.hrsf.hackreactor.com/chatterbox/classes/messages' };
$(document).ready( function () {
  app.init();
  //$('body').on('click', '#main', function() {alert();});
  $('body').on('click', '.username', function() {app.handleUsernameClick($(this));});
  // $('#send .submit').on('click', '#send .submit', app.handleSubmit);
  // $('.username').click(function() { app.handleUsernameClick(); });
  $('#send button').click(function() { app.handleMsgSubmit(); }); 
  $('.roomSelect').change(function() { app.filterFeed($('.roomSelect').val()); });
});


var app = {
  server: 'http://parse.sfm6.hackreactor.com/chatterbox/classes/messages',
  friends: [],
  data: {},
  roomname: 'lobby'
};

app.init = function() {
  // this.renderRoom();
  // this.query();
  this.fetch();
};

app.send = function(message) {
  let that = this;
  $.ajax({
    url: this.server,
    type: 'POST',
    data: JSON.stringify(message),
    contentType: 'application/json',
    success: function(data) {
      that.clearMessages();
      that.fetch();
    },
    error: function(data) {
      console.error('chatterbox: Failed to send message', data);
    }
  });
};

app.fetch = function() {
  let that = this;
  $.ajax({
    url: this.server,
    type: 'GET',
    data: {limit: 100},
    contentType: 'application/json',
    success: function(data) {
      data = that.scrubXSS(data);
      that.data = data;
      that.sortMessages(data);
      console.log(data);
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

app.sortMessages = function(data) {
  data.results.sort((a, b) => { a.createdAt - b.createdAt; });
  console.log('sorted', data);
};


app.renderAll = function(data) {
  //loop that builds each message
  var that = this;
  var roomList = [];
  //sort data.results before the following

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
  $usernameEl.attr('value', username);

  let $messageBodyEl = $(`<p>${text}</p>`);
  $messageBodyEl.attr('class', 'messageBody');


  $messageWrapper.append($usernameEl, $messageBodyEl);
  $('#chats').prepend($messageWrapper);
  //$('#chats').append(`<div><p class="${username}"></p><p><${text}</p></div>`);
};

app.renderRoom = function(roomName) {
  var $roomSelector;
  $roomSelector = $('.roomSelect');
  let $option = $('<option></option>');
  $option.attr('value', roomName);
  $option.text(roomName);
  $roomSelector.append($option);
};

app.handleUsernameClick = function($node) {
  let name = $node.attr('value');
  $('p[value="' + name + '"]').toggleClass('friend');
};

app.handleMsgSubmit = function() {
  
  //$('#send .submit').on('submit', this.handleSubmit.call(this));
  let msgText = $('#messageToSubmit').val();
  let message = {
    username: window.location.search.slice(10),
    text: msgText,
    roomname: this.roomname
  };
  app.send(message);
};

app.filterFeed = function(roomName) {
  var filteredMsgs = this.data.results.filter(function(message) {
    return message.roomname === roomName;
  });
  var newData = {results: filteredMsgs};
  this.clearMessages();
  this.renderAll(newData);
  this.roomname = roomName;
};

