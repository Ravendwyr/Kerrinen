# Kerrinen
Twitch chatbot for twitch.tv/ravendwyr

***

## Getting Started

1. Install [Node 22](https://nodejs.org/dist/latest-v22.x/) or newer.

2. Checkout the repository.

```
$ git clone https://github.com/Ravendwyr/Kerrinen.git
```

3. Install the necessary libraries.

```
$ cd kerrinen
$ npm install
```

4. Rename `.env.example` to `.env` and populate the necessary fields.

    `TWITCH_NAME` and `BOT_NAME` can be the same if you only have one Twitch account, and any valid oauth code will work for `TWITCH_PASS` and `BOT_PASS`.

    `VRCHAT_NAME`, `VRCHAT_PASS`, and `VRCHAT_2FA` need to be filled in with your actual VRChat login info, however a cookie file is created upon successful login and you'll only need to provide these once.

***

## vrchat.js

A quick and simple chatbot script for VRChat streamers on Twitch.  This script provides a `!world` command for your Twitch viewers to use to easily obtain a brief summary about the VRChat world you are currently visiting.

```
$ node vrchat
```

env tokens required: `VRCHAT_NAME`, `VRCHAT_PASS`, `VRCHAT_2FA`, `BOT_NAME`, `BOT_PASS`, `TWITCH_NAME`
