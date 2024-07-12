import { Materia } from "./materia/materia";
import { User } from "./usuario/user";

export interface Post {
    fechaFormatted?: string | null;
    id?: number;
    titulo: string;
    contenido: string;
    materia?: Materia;
    img?: File;
    archivo?: File;
   
    usuario?:User;
    fecha?: Date,

  }
  