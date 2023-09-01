import { Injectable } from '@angular/core';
import { Firestore, doc, getDoc, collection, getDocs } from '@angular/fire/firestore';
import { updateDoc } from 'firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  constructor(private firestore: Firestore) { }

  traer() {
    const col = collection(this.firestore, 'usuarios');
    return getDocs(col);
  }

  traerUsuarios() {
    return new Promise(async (resolve) => {
      const respuesta = await this.traer();
      const usuarios = respuesta.docs.map(doc => {
        const data = doc.data();
        const id = doc.id; // Obteniendo el ID del documento
        return { ...data, id }; // Incluyendo el ID en el objeto de usuario
      });
      resolve(usuarios);
    });
  }

  guardarCreditos(id: string, creditos: number, qr100: number, qr50: number, qr10: number) {
    const col = collection(this.firestore, 'usuarios');
    const documento = doc(col, id);
    getDoc(documento).then(docSnapshot => {
      if (docSnapshot.exists()) {
        const data: any = docSnapshot.data();
        const cantCreditosAnterior = data?.cantCreditos || 0;
        const cantQr100Anterior = data?.cantQr100 || 0;
        const cantQr50Anterior = data?.cantQr50 || 0;
        const cantQr10Anterior = data?.cantQr10 || 0;

        updateDoc(documento, {
          cantCreditos: cantCreditosAnterior + creditos,
          cantQr100: cantQr100Anterior + qr100,
          cantQr50: cantQr50Anterior + qr50,
          cantQr10: cantQr10Anterior + qr10
        });
      }
    });
  }

  limpiarCreditos(id: string) {
    const col = collection(this.firestore, 'usuarios');
    const documento = doc(col, id);
    getDoc(documento).then(docSnapshot => {
      if (docSnapshot.exists()) {
        updateDoc(documento, {
          cantCreditos: 0,
          cantQr100: 0,
          cantQr50: 0,
          cantQr10: 0
        });
      }
    });
  }


}
