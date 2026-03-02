export interface CrudService<TEntity, TCreateDto, TId = string> {
  findById(id: TId): Promise<TEntity | null>;
  create(dto: TCreateDto): Promise<TEntity>;
}
