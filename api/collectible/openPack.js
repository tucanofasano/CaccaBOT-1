const {
	setMoney,
	getRarities,
	getCollectibles,
	addCollectibleToUser,
} = require('../../database')
const { authenticate } = require('../../middleware/auth')
const { client } = require('../../whatsapp/index')
const config = require('../../config.json')
const { MessageMedia } = require('whatsapp-web.js')

module.exports = async function (fastify, options) {
	fastify.get('/open', async (req, res) => {
		res.code(401).send({ error: 'This route will be available soon' })
		return

		const user = await authenticate(req, res)

		if (user.money < 5) {
			res.code(403).send({ error: "You can't afford this item" })
			return
		}

		setMoney(user.id, user.money - 5)
		const rarities = getRarities()
		const rarity = pickRarity(rarities)
		const collectiblesOfRarity = getCollectibles(rarity.id)
		const collectible =
			collectiblesOfRarity[
				Math.floor(Math.random() * collectiblesOfRarity.length)
			]
		delete collectible.rarity_id
		collectible.rarity = rarity.name
		addCollectibleToUser(user.id, collectible.id)
		if (config.whatsappModuleEnabled) {
			const media = await MessageMedia.fromUrl(collectible.asset_url)
			client.sendMessage(config.groupId, media, {
				caption: `*[PACK] ${user.username}* found *${collectible.name}* (${collectible.rarity})`,
			})
		}
		res.code(200).send(collectible)
	})
}

function pickRarity(rarities) {
	const randomChance = Math.random() * 100
	let runningSum = 0

	for (const rarity of rarities) {
		runningSum += rarity.chance
		if (randomChance < runningSum) {
			return rarity
		}
	}
}
