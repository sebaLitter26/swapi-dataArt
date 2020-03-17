import { Component, OnInit } from '@angular/core';
//import { Router } from "@angular/router";
import { ApiService } from '../api.service';


import { Film } from '../models/film.model';

import { mergeMap, map } from 'rxjs/operators';
import { Observable } from 'rxjs';

import { trigger, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
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
export class HomeComponent implements OnInit {

  film$: any ;
  films: Film[] ;

  showAdicional: number = 0;

  constructor(
              private apiService: ApiService
              ) { }

	ngOnInit() {
    this.film$ = this.apiService.sendGetRequest('films')
    .pipe(
      map(x =>  x['results'].sort((a, b) => a['episode_id'] - b['episode_id']))
    ).subscribe((data: Film[])=>{
			console.log(data);
			this.films = data;
		});

  }
/*
  public gotoCharactersDetails(url, id) {
    this.router.navigate([url, id]).then( (e) => {
      if (e) {
        console.log("Navigation is successful!");
      } else {
        console.log("Navigation has failed!");
      }
    });
}
*/
ngOnDestroy() {
  this.film$.unsubscribe();
}


}
