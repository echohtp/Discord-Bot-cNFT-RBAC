const User = require('../models/userModel');
const axios = require('axios')


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

    const config = {
        headers: { Authorization: `Bearer ${process.env.UNDERDOG_API_KEY}` }
    }


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
                console.log("New user roles")
                console.log(roles)
                await user.save()

                
                let atts = {}
                for (var i = 0;i < roles.length; i++){
                    atts[roles[i]] = ""
                }

                await axios.put(`${process.env.UNDERDOG_API}/v2/projects/${process.env.UNDERDOG_PROJECT_ID}/nfts/${user.nftId}`, {attributes: atts, image: "https://ipfs.io/ipfs/bafybeigy65aewj3nxon4xpa7vfysvsqxmp6g5wm5s3dgx2o6pwhr6rgcgu"}, config)
            }
        }
    }
};
