import { Message } from 'whatsapp-web.js'
import { Poop } from '../../types/Poop'
import { RawUser } from '../../types/User'
import moment from 'moment'
import { addAchievementToUser, getAchievement } from '../../database'
import { Achievement } from '../../types/Achievement'
import { config } from '../../config/loader'

const timezone = config.timezone || 'UTC'

const instantEffect: Achievement = {
	id: 'INSTANT_EFFECT',
	check: function (poop: Poop, user: RawUser, message: Message) {
		const timestamp = moment.tz(poop.timestamp, timezone).hour()
		if (timestamp >= 12 && timestamp < 14) {
			addAchievementToUser(user.id, this.id)
			const achievement = getAchievement(this.id)
			message.reply(
				`*[ACHIEVEMENT] ${user.username}* unlocked *${achievement.name}*`,
			)
		}
	},
}

export default instantEffect
