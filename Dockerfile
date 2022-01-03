FROM node:lts

# Add cargo
# RUN apk update && apk add --no-cache rust cargo libc6-compat
RUN curl https://sh.rustup.rs -sSf | sh -s -- -y
# RUN ln -s /lib/libc.musl-x86_64.so.1 /lib/ld-linux-x86-64.so.2
# RUN curl --proto '=https' --tlsv1.2 -sSfy https://sh.rustup.rs | sh
ENV PATH="/root/.cargo/bin:${PATH}"
# RUN source $HOME/.cargo/env
RUN cargo install nj-cli

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./
COPY patches/* ./patches/

RUN npm install
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY . .

EXPOSE 3000
CMD [ "npm", "start" ]
