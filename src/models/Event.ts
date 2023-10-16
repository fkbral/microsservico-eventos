export class Event {
  id?: number;
  title: string = "";
  date: Date = new Date();
  time: string = "";
  location: string = "";
  description: string = "";
  guests: number[] = [];
}
