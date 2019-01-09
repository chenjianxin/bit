// @flow
import fs from 'fs-extra';
import path from 'path';
import { AbstractVinyl } from '../consumer/component/sources';
import { AUTO_GENERATED_STAMP, AUTO_GENERATED_MSG } from '../constants';
import type { PathOsBased } from '../utils/path';

export default class LinkFile extends AbstractVinyl {
  override: ?boolean = false;
  writeAutoGeneratedMessage: ?boolean = true;

  async write(): Promise<string> {
    if (!this.override && fs.existsSync(this.path)) {
      const fileContent = fs.readFileSync(this.path).toString();
      if (!fileContent.includes(AUTO_GENERATED_STAMP)) return Promise.resolve(this.path);
    }

    const data = this.writeAutoGeneratedMessage ? AUTO_GENERATED_MSG + this.contents : this.contents;
    await fs.outputFile(this.path, data);
    return Promise.resolve(this.path);
  }

  static load({
    filePath,
    base,
    content,
    override = false,
    writeAutoGeneratedMessage = true
  }: {
    filePath: PathOsBased,
    base?: string,
    content: string,
    override?: boolean,
    writeAutoGeneratedMessage?: boolean
  }): LinkFile {
    const linkFile = new LinkFile({
      base: base || path.dirname(filePath),
      path: filePath,
      contents: new Buffer(content)
    });
    linkFile.override = override;
    linkFile.writeAutoGeneratedMessage = writeAutoGeneratedMessage;
    return linkFile;
  }
}
