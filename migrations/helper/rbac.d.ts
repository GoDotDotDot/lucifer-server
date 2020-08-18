export interface Rule {
  parentId: string;
  name: string;
  /**
   * 是否在菜单上显示
   */
  isMenu: boolean;
  /**
   * 链接地址
   */
  url: string;
  /**
   * 图标
   */
  icon: string;
  /**
   * 排序，数字越大越靠前
   */
  sort: number;
}

declare class RbacTreeBuilder {
  constructor(rules: { [key: string]: Rule });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  up(db: any): Promise<void>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  down(db: any): Promise<void>;
}

export { RbacTreeBuilder };
