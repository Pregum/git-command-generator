import { CommitGroup } from './CommitGroup'

export class CommitHistory {
  constructor(public title: string, private commitGroups: CommitGroup[]) {}

  public addCommitGroup(...item: CommitGroup[]) {
    this.commitGroups.push(...item)
  }

  public removeCommitGroup(hash: string) {
    if (!hash) {
      return
    }

    const elem = this.commitGroups.filter((e) => e.firstHash != hash)

    this.commitGroups = elem
  }
}
