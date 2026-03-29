// Like History and Match Functionality

// 從 mock-api-data.json 載入使用者資料
async function fetchUserData() {
    try {
        const response = await fetch('./mock-api-data.json');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching user data:', error);
        return [];
    }
}

// 從 sessionStorage 取得 like 記錄
function getLikedUserIds() {
    const swipeHistory = sessionStorage.getItem('swipeHistory');
    if (!swipeHistory) {
        return;
    }

    try {
        const history = JSON.parse(swipeHistory);
        // 篩選出 action 為 'like' 或 'superlike' 的記錄
        const likedUsers = history.filter(record =>
            record.action === 'like' || record.action === 'superlike'
        );
        // 取得 userId 陣列，避免重複
        // likedUsers.map(record => record.userId):從每個物件中取出 userId，形成一個陣列。=> ["10", "10", "9"]
        // Set 是一種「不允許重複項目」的資料結構，Set 不是陣列，所以不能用 .map() 或 .forEach()
        // ... 把 Set 攤開 → 變成普通陣列
        const userIds = [...new Set(likedUsers.map(record => record.userId))];
        return userIds;
    } catch (error) {
        console.error('Error parsing swipe history:', error);
        return [];
    }
}

// 生成單個喜歡的使用者卡片
function createLikedUserCard(user) {
    // 處理興趣標籤，取前3個
    let interestsText = '';
    if (user.interests && user.interests.length > 0) {
        interestsText = user.interests.slice(0, 3).join('、');
    }

    // 根據年齡和興趣生成描述
    let description = `${user.age}歲`;
    if (interestsText) {
        // windows打法
        /*
        按住 Alt
        在小鍵盤輸入 0149
        */
        // mac
        // Option + 8
        description += ` • 喜歡${interestsText}`;
    }
    if (user.location) {
        description += ` • ${user.location}`;
    }

    return `
        <div class="col-md-6 col-12 mb-2">
            <div class="dz-media-card style-3">
                <div class="dz-media">
                    <img src="${user.image}" alt="${user.name}">
                </div>
                <div class="dz-content">
                    <h3 class="title">${user.name}</h3>
                    <p>${description}</p>
                    <a href="profile-detail.html?id=${user.id}" class="btn btn-sm btn-light rounded-xl">查看資料</a>
                </div>
            </div>
        </div>
    `;
}

// 載入並顯示喜歡的使用者
async function loadLikedUsers() {
    try {
        // 取得喜歡的使用者ID
        const likedUserIds = getLikedUserIds();
        console.log('喜歡的使用者ID:', likedUserIds);

        const myLikeContainer = document.getElementById('myLike');

        if (likedUserIds.length === 0) {
            // 沒有喜歡的使用者，顯示空狀態
            myLikeContainer.innerHTML = `
                <div class="col-12 d-flex flex-column justify-content-center align-items-center" style="min-height: 70vh; padding: 2rem 0;">
                    <i class="fa-solid fa-heart text-muted" style="font-size: 3.5rem; margin-bottom: 1.5rem;"></i>
                    <h4 class="text-muted mb-3">還沒有喜歡的人</h4>
                    <p class="text-muted text-center mb-4">去首頁滑動卡片，喜歡的人會出現在這裡</p>
                    <a href="home.html" class="btn btn-primary">開始探索</a>
                </div>
            `;
            return;
        }

        // 載入所有使用者資料
        const allUsers = await fetchUserData();

        // 篩選出喜歡的使用者
        const likedUsers = allUsers.filter(user =>
            // 這個使用者的 ID 是否在喜歡清單裡？
            // .toString() 是為了確保型別一致（因為 includes() 比對字串會區分型別）
            likedUserIds.includes(user.id.toString())
        );

        console.log('喜歡的使用者資料:', likedUsers);

        // 生成卡片HTML
        let cardsHTML = '';
        likedUsers.forEach(user => {
            cardsHTML += createLikedUserCard(user);
        });

        // 更新頁面內容
        myLikeContainer.innerHTML = cardsHTML;

        // 顯示統計資訊
        console.log(`載入了 ${likedUsers.length} 位喜歡的使用者`);

    } catch (error) {
        console.error('載入喜歡的使用者時發生錯誤:', error);
        document.getElementById('myLike').innerHTML = `
            <div class="col-12 d-flex flex-column justify-content-center align-items-center" style="min-height: 70vh; padding: 2rem 0;">
                <i class="fa-solid fa-exclamation-triangle text-warning" style="font-size: 3.5rem; margin-bottom: 1.5rem;"></i>
                <h4 class="text-warning mb-3">載入失敗</h4>
                <p class="text-muted text-center mb-4">無法載入喜歡的使用者資料</p>
                <button onclick="loadLikedUsers()" class="btn btn-primary">重新載入</button>
            </div>
        `;
    }
}

// 清除喜歡記錄的函數（可選功能）
// function clearLikedUsers() {
//     if (confirm('確定要清除所有喜歡記錄嗎？')) {
//         sessionStorage.removeItem('swipeHistory');
//         loadLikedUsers();
//     }
// }

// ========== Match 功能 ==========

// 生成單個配對使用者卡片
function createMatchedUserCard(user) {
    // 處理興趣標籤，取前3個
    let interestsText = '';
    if (user.interests && user.interests.length > 0) {
        interestsText = user.interests.slice(0, 3).join('、');
    }

    // 根據年齡和興趣生成描述
    let description = `${user.age}歲`;
    if (interestsText) {
        description += ` • 興趣：${interestsText}`;
    }
    if (user.location) {
        description += ` • ${user.location}`;
    }

    return `
        <div class="col-md-6 col-12 mb-2">
            <div class="dz-media-card style-3">
                <div class="dz-media">
                    <img src="${user.image}" alt="${user.name}">
                    <div class="badge badge-success position-absolute" style="top: 10px; right: 10px;">
                        <i class="fa-solid fa-heart"></i> 配對成功
                    </div>
                </div>
                <div class="dz-content">
                    <h3 class="title">${user.name}</h3>
                    <p>${description}</p>
                    <a href="chat.html?id=${user.id}" class="btn btn-sm btn-primary rounded-xl">
                        <i class="fa-solid fa-comment"></i> 開始聊天
                    </a>
                </div>
            </div>
        </div>
    `;
}

// 載入並顯示配對的使用者（for match.html）
async function loadMatchedUsers() {
    try {
        // 取得我喜歡的使用者ID
        const likedUserIds = getLikedUserIds();
        console.log('我喜歡的使用者ID:', likedUserIds);

        const myMatchContainer = document.getElementById('myMatch');

        if (likedUserIds.length === 0) {
            // 沒有喜歡的使用者，顯示空狀態
            myMatchContainer.innerHTML = `
                <div class="col-12 d-flex flex-column justify-content-center align-items-center" style="min-height: 70vh; padding: 2rem 0;">
                    <i class="flaticon flaticon-sparkle text-muted" style="font-size: 3.5rem; margin-bottom: 1.5rem;"></i>
                    <h4 class="text-muted mb-3">還沒有配對成功</h4>
                    <p class="text-muted text-center mb-4">去首頁滑動卡片，當對方也喜歡你時就會配對成功</p>
                    <a href="home.html" class="btn btn-primary">開始探索</a>
                </div>
            `;
            return;
        }

        // 載入所有使用者資料
        const allUsers = await fetchUserData();

        // 篩選出配對的使用者（我喜歡且對方的 like 欄位為 true）
        const matchedUsers = allUsers.filter(user =>
            likedUserIds.includes(user.id.toString()) && user.like === true
        );

        console.log('配對成功的使用者:', matchedUsers);

        if (matchedUsers.length === 0) {
            // 有喜歡的人但沒有配對成功
            myMatchContainer.innerHTML = `
                <div class="col-12 d-flex flex-column justify-content-center align-items-center" style="min-height: 70vh; padding: 2rem 0;">
                    <i class="flaticon flaticon-sparkle text-muted" style="font-size: 3.5rem; margin-bottom: 1.5rem;"></i>
                    <h4 class="text-muted mb-3">還沒有配對成功</h4>
                    <p class="text-muted text-center mb-4">你已經喜歡了一些人，等待他們也喜歡你就會配對成功</p>
                    <a href="home.html" class="btn btn-primary">繼續探索</a>
                </div>
            `;
            return;
        }

        // 生成配對卡片HTML
        let matchCardsHTML = '';
        matchedUsers.forEach(user => {
            matchCardsHTML += createMatchedUserCard(user);
        });

        // 更新頁面內容
        myMatchContainer.innerHTML = matchCardsHTML;

        // 顯示統計資訊
        console.log(`載入了 ${matchedUsers.length} 位配對成功的使用者`);

    } catch (error) {
        console.error('載入配對使用者時發生錯誤:', error);
        document.getElementById('myMatch').innerHTML = `
            <div class="col-12 d-flex flex-column justify-content-center align-items-center" style="min-height: 70vh; padding: 2rem 0;">
                <i class="fa-solid fa-exclamation-triangle text-warning" style="font-size: 3.5rem; margin-bottom: 1.5rem;"></i>
                <h4 class="text-warning mb-3">載入失敗</h4>
                <p class="text-muted text-center mb-4">無法載入配對資料</p>
                <button onclick="loadMatchedUsers()" class="btn btn-primary">重新載入</button>
            </div>
        `;
    }
}

// 全域函數，可以在 match.html 中呼叫
// window.loadMatchedUsers = loadMatchedUsers;
