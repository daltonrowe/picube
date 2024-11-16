// const _exampleEvent = {
//   for: 'broker',
//   name: 'minechecker-players',
//   data: {
//     message: '5 players online'
//   }
// }

export const getBehaviors = (event) => {
  const { name } = event
  switch (name) {
    case 'minechecker-players': {
      const lightsEvent = {
        for: 'lights',
        name: 'setTempEffect',
        data: {
          duration: 5,
          color: [0, 255, 0]
        }
      };

      const pingerEvent = {
        for: 'discord',
        name: 'sendMessage',
        data: {
          message: event.data.message
        }
      };
      return [lightsEvent, pingerEvent]
    }

    default:
      return []
  }
}