import { Post } from "../post";
import { User } from "../usuario/user";

export interface Comentario {
    id?:number,
    titulo:string,
    contenido:string,
    fecha?: Date,
    img?: File;
    archivo?: File;
    usuario?:User;
    post?:number;
    formattedDate?: string; 
}
