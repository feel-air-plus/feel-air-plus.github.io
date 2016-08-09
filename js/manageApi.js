var milkcocoa = new MilkCocoa("eggipdy4kpy.mlkcca.com");
var groupDataStore = milkcocoa.dataStore("group");
var userDataStore = milkcocoa.dataStore("user");
var iconDataStore = milkcocoa.dataStore("icon");
var locationDataStore = milkcocoa.dataStore("location");
var chatDataStore = milkcocoa.dataStore("chat");
var mapDataStore = milkcocoa.dataStore("map");
var groupList;
var iconList;
var chatList = [];
var userList = [];

window.onload = function(){

    groupList = [
        {
            groupId:1,
            groupName:"group1",
            count:0,
            maxcount:4
        },
        {
            groupId:2,
            groupName:"group2",
            count:0,
            maxcount:4
        },
        {
            groupId:3,
            groupName:"group3",
            count:0,
            maxcount:4
        },
        {
            groupId:4,
            groupName:"group4",
            count:0,
            maxcount:4
        }
    ];

    iconList = [
        {
            iconId:1,
            iconName:"hakase",
            url:"hakase.png"
        },
        {
            iconId:2,
            iconName:"azarashi",
            url:"azarashi.png"
        },
        {
            iconId:3,
            iconName:"buta",
            url:"buta.png"
        },
        {
            iconId:4,
            iconName:"tanuki",
            url:"tanuki.png"
        }
    ];

    getChatData(function(){
        renderChat();
    })
    getUserData(function(){
        renderUser();
    })
};

function getChatData(callback){
    chatDataStore.stream().sort("desc").next(function(err, datas) {
        // 取得したユーザ情報を削除
        datas.forEach(function(data) {
            chatList.push(data);
        });
        callback();
    });
}

function getUserData(callback){
    userDataStore.stream().sort("desc").next(function(err, datas) {
        // 取得したユーザ情報を削除
        datas.forEach(function(data) {
            userList.push(data);
        });
        callback();
    });
}

function renderChat(){
    $("table.chat-tbl tbody").html("");  
    $('<tr>'+ 
      '<th>'+"ユーザ名"+'</th>'+  
      '<th>'+"チャット内容"+'</th>'+ 
      '<th>'+"タイムスタンプ"+'</th>'+ 
      '</tr>').appendTo('table.chat-tbl tbody');
    for(var index in chatList){
        var chat = chatList.value;
        $('<tr>'+ 
          '<td class="label">' +
              chatList[index].value.userName + 
          '</td>'+
          '<td class="label">' +
              chatList[index].value.message + 
          '</td>'+ 
          '<td class="label">' +
              dateFormatUnixToDate(chatList[index].timestamp) + 
          '</td>'+
          '</tr>').appendTo('table.chat-tbl tbody');
    }
}

function renderUser(){
    $("table.user-tbl tbody").html("");  
    $('<tr>'+ 
      '<th>'+"ユーザID"+'</th>'+  
      '<th>'+"ユーザ名"+'</th>'+  
      '<th>'+"グループID"+'</th>'+ 
      '<th>'+"タイムスタンプ"+'</th>'+ 
      '</tr>').appendTo('table.user-tbl tbody');
    for(var index in userList){
        var chat = userList.value;
        $('<tr>'+ 
          '<td class="label">' +
              userList[index].value.userId + 
          '</td>'+
          '<td class="label">' +
              userList[index].value.userName + 
          '</td>'+
          '<td class="label">' +
              userList[index].value.groupId + 
          '</td>'+ 
          '<td class="label">' +
              dateFormatUnixToDate(userList[index].timestamp) + 
          '</td>'+
          '</tr>').appendTo('table.user-tbl tbody');
    }
}

function deleteGroupData(){

    // グループデータストア内の項目を一覧で取得
    groupDataStore.stream().sort("desc").next(function(err, datas) {
        // 取得したグループ情報を削除
        datas.forEach(function(data) {
            groupDataStore.remove(data.id);
        });
    });
}
function createGroupData(){
    for(i=0;i<groupList.length;i++){
        groupDataStore.push(
            {
                groupId  : groupList[i].groupId,
                groupName : groupList[i].groupName,
                count : groupList[i].count,
                maxcount : groupList[i].maxcount
            },
            function(err, pushed){
                // console.log("chatMessage pushed");
            },
            function(err) {
                console.log("groupDataStore push failed "+err);
            }
        )
    }
}

function deleteIconData(){

   // アイコンデータストア内の項目を一覧で取得
    iconDataStore.stream().sort("desc").next(function(err, datas) {
        // 取得したアイコン情報を削除
        datas.forEach(function(data) {
            iconDataStore.remove(data.id);
        });
    });
};

function createIconData(){
    for(i=0;i<iconList.length;i++){
        iconDataStore.push(
            {
                iconId  : iconList[i].iconId,
                iconName : iconList[i].iconName,
                url : iconList[i].url,
            },
            function(err, pushed){
                // console.log("chatMessage pushed");
            },
            function(err) {
                console.log("iconDataStore push failed "+err);
            }
        )
    }
}

function deleteUserData(){
    // ユーザデータストア内の項目を一覧で取得
    userDataStore.stream().sort("desc").next(function(err, datas) {
        // 取得したユーザ情報を削除
        datas.forEach(function(data) {
            userDataStore.remove(data.id);
        });
    });
}

function deleteLocationData(){
    // ユーザデータストア内の項目を一覧で取得
    locationDataStore.stream().sort("desc").next(function(err, datas) {
        // 取得したユーザ情報を削除
        datas.forEach(function(data) {
            locationDataStore.remove(data.id);
        });
    });
}

function deleteChatData(){
    // ユーザデータストア内の項目を一覧で取得
    chatDataStore.stream().sort("desc").next(function(err, datas) {
        // 取得したユーザ情報を削除
        datas.forEach(function(data) {
            chatDataStore.remove(data.id);
        });
    });
}

function dateFormatUnixToDate(date){
    var d = new Date(date);
    var year = d.getFullYear();
    var month = d.getMonth() + 1;
    var day   = d.getDate();
    var hour  = ( d.getHours()   < 10 ) ? '0' + d.getHours()   : d.getHours();
    var min   = ( d.getMinutes() < 10 ) ? '0' + d.getMinutes() : d.getMinutes();
    var sec   = ( d.getSeconds() < 10 ) ? '0' + d.getSeconds() : d.getSeconds();
    return year + '/'  + month + '/' + day + ' ' + hour + ':' + min + ':' + sec;
};

function setMapData(){
    var zoom = $(".input_map_zoom")[0].value;
    mapDataStore.stream().sort("desc").next(function(err, datas) {
        if(datas.length){
            mapDataStore.set(datas[0].id, {
                zoom  : zoom
            });
        }else{
            mapDataStore.push(            
            {
                zoom  : zoom
            })
        }
    })
}
    