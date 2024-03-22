import * as core from '@actions/core'
import * as github from '@actions/github'

import {Context} from '@actions/github/lib/context'


import {assign} from './assign'
import {unassign} from './unassign'

export const handleIssueComment = async (
    context: Context = github.context
  ): Promise<void> => {
    const commandConfig = core
      .getInput('prow-commands', {required: false})
      .replace(/\n/g, ' ')
      .split(' ')
    const commentBody: string = context.payload['comment']['body']
  
    await Promise.all(
      commandConfig.map(async command => {
        if (commentBody.includes(command)) {
          switch (command) {
                case '/assign':
                  return await assign(context).catch(async e => {
                    return e
                  })

                case '/unassign':
                  return await unassign(context).catch(async e => {
                    return e
                })
            }
        }
      })
    )
      .then(results => {
        for (const result of results) {
          if (result instanceof Error) {
            throw new Error(`error handling issue comment: ${result}`)
          }
        }
      })
      .catch(e => {
        core.setFailed(`${e}`)
      })
  }