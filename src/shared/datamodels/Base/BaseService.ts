import {BaseEntity} from "./model/BaseEntity";
import {Observable} from "rxjs";

export interface BaseService<T extends BaseEntity> {

  findById(id: number): Observable<T>;

  findAll(): Observable<T[]>;

  save(instance: T): Observable<T>;

  update(id: number, instance: T): Observable<T>;

  delete(id: number): Observable<number>;
}
