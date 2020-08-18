/* eslint-disable @typescript-eslint/no-explicit-any */
import { Controller } from 'egg';
import * as path from 'path';
import * as semver from 'semver';
import { BUCKET_NAME } from 'common/constants';

export default class Material extends Controller {
  async updload() {
    const stream = await this.ctx.getFileStream();
    const { fields } = stream;
    const { version = '1.0.0', type = 'component', name } = fields;

    const tags = JSON.parse(fields.tags || '[]');

    if (
      typeof version !== 'string' ||
      typeof type !== 'string' ||
      typeof name !== 'string' ||
      !Array.isArray(tags)
    ) {
      return this.ctx.failure({ code: 20001, msg: 'Bad Request' });
    }

    const pkgs = await this.ctx.service.material.getPkgsWithVersionSort(name);

    const isLt = pkgs.filter(pkg => semver.lte(version, pkg.version));

    // 当前的版本是否小于最新版本
    if (isLt.length) {
      return this.ctx.failure({
        code: 30003,
        msg: `You cannot publish less than or equal to the previously published versions: ${isLt[0].version}`,
      });
    }

    const objectName = `${type}/${name}/${stream.filename}`;

    const etag = await this.app.minio.putObject(
      BUCKET_NAME,
      objectName,
      stream,
    );

    const hasOne = await this.ctx.model.Material.findOne({ etag });
    if (hasOne) {
      this.ctx.failure({ code: 30001, data: hasOne });
      return;
    }

    const result = await this.ctx.model.Material.create({
      etag,
      objectName,
      bucketName: BUCKET_NAME,
      name,
      version,
      type,
      tags,
    });

    this.ctx.success({ data: result });
  }

  async download() {
    const { params } = this.ctx.validateReq('material.download');
    const { name, fileName } = params;

    const ext = path.extname(fileName);
    const basename = path.basename(fileName, ext);

    const version = basename.split('-').pop();

    const material = await this.ctx.model.Material.findOne({ name, version });

    if (!material) {
      return this.ctx.failure({ code: 30002 });
    }

    const { objectName, bucketName } = material;
    const fileStream = await this.app.minio.getObject(bucketName, objectName);

    this.ctx.set('vary', 'Accept-Encoding');
    this.ctx.body = fileStream;
  }

  async list() {
    const { query } = this.ctx.validateReq('material.list');
    const { type, name, tags } = query;

    const list = await this.ctx.service.material.getList({
      type,
      name,
      tags: tags && tags.split(','),
    });

    this.ctx.success({ data: list });
  }

  async getMaterialInfo() {
    const { query } = this.ctx.validateReq('material.info');
    const { name, version } = query;

    // 指定版本
    if (version) {
      const v = version === 'latest' ? undefined : version;
      const pkgs = await this.ctx.service.material.getPkgsWithVersionSort(
        name,
        v,
      );

      return this.ctx.success({ data: pkgs[0] });
    }

    const pkgs = await this.ctx.service.material.getMaterailInfo({
      name,
    });

    return this.ctx.success({ data: pkgs });
  }
}
