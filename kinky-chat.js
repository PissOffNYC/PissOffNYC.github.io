if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
    console.log('mobile!!');
    document.body.className = 'mobile';
}
else {
    document.body.className = 'desktop';
}
var Chat = (function () {
    // private myName_;
    function Chat() {
        this.BASE_URL_ = 'https://po-chat.firebaseio.com/';
        this.chatFirebase_ = new Firebase(this.BASE_URL_ + 'chat');
        this.usersFirebase_ = new Firebase(this.BASE_URL_ + 'users');
    }
    Chat.prototype.connect = function () {
        var _this = this;
        // this.myName_ = myName;
        this.usersFirebase_.on('value', function (snapshot) {
            var onlineUsers = [];
            var offlineUsers = [];
            snapshot.forEach(function (child) {
                if (child.val()) {
                    onlineUsers.push(child.key());
                }
                else {
                    offlineUsers.push(child.key());
                }
            });
            if (_this.onUsersCallback_) {
                _this.onUsersCallback_(onlineUsers, offlineUsers);
            }
        });
        this.chatFirebase_.on('value', function (snapshot) {
            var messages = [];
            snapshot.forEach(function (child) {
                if (_this.onMessageCallback_) {
                    messages.push(child.val());
                }
            });
            if (_this.onMessageCallback_) {
                _this.onMessageCallback_(messages);
            }
        });
        // var myRef = this.usersFirebase_.child(myName);
        // myRef.set(true);
        // myRef.onDisconnect().set(false);
    };
    // public send = (message :string) => {
    //   var messageObj = {userName: this.myName_, message: message};
    //   this.chatFirebase_.push(messageObj);
    // }
    Chat.prototype.onUsers = function (func) {
        this.onUsersCallback_ = func;
    };
    Chat.prototype.onMessage = function (func) {
        this.onMessageCallback_ = func;
    };
    return Chat;
}());
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
var login = function () {
    chat.connect();
    chat.onUsers(function (onlineUsers, offlineUsers) {
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
    chat.onMessage(function (messages) {
        console.log('got messages: ' + JSON.stringify(messages));
        var messagesDiv = $('#messages');
        messagesDiv.empty();
        for (var i = 0; i < messages.length; ++i) {
            var userName = messages[i].userName;
            var message = messages[i].message;
            messagesDiv.append('<div class="message"><span class="userName">' + userName + '</span>: ' + message + '</div>');
        }
        messagesDiv.scrollTop(messagesDiv[0].scrollHeight); // scroll to bottom
    });
};
login();
// $('#messageSendButton').click(() => {
//   var message = $('#messageInput').val();
//   chat.send(message);
//   $('#messageInput').val('');  // clear input
// });
