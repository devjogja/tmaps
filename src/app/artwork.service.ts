import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { ARTWORK } from "./mock-artwork";

@Injectable({
  providedIn: "root"
})
export class ArtworkService {
  retrieveAll(): Observable {
    return of(ARTWORK);
  }
}
