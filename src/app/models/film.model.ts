export class Film{
	public episode_id: number;
	public title: string;
	public director: string;
	public opening_crawl: string;
	public producer: string;
	public release_date: Date;
	public characters: any[];
	public planets: any[];
	public starships: any[];
	public vehicles: any[];
	public species: any[];
	public created: Date;
	public edited: Date;
	public url: string;

	constructor(init?:Partial<Film>) {
					Object.assign(this, init);
	}


}
