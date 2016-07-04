var milkcocoa = new MilkCocoa("eggipdy4kpy.mlkcca.com");
var locationDataStore = milkcocoa.dataStore("location");
var chatDataStore = milkcocoa.dataStore("chat");
var groupDataStore = milkcocoa.dataStore("group");
var userDataStore = milkcocoa.dataStore("user");

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

// ユーザIDを元にユーザ情報を返却する
function getUserDataByUserId(userId){
    // ユーザデータストア内の項目を一覧で取得
    userDataStore.stream().sort("desc").next(function(err, datas) {
        // 取得したグループ情報を削除
        datas.forEach(function(data) {
        	if(userId == data.value.userId){
        		return data;
        	};
        });
    });
};

// グループIDを元にグループ情報を返却する
function getGroupDataByUserId(userId){

};