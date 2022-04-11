import { color } from './Color.js'
import { app } from './App.js'
import repl from 'repl'
import { createContext} from 'vm'
import { EventEmitter } from 'events'
import { inspect } from 'util'

export class Server extends EventEmitter {
  #application = app

  #writer(output) {
    const options = {
      colors: true,
      depth: 1,
      compact: 1,
      breakLength: Infinity,
      maxArrayLength: 10,
    }
    return inspect(output, options)
  }

  constructor(params = {}) {
    super(params)
    Object.assign(this, params)
    this.app = params.app || this.#application
    this.prompt = 'home-api> '
    this.input = params.input || process.stdin
    this.output = params.output || process.stdout
    this.error = params.error || process.stderr
  }

  start(port = 8081) {
    const server = this.app.listen(port, (err) => {
      console[err ? 'error' : 'log'](err || `Server running on ${port}`);
    });

    server.on('connection', (stream) => {
      console.log(JSON.stringify({
        event: 'client.connected',
        time: new Date().toJSON(),
        message: 'a client connected'
      }))
    })

    server.on('close', () => {
      console.log(JSON.stringify({
        event: 'server.closed',
        time: new Date().toJSON(),
        message: 'the server process stopped'
      }))
    })

    // adds server to class properties
    this.server = server
    // also returns the server object

    return server
  }

  repl() {
    const { prompt, input, output } = this
    const replServer = repl.start({
      prompt,
      input,
      output,
      writer: this.#writer
    })
    replServer.context = createContext({
      server: this,
      application: this.app,
      environment: process.env,
      process
    })
    replServer.on('exit', () => {
      console.log(JSON.stringify({
        event: 'repl.closed',
        time: new Date().toJSON(),
        message: 'the repl process exited'
      }))
    })
  }
}