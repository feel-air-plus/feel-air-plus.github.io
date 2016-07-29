var milkcocoa = new MilkCocoa("eggipdy4kpy.mlkcca.com");var groupDataStore = milkcocoa.dataStore("group");var userDataStore = milkcocoa.dataStore("user");var iconDataStore = milkcocoa.dataStore("icon");var groupList;var userListInSelectedGroup;var totalUsingCount;var usingCountForEachGroupObj = [];var minHeight = 400;window.onload = function(){    var windowHeight = $(window).height();    if (windowHeight < minHeight) {        windowHeight  = minHeight;    }    $(".start").css('height', windowHeight);    // 画面描画時    // グループデータストア内の項目を一覧で取得    groupDataStore.stream().sort("desc").next(function(err, datas) {        groupList = datas;        // 取得したグループ情報を画面のセレクトボックスに反映        var totalGroupCount = 0;        datas.forEach(function(data) {            // 各グループの使用数を取得して連想配列でセット            totalGroupCount += data.value.maxcount;            setUsingCountForEachGroupObj(data.value.groupId, data.value.count);            // セレクトボックスの生成            createGroupRow(data);        });        // セッション利用数部分の生成        createUsingSessionRow(totalGroupCount);    });    // ユーザデータストア内の項目を一覧で取得    userDataStore.stream().sort("desc").next(function(err, datas) {        userListInSelectedGroup = datas;    });    // アイコンデータストア内の項目を一覧で取得    iconDataStore.stream().sort("desc").next(function(err, datas) {        // 取得したアイコン情報を元に画面のラジオボタンに反映        datas.forEach(function(data) {            createIconRow(data);        });    });    // TODO:ラジオボタンデフォルト選択指定};function createUsingSessionRow(totalGroupCount) {    var nowUsingSessionCount = getTotalUsingCount();    var maxUsingCount = totalGroupCount;    $("#usingSessionRow span").append(    + nowUsingSessionCount    + ' / '    + maxUsingCount    );}function createGroupRow(data){    var limitCountInGroup = data.value.maxcount;    // 各グループの使用数が上限値の場合は選択できないようにする    var propertyDisabled = '';    if (data.value.count >= limitCountInGroup) {        propertyDisabled = 'disabled="disabled"';    };    // グループのセレクトボックス要素を生成    $('.selectgroup').append(    '<option value="'    + data.value.groupId    + '" '    + propertyDisabled    +'>'    + data.value.groupName    + ' ('    + data.value.count    + ')'    + '</option>');};function createIconRow(data){    // アイコンのラジオボタン要素を生成    var iconName = data.value.iconName;    var iconUrl = "./img/"+data.value.url;    $('.icon-radio-row').append('<i class="'    + iconName + " unselected"    + '" onClick="selectedImg('    + data.value.iconId    + ')">');    $('.'+iconName).css('background', 'url('    + iconUrl    + ') no-repeat left top');};function enterChatMap() {    var selectedGroup = $(".selectgroup")[0].value;    var userName = $(".input__field")[0].value;    var selectedIcon = $("#iconVal").val();    var errorMessages = checkError(selectedGroup, userName, selectedIcon);    if (errorMessages.length > 0) {        // エラーメッセージ表示未対応        dispErrorMessages(errorMessages);        return;    }    // 選択しているグループの入室上限チェック    for(var i=0;i<groupList.length;i++){        if(groupList[i].value.groupId==selectedGroup){            if(groupList[i].value.count == groupList[i].value.maxcount){                alert("入室上限なり。");                return;            }else{                // 入室上限を+1                var num = groupList[i].value.count + 1;                groupDataStore.set(groupList[i].id, { 'count' : num});            }        }    }    // ユーザIDを作成    // ユーザIDは1〜4までで作成する    var userIdLimit = 5;    var userId = 0;    var userIdInDataStoreArray = [];    userIdInDataStoreArray.push(0);     // 選択しているグループを使用しているユーザIDを配列で取得する    for(var i=0;i<userListInSelectedGroup.length;i++){        if (userListInSelectedGroup[i].value.groupId==selectedGroup) {            userIdInDataStoreArray.push(userListInSelectedGroup[i].value.userId);        }    }    // 選択しているのグループの中のユーザID+1をユーザIDとして採番する    userId = Math.max.apply(null,userIdInDataStoreArray) + 1;    // ユーザ情報をユーザデータストアに反映    userDataStore.push(        {            userId            : userId,            userName          : userName,            groupId           : selectedGroup,            iconId            : selectedIcon        },        function(err, pushed){        },        function(err) {            console.log("userDataStore push failed "+err);        }    )    // ユーザ情報をセッションストレージに格納    sessionStorage.clear('userInfo');    var userInfo = {        userId  : userId,        userName: userNmane,        groupId : selectedGroup,        userName : userName,        iconId  : selectedIcon    };    sessionStorage.setItem('userInfo', JSON.stringify(userInfo));    var chatMapUrl = "chatMap.html";    location.href = chatMapUrl;};// エラーチェックfunction checkError(groupId, userName, imgIcon) {    var errorMessages = [];    // グループの未選択チェック    if (!groupId.length) {        errorMessages.push("グループを選択してください。");    }    // 名前の未入力チェック    if (!userName.length) {        errorMessages.push("名前を入力してください。");    }    // アイコンの未選択チェック    if (imgIcon == 0) {        errorMessages.push("アイコンを選択してください。");    }    // 入力されたユーザ名文字数上限チェック    if(userName.length > 5){        errorMessages.push("ユーザ名が上限文字数(5文字)を超えています。");    }    return errorMessages;}function setUsingCountForEachGroupObj(key, value) {    usingCountForEachGroupObj[key] = value;}function getTotalUsingCount() {    var sum = 0;    // console.log(Object.keys(usingCountForEachGroupObj).length);    for (var key in usingCountForEachGroupObj) {        sum += usingCountForEachGroupObj[key];    }    return sum;}// エラーメッセージの表示// 配列で受け取る// 配列の要素数だけ回してどこかに表示するfunction dispErrorMessages (errorMessages) {    var messageHtml = "";    for (var i = 0; i <= errorMessages.length -1; i++) {        messageHtml += "<p>"            + errorMessages[i]            + "</p>\n";    }    $('.errorMessages-area').empty();    $('.errorMessages-area').addClass('errorMessages-on');    $('.errorMessages-area').append(messageHtml);}function selectedImg(num) {    $('i').removeClass('selected');    $('#iconVal').val(num);    var iconVal = num - 1;    $('i:eq(' + iconVal + ')').addClass('selected');}// リサイズ時高さ変更var timer = false;$(window).resize(function() {    if (timer !== false) {        clearTimeout(timer);    }    timer = setTimeout(function() {        var windowHeight = $(window).height();        if (windowHeight < minHeight) {           windowHeight  = minHeight;        }        $(".start").css('height', windowHeight);    }, 200);});