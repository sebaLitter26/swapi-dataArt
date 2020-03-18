import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';

import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { ApiService } from '../api.service';

import { Character, Film } from '../models/index.models';

import { mergeMap, map, switchMap, tap, concatAll   } from 'rxjs/operators';
import { Observable, of , forkJoin, Subscription } from 'rxjs';

@Component({
  selector: 'app-characters',
  templateUrl: './characters.component.html',
  styleUrls: ['./characters.component.scss'],

})
export class charactersComponent implements OnInit, OnDestroy {

  private character$Subscription: Subscription;
  private films$Subscription: Subscription;

  private character$: Observable<any[]> ;
  characters: Character[] ;
  film$: any ;
  film: Film ;
  showFilms: any[] = [];

  displayedColumns: string[] = ['name', 'eye_color', 'gender', 'films'];
  dataSource: MatTableDataSource<Character>;
  expandedElement: any | null;

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild('table', { static: true }) table;

  constructor(
                private apiService: ApiService,
                private activatedRoute: ActivatedRoute
              ) { }

	ngOnInit() {

    this.film$ = this.activatedRoute.snapshot.params;
    const people:string[] = this.activatedRoute.snapshot.params.characters.split(',') ;

    const peopleAux: any[] =[];
    this.character$Subscription = this.getArrayRequest(people).subscribe((results:any) => {
      peopleAux.push(results);
    },
    (error) => console.log('onError', error),
    () => {
      this.characters = peopleAux;
      peopleAux.forEach((character, pos)=>{
        this.expandFilmDetails(character, pos);
      });
      console.log(this.characters);
      this.dataSource = new MatTableDataSource(this.characters);

      this.table.renderRows();
      this.dataSource.paginator = this.paginator;
    }
    );

  }

  expandFilmDetails(character, pos){

    const filmsAux: any[] =[];
    this.films$Subscription = this.getArrayRequest(character.films).subscribe((results:any) => {
      filmsAux.push(results);
    },
    (error)=>console.log("onError", error),
    () => {

      this.characters[pos].films = filmsAux;
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
    this.films$Subscription.unsubscribe();
  }



}
