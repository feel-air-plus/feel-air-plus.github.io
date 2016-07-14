var milkcocoa = new MilkCocoa("eggipdy4kpy.mlkcca.com");
var locationDataStore = milkcocoa.dataStore("location");
var chatDataStore = milkcocoa.dataStore("chat");
var groupDataStore = milkcocoa.dataStore("group");
var userDataStore = milkcocoa.dataStore("user");
var userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
var map;
var myid;

window.onload = function(){
    var userId = userInfo.userId;
    setUserDataByUserId(userId);
    setIconData();
    var lat = "";
    var lng = "";
    map = new GMaps({
        div: "#map",//id名
        lat: lat,//緯度
        lng: lng,//経度
        zoom: 18,//縮尺
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

function refreshMarker(){
    map.removeMarkers();
    locationDataStore.stream().size(20).sort("desc").next(function(err, datas) {
        datas.forEach(function(data) {
            renderMarker(data);
        });
    });
};

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
    map.addMarker({
        lat: lat,
        lng: lng,
        title: 'I’m here',
        icon:img,
        click: function(e) {
        }
    });
    map.drawOverlay({
        lat: lat,
        lng: lng,
        layer: 'overlayLayer',
        content: '<div id="chatMessage"></div>',
        verticalAlign: 'top',
        horizontalAlign: 'center'
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
                userId : userId,
                iconId : userInfo.iconId
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

function postMessage(){
    var textArea = document.getElementById("input-message");
    var chatMessage = textArea.value;
    var userId = userInfo.userId;
    var groupId = userInfo.groupId;
    var iconId = userInfo.iconId;
    textArea.value = "";
    if(chatMessage == "" || userId == ""){
        return;
    }
    chatDataStore.push(
        { 
            userId  : userId,
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

$(function() {
    chatDataStore.on("push", function(e) {
        var user = e.value.userId;
        if($('.'+user).text()){
            //同一ユーザが既に投稿済みの文言を削除する
          $('.'+user).remove();
        }
        var userMessage = $('<div class='
          + user
          + '>'
          + '</div>').appendTo($("#chatMessage")).show();
        userMessage.css({
        })
        $('.'+user).addClass("overlay");
        $('.'+user).text(user+": "+e.value.message);
    });

    //チャットデータストア内の項目を一覧で取得
    chatDataStore.stream().size(20).sort("desc").next(function(err, datas) {
        datas.forEach(function(data) {
            var groupId =  userInfo.groupId;
            if(groupId == data.value.groupId){
                renderMessage(data);                
            };
        });
    });

    chatDataStore.on("push", function(e) {
        // チャット内容変更のイベントを受け取った際に、チャットメッセージを表示
        renderMessage(e);
    });

    function renderMessage(msg) {
        //取得したチャットデータストア内の項目一覧を画面上に表示
        // ユーザが入室しているグループのチャット情報のみ表示させる
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
        }else{
            var classes = "chat-talk";
            var target = "tartgeticon";
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
        + '<span class="talk-content">'
        + msg.value.message
        + '</span></p>');
    };
});
