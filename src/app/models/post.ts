import { Materia } from "./materia/materia";

export interface Post {
    id?: number;
    titulo: string;
    contenido: string;
    materia?: Materia;
    img?: File;
    archivo?: File;
  }
  