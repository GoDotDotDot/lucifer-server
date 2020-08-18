import { Service } from 'egg';
import * as semver from 'semver';
import { deleteNullOrUndefinedField } from 'utils';

export default class MaterialService extends Service {
  getList({
    type,
    name,
    tags = [],
  }: {
    type: string;
    name: string;
    tags?: string[];
  }) {
    let query: { type: string; name: string; tags?: object } = { type, name };
    if (tags.length) {
      query = { type, name, tags: { $in: tags } };
    }

    return this.ctx.model.Material.find(deleteNullOrUndefinedField(query));
  }

  async getPkgsWithVersionSort(pkg: string, version?: string) {
    const pkgs = await this.ctx.model.Material.find(
      deleteNullOrUndefinedField({ name: pkg, version }),
    );
    return pkgs.sort((a, b) => (semver.gt(a.version, b.version) ? -1 : 1));
  }

  async getMaterailInfo(query: object) {
    return this.ctx.model.Material.find(deleteNullOrUndefinedField(query));
  }
}
