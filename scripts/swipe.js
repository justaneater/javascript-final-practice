// 我寫的
// 1.fetch 資料
// 2.生成卡片並
// 3.帶入fetch來的資料到卡片中並顯示

// 我寫的

// 進階
// 根據條件篩選使用者
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
