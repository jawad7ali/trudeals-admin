import { AddCategoryModule } from './add-category.module';

describe('AddCategoryModule', () => {
  let addCategoryModule: AddCategoryModule;

  beforeEach(() => {
    addCategoryModule = new AddCategoryModule();
  });

  it('should create an instance', () => {
    expect(addCategoryModule).toBeTruthy();
  });
});
