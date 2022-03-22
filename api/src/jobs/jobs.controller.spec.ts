import { Test, TestingModule } from '@nestjs/testing';
import { JobsController } from './jobs.controller';
import { JobsService } from './jobs.service';

describe('JobsController', () => {
  let jobsController: JobsController;
  let jobsService: JobsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [JobsController],
      providers: [JobsService],
    }).compile();

    jobsController = await module.resolve<JobsController>(JobsController);
    jobsService = await module.resolve<JobsService>(JobsService);
  });

  it('should be defined', () => {
    expect(jobsController).toBeDefined();
  });

});
