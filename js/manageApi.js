var milkcocoa = new MilkCocoa("eggipdy4kpy.mlkcca.com");
var groupDataStore = milkcocoa.dataStore("group");
var userDataStore = milkcocoa.dataStore("user");
var iconDataStore = milkcocoa.dataStore("icon");

window.onload = function(){
    alert("refresh group and user and icon DataStore!!!");
    // グループとアイコンのデータストアをクリア＆作成する

    var groupList = [
        {
            groupId:1,
            groupName:"group1",
            count:0
        },
        {
            groupId:2,
            groupName:"group2",
            count:0
        },
        {
            groupId:3,
            groupName:"group3",
            count:0
        },
        {
            groupId:4,
            groupName:"group4",
            count:0
        }
    ];

    var iconList = [
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

    // グループデータストア内の項目を一覧で取得
    groupDataStore.stream().sort("desc").next(function(err, datas) {
        // 取得したグループ情報を削除
        datas.forEach(function(data) {
            groupDataStore.remove(data.id);
        });
    });

    // ユーザデータストア内の項目を一覧で取得
    userDataStore.stream().sort("desc").next(function(err, datas) {
        // 取得したグループ情報を削除
        datas.forEach(function(data) {
            userDataStore.remove(data.id);
        });
    });

    // アイコンデータストア内の項目を一覧で取得
    iconDataStore.stream().sort("desc").next(function(err, datas) {
        // 取得したアイコン情報を削除
        datas.forEach(function(data) {
            iconDataStore.remove(data.id);
        });
    });

    for(i=0;i<groupList.length;i++){
        groupDataStore.push(
            {
                groupId  : groupList[i].groupId,
                groupName : groupList[i].groupName,
                count : groupList[i].count
            },
            function(err, pushed){
                // console.log("chatMessage pushed");
            },
            function(err) {
                console.log("groupDataStore push failed "+err);
            }
        )
    }

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
};
