import { Application } from 'egg';
/**
 * webhook 路由
 */
export default (app: Application) => {
  return {
    'webhook.gitlab': {
      method: 'POST',
      path: '/api/webhook/gitlab',
      options: {
        tags: ['webhook'],
        description: 'gitlab webhook',
        handler: app.controller.webhook.gitlab.webhook,
      },
    },
  };
};
