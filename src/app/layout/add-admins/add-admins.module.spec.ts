import { AddAdminsModule } from './add-admins.module';

describe('AddAdminsModule', () => {
  let addAdminsModule: AddAdminsModule;

  beforeEach(() => {
    addAdminsModule = new AddAdminsModule();
  });

  it('should create an instance', () => {
    expect(addAdminsModule).toBeTruthy();
  });
});
