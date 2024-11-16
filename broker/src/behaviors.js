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

    case 'minechecker-realmFound': {
      const discordEvent = {
        for: 'discord',
        name: 'sendMessage',
        data: {
          channel: 'picube-general',
          message: `${event.data.realm} successfully connected!`
        }
      };
      return [discordEvent]
    }

    case 'minechecker-backup': {
      const discordEvent = {
        for: 'discord',
        name: 'sendMessage',
        data: {
          channel: 'picube-general',
          message: `${event.data.file} backup complete`
        }
      };
      return [discordEvent]
    }

    case 'minechecker-players': {
      const discordEvent = {
        for: 'discord',
        name: 'sendMessage',
        data: {
          message: `${event.data.count} bob cat bois online`
        }
      };
      return [discordEvent]
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

      const discordEvent = {
        for: 'discord',
        name: 'sendMessage',
        data: {
          message: event.data.message
        }
      };
      return [lightsEvent, discordEvent]
    }

    default:
      console.log("Unhandled broker event:", event);
      return []
  }
}