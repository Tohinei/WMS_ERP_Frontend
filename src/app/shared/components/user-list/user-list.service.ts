/* eslint-disable @typescript-eslint/adjacent-overload-signatures */
import { Injectable, PipeTransform } from '@angular/core';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { DecimalPipe } from '@angular/common';
import { debounceTime, delay, switchMap, tap } from 'rxjs/operators';
import { User } from '../../../core/models/user.model';
import { SharedDataService } from '../../../core/services/shared-data/shared-data.service';

// Define sort column as any key of User or empty string
export type SortColumn = keyof User | '';
export type SortDirection = 'asc' | 'desc' | '';

interface SearchResult {
  countries: User[];
  total: number;
}

interface State {
  page: number;
  pageSize: number;
  searchTerm: string;
  sortColumn: SortColumn;
  sortDirection: SortDirection;
  startIndex: number;
  endIndex: number;
  totalRecords: number;
}

const compare = (v1: string | number, v2: string | number): number =>
  v1 < v2 ? -1 : v1 > v2 ? 1 : 0;

function sort(
  countries: User[],
  column: SortColumn,
  direction: SortDirection
): User[] {
  if (!column || !direction) return countries;

  return [...countries].sort((a, b) => {
    const aValue = a[column] ?? (typeof a[column] === 'string' ? '' : 0);
    const bValue = b[column] ?? (typeof b[column] === 'string' ? '' : 0);

    // Convert Date to string if the value is a Date object
    const aValueConverted =
      aValue instanceof Date ? aValue.toISOString() : aValue;
    const bValueConverted =
      bValue instanceof Date ? bValue.toISOString() : bValue;

    const res = compare(aValueConverted, bValueConverted);
    return direction === 'asc' ? res : -res;
  });
}

function matches(user: User, term: string, pipe: PipeTransform): boolean {
  const lowerTerm = term.toLowerCase();

  return (
    (user.firstName?.toLowerCase().includes(lowerTerm) ?? false) ||
    (user.lastName?.toLowerCase().includes(lowerTerm) ?? false) ||
    (user.email?.toLowerCase().includes(lowerTerm) ?? false) ||
    (user.createdAt?.toString().toLowerCase().includes(lowerTerm) ?? false) ||
    (user.updatedAt?.toString().toLowerCase().includes(lowerTerm) ?? false)
  );
}

@Injectable({ providedIn: 'root' })
export class OrdersService {
  private _loading$ = new BehaviorSubject<boolean>(true);
  private _search$ = new Subject<void>();
  private _countries$ = new BehaviorSubject<User[]>([]);
  private _total$ = new BehaviorSubject<number>(0);

  private _state: State = {
    page: 1,
    pageSize: 10,
    searchTerm: '',
    sortColumn: '',
    sortDirection: '',
    startIndex: 0,
    endIndex: 9,
    totalRecords: 0,
  };

  constructor(
    private pipe: DecimalPipe,
    private sharedDataService: SharedDataService
  ) {
    this._search$
      .pipe(
        tap(() => this._loading$.next(true)),
        debounceTime(200),
        switchMap(() => this._search()),
        delay(200),
        tap(() => this._loading$.next(false))
      )
      .subscribe((result) => {
        this._countries$.next(result.countries);
        this._total$.next(result.total);
      });

    this._search$.next();
  }

  get countries$() {
    return this._countries$.asObservable();
  }

  get total$() {
    return this._total$.asObservable();
  }

  get loading$() {
    return this._loading$.asObservable();
  }

  get page() {
    return this._state.page;
  }

  get pageSize() {
    return this._state.pageSize;
  }

  get searchTerm() {
    return this._state.searchTerm;
  }

  get startIndex() {
    return this._state.startIndex;
  }

  get endIndex() {
    return this._state.endIndex;
  }

  get totalRecords() {
    return this._state.totalRecords;
  }

  set page(page: number) {
    this._set({ page });
  }

  set pageSize(pageSize: number) {
    this._set({ pageSize });
  }

  set searchTerm(searchTerm: string) {
    this._set({ searchTerm });
  }

  set sortColumn(sortColumn: SortColumn) {
    this._set({ sortColumn });
  }

  set sortDirection(sortDirection: SortDirection) {
    this._set({ sortDirection });
  }

  set startIndex(startIndex: number) {
    this._set({ startIndex });
  }

  set endIndex(endIndex: number) {
    this._set({ endIndex });
  }

  set totalRecords(totalRecords: number) {
    this._set({ totalRecords });
  }

  private _set(patch: Partial<State>) {
    Object.assign(this._state, patch);
    this._search$.next();
  }

  private _search(): Observable<SearchResult> {
    const { sortColumn, sortDirection, pageSize, page, searchTerm } =
      this._state;

    let usersList: any[] = this.sharedDataService.getUserList() ?? [];
    let countries = sort(usersList, sortColumn, sortDirection);

    countries = countries.filter((country) =>
      matches(country, searchTerm, this.pipe)
    );
    const total = countries.length;

    this.totalRecords = total;
    this._state.startIndex = (page - 1) * pageSize + 1;
    this._state.endIndex = this._state.startIndex + pageSize - 1;
    if (this._state.endIndex > total) {
      this._state.endIndex = total;
    }

    countries = countries.slice(
      this._state.startIndex - 1,
      this._state.endIndex
    );

    return of({ countries, total });
  }
}
