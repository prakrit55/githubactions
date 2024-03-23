import * as core from '@actions/core'
import * as github from '@actions/github'
// import {assign} from './issueComment/assign'
// import {unassign} from './issueComment/unassign'
import {handleIssueComment} from './issueComment/handleIssueComment'
// import { assigned } from './labels/assignd'
import {  onPrOnReview } from './labels/onProgress'
import { onPrClosed } from './labels/onPrClosed'


export async function run(): Promise<void> {
    try {
      switch (github.context.eventName) {
        case 'issue_comment':
          handleIssueComment()
          break

        case 'pull_request':
          const action: string | undefined = github.context.payload.action;
          if (action == 'opened') {
          onPrOnReview(github.context)
          } else if (action == 'closed') {
            onPrClosed(github.context)
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

