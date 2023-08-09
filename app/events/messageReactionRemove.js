const User = require('../models/userModel');

const ROLE_MESSAGES = {
    '1138248311845953561': {
        "💻": "developer",
        "🎨": "artist",
        "📝": "writer",
        "🎦": "video",
        "📸": "photographer"
    }
};

module.exports = async (reaction, user) => {
    if (reaction.partial) {
        // If the message this reaction belongs to was removed, the fetching might result in an API error which should be handled
        try {
            await reaction.fetch();
        } catch (error) {
            console.error('Something went wrong when fetching the message:', error);
            // Return as `reaction.message.author` may be undefined/null
            return;
        }
    }

    if (reaction.message.author.bot) return;
    const { message } = reaction;
    if (ROLE_MESSAGES[message.id]) {
        const role = ROLE_MESSAGES[message.id][reaction.emoji.name];
        if (role) {
            console.log(`Removing ${role} from ${user.id}`)
            const member = message.guild.members.cache.get(user.id);
            const roleObj = message.guild.roles.cache.find(r => r.name === role);
            if (roleObj) {
                member.roles.remove(roleObj);
                let user = await User.findByPk(message.author.id)
                let roles = Array.from(new Set(user.roles.split(','))).filter(a=>a !== role)
                user.roles = roles.join(",")
                await user.save()

            }
        }
    }
};
