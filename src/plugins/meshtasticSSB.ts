import {connection} from '../index'

function sleep (time: number) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

export = {
  name: 'random',
  version: '1.0.0',
  manifest: {
    query: 'source',
  },
  permissions: {
    master: {
      allow: ['query'],
    },
  },
  init: function init(ssb: any) {
    return ssb.post(async (msg: object) => {
      console.log('NOVA MENSAGEM', msg, ssb.id)
      const isMine = msg?.value?.author === ssb.id
      if (msg.value && !isMine) {
        // send over lora
        if (msg?.value?.content?.type === 'post') {
          const loraMessage = `${msg.value.author}:\n${msg.value.content.text}`
          console.log('SENDING LORA PACKET')
          console.log(loraMessage)
          await connection.sendText(loraMessage, undefined, true);
          sleep(10)
        }
      }
    })
  }
}