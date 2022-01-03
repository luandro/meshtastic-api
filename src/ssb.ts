import SecretStack from "secret-stack";
import caps from "ssb-caps";
import operators from "ssb-db2/operators/index.js";
import ssbMaster from "ssb-master";
import ssbDb from "ssb-db2";
import ssbMigrate from "ssb-db2/migrate.js";
import ssbCompat from "ssb-db2/compat/index.js";
import ssbConfig from "ssb-config/inject.js";
import ssbEbt from "ssb-ebt";
import ssbFriends from "ssb-friends";
import ssbReplication from "ssb-replication-scheduler";
import ssbConn from "ssb-conn";
import ssbLan from "ssb-lan";
import ssbPromiscuous from "ssb-promiscuous";
import ssbMeshtastic from "./meshtasticSSB";

const opts = {};
let config = ssbConfig("teste-lora", opts);

const { where, and, type, author, toCallback } = operators;

const Server = SecretStack({ appKey: caps.shs })
  .use(ssbMaster)
  .use(ssbMigrate)
  .use(ssbDb)
  .use(ssbCompat)
  .use(ssbEbt)
  .use(ssbFriends)
  .use(ssbReplication)
  .use(ssbLan)
  .use(ssbConn)
  .use(ssbPromiscuous)
  .use(ssbMeshtastic);

const sbot = Server(config);
console.log('Secure Scuttlebutt started with ID:', sbot.whoami().id);

export const postMessage = (content: any) => {
  const keys = sbot.keys;
  return sbot.db.publishAs(keys, content, (err, data) => {
    if (err) {
      console.log("ERROR:", err);
      return err;
    }
    console.log("DATA", data);
    return data;
  });
};
