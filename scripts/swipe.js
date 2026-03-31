// 我寫的

const idSwiper = document.getElementById("swiper"); // 卡片區塊
async function initializeUserCards() {
    try {
        // 1.fetch 資料
        const result = await fetchUserData(); // 用 await 等資料回來
        if (result.success && result.data.length > 0) {
            // (進階) 根據預設條件篩選使用者
            let filters = getFilterInfo(); // 取得篩選條件
            [filters.swipedId, filters.action] = loadSwipeHistory();
            console.log(filters.swipedId);
            const filterResults = filterUsers(result.data, filters);
            console.log(`共 ${filterResults.length} 筆數據符合條件`);
            if (!filterResults.length) {
                idSwiper.innerHTML = renderEmptyCards();
                return;
            }
            // 拿到資料後打亂順序
            const shuffledUsers = shuffleArray(filterResults);
            // 把卡片渲染到頁面上
            const userCards = renderUserCards(shuffledUsers);
            idSwiper.innerHTML = renderEmptyCards() + userCards;
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
    let cards = "";
    for (let user of users) {
        const card =` 
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
        cards += card;
    }
    return cards;
}

// 我寫的


// (進階) 

// 取得篩選條件
function getFilterInfo() {
    console.log("獲取條件中...");
    // 最大距離、最小年齡
    const [maxDistanceElem, minAgeElem] = document.querySelectorAll(
        "span.example-val.title.slider-margin-value-min",
    );
    // 最大年齡
    const [, maxAgeElem] = document.querySelectorAll(
        "span.example-val.title.slider-margin-value-max",
    );
    // 性別
    const genderElem = document.querySelector("span.text-start.d-block");

    const maxDistance = Number(maxDistanceElem.textContent.replace("km", ""));
    const minAge = Number(minAgeElem.textContent);
    const maxAge = Number(maxAgeElem.textContent.replace(" - ", ""));
    const gender = genderElem.textContent;
    const filterResult = {
        maxDistance: maxDistance,
        minAge: minAge,
        maxAge: maxAge,
        gender: gender,
    };
    return filterResult;
}

// 根據條件篩選使用者
function filterUsers(users, filters={}) {
    const {maxDistance, minAge, maxAge, gender, swipedId, action} = filters;
    return users.filter(user => {
        // 距離篩選
        if (maxDistance && user.distance > maxDistance) {
            return false;
        }
        // 年齡篩選
        if (minAge && user.age < minAge) {
            return false;
        }
        if (maxAge && user.age > maxAge) {
            return false;
        }
        if (swipedId && swipedId.includes(String(user.id))) {
            const userIndex = swipedId.indexOf(String(user.id));
            if (action[userIndex]!="reject"){
                return false;
            }
        }
        // 性別篩選
        const femaleOnly =
            gender==="Female Only" && user.gender.toLowerCase()==="female";
        const maleOnly =
            gender==="Female Only" && user.gender.toLowerCase()==="female";
        const allGender = gender==="Show All" && user.gender;
        if (!femaleOnly && !maleOnly && !allGender) {
            return false;
        }
        // 興趣篩選
        // if (filters.interests && filters.interests.length > 0) {
        //     const hasCommonInterest = user.interests.some(interest =>
        //         filters.interests.includes(interest)
        //     );
        //     if (!hasCommonInterest) {
        //         return false;
        //     }
        // }
        return true;
    });
}

// 生成卡片(無符合條件的用戶)
function renderEmptyCards() {
    const card =` 
                <div class="dzSwipe_card">
                    <div class="dz-media">
                        <img src="./assets/images/error.png" alt="">
                    </div>
                </div>`;
    return card;
}

// 移除瀏覽過的卡片
idSwiper.addEventListener("mousedown", function () {
    const swipedCard = idSwiper.querySelector('div.dzSwipe_card.below');
    if (swipedCard && swipedCard.dataset.userId) {
        swipedCard.remove();
    }
    return;
})