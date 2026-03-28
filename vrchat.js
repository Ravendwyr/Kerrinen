
// define configuration options
import 'dotenv/config'
import tmi from '@tmi.js/chat'
import fs from 'fs'

import { KeyvFile } from 'keyv-file'
import { VRChat } from 'vrchat'

const debug = process.argv.slice(2)[0] == "--debug" ? true : false

// our pretty printer
function printMessage(message) {
    console.info(new Date().toLocaleTimeString(), message)
}

// our VRChat wrapper
const vrchat = new VRChat({
    application: {
        name: "Twitch chatbot for twitch.tv/ravendwyr",
        version: "1.0.0",
        contact: "https://github.com/Ravendwyr/Kerrinen",
    },
    authentication: {
        credentials: {
            username: process.env.VRCHAT_NAME,
            password: process.env.VRCHAT_PASS,
            twoFactorCode: process.env.VRCHAT_2FA,
        }
    },
    keyv: new KeyvFile({ filename: "./vrchat-cookies.json" }),
})

// our Twitch chat client
const kerrinen = new tmi.Client({ channels: [ process.env.TWITCH_NAME ], token: process.env.BOT_PASS })

kerrinen.on('message', async payload => {
    const { channel, user, message } = payload

    if (message.text.toLowerCase().trim() == "!world") {
        const { data: user } = await vrchat.getCurrentUser({ throwOnError: true })
        if (debug) fs.writeFile(`vrchat-getCurrentUser.txt`, JSON.stringify(user, null, 4), err => { if (err) throw err })

        if (user.presence.world == "offline") {
            kerrinen.say(channel, `${channel.login} is not logged in to VRChat.`)
        }

        else if (user.presence.world == "traveling") {
            const { data: world }  = await vrchat.getWorld({ path: { worldId: user.presence.travelingToWorld }, throwOnError: true })
            if (debug) fs.writeFile(`vrchat-getWorld.txt`, JSON.stringify(world, (key, value) => typeof value === "bigint" ? Number(value) : value, 4), err => { if (err) throw err })

            kerrinen.say(channel, `${channel.login} is travelling to "${world.name}" by ${world.authorName}. Learn more about the world at https://vrchat.com/home/world/${user.presence.travelingToWorld}/info`)
        }

        else if (user.presence.world.startsWith("wrld_")) {
            const { data: world }  = await vrchat.getWorld({ path: { worldId: user.presence.world }, throwOnError: true })
            if (debug) fs.writeFile(`vrchat-getWorld.txt`, JSON.stringify(world, (key, value) => typeof value === "bigint" ? Number(value) : value, 4), err => { if (err) throw err })

            kerrinen.say(channel, `${channel.login} is in a ${user.presence.instanceType} instance of "${world.name}" by ${world.authorName}. Learn more about the world at https://vrchat.com/home/world/${user.presence.world}/info`)
        }

        else {
            fs.writeFile(`vrchat-getCurrentUser.txt`, JSON.stringify(user, null, 4), err => { if (err) throw err })
            kerrinen.say(channel, `Unhandled exception. Please check the output file for more info.`)
        }
    }
})

kerrinen.on('join', async payload => {
    const { channel } = payload
    printMessage(`Connected to ${channel} as @${process.env.BOT_NAME}`)
})

// engage
const { data: data } = await vrchat.getCurrentUser({ throwOnError: true })
if (debug) fs.writeFile(`vrchat-getCurrentUser.txt`, JSON.stringify(data, null, 4), err => { if (err) throw err })

if (data.displayName) {
    printMessage(`Connected to VRChat API as ${data.displayName}`)
    kerrinen.connect()
} else if (data.requiresTwoFactorAuth) {
    printMessage(`Could not connect to VRChat API. Please update your two-factor code in the .env file and try again.`)
} else {
    printMessage(`Could not connect to VRChat API. Please check your .env credentials and try again.`)
}
