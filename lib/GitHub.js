
import { Octokit } from '@octokit/rest';

export default class GitHub {
  #defaultRepository = 'home-data';
  #ctx = new Octokit({
    auth: process.env.GITHUB_TOKEN || this.token || null,
  });
  constructor(props = {}) {
    Object.assign(this, props);
    this.owner = props.owner || 'apsamuel';
    this.context = props.ctx || this.#ctx;
  }

  async repository(name) {
    const owner = this.owner;
    const repo = name || this.#defaultRepository;
    const result = await this.context.repos.get({
      owner,
      repo,
    });
    if (result.status && result.status === 200) {
      return new Repository(this, { ...result.data });
    }
  }
}

class Repository {
  constructor(hub, props = {}) {
    this.hub = hub;
    this.context = this.hub.context;
    Object.assign(this, props);
  }

  async files(path = '.', ref = 'main') {
    const owner = this.hub.owner;
    const repo = this.name;
    const result = await this.context.repos.getContent({
      owner,
      repo,
      path,
      ref,
    });
    if (result.status && result.status === 200) {
      // if (result.type === 'file' && result.content && typeof result.content === 'string') return result.content.toString()
      if (Array.isArray(result.data)) {
        return result.data;
      }
      if (
        typeof result.data === 'object' &&
        result.data.content &&
        typeof result.data.content === 'string'
      ) {
        return new Buffer.from(result.data.content, 'base64').toString('ascii');
      }
      // return result.data
    }
  }
}
