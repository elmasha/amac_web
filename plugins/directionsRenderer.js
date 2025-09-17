import { MapElementFactory } from "vue2-google-maps";
export default MapElementFactory({
  name: "directionsRenderer",
  ctr() {
    return window.google.maps.DirectionsRenderer;
  },
  events: [],
  mappedProps: {},
  props: {
    origin: { type: [Object, Array] },
    destination: { type: [Object, Array] },
    travelMode: { type: String },
    waypoints: {type: Array},
    optimizeWaypoints: {type: Boolean}
  },
  afterCreate(directionsRenderer) {
    console.log(1)
    let directionsService = new window.google.maps.DirectionsService();
    this.$watch(
      () => [this.origin, this.destination, this.travelMode, this.waypoints, this.optimizeWaypoints],
      () => {
        let { origin, destination, travelMode, waypoints, optimizeWaypoints } = this;
        if (!origin || !destination || !travelMode || !waypoints|| !optimizeWaypoints) return;
        directionsService.route(
          {
            origin,
            destination,
            travelMode,
            waypoints,
            optimizeWaypoints,
          },
          (response, status) => {
            if (status !== "OK") return;
            directionsRenderer.setDirections(response);
          }
        );
      }
    );
  },
});
