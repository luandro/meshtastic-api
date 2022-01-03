import { connection } from "./index";
// import { addToQueue } from "./utils";

/* TODO: QUEUE */
/*
let queue = [];
let running = false;

async function runQueue() {
  running = true;
  // Send first LoRa packet from queue
  if (queue[0]) {
    console.log("SENDING LORA PACKET");
    console.log(queue[0]);
    try {
      const buffer = Buffer.from(queue[0]);
      // const buffer = Uint8Array.from(Buffer.from(queue[0]))
      await connection.sendPacket(
        buffer,
        397,
        undefined,
        true,
        false,
        false,
        (id: Promise) => {
          console.log("Message has been received on the other end", id);
          console.log("Running next on queue");
          // if ack is received remove first from queue
          queue.shift();
          // and send another
          runQueue();
        }
      );
    } catch (err) {
      console.log("Got error sending packet", err);
      runQueue();
    }
  }
}
*/

export = {
  name: "meshtasticSSB",
  version: "1.0.0",
  manifest: {
    // query: 'source',
  },
  permissions: {
    master: {
      allow: ["query"],
    },
  },
  init: function init(ssb: any) {
    return ssb.post(async (msg: object) => {
      console.log("NOVA MENSAGEM", msg, ssb.id);
      const isPubs = msg?.value?.author === ssb.id;
      // Add to queue if message is post or about and not the pub's
      if (
        (msg?.value?.content?.type === "post" ||
          msg?.value?.content?.type === "about") &&
        !isPubs
      ) {
        // TODO: Split message into envelope, and content pieces of 512 Bytes
        // Possible message example:
        // const loraMessage = [
        //   "yrXKc7C5riUVXB6ckaLZ7zzvn63G6AdzIEPM1esuu3EDS2whDr5DL2N8ILPGoa4pzp9cMd4O6kJEJEkr1", // signature 81 bytes
        //   "8094", // Sequence (Not sure) 4 bytes
        //   "2RNG", // author 4 chars 4 bytes
        //   "tz/6", // content.root 4 bytes
        //   "Hello", // content.text 400 bytes
        // ];
        // TODO: Store in a local queue
        // queue.push(loraMessage);
        // if (!running) runQueue();
        const loraMessage = `${msg.value.author}:\n${msg.value.content.text}`
        await connection.sendText(loraMessage, undefined, true, (i) => {
          console.log("Message has been received on the other end", i);
        });
      }
    });
  },
};
