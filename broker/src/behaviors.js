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
          message: event.data.message
        }
      };
      return [discordEvent]
    }

    case 'minechecker-players': {
      const discordEvent = {
        for: 'discord',
        name: 'sendMessage',
        data: {
          channel: 'picube-general',
          message: `${event.data.count} bob cat bois online`
        }
      };
      return [discordEvent]
    }

    default:
      console.log("Unhandled broker event:", event);
      return []
  }
}