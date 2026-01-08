# Code Citations

## License: MIT
https://github.com/luizcarlospedrosogomes/transparenciaBRAPI/blob/0378a8b7f9a796a13dd994d86b1c34be4bcd9137/src/config/logger.js

```
.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger
```


## License: MIT
https://github.com/JensWinter/sags-uns-einfach-twitter-bot/blob/0c7d57aab8d95c2cc3466945b80f50897e11826c/create-week-stats.js

```
.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger
```


## License: MIT
https://github.com/adetola-ralph/todo-backend/blob/8db758810d47a59ed770c52aa7452673afc028fb/services/logger.js

```
.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger
```


## License: unknown
https://github.com/marcotgs/linkedin-learning/blob/b84609d7a8ba7e2eeaf46699c53da25c6ba8f7ce/Node.js%20Perfomance%20tuning/rock-paper-scissors/servers/shared/lib/logger.js

```
.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger
```


## License: unknown
https://github.com/Takyra/learning_application/blob/c8b535e6c08674245f1c0d1c239b97f8d982384d/server/libs/log.js

```
.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger
```


## License: MIT
https://github.com/adetola-ralph/todo-backend/blob/8db758810d47a59ed770c52aa7452673afc028fb/services/logger.js

```
.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple
```


## License: unknown
https://github.com/marcotgs/linkedin-learning/blob/b84609d7a8ba7e2eeaf46699c53da25c6ba8f7ce/Node.js%20Perfomance%20tuning/rock-paper-scissors/servers/shared/lib/logger.js

```
.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple
```


## License: unknown
https://github.com/Takyra/learning_application/blob/c8b535e6c08674245f1c0d1c239b97f8d982384d/server/libs/log.js

```
.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple
```


## License: MIT
https://github.com/luizcarlospedrosogomes/transparenciaBRAPI/blob/0378a8b7f9a796a13dd994d86b1c34be4bcd9137/src/config/logger.js

```
.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple
```


## License: MIT
https://github.com/JensWinter/sags-uns-einfach-twitter-bot/blob/0c7d57aab8d95c2cc3466945b80f50897e11826c/create-week-stats.js

```
.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple
```


## License: unknown
https://github.com/marcotgs/linkedin-learning/blob/b84609d7a8ba7e2eeaf46699c53da25c6ba8f7ce/Node.js%20Perfomance%20tuning/rock-paper-scissors/servers/shared/lib/logger.js

```
.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ]
});

if (process.env.NODE_ENV !== 'production') {
  
```


## License: unknown
https://github.com/Takyra/learning_application/blob/c8b535e6c08674245f1c0d1c239b97f8d982384d/server/libs/log.js

```
.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ]
});

if (process.env.NODE_ENV !== 'production') {
  
```


## License: MIT
https://github.com/luizcarlospedrosogomes/transparenciaBRAPI/blob/0378a8b7f9a796a13dd994d86b1c34be4bcd9137/src/config/logger.js

```
.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ]
});

if (process.env.NODE_ENV !== 'production') {
  
```


## License: MIT
https://github.com/JensWinter/sags-uns-einfach-twitter-bot/blob/0c7d57aab8d95c2cc3466945b80f50897e11826c/create-week-stats.js

```
.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ]
});

if (process.env.NODE_ENV !== 'production') {
  
```


## License: MIT
https://github.com/adetola-ralph/todo-backend/blob/8db758810d47a59ed770c52aa7452673afc028fb/services/logger.js

```
.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ]
});

if (process.env.NODE_ENV !== 'production') {
  
```


## License: MIT
https://github.com/JensWinter/sags-uns-einfach-twitter-bot/blob/0c7d57aab8d95c2cc3466945b80f50897e11826c/create-week-stats.js

```
.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.trans
```


## License: MIT
https://github.com/adetola-ralph/todo-backend/blob/8db758810d47a59ed770c52aa7452673afc028fb/services/logger.js

```
.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.trans
```


## License: unknown
https://github.com/marcotgs/linkedin-learning/blob/b84609d7a8ba7e2eeaf46699c53da25c6ba8f7ce/Node.js%20Perfomance%20tuning/rock-paper-scissors/servers/shared/lib/logger.js

```
.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.trans
```


## License: unknown
https://github.com/Takyra/learning_application/blob/c8b535e6c08674245f1c0d1c239b97f8d982384d/server/libs/log.js

```
.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.trans
```


## License: MIT
https://github.com/luizcarlospedrosogomes/transparenciaBRAPI/blob/0378a8b7f9a796a13dd994d86b1c34be4bcd9137/src/config/logger.js

```
.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.trans
```


## License: unknown
https://github.com/Takyra/learning_application/blob/c8b535e6c08674245f1c0d1c239b97f8d982384d/server/libs/log.js

```
.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format:
```


## License: MIT
https://github.com/luizcarlospedrosogomes/transparenciaBRAPI/blob/0378a8b7f9a796a13dd994d86b1c34be4bcd9137/src/config/logger.js

```
.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format:
```


## License: MIT
https://github.com/JensWinter/sags-uns-einfach-twitter-bot/blob/0c7d57aab8d95c2cc3466945b80f50897e11826c/create-week-stats.js

```
.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format:
```


## License: MIT
https://github.com/adetola-ralph/todo-backend/blob/8db758810d47a59ed770c52aa7452673afc028fb/services/logger.js

```
.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format:
```


## License: unknown
https://github.com/marcotgs/linkedin-learning/blob/b84609d7a8ba7e2eeaf46699c53da25c6ba8f7ce/Node.js%20Perfomance%20tuning/rock-paper-scissors/servers/shared/lib/logger.js

```
.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format:
```


## License: MIT
https://github.com/luizcarlospedrosogomes/transparenciaBRAPI/blob/0378a8b7f9a796a13dd994d86b1c34be4bcd9137/src/config/logger.js

```
.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple
```


## License: MIT
https://github.com/JensWinter/sags-uns-einfach-twitter-bot/blob/0c7d57aab8d95c2cc3466945b80f50897e11826c/create-week-stats.js

```
.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple
```


## License: MIT
https://github.com/adetola-ralph/todo-backend/blob/8db758810d47a59ed770c52aa7452673afc028fb/services/logger.js

```
.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple
```


## License: unknown
https://github.com/marcotgs/linkedin-learning/blob/b84609d7a8ba7e2eeaf46699c53da25c6ba8f7ce/Node.js%20Perfomance%20tuning/rock-paper-scissors/servers/shared/lib/logger.js

```
.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple
```


## License: unknown
https://github.com/Takyra/learning_application/blob/c8b535e6c08674245f1c0d1c239b97f8d982384d/server/libs/log.js

```
.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple
```

