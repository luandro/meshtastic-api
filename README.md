# LoRa Pub: Meshtastic <--> Secure Scuttlebutt

## Features

- Pub transmits

## Usage

Make sure you have [NodeJs](https://github.com/nvm-sh/nvm#installing-and-updating) >= v16, [Rust](curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
) and [nj-cli](https://lib.rs/crates/nj-cli) installed.

First intall the dependencies with `npm install` and run the project with `npm start`.

## Docker

Build with docker with `docker build -t meshtastic-api .`

Then run with `docker run --network host -d meshtastic-api`

### Todo

- Sync strategy
- Acknowledgement of receipt
- Send & receive about messages
- Send & receive base64 images