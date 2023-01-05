import { PageBlocksModule } from './page-blocks.module';

describe('PageBlocksModule', () => {
  let pageBlocksModule: PageBlocksModule;

  beforeEach(() => {
    pageBlocksModule = new PageBlocksModule();
  });

  it('should create an instance', () => {
    expect(pageBlocksModule).toBeTruthy();
  });
});
