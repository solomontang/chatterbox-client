// YOUR CODE HERE:
//{ url: 'http://parse.hrsf.hackreactor.com/chatterbox/classes/messages' };



var app = {
  server: 'http://parse.sfm6.hackreactor.com/chatterbox/classes/messages'
};

app.init = function() {
  // this.renderRoom();
  // this.query();
  console.log('init');
  this.fetch();
  $('.username').on('click', this.handleUsernameClick.call(this));
  $('#send .submit').on('submit', this.handleSubmit.call(this));
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
      console.log(data);
      that.renderFeed(data);
    },
    error: function(data) {
      console.error('chatterbox: Failed to receive message', data);
    }
  });
};

app.clearMessages = function() {
  $('#chats').empty();
};

app.renderFeed = function(data) {
  //loop that builds each message
  var that = this;
  data.results.forEach((message) => {
    that.renderMessage(message);
  });
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

//app.filterFeed = function(data) {}
//use renderFeed
//TODO: should filter the fetched array messages by selected room for display
//property on app that is updated to current room upon selection
app.init();
