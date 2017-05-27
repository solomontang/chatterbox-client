// YOUR CODE HERE:
//{ url: 'http://parse.hrsf.hackreactor.com/chatterbox/classes/messages' };



var app = {
  server: 'http://parse.sfm6.hackreactor.com/chatterbox/classes/messages'
};

app.init = function() {
  // this.renderRoom();
  // this.query();
  this.fetch();
  $('.username').on('click', this.handleUsernameClick.call(this));
  $('#send .submit').on('submit', this.handleSubmit.call(this));
};

app.send = function(message) {
  console.log('send');
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

app.fetch = function() {
  console.log('fetch');
  $.ajax({
    url: this.server,
    type: 'GET',
    contentType: 'application/json',
    success: function(data) {
      console.log('chatterbox: Message received');
      console.log(data);
    },
    error: function(data) {
      console.error('chatterbox: Failed to receive message', data);
    }
  });
};

app.query = function() {
  $.ajax({
    type: 'OPTIONS',
    success: function(data) {
      console.log('success', data);
    },
    error: function(data) {
      console.log('error', data);
    }
  });
};

app.clearMessages = function() {
  $('#chats').empty();
};

app.renderMessage = function(message) {
  let {username, text, roomname} = message;

  let $messageWrapper = $('<div></div>');
  $messageWrapper.attr('class', 'messageEl');

  let $usernameEl = $(`<p>${username}</p>`);
  $usernameEl.attr('class', 'username');

  let $messageBodyEl = $(`<p>${text}</p>`);
  $messageBodyEl.attr('class', 'messageBody');

  $messageWrapper.append($usernameEl, $messageBodyEl);
  $('#chats').append($messageWrapper);
  //$('#chats').append(`<div><p class="${username}"></p><p><${text}</p></div>`);
};

app.renderRoom = function(roomName = '') {
  //--------consider whether this replaces old selector-----
  var $roomSelector;
  if ($('#roomSelect').length === 0) {
    $roomSelector = $('<select></select>');
    $roomSelector.attr('class', 'roomSelect');
    $('#main').append($roomSelector);
  }
  $roomSelector = $('#roomSelect');
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
};


// app.init();
