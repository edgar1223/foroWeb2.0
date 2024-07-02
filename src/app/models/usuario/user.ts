export interface User {
        id?: number;
        nombre: string;
        apellido:string;
        email:string;
        password:string;
        imgUrl:string;
        departamentoId?:number;
        semestre?:string;
    
}
