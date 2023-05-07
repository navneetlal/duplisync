import log4js from 'log4js'

log4js.addLayout('json', (config) => (logEvent) => JSON.stringify({ ...logEvent }) + config.separator ?? ',')

log4js.configure({
  appenders: {
    dev: { type: 'stdout', layout: { type: 'colored' } },
    prod: { type: 'stdout', layout: { type: 'json', separator: ',' } },
  },
  categories: {
    default: {
      appenders: ['dev'],
      level: 'debug',
      enableCallStack: true,
    },
    prod: {
      appenders: ['prod'],
      level: 'debug',
      enableCallStack: true,
    },
  },
})

export default process.env.NODE_ENV === 'production' ? log4js.getLogger('prod') : log4js.getLogger('default')
