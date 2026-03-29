// 內建
// API模擬函數
async function fetchUserData() {
	try {
		// 從JSON檔案讀取資料
		const response = await fetch('./mock-api-data.json');
		const data = await response.json();


		// 直接回傳結果（不加 setTimeout）
		return {
			success: true,
			data: data,
			total: data.length
		};

	} catch (error) {
		console.error('Error fetching user data:', error);
		return {
			success: false,
			error: error.message,
			data: []
		};
	}
}
// 用這個印出fetchUserData() 抓到的資料：console.log(fetchUserData());
// fetchUserData() 會回傳一個 Promise 物件


// 獲取滑動統計
function getSwipeStatistics() {
	const stats = {
		total: swipeHistory.length,
		likes: swipeHistory.filter(s => s.action === 'like').length,
		rejects: swipeHistory.filter(s => s.action === 'reject').length,
		superlikes: swipeHistory.filter(s => s.action === 'superlike').length,
		likeRate: 0,
		today: 0
	};

	if (stats.total > 0) {
		stats.likeRate = ((stats.likes + stats.superlikes) / stats.total * 100).toFixed(1);
	}

	// 計算今天的滑動次數
	const today = new Date().toDateString();
	stats.today = swipeHistory.filter(s =>
		new Date(s.timestamp).toDateString() === today
	).length;

	return stats;
}



// 隨機打亂陣列
function shuffleArray(array) {
	const shuffled = [...array];
	for (let i = shuffled.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
	}
	return shuffled;
}

// 使用範例
async function loadAndDisplayUsers() {
	console.log('開始載入使用者資料...');

	const result = await fetchUserData();

	if (result.success) {
		console.log('成功載入資料:', result.data);

		// 篩選範例：25-30歲，距離5公里內
		const filtered = filterUsers(result.data, {
			minAge: 25,
			maxAge: 30,
			maxDistance: 5
		});

		console.log('篩選後的使用者:', filtered);

		// 隨機打亂順序
		const shuffled = shuffleArray(result.data);
		console.log('隨機排序的使用者:', shuffled);

		return shuffled;
	} else {
		console.error('載入失敗:', result.error);
		return [];
	}
}

