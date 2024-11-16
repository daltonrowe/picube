// const _exampleEvent = {
//   for: 'broker',
//   name: 'minechecker-players',
//   data: {
//     message: '5 players online'
//   }
// }

export function getBehaviors(event) {
  const { name, from } = event
  const behaviorKey = `${from}-${name}`

  if (name === 'serviceOnline') return [];

  switch (behaviorKey) {
    case 'minechecker-requireMsLogin': {
      return [{
        for: 'discord',
        name: 'sendMessage',
        data: {
          channel: 'picube-general',
          message: event.data.message
        }
      }]
    }

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
      console.log("Unhandled broker event:", event);
      return []
  }
}