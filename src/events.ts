import { TextDecoder } from "util";

import { Protobuf } from "@meshtastic/meshtasticjs";
import type { Hardware as HardwareType } from "@prisma/client";
import pkg from "@prisma/client";
import { connection, prisma } from "./index.js";
import { postMessage } from "./ssb";

const { Hardware } = pkg;

const addNode = async (node: Protobuf.NodeInfo): Promise<void> => {
  await prisma.node.upsert({
    where: {
      number: node.num,
    },
    create: {
      number: node.num,
      lastHeard: new Date(node.lastHeard * 1000),
    },
    update: {
      lastHeard: new Date(node.lastHeard * 1000),
    },
  });

  if (node.user) {
    addUser(node.user, node.num);
  }

  if (node.position) {
    addPosition(node.position, node.num);
  }

  if (node.num !== 0xffffffff) {
    await prisma.sNR.create({
      data: {
        snr: node.snr,
        node: {
          connect: {
            number: node.num,
          },
        },
      },
    });
  }
};

const addUser = async (user: Protobuf.User, nodeNum: number): Promise<void> => {
  await prisma.user.upsert({
    where: {
      userId: user.id,
    },
    create: {
      userId: user.id,
      longName: user.longName,
      shortName: user.shortName,
      hardware: user.hwModel
        ? Hardware[Protobuf.HardwareModel[user.hwModel ?? 0] as HardwareType]
        : Hardware.ANDROID_SIM,
      node: {
        connect: {
          number: nodeNum,
        },
      },
      mac:
        Buffer.from(user.macaddr)
          .toString("hex")
          .match(/.{1,2}/g)
          ?.join(":") ?? "",
    },
    update: {
      longName: user.longName,
      shortName: user.shortName,
    },
  });
};

const addPosition = async (
  position: Protobuf.Position,
  nodeNum: number
): Promise<void> => {
  if (
    position.latitudeI === 0 &&
    position.longitudeI === 0 &&
    position.altitude === 0 &&
    position.batteryLevel === 0
  ) {
    return;
  }

  const newPosition = await prisma.position.create({
    data: {
      latitude: position.latitudeI / 1e7,
      longitude: position.longitudeI / 1e7,
      altitude: position.altitude,
      batteryLevel: position.batteryLevel,
      node: {
        connect: {
          number: nodeNum,
        },
      },
    },
  });
  await prisma.node.update({
    where: {
      number: nodeNum,
    },
    data: {
      position: {
        connect: {
          id: newPosition.id,
        },
      },
    },
  });
};

export const RegisterSubscribers = () => {
  connection.onMeshPacket.subscribe(async (packet) => {
    if (packet.to === 0xffffffff) {
      await addNode(
        Protobuf.NodeInfo.create({
          num: 0xffffffff,
        })
      );
    }
    const nodes = await prisma.node.findMany({
      where: {
        number: {
          in: [packet.from, packet.to],
        },
      },
    });

    await Promise.all(
      [packet.from, packet.to].map(async (number) => {
        nodes.find((node) => node.number === number) ||
          (await addNode(
            Protobuf.NodeInfo.create({
              num: number,
            })
          ));
      })
    );
  });
  connection.onNodeInfoPacket.subscribe(async (packet) => {
    await addNode(packet.data);
  });

  connection.onPositionPacket.subscribe(async (packet) => {
    await addPosition(packet.data, packet.packet.from);
  });

  connection.onTextPacket.subscribe(async (packet) => {
    const nodeNum = connection?.myNodeInfo?.myNodeNum;
    if (nodeNum !== packet.packet.from) {
      try {
        const content = {
          type: "post",
          text: packet.data,
          loraTo:
            packet.packet.to === 0xffffffff ? -1 : packet.packet.to.toString(),
          loraPacketId: packet.packet.id.toString(),
          loraFrom: packet.packet.from.toString(),
          loraChannel: packet.packet.channel,
          loraRxSnr: packet.packet.rxSnr,
        };
        await postMessage(content);
      } catch (err) {
        console.log("Error sending message", err);
      }
    } else console.log('From node')
  });

  connection.onPrivatePacket.subscribe(async (packet) => {
    const msg = new TextDecoder().decode(packet.data);
    // if (new RegExp()) {

    // }

    console.log("msg");
  });

  connection.onUserPacket.subscribe(async (packet) => {
    await addUser(packet.data, packet.packet.from);
  });
};
