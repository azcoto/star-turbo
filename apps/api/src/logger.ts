import pinoHttp from 'pino-http';

const logger = pinoHttp({
  transport: {
    targets: [
      {
        level: 'info',
        target: 'pino/file',
        options: {
          destination: 'my.log',
        },
      },
      {
        level: 'info',
        target: 'pino-pretty',
        options: {
          colorize: true,
        },
      },
    ],
  },
});

export default logger;
