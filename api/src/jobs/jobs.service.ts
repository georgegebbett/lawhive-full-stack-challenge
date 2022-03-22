import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Job, JobDocument } from './job.schema';
import { Model } from 'mongoose';

@Injectable()
export class JobsService {
  constructor(@InjectModel(Job.name) private jobModel: Model<JobDocument>) {}

  async create(createJobDto: CreateJobDto): Promise<Job> {
    const createdJob = new this.jobModel({ ...createJobDto, state: 'started' });
    return createdJob.save();
  }

  findAll(): Promise<Job[]> {
    return this.jobModel.find().exec();
  }

  findOne(id: string) {
    return this.jobModel.findById(id).exec();
  }

  update(id: number, updateJobDto: UpdateJobDto) {
    return `This action updates a #${id} job`;
  }

  remove(id: number) {
    return `This action removes a #${id} job`;
  }

  async markPaid(id: string, settlementAmount: number) {
    const docToModify = await this.jobModel.findById(id);

    if (docToModify.state !== 'started')
      throw new HttpException(
        'Job already in paid state',
        HttpStatus.BAD_REQUEST,
      );

    if (docToModify.feeStructure === 'No-Win-No-Fee') {
      docToModify.settlementAmount = settlementAmount;
      docToModify.paymentAmount = this.calculateFeeFromSettlement(
        docToModify.feeAmount,
        settlementAmount,
      );
    } else {
      docToModify.paymentAmount = docToModify.feeAmount;
    }

    docToModify.state = 'paid';
    return docToModify.save();
  }

  calculateFeeFromSettlement(feeAmount: number, settlementAmount: number) {
    return settlementAmount * (feeAmount / 100);
  }
}
