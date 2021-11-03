import {
  IHTTPConnection,
  Protobuf,
  SettingsManager,
} from "@meshtastic/meshtasticjs";
import pkg from "@prisma/client";
import { App } from "@tinyhttp/app";
import { resolve } from "path/posix";
import { json } from "milliparsec";
import { getPosts, postMessage } from "./ssb";
import { RegisterSubscribers } from "./events.js";

const { PrismaClient } = pkg;

const app = new App();

SettingsManager.debugMode = Protobuf.LogRecord_Level.TRACE;
export const connection = new IHTTPConnection();
export const prisma = new PrismaClient();
// const deviceIP = "10.208.237.230";
const deviceIP = "meshtastic.local";

RegisterSubscribers();
async function connect() {
  console.log("Connecting to", deviceIP);
  await connection.connect({
    address: deviceIP,
    tls: false,
    receiveBatchRequests: false,
    fetchInterval: 2000,
  });
  console.log("Connected");
}

connect()

app
  .get("/", async (_, res) => {
    // const posts = await getPosts();
    // console.log("POSTS", posts);
    res.status(200);
  })
  .get("/connect", async (_, res) => {
    await connect();
    res.json(connection.url);
  })

  //API Routes,
  .get("/messages", async (_, res) => {
    res.json(await prisma.message.findMany());
  })
  .post("/message", async (req, res) => {
    await json()(req, res, (err) => void err && console.log(err));
    const stringified = JSON.stringify(req.body);
    // const message = JSON.stringify(req.body);
    console.log("🚀 ~ file: index.ts ~ line 44 ~ .post ~ message", req.body);
    // if (!message || !message.content) res.json({ status: 500 });
    await connection.sendText(stringified, undefined, true);
    res.json({ status: 200 });
  })
  .get("/users", async (_, res) => {
    res.json(await prisma.user.findMany());
  })
  .get("/nodes", async (_, res) => {
    res.json(
      await prisma.node.findMany({
        include: {
          user: true,
        },
      })
    );
  })
  .get("/positions", async (_, res) => {
    res.json(await prisma.position.findMany());
  })
  .get("/user/:id", async (req, res) => {
    res.json(
      await prisma.user.findUnique({
        where: {
          id: req.params.id,
        },
      })
    );
  })
  .get("/node/:id", async (req, res) => {
    res.json(
      await prisma.node.findUnique({
        where: {
          id: req.params.id,
        },
      })
    );
  })
  .get("/node/:id/position", async (req, res) => {
    res.json(
      await prisma.node.findUnique({
        where: {
          id: req.params.id,
        },
      })
    );
  })
  .get("/node/:id/positions", async (req, res) => {
    res.json(
      await prisma.node.findUnique({
        where: {
          id: req.params.id,
        },
      })
    );
  })

  .listen(3000, () => console.log("Started on http://localhost:3000"));
