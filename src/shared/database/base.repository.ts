import { EntityManager, EntityRepository } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';

@Injectable()
/**
 * Repositorio base genérico que encapsula operaciones comunes de persistencia
 * usando MikroORM. Todos los repositorios custom deberían extender este.
 *
 * @template T - Tipo de entidad
 */
export class BaseRepository<T extends object> extends EntityRepository<T> {
  constructor(
    readonly em: EntityManager,
    entityClass: { new (): T },
  ) {
    super(em, entityClass);
  }

  /**
   * Guarda una entidad en la base de datos.
   * Equivale a llamar a `persist()` seguido de `flush()`.
   *
   * @param entity - La entidad a guardar
   */
  async save(entity: T | T[]): Promise<void> {
    await this.em.persist(entity).flush();
  }

  /**
   * Marca una entidad para ser eliminada, pero NO ejecuta el borrado.
   * Necesita luego un `flush()` para hacerse efectivo.
   *
   * @param entity - La entidad a eliminar
   */
  async remove(entity: T | T[]): Promise<void> {
    await this.em.remove(entity).flush();
  }
}
