import { PartialType } from '@nestjs/swagger';
import { CreateMetricaDto } from './create-metrica.dto';

export class UpdateMetricaDto extends PartialType(CreateMetricaDto) {}
