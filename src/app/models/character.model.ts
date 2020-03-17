export interface  Character{
	 name: string;
	 height: number;
	 mass: number;
	 hair_color: string;
	 skin_color: string;
	 eye_color: Date;
	 birth_year: string;
	 gender: string;
	 homeworld: any[];
	 films: any[];
	 species: any[];
	 vehicles: any[];
	 starships: any[];
   created: Date;
   edited: Date;
   url: string;
/*
	constructor(init?:Partial<Character>) {
					Object.assign(this, init);
	}
*/

}
