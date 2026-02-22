import { NotFoundError } from '@mikro-orm/core';
import { ArgumentsHost, Catch, ExceptionFilter, NotFoundException } from '@nestjs/common';
import { GqlArgumentsHost, GqlExceptionFilter } from '@nestjs/graphql';

@Catch(NotFoundError)
export class EntityNotFoundFilter<T> implements GqlExceptionFilter {
  catch(exception: NotFoundError, host: ArgumentsHost) {
    GqlArgumentsHost.create(host);
    return new NotFoundException(exception.message);
  }
} 
