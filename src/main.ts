import * as core from '@actions/core'
import * as github from '@actions/github'
// import {assign} from './issueComment/assign'
// import {unassign} from './issueComment/unassign'
import {handleIssueComment} from './issueComment/handleIssueComment'
// import { assigned } from './labels/assignd'
import {  onPrOnReview } from './labels/onProgress'
import { onPrClosed } from './labels/onPrClosed'
// import { assign } from './issueComment/assign'
import { assigned } from './labels/assignd'
import { unassigned } from './labels/unassigned'
import { handlePullReq } from './labels/handleprs'


export async function run(): Promise<void> {
  const action: string | undefined = github.context.payload.action;
    try {
      switch (github.context.eventName) {
        case 'issue_comment':
          handleIssueComment()
          break

        case 'pull_request':
          handlePullReq()
          break

        case 'issues':
          if (action == 'assigned') {
            assigned(github.context)
          } else {
            unassigned()
          }
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

