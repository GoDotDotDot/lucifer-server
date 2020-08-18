import { Controller } from 'egg';
import * as Robot from 'lib/ding-talk';
'SEC427a65f5b7276cc1107f9a31fd64b513da630674536ba0a63aa84413d68d04d9';
'https://oapi.dingtalk.com/robot/send?access_token=8766a0b42b47d7663a006d58b8de45e7a6a07f2e9bd30cedcc90178d1355409e';
interface Commit {
  id: string;
  message: string;
  timestamp: string;
  url: string;
  author: object;
  added: Array<any>;
  modified: Array<any>;
  removed: Array<any>;
}

const HEADER_KEY = 'x-gitlab-event';

const HEADER_KEY_V2 = 'X-Gitlab-Event';

const EVENTS = {
  'Push Hook': 'push',
  'Tag Push Hook': 'tag_push',
  'Issue Hook': 'issue',
  'Note Hook': 'note',
  'Merge Request Hook': 'merge_request',
  'Review Hook': 'review',
};

const actionWords = {
  open: '发起',
  close: '关闭',
  reopen: '重新发起',
  update: '更新',
  merge: '合并',
  undefined: '-',
};
export default class Gitlab extends Controller {
  async webhook() {
    const event: string =
      this.ctx.request.header[HEADER_KEY] ||
      this.ctx.request.header[HEADER_KEY_V2];
    if (!event) {
      return this.ctx.failure({
        data: 'Sorry，这可能不是一个gitlab的webhook请求',
      });
    }

    const { access_token: accessToken, secret } = this.ctx.query;
    const robot = new Robot({
      accessToken,
      secret,
      curl: this.ctx.curl.bind(this.ctx)
    });

    // 检查是否是test事件
    if (this.ctx.request.header['x-event-test'] == 'true') {
      // test事件中仅处理push，否则推送太多
      if (EVENTS[event] == 'push') {
        return this.handleTest();
      } else {
        return this.ctx.success({ data: '其他test请求我可不会管' });
      }
    }

    let msg;
    switch (EVENTS[event]) {
      case 'push':
        msg = await this.handlePush();
        break;
      case 'merge_request':
        msg = await this.handleMR();
        break;
      case 'issue':
        msg = await this.handleIssue();
        break;
      case 'note':
        msg = this.handleNote();
        break;
      default:
        msg = await this.handleDefault(event);
        break;
    }

    console.log(JSON.stringify(msg.get()));
    await robot.send(msg);

    this.ctx.success();
  }

  /**
   * 处理push事件
   * @param ctx koa context
   * @param robotid 机器人id
   */
  handlePush() {
    const {
      user_name: userName,
      repository,
      commits,
      ref,
      project
    } = this.ctx.request.body;
    if (repository.name === 'project_test' && userName === 'user_test') {
      const markdown = new Robot.Markdown();

      markdown
        .setTitle(
          `GitLab·${repository.name} Push Test`,
        )
        .add(`# [Gitlab]·[[${repository.name}](${repository.homepage})] Push Test`)
        .add(`## ${userName} 发起了一个测试请求`)
        .setHideAvatar(1);

      return markdown;
    } else {
      const lastCommit: Commit = commits[0];
      'http://gitlab.shishike.com/fe_bui/loyalty-mobile/tree/sprint-2017-temp';
      const branchName = ref.replace('refs/heads/', '');
      const brachUrl = `${repository.homepage}/tree/${branchName}`;

      const markdown = new Robot.Markdown();

      markdown
        .setTitle('GitLab 信息')
        .add(`## [${project.name}](${project.web_url}) 项目 Push 通知`)
        .add(`${userName} 提交了一个 Commit

分支:  ${branchName}

最新提交信息: ${lastCommit.message}

[查看详情](${brachUrl})`,
        )
      return markdown;
    }
  }

  handleMR() {
    const markdown = new Robot.Markdown();
    const { user, object_attributes: attr, project, assignees, assignee } = this.ctx.request.body;
    
    const getAssignees = () => {
      if (assignees) {
        return assignees.map(item => `@${item.name}`).join(', ')
      }

      return `@${assignee.name}`;
    }

    markdown
      .setTitle('Gitlab 信息')
      .add(`## [${project.name}](${project.web_url}) 项目 Merge Request 通知`)
      .add(`${user.name}${actionWords[attr.action]}了一个 MR

标题：${attr.title}

源分支名：${attr.source_branch}

目标分支名：${attr.target_branch}

指派人：${getAssignees()}

[查看详情](${attr.url})
`,
      );

    return markdown;
  }

  handleIssue() {
    const { user, object_attributes: attr, repository } = this.ctx.request.body;

    const markdown = new Robot.Markdown();

    markdown
      .setTitle('GitLab 信息',
      )
      .add(`## [${repository.name}](${repository.homepage}) 项目 Issue 通知`)
      .add(`标题：${attr.title}

发起人：${user.name}

状态：${actionWords[attr.action]}

[查看详情](${attr.url})
`);
    return markdown;
  }

  handleTest() {
    return this.handlePush();
  }

  handleDefault(event) {
    const markdown = new Robot.Markdown();

    markdown
      .setTitle('Gitlab 信息')
      .add(`Sorry，暂时还没有处理${event}事件`)

    console.log(this.ctx.request.body)
    return markdown;
  }

  handleNote() {
    const { user, object_attributes: { noteable_type: type, note, url}, repository, merge_request: mr, commit, issue } = this.ctx.request.body;

    const markdown = new Robot.Markdown();

    let tips = '';
    if (type === 'MergeRequest') {
      tips = `[${mr.title}](${mr.url})`;
    } else if (type === 'Commit') {
      tips = `[${commit.message}](${commit.url})`;
    } else if (type === 'Issue') {
      tips = `[${issue.title}](${repository.homepage}/issues/${issue.iid})`;
    }
    markdown
      .setTitle('GitLab 信息')
      .add(`## [${repository.name}](${repository.homepage}) 项目评论通知`)
      .add(`${user.name} 在 ${type}(${tips}) 上评论了：`)
      .add(`> ${note}`)
      .add(`
[查看详情](${url})
      `);

    return markdown;
  }
}
