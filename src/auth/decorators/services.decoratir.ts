import { SetMetadata } from '@nestjs/common';

export enum ServiceType {
  blogPostService = 'blogPostService',
  blogService = 'blogService',
}

export const CurrentService = (currentService: ServiceType) =>
  SetMetadata('service', currentService);
