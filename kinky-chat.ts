declare var Firebase :any;
declare var $ :any;

if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
  console.log('mobile!!');
  document.body.className = 'mobile';
} else {
  document.body.className = 'desktop';
}

class Chat {
  private BASE_URL_ = 'https://po-chat.firebaseio.com/';
  private chatFirebase_ :any;
  private usersFirebase_ :any;
  private onUsersCallback_ :Function;
  private onMessageCallback_ :Function;
  // private myName_;

  constructor() {
    this.chatFirebase_ = new Firebase(this.BASE_URL_ + 'chat');
    this.usersFirebase_ = new Firebase(this.BASE_URL_ + 'users');
  }

  public connect(/*myName :string*/) {
    // this.myName_ = myName;
    this.usersFirebase_.on('value', (snapshot) => {
      var onlineUsers = [];
      var offlineUsers = [];
      snapshot.forEach((child) => {
        if (child.val()) {
          onlineUsers.push(child.key());
        } else {
          offlineUsers.push(child.key());
        }
      });
      if (this.onUsersCallback_) {
        this.onUsersCallback_(onlineUsers, offlineUsers);
      }
    });
    this.chatFirebase_.on('value', (snapshot) => {
      var messages = [];
      snapshot.forEach((child) => {
        if (this.onMessageCallback_) {
          messages.push(child.val());
        }
      });
      if (this.onMessageCallback_) {
        this.onMessageCallback_(messages);
      }
    });

    // var myRef = this.usersFirebase_.child(myName);
    // myRef.set(true);
    // myRef.onDisconnect().set(false);
  }

  // public send = (message :string) => {
  //   var messageObj = {userName: this.myName_, message: message};
  //   this.chatFirebase_.push(messageObj);
  // }

  public onUsers(func :Function) {
    this.onUsersCallback_ = func;
  }

  public onMessage(func :Function) {
    this.onMessageCallback_ = func;
  }
}

var mapUserToStatus = {};

// var myName;
// $('#chatScreen').hide();
// $('#loginButton').click(() => {
//   // myName = $('#nameInput').val();
//   $('#loginScreen').hide();
//   $('#chatScreen').show();
//   login();
// });

var chat = new Chat();
var login = () => {
  chat.connect(/*myName*/);

  chat.onUsers((onlineUsers :any, offlineUsers :any) => {
    var userList = $('#userList');
    userList.empty();
    for (var i = 0; i < onlineUsers.length; ++i) {
      var name = onlineUsers[i];
      userList.append('<div class="user">' + name + '</div>');
    }
    for (var i = 0; i < offlineUsers.length; ++i) {
      var name = offlineUsers[i];
      userList.append('<div class="user offline">' + name + ' [offline]</div>');
    }
  });

  chat.onMessage((messages :any) => {
    console.log('got messages: ' + JSON.stringify(messages));
    var messagesDiv = $('#messages');
    messagesDiv.empty();
    for (var i = 0; i < messages.length; ++i) {
      var userName = messages[i].userName;
      var message = messages[i].message;
      messagesDiv.append('<div class="message"><span class="userName">' + userName + '</span>: ' + message + '</div>');
    }
    messagesDiv.scrollTop(messagesDiv[0].scrollHeight);  // scroll to bottom
  });
}
login();


// $('#messageSendButton').click(() => {
//   var message = $('#messageInput').val();
//   chat.send(message);
//   $('#messageInput').val('');  // clear input
// });

