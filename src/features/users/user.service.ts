import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {
  private users = [
    {
      id: 1,
      name: 'Maxi',
    },
    {
      id: 2,
      name: 'John',
    },
  ];

  findOneById(id: number) {
    return this.users.find((user) => user.id === id);
  }
}
