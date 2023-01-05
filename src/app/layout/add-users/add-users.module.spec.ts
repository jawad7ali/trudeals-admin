import { AddUsersModule } from './add-users.module';

describe('AddUsersModule', () => {
  let addUsersModule: AddUsersModule;

  beforeEach(() => {
    addUsersModule = new AddUsersModule();
  });

  it('should create an instance', () => {
    expect(addUsersModule).toBeTruthy();
  });
});
