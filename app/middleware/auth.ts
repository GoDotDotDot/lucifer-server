import { Context } from 'egg';

export default (action?: string) => async (ctx: Context, next) => {
  // 开发模式跳过权限检查
  const { config } = ctx.app;
  if (config.skipAuthentication) {
    await next();
    return true;
  }

  const isLogin = ctx.isAuthenticated();
  const userInfo = ctx.user;
  const responseData = { userId: userInfo, uri: action };

  if (!isLogin) {
    ctx.unauthorized({ data: responseData });
    return false;
  }

  if (!action) {
    await next();
    return;
  }

  const group = await ctx.model.AuthGroup.findOne(
    {
      users: userInfo.id,
      modules: action,
    },
    { _id: 1 },
  );

  if (!group) {
    ctx.forbidden({ data: responseData });
    return false;
  }

  await next();
  return true;
};
