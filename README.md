# memorinda

Memorinda is developed during #Acikhack2022 Blockchain, NFT and Metaverse Hackathon in just 36 hours. Special thanks to [AçıkHack](www.acikhack.com), [Bilişim Vadisi](http://bilisimvadisi.com.tr/) and whole contributors/sponsors for organizing this event! 

## What is memorinda?

Memorinda is the blockchain-based event-management platform that can help event organizers to manage all activities before, during and after the event. It is a P2P platform powered by web3, which allows anyone to create events, reach crowds and distribute tickets. After the event, event organizers might distribute airdrop, share event contents and connect people that participate/own event content. Event content is conforming to ERC721 standard. Which means  people who own event content is basically own a non-fungible token. It can be exchanged, sold, bought easily throught blockchain protocol. The purpose of the memorinda is to create memory that is valuable to remember. People who participated the memorinda, basically creating event or content in memorinda, will be a part of the big picture, a collective memory of humanity.

## Layers

Memorinda consist of three layers. [1] A user layer that interact with layer 2 services to create event contents. [2] A service provider layer that use layer 3 as an event management protocol to access secure, fast and trustable event management service. [3] A blockchain protocol that is a backbone of the memorinde. Protocol is created using ERC721 standard and all event contents are non-fungible tokens.

### Client
A frontend application powered by web3, it is developed using React and Web3js. Source code is accessible inside `web/client`. In order to install `npm` packages following steps should be done.

```bash
# install required node modules
npm install

# create .env file for React App
echo "REACT_APP_URL=http://localhost:5000" > .env
```

### Service
A backend application that is managed by service provider to keep user information to authenticate during event in-person. It is developed using NodeJS and MongoDB is used as a database. Source code accessible inside `web/server`

```bash
# install required node modules
npm install
```

Create `config.env` file inside `web/server` to write environmental variables for database. You should add following fields. In order to create MongoDB database use [website](https://www.mongodb.com) and [official](https://www.mongodb.com/docs/atlas/getting-started/) tutorial.

```
# web/server/config.env
ATLAS_URI= <Mongo DB URI> 
PORT=5000
REACT_APP_URL=http://localhost:3000
```

Start your backend server locally.

```
npm start
```
### Contracts

A blockchain protocol that is responsible for on-chain operations. There are two contracts, `EventFactory` which is responsible for creating events and `Event` which is responsible to whole event operations; minting, selling, distributing etc.
```bash
# install required node modules
npm install

# migrate your contract locally
npx truffle migrate

# copy your migration files to client in order to make them accessible by web3
mkdir web/client/src/abis
cp ethereum/build/contracts/EventFactory.json web/client/src/abis
cp ethereum/build/contracts/Event.json  web/client/src/abis
```

After you can open web application from `localhost:3000`. However; in order to create buy/sell/mint tickets in memorinda you need to configure your [MetaMask Wallet](https://metamask.io) to correct host `localhost:7545` and correct channel id `1337`. You can follow [geeksforgeeks tutorial](https://www.geeksforgeeks.org/how-to-set-up-ganche-with-metamask/).

If you complete whole steps correctly, you will be able to access Memorinda. Congrats!
