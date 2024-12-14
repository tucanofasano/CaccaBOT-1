import moment from 'moment'
import { addAchievementToUser, getAchievement } from '../../database'
import { Poop } from '../../types/Poop'
import { RawUser } from '../../types/User'
import { Message } from 'whatsapp-web.js'
import { Achievement } from '../../types/Achievement'
import { configuration } from '../..'

const timezone = configuration.timezone || 'UTC'

const poopOnWheelchair: Achievement = {
	id: 'POOP_ON_WHEELCHAIR',
	check: function (poop: Poop, user: RawUser, message: Message) {
		const hour = moment.tz(poop.timestamp, timezone).hour()
		const minute = moment.tz(poop.timestamp, timezone).minute()
		if (hour == 1 && minute == 4) {
			addAchievementToUser(user.id, this.id)
			const achievement = getAchievement(this.id)
			message.reply(
				`*[ACHIEVEMENT] ${user.username}* unlocked *${achievement.name}*`,
			)
		}
	},
}

export default poopOnWheelchair
