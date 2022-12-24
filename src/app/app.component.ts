import { Component, OnInit } from "@angular/core";
import * as L from "leaflet";
import { ArtworkService } from "./artwork.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent implements OnInit {
  constructor(private artworkService: ArtworkService) {}

  map;
  artworkList;
  zipcode;
  popupOptions = {
    className: "test test2"
  };
  markerIcon = {
    icon: L.icon({
      iconSize: [25, 41],
      iconAnchor: [10, 41],
      popupAnchor: [2, -40],
      // specify the path here
      iconUrl: "https://unpkg.com/leaflet@1.4.0/dist/images/marker-icon.png",
      shadowUrl: "https://unpkg.com/leaflet@1.4.0/dist/images/marker-shadow.png"
    })
  };

  ngOnInit() {
    this.map = L.map("map").setView([51.505, -0.09], 13);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);
    this.refresh();
  }

  buildMarkers(artworkList) {
    for (let artwork of artworkList) {
      this.buildPopup(artwork);
    }
  }

  buildPopup(object) {
    const popupInfo = `
        ${object.name} <br/>
        ${object.firstname}
        ${object.lastname} <br/>
        ${object.streetname} ${object.streetnumber}
        , ${object.zipcode}
      `;
    L.marker([object.latitude, object.longitude], this.markerIcon)
      .addTo(this.map)
      .bindPopup(popupInfo, this.popupOptions);
  }

  refresh(): void {
    this.artworkService.retrieveAll().subscribe(artworkList => {
      this.artworkList = artworkList;
      // console.log(this.artworkList);
      this.buildMarkers(this.artworkList);
    });
  }

  changeZipcode() {
    // empty map of any markers
    this.map.eachLayer(layer => {
      if (layer instanceof L.Marker) this.map.removeLayer(layer);
    });
    if (this.zipcode === "-All-") {
      // build all markers like before selection
      this.buildMarkers(this.artworkList);
    } else {
      // return object inside array which contains the specific zipcode
      const currentArtworklist = this.artworkList.filter(
        list => list.zipcode == this.zipcode
      );
      this.buildMarkers(currentArtworklist);
    }
  }
}
