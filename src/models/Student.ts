class Student{
    id: number;
    name: string;
    shift: string;
    year: string;
    room: string;
    constructor(id: number, name: string, shift: string, year: string, room: string){
        this.id = id;
        this.name = name;
        this.shift = shift;
        this.year = year;
        this.room = room;
    }
}

export default Student;