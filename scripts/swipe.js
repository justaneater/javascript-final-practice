// 我寫的

async function initializeUserCards() {
    try {
        // 1.fetch 資料
        const result = await fetchUserData(); // 用 await 等資料回來
        if (result.success && result.data.length > 0) {
            // 拿到資料後打亂順序
            const shuffledUsers = shuffleArray(result.data);
            // 把卡片渲染到頁面上
            renderUserCards(shuffledUsers);
            // 啟用滑動偵測
            initSwipeDetection();
        }
    } catch (error) {
        console.error("初始化失敗:", error);
    }
    return;
}

// 2.生成卡片並
// 3.帶入fetch來的資料到卡片中並顯示
function renderUserCards(users) {
    const idSwiper = document.getElementById("swiper"); // 卡片區塊
    for (let user of users) {
        const userCard =` 
                    <div class="dzSwipe_card" data-user-id=${user.id} data-user-name=${user.name}>
                        <div class="dz-media">
                            <img src=${user.image} alt="">
                        </div>
                        <div class="dz-content">
                            <div class="left-content">
                                <span class="badge badge-primary d-inline-flex gap-1 mb-2">
                                    <i class="icon feather icon-map-pin"></i>
                                    ${user.location}
                                </span>
                                <h4 class="title">
                                    <a href="profile-detail.html">${user.name} , ${user.age}</a>
                                </h4>
                                <p class="mb-0">
                                    <i class="icon feather icon-map-pin"></i>
                                    ${user.distance} miles away
                                </p>
                                <ul class="intrest">
                                    <li><span class="badge">${user.interests[0]}</span></li>
                                    <li><span class="badge">${user.interests[1]}</span></li>
                                    <li><span class="badge">${user.interests[2]}</span></li>
                                </ul>
                            </div>
                            <a href="javascript:void(0);" class="dz-icon dz-sp-like">
                                <i class="flaticon flaticon-star-1"></i>
                            </a>
                        </div>
                        <div class="dzSwipe_card__option dzReject">
                            <i class="fa-solid fa-xmark"></i>
                        </div>
                        <div class="dzSwipe_card__option dzLike">
                            <i class="fa-solid fa-check"></i>
                        </div>
                        <div class="dzSwipe_card__option dzSuperlike">
                            <h5 class="title mb-0">Super Like</h5>
                        </div>
                        <div class="dzSwipe_card__drag"></div>
                    </div>`;
    idSwiper.innerHTML += userCard;
    }
    return;
}

// 我寫的


// (進階) 根據條件篩選使用者
function filterUsers(users, filters = {}) {
    return users.filter(user => {
        // 距離篩選
        if (filters.maxDistance && user.distance > filters.maxDistance) {
            return false;
        }

        // 年齡篩選
        if (filters.minAge && user.age < filters.minAge) {
            return false;
        }
        if (filters.maxAge && user.age > filters.maxAge) {
            return false;
        }

        // 興趣篩選
        if (filters.interests && filters.interests.length > 0) {
            const hasCommonInterest = user.interests.some(interest =>
                filters.interests.includes(interest)
            );
            if (!hasCommonInterest) {
                return false;
            }
        }

        return true;
    });
}

