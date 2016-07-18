var milkcocoa = new MilkCocoa("eggipdy4kpy.mlkcca.com");
var groupDataStore = milkcocoa.dataStore("group");
var userDataStore = milkcocoa.dataStore("user");
var iconDataStore = milkcocoa.dataStore("icon");
var locationDataStore = milkcocoa.dataStore("location");
var chatDataStore = milkcocoa.dataStore("chat");
var groupList;
var iconList;

window.onload = function(){

    groupList = [
        {
            groupId:1,
            groupName:"乃木團",
            count:0,
            maxcount:7
        },
        {
            groupId:2,
            groupName:"孤独兄弟",
            count:0,
            maxcount:2
        },
        {
            groupId:3,
            groupName:"サンクエトワール",
            count:0,
            maxcount:5
        },
        {
            groupId:4,
            groupName:"からあげ姉妹",
            count:0,
            maxcount:2
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
};

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


