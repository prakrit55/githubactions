// Import necessary modules and functions for testing
import * as core from '@actions/core';
import * as github from '@actions/github';
import { assign } from './issueComment/assign';
import { run } from './main';

// Mock the core module
jest.mock('@actions/core');

// Mock the github module and its context
jest.mock('@actions/github', () => ({
  context: {
    eventName: 'issue_comment'
  }
}));

// Mock the assign function
jest.mock('./issueComment/assign', () => ({
  assign: jest.fn()
}));

describe('Your script test suite', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should call assign function for issue_comment event', async () => {
    await run();
    expect(assign).toHaveBeenCalled();
  });

  it('should log error for unsupported event', async () => {
    // Change the event name to something unsupported
    jest.spyOn(github.context, 'eventName', 'get').mockReturnValueOnce('unsupported_event');
    
    await run();
    expect(core.error).toHaveBeenCalledWith('unsupported_event not yet supported');
    expect(core.setFailed).toHaveBeenCalledWith('unsupported_event not yet supported');
  });

  it('should handle errors gracefully', async () => {
    const errorMessage = 'An error occurred';
    const error = new Error(errorMessage);

    // Mocking the assign function to throw an error
    (assign as jest.Mock).mockImplementation(() => {
      throw error;
    });

    await run();
    expect(core.setFailed).toHaveBeenCalledWith(errorMessage);
  });
});
