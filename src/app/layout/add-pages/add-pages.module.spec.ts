import { AddPagesModule } from './add-pages.module';

describe('AddPagesModule', () => {
  let addNewsModule: AddPagesModule;

  beforeEach(() => {
    addNewsModule = new AddPagesModule();
  });

  it('should create an instance', () => {
    expect(addNewsModule).toBeTruthy();
  });
});
