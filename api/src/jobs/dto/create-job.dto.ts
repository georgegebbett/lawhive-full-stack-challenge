export class CreateJobDto {
  title: string;
  description: string;
  url: string;
  state: 'started';
  feeStructure: 'No-Win-No-Fee' | 'Fixed-Fee';
  feeAmount: number;
  expectedSettlement: number;
}
