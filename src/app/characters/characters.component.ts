import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';

import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { ApiService } from '../api.service';

import { Character, Film } from '../models/index.models';

import { mergeMap, map, switchMap, tap, concatAll   } from 'rxjs/operators';
import { Observable, of , forkJoin, Subscription } from 'rxjs';

import {animate, state, style, transition, trigger} from '@angular/animations';

@Component({
  selector: 'app-characters',
  templateUrl: './characters.component.html',
  styleUrls: ['./characters.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class charactersComponent implements OnInit, OnDestroy {

  private character$Subscription: Subscription;
  private character$: Observable<any[]> ;
  characters: Character[] ;
  film$: any ;
  film: Film ;
  showFilms: any[] = [];

  displayedColumns: string[] = ['name', 'eye_color', 'gender','films'];
  dataSource: MatTableDataSource<Character>;
  expandedElement: any | null;

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor(
                private apiService: ApiService,
                private activatedRoute: ActivatedRoute
              ) { }

	ngOnInit() {

    this.film$ = this.activatedRoute.snapshot.params;
    const people:string[] = this.activatedRoute.snapshot.params.characters.split(',') ;

    let peopleAux: any[] =[];
    this.character$Subscription = this.getArrayRequest(people).subscribe((results:any) => {
      peopleAux.push(results);
    },
    (error)=>console.log("onError", error),
    () => {
      //this.characters = peopleAux;
      this.dataSource = new MatTableDataSource(peopleAux);
      this.dataSource.paginator = this.paginator;
      console.log("onComplete", this.dataSource);
    }
    );

  }

  expandFilmDetails(character){

    let filmsAux: any[] =[];
    this.character$Subscription = this.getArrayRequest(character.films).subscribe((results:any) => {
      filmsAux.push(results);
    },
    (error)=>console.log("onError", error),
    () => {
      //this.characters = peopleAux;

      console.log("onComplete", filmsAux);
      this.showFilms = filmsAux;
    }
    );

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
