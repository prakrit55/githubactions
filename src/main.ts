import * as core from '@actions/core'
import * as github from '@actions/github'
import {assign} from './issueComment/assign'
// import {handlePullReq} from './pullReq/handlePullReq'


export async function run(): Promise<void> {
    try {
      switch (github.context.eventName) {
        case 'issue_comment':
          assign()
          break
  
        default:
          core.error(`${github.context.eventName} not yet supported`)
          break
      }
    } catch (error) {
      core.setFailed(String(error))
    }
  }
  
  run()