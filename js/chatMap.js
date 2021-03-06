var milkcocoa = new MilkCocoa("eggipdy4kpy.mlkcca.com");
var locationDataStore = milkcocoa.dataStore("location");
var chatDataStore = milkcocoa.dataStore("chat");
var groupDataStore = milkcocoa.dataStore("group");
var userDataStore = milkcocoa.dataStore("user");
var userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
var map;
var myid;
var zoom = 20;

// 初期表示時の処理
window.onload = function(){
    var userId = userInfo.userId;
    setUserDataByUserId(userId);
    setIconData();
    var lat = "";
    var lng = "";
    // 地図の拡大率を設定
    zoom = Number(userInfo.zoom);
    map = new GMaps({
        div: "#map",//id名
        lat: lat,//緯度
        lng: lng,//経度
        zoom: zoom,//縮尺
        panControl : false,//???
        streetViewControl : false,//ストリートビュー表示
        overviewMapControl: false//???
    });
    // 画面描画時に現在地を取得
    getGeolocate(userId);
    setInterval(function(){
        // 10秒ごとに自分の位置情報送信
        updateGeolocate(userId);
        // 他者の位置情報を取得してマーカー情報更新
        refreshMarker();
    },10000);
};

// ログインしているグループ名称を画面上に表示
function renderGroupName(groupName) {
    $("#groupname").empty();
    $("#groupname").text(groupName);
};

// マーカー情報更新
function refreshMarker(){
    map.removeMarkers();
    locationDataStore.stream().size(20).sort("desc").next(function(err, datas) {
        datas.forEach(function(data) {
            if(userInfo.groupId == data.value.groupId){
                renderMarker(data);
            }
        });
    });
};

// マーカー情報画面反映
function renderMarker(data){
    var lat = data.value.lat, lng = data.value.lng, userId = data.value.userId;
    var iconList = JSON.parse(localStorage.getItem('iconData'));
    var icon;
    for(var i=0;i<iconList.length;i++){
        if(data.value.iconId == iconList[i].value.iconId){
            icon = iconList[i].value.url;
        }
    }
    var img = './img/'+icon;
    map.setCenter(lat, lng);
    var infoWindow = "<div id='infoWindow'></div>";
    map.addMarker({
        lat: lat,
        lng: lng,
        icon:img,
        details: {
            userId:data.value.userId,
            userName:data.value.userName,
            groupId:data.value.groupId
        },
        infoWindow: {
            content: infoWindow
        },
        click: function(e){
            var w = e.infoWindow;
            chatDataStore.stream().size(20).sort("asc").next(function(err, datas) {
                datas = datas.reverse();
                for(i=0;i<datas.length;i++){
                    if(e.details.groupId == datas[i].value.groupId && e.details.userId == datas[i].value.userId){
                        w.setContent("<div id='infoWindow'>"+datas[i].value.message+"</div>");
                        return;
                    }
                }
            });
            this.infoWindow.open(this.map, this);
        },
    });
};

// 自己の位置情報を新規追加する
function getGeolocate(userId){
    GMaps.geolocate({
        success: function(position) {
            locationDataStore.push({
                lat : position.coords.latitude,
                lng : position.coords.longitude,
                userId : userId,
                groupId : userInfo.groupId,
                userName: userInfo.userName,
                iconId : userInfo.iconId
            },function(err, pushed){
                myid = pushed['id'];
                // 他者の位置情報を取得してマーカー情報更新
                refreshMarker();
            });
        },
        error: function(error) {
            console.log('geolocate error '+error.message);
        },
        not_supported: function() {
            console.log("geolocate not support");
        },
    });
};

// 自己の位置情報を更新する
function updateGeolocate(userId){
    GMaps.geolocate({
        success: function(position) {
            locationDataStore.set(myid, {
                lat : position.coords.latitude,
                lng : position.coords.longitude,
            });
        },
        error: function(error) {
            console.log('geolocate error '+error.message);
        },
        not_supported: function() {
            console.log("geolocate not support");
        },
    });
};

// 入力されたチャット内容をデータストアに反映
function postMessage(){
    var textArea = document.getElementById("input-message");
    var chatMessage = textArea.value;
    var userId = userInfo.userId;
    var userName = userInfo.userName;
    var groupId = userInfo.groupId;
    var iconId = userInfo.iconId;
    textArea.value = "";
    if(chatMessage == "" || userId == ""){
        return;
    }
    chatDataStore.push(
        {
            userId  : userId,
            userName: userName,
            groupId : groupId,
            message : chatMessage,
            iconId  : iconId,
            date    : new Date()
        },
        function(err, pushed){
            // console.log("chatMessage pushed");
        },
        function(err) {
            console.log("chatMessage push failed "+err);
        }
    )
};

// 退室ボタン押下時の処理
function clickLogoutButton(){
    if(!window.confirm('退室しますがよろしいでしょうか？\nチャット情報はクリアされます。')){
        return;
    }
    var user = userInfo.userId;
    var group = userInfo.groupId;
    sessionStorage.clear('userInfo');
    clearUserRelationData(user,group,function(){
        // 各種データ削除処理が完了後に、TOPページに遷移する
        var indexUrl = "index.html";
        location.href = indexUrl;
    });
};

// 退室ボタン押下時の各種データストアクリア処理
function clearUserRelationData(user,group,callback){
    // チャット・ロケーション・ユーザ情報をクリア
    chatDataStore.stream().sort('desc').next(function(err, datas) {
        datas.forEach(function(data) {
            if(data.value.userId == user){
                chatDataStore.remove(data.id);
            }
        });
    });
    locationDataStore.stream().sort('desc').next(function(err, datas) {
        datas.forEach(function(data) {
            if(data.value.userId == user){
                locationDataStore.remove(data.id);
            }
        });
    });
    groupDataStore.stream().sort('desc').next(function(err, datas) {
        datas.forEach(function(data) {
            if(data.value.groupId == group){
                // 入室上限を-1
                var num = data.value.count - 1;
                groupDataStore.set(data.id, { 'count' : num});
            }
        });
    });
    userDataStore.stream().sort("desc").next(function(err, datas) {
        datas.forEach(function(data) {
            if(data.value.userId == user){
                userDataStore.remove(data.id);
            }
        });
        callback();
    });
};

$(function() {
    //チャットデータストア内の項目を一覧で取得
    chatDataStore.stream().size(20).sort("desc").next(function(err, datas) {
        datas.forEach(function(data) {
            var groupId =  userInfo.groupId;
            if(groupId == data.value.groupId){
                renderMessage(data);
            };
        });
    });

    // チャット内容変更のイベントを受け取った際に、チャットメッセージを表示
    chatDataStore.on("push", function(e) {
        renderMessage(e);
    });

    // グループデータストア内の項目を一覧で取得
    groupDataStore.stream().sort("desc").next(function(err, datas) {
        datas.forEach(function(data) {
            if(userInfo.groupId == data.value.groupId){
                renderGroupName(data.value.groupName);
            };
        });
    });

    //取得したチャットデータストア内の項目一覧を画面上に表示
    // ユーザが入室しているグループのチャット情報のみ表示させる
    function renderMessage(msg) {
        var iconList = JSON.parse(localStorage.getItem('iconData'));
        var icon;
        for(var i=0;i<iconList.length;i++){
            if(msg.value.iconId == iconList[i].value.iconId){
                icon = iconList[i].value.url;
            }
        }

        if(msg.value.userId == userInfo.userId){
            var classes = "chat-talk mytalk";
            var target = "myicon";
            var chatUser = userInfo.userName;
            var chatUserPosition = "right";
        }else{
            var classes = "chat-talk";
            var target = "tartgeticon";
            var chatUser = msg.value.userName;
            var chatUserPosition = "left";
        }

        $('#chat-frame').prepend(
        '<p class="'
        + classes
        + '"><span class="talk-icon">'
        + '<img src="./img/'
        + icon
        + '"'
        + 'alt="'
        + target
        + '"/></span>'
        + '<span class="talk-user '
        + chatUserPosition
        + '">'
        + chatUser
        + '</span>'
        + '<span class="talk-content">'
        + msg.value.message
        + '</span></p>');
    };
});
