const User = require('../models/userModel');
const {v4} = require('uuid');


module.exports = async (message, args) => {
    console.log("command register")
    if (args.length === 0) return message.reply('You did not provide a wallet address.');

    const requester = await User.findByPk(message.author.id)

    if (requester && requester.membershipNFTPublicKey != null) {
        return message.reply(`You already have your membership pass!`);
    }

    try {
        const _key = v4()
        await User.upsert({ id: message.author.id, username: message.author.username, solanaPublicKey: args[0], registrationKey: _key, roles: "" });
        message.reply(`Your wallet has been saved successfully.`);
        return message.reply(`Mint here: ${process.env.MINT_URL}/${_key}`)
        

    } catch (err) {
        console.error(err);
        return message.reply('There was an error trying to save your wallet address.');
    }
};
