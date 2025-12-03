import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { TaskModule } from './tasks/tasks.module';

@Module({
  imports: [AuthModule, TaskModule],
})
export class AppModule {}
