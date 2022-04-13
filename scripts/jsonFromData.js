// import { argv } from process
import { Command } from 'commander'

import {
  resumeWorkHistory
} from '../lib/resumeWorkHistory.js'

import {
  resumeSkillInfo
} from '../lib/resumeSkillInfo.js'

import {
  resumeEducationHistory
} from '../lib/resumeEducationHistory.js'

import {
  resumeGeneralInfo
} from '../lib/resumeGeneralInfo.js'

const possibleOutputs = ['education', 'workhistory', 'skills', 'general'];

const program = new Command()

program
  .name('dumpJSON')
  .description('Dump raw JSON from defined data functions')
  .version("0.0.1")

program.command('dump')
  .description('dump JSON string from data object')
  .argument('<data>', 'data object to convert')
  .action((str, options) => {
    if (!str) throw new Error(`please specify one of ${possibleOutputs}`)
    if (possibleOutputs.includes(str)) {
      switch (str) {
        case 'general':
          console.log(JSON.stringify(resumeGeneralInfo(), null, 2))
          break
        case 'education':
          console.log(JSON.stringify(resumeEducationHistory(), null, 2))
          break
        case 'workhistory':
          console.log(JSON.stringify(resumeWorkHistory(), null, 2))
          break
        case 'skills':
          console.log(JSON.stringify(resumeSkillInfo(), null, 2))
          break
        default:
          console.log(`the dump argument should be one of ${possibleOutputs}`)
          break
      }
    }

    // console.log('the string is')
    // console.log(str)
    // console.log('the options are')
    // console.log(options)
  })

program.parse()

// console.log(process.argv)
// if (process.argv[1] === '' || process.argv.length < 2) {
//   console.log(`please supply an argument which is one of ${possibleOutputs}`)
// }

// const arguments = process.argv