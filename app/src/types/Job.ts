export type Job = {
  title: string,
  description: string,
  state: 'started' | 'paid',
  feeStructure: 'No-Win-No-Fee' | 'Fixed-Fee',
  feeAmount: number,
  _id: string
}
