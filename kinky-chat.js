var Chat = (function () {
    function Chat() {
        var _this = this;
        this.BASE_URL_ = 'https://po-chat.firebaseio.com/';
        this.send = function (message) {
            var messageObj = { userName: _this.myName_, message: message };
            _this.chatFirebase_.push(messageObj);
        };
        this.chatFirebase_ = new Firebase(this.BASE_URL_ + 'chat');
        this.usersFirebase_ = new Firebase(this.BASE_URL_ + 'users');
    }
    Chat.prototype.connect = function (myName) {
        var _this = this;
        this.myName_ = myName;
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
        var myRef = this.usersFirebase_.child(myName);
        myRef.set(true);
        myRef.onDisconnect().set(false);
    };
    Chat.prototype.onUsers = function (func) {
        this.onUsersCallback_ = func;
    };
    Chat.prototype.onMessage = function (func) {
        this.onMessageCallback_ = func;
    };
    return Chat;
}());
var mapUserToStatus = {};
var myName;
$('#chatScreen').hide();
$('#loginButton').click(function () {
    myName = $('#nameInput').val();
    $('#loginScreen').hide();
    $('#chatScreen').show();
    login();
});
var chat = new Chat();
var login = function () {
    chat.connect(myName);
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
$('#messageSendButton').click(function () {
    var message = $('#messageInput').val();
    chat.send(message);
    $('#messageInput').val(''); // clear input
});
