import { Module } from '@nestjs/common';
import { SerperDevService } from './serper.dev/serperDev.service';

@Module({ providers: [SerperDevService], exports: [SerperDevService] })
export class ScrapersModule {}
