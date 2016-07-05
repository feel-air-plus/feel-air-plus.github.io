var milkcocoa = new MilkCocoa("eggipdy4kpy.mlkcca.com");
var locationDataStore = milkcocoa.dataStore("location");
var chatDataStore = milkcocoa.dataStore("chat");
var groupDataStore = milkcocoa.dataStore("group");
var userDataStore = milkcocoa.dataStore("user");
var iconDataStore = milkcocoa.dataStore("icon");

function dateFormatYYYYMMDDHHNNSS(date){
    var YYYY = date.getYear();
    if (YYYY < 1900){YYYY += 1900}
    var MM = String(date.getMonth()+1);
    if (MM.length < 2){MM = "0" + MM}
    var DD = String(date.getDate());
    if (DD.length < 2){DD = "0" + DD}
    var HH = String(date.getHours());
    if (HH.length < 2){HH = "0" + HH}
    var NN = String(date.getMinutes());
    if (NN.length < 2){NN = "0" + NN}
    var SS = String(date.getSeconds());
    if (SS.length < 2){SS = "0" + SS}
    return Number(String(YYYY) + MM + DD + HH + NN + SS);
};

// ユーザIDを元にユーザ情報を取得
// TODO:本当はsetUserDataByUserId()の結果を単純にreturnしたかったけど、できなかったのでLSに格納
function setUserDataByUserId(userId){
    userDataStore.stream().sort("desc").next(function(err, datas) {
        for(var i=0;i<datas.length;i++){
        	if(userId == datas[i].value.userId){
        		setUserDataToLS(datas[i]);
        	};
        };
    });
};

// グループIDを元にグループ情報を取得する
function setGroupDataByGroupId(groupId){
    groupDataStore.stream().sort("desc").next(function(err, datas) {
        for(var i=0;i<datas.length;i++){
        	if(groupId == datas[i].value.groupId){
        		setGroupDataToLS(datas[i]);
        	};
        };
    });
};

// アイコン情報を全取得する
function setIconData(){
    iconDataStore.stream().sort("desc").next(function(err, datas) {
	    localStorage.removeItem("iconData");
		localStorage.setItem("iconData",JSON.stringify(datas));
    });
};

// ローカルストレージにログインユーザ情報格納
function setUserDataToLS(user){
    localStorage.removeItem("userData");
	localStorage.setItem("userData",JSON.stringify(user));
}

// ローカルストレージにログイングループ情報格納
function setGroupDataToLS(group){
    localStorage.removeItem("groupData");
	localStorage.setItem("groupData",JSON.stringify(group));
}
