const { poopStreak, addAchievementToUser } = require('../database/index')
module.exports = {
	id: 'ONE_YEAR_OF_SHIT',
	check: function (poop, user, message) {
		const streak = poopStreak(user.id)
		if (streak >= 365) {
			addAchievementToUser(user.id, this.id)
			message.reply('Ottenuta achievement: Un anno di merda!')
		}
	},
}
