import { CommitRevision } from './CommitRevision'

export class CommitGroup extends Array<CommitRevision> {
  constructor(private items: CommitRevision[] = []) {
    super()
  }

  /**
   * 最初のリビジョンのhash値を返します。
   *
   * @readonly
   * @type {string}
   * @memberof CommitGroup
   */
  public get firstHash(): string {
    if (!this.items?.length) {
      return ''
    }
    return this.items[0].hash
  }
}
