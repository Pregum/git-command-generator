import { Author } from './Author'

export class CommitRevision {
  /**
   * Creates an instance of CommitRevision.
   * @param {string} name 名前
   * @param {Author} author 作者
   * @param {string} hash ハッシュ値
   * @param {string} comment コメント
   * @param {Partial<CommitRevision>} _ancestor 祖先のコミット
   * @param {Partial<CommitRevision[]>} _child 子孫のコミット
   * @memberof CommitRevision
   */
  constructor(
    public name: string,
    public author: Author,
    public hash: string,
    public comment: string,
    public branchId: string,
    private _ancestor: Partial<CommitRevision>,
    private _child: CommitRevision[] = []
  ) {}

  public set ancestor(newValue: Partial<CommitRevision>) {
    this._ancestor = newValue
  }

  public get ancestor(): Partial<CommitRevision> {
    return this._ancestor
  }

  public addChild(newValue: CommitRevision) {
    this._child.push(newValue)
  }

  public clearChild() {
    this._child.splice(0)
  }

  public changeChildPointer(
    oldPoint: CommitRevision,
    newPoint: CommitRevision
  ) {
    const childIndex = this._child.findIndex((e) => e.hash == oldPoint.hash)
    if (childIndex < 0) {
      return
    }

    this._child.splice(childIndex, 1, newPoint)
  }

  public get child(): Readonly<CommitRevision[]> {
    return this._child
  }
}
