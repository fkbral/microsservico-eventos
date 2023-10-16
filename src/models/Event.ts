export class Event {
  // quando tiver "?" na frente do atributo, significa que ele
  // é opcional 
  // se não tiver o "?" na frente, significa que ele é obrigatório
  id?: number;
  title: string = "";
  date: Date = new Date();
  time: string = "";
  location: string = "";
  description: string = "";
  guests: number[] = [];
}
