
export interface PokeResponse {
	next: string;
	previous: any;
	count: number;
	results: Result[];
}
export interface Result {
	name: string;
	url: string;
}



