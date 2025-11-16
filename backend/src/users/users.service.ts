import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, Role } from './user.entity';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepo: Repository<User>,
  ) {}

  async create(userData: Partial<User>) {
    const passwordHash = userData.passwordHash
      ? await bcrypt.hash(userData.passwordHash, 10)
      : await bcrypt.hash('password123', 10);

    const user = this.usersRepo.create({
      email: userData.email,
      passwordHash,
      role: userData.role || Role.MEMBER,
      country: userData.country || 'India',
      // paymentMethodId: userData.paymentMethodId || null,
    } as Partial<User>);

    return this.usersRepo.save(user);
  }

  async findByEmail(email: string) {
    return this.usersRepo.findOne({ where: { email } });
  }

  async findAll() {
    return this.usersRepo.find();
  }
}
