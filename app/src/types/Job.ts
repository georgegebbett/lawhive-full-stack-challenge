export type Job = {
  title: string,
  description: string,
  state: 'started' | 'paid',
  feeStructure: 'No-Win-No-Fee' | 'Fixed-Fee',
  feeAmount: number,
  paymentAmount: number,
  _id: string
}
