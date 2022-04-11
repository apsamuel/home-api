import {
  join as pathJoin,
  dirname
} from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

import { Server } from './lib/Server.js';
import { execFile, fork } from 'child_process';
// import { promisify } from 'util';

export { Server };
const controller = new AbortController()
const __filename = fileURLToPath(import.meta.url)



if (process.env.NODE_ENV && process.env.NODE_ENV === 'production') {
  const serverFile = pathJoin(dirname(__filename), 'server.js');
  console.log(`${JSON.stringify({
    event: 'load.source',
    time: new Date().toJSON(),
    source: serverFile
  })}`);
  const { signal } = controller
  const child = execFile('node', [serverFile], {
    signal,
    shell: true

  }, (error) => {
    console.log(`${JSON.stringify(error)}`) // abort error
  })

  child.on('spawn', () => {
    console.log(`${JSON.stringify({
      event: 'server.start',
      time: new Date().toJSON(),
      pid: child?.pid,

    })}`)
  })

  child.on('close', (code, signal) => {
    console.log(`${JSON.stringify({
      event: 'server.close',
      time: new Date().toJSON(),
      pid: child?.pid,
      code: code || 'no code',
      signal: signal || 'no signal'
    })}`)
  })

  child.on('exit', (code, signal ) => {
    console.log(
      `${JSON.stringify({
        event: 'server.exit',
        time: new Date().toJSON(),
        pid: child?.pid,
        code: code || 'no code',
        signal: signal || 'no signal',
      })}`
    );
  });

  child.on('disconnect', () => {
    // console.log(`server.disconnected ${new Date().toJSON()}`)
    console.log(`${JSON.stringify({
      event: 'process.detached',
      time: new Date().toJSON(),
      pid: child?.pid,

    })}`)
  })

  child.stdout.on('data', (data) => {
    // console.log(`server.stdout: ${data.toString()}`)
    console.log(`${JSON.stringify({
      event: 'server.stdout',
      time: new Date().toJSON(),
      message: data.toString()
    })}`)
  })

  child.stderr.on('data', (data) => {
    console.log(`server.stderr: ${data.toString()}`);
    console.log(`${JSON.stringify({
      event: 'server.stderr',
      time: new Date().toJSON(),
      message: data.toString()
    })}`)
  })

}


if (process.env.NODE_ENV && process.env.NODE_ENV === 'development') {
  const devFile = pathJoin(dirname(__filename), 'dev.js');
  console.log(
    `${JSON.stringify({
      event: 'load.source',
      time: new Date().toJSON(),
      source: devFile,
    })}`
  );
  const { signal } = controller;



  const child = fork(
    devFile,
    [],
    {
      signal,
      shell: false,
      env: { ...process.env }
    }
  );

  // console.log(child)

  child.on('spawn', () => {
    console.log(
      `${JSON.stringify({
        event: 'repl.start',
        time: new Date().toJSON(),
        pid: child?.pid,
      })}`
    );
  });

  child.on('close', (code, signal) => {
    console.log(
      `${JSON.stringify({
        event: 'repl.close',
        time: new Date().toJSON(),
        pid: child?.pid,
        code: code || 'no code',
        signal: signal || 'no signal',
      })}`
    );
  });

  child.on('exit', (code, signal) => {
    console.log(
      `${JSON.stringify({
        event: 'repl.exit',
        time: new Date().toJSON(),
        pid: child?.pid,
        code: code || 'no code',
        signal: signal || 'no signal',
      })}`
    );
  });

  child.on('disconnect', () => {
    // console.log(`server.disconnected ${new Date().toJSON()}`)
    console.log(
      `${JSON.stringify({
        event: 'repl.detached',
        time: new Date().toJSON(),
        pid: child?.pid,
      })}`
    );
  });

  // child.stdout.on('data', (data) => {
  //   // console.log(`server.stdout: ${data.toString()}`)
  //   console.log(
  //     `${JSON.stringify({
  //       event: 'server.stdout',
  //       time: new Date().toJSON(),
  //       message: data.toString(),
  //     })}`
  //   );
  // });

  // child.stderr.on('data', (data) => {
  //   console.log(`server.stderr: ${data.toString()}`);
  //   console.log(
  //     `${JSON.stringify({
  //       event: 'server.stderr',
  //       time: new Date().toJSON(),
  //       message: data.toString(),
  //     })}`
  //   );
  // });
}