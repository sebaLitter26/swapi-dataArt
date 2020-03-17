import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';

import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { ApiService } from '../api.service';

import { Character, Film } from '../models/index.models';

import { mergeMap, map, switchMap, tap, concatAll   } from 'rxjs/operators';
import { Observable, of , forkJoin, Subscription } from 'rxjs';

import { trigger, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'app-characters',
  templateUrl: './characters.component.html',
  styleUrls: ['./characters.component.scss'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate(500, style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate(500, style({ opacity: 0 }))
      ])
    ])
  ],
})
export class charactersComponent implements OnInit, OnDestroy {

  private character$Subscription: Subscription;
  private character$: Observable<any[]> ;
  characters: Character[] ;
  film$: any ;
  film: Film ;
  showAdicional: number = 0;

  displayedColumns: string[] = ['name', 'eye_color', 'gender'];
  dataSource: MatTableDataSource<Character>;

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor(
                private apiService: ApiService,
                private activatedRoute: ActivatedRoute
              ) { }

	ngOnInit() {

    this.film$ = this.activatedRoute.snapshot.params;
    const people:string[] = this.activatedRoute.snapshot.params.characters.split(',') ;


    this.character$Subscription = this.getArrayRequest(people).subscribe(results => {

      this.characters = results;
      this.dataSource = new MatTableDataSource(this.characters);
      console.log(this.characters);
    });

    this.dataSource.paginator = this.paginator;

  }

  getArrayRequest(arrayRequestString: string[]): Observable<any> {

    return  forkJoin(
      arrayRequestString.map(id =>  this.apiService.sendGetRequest(id.split(this.apiService.HOST_URL)[1]))  //debido al Proxy
    ).pipe(concatAll());
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  ngOnDestroy() {
    this.character$Subscription.unsubscribe();
   // this.film$.unsubscribe();
  }



}
