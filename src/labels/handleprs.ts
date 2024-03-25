import * as core from '@actions/core'
import * as github from '@actions/github'

import {Context} from '@actions/github/lib/context'

import { onPrClosed } from './onPrClosed'
import { onPrOnReview } from './onProgress'
import { labelIssue } from '../utills/labelling'




export const handlePullReq = async (
    context: Context = github.context
  ): Promise<void> => {
    const token = core.getInput('token', {required: true})
    console.log(token, "############################################# token")
    const octokit = new github.GitHub(token)
    const action: string | undefined = context.payload.action;

        try {
        switch (action) {
          case 'opened':
            core.debug('pr opened')
            return await onPrOnReview(context).catch(async e => {
              return e
            })

            case 'reopened':
            core.debug('pr opened')
            return await onPrOnReview(context).catch(async e => {
              return e
            })
  
          case 'closed':
            const runConfig = core.getInput('jobs', {required: false}).split(' ')
            const issueNumber = await onPrClosed(context)
            issueNumber !== null ? issueNumber : undefined
            runConfig.map(async command => {
                if (command == 'pr-merged' && issueNumber != undefined) {
                    await labelIssue(octokit, context, issueNumber, ["done"])
                }
            })
            break
  
          default:
            core.error(`${github.context.eventName} not yet supported`)
          break
        }
    } catch(e) {
        core.setFailed(`${e}`)
      }
  
    return
  }