interface GalleryImage {
  url: string;
  caption: string;
}
export const galleryImages: GalleryImage[] = [
  { url: "room/2.jpg", caption: "Master Bedroom" },
  { url: "room/balcony.jpg", caption: "Private Terrace" },
  { url: "complex/pool.jpg", caption: "Resort Pool" },
  { url: "beach/3.jpg", caption: "Beach" },
  { url: "complex/pool-2.jpg", caption: "Resort Pool" },
  { url: "complex/pool-night.jpg", caption: "Resort Pool" },
  { url: "beach/2.jpg", caption: "Beach" },
  { url: "complex/drone-2.jpg", caption: "View from the Sky" },
  { url: "complex/drone.jpg", caption: "View from the Sky" },
  { url: "complex/kids-2.jpg", caption: "Kid's Playground" },
  { url: "complex/kids.jpg", caption: "Kid's Playground" },
  { url: "complex/map.jpg", caption: "Complex Map" },
  { url: "complex/path-2.jpg", caption: "Complex" },
  { url: "complex/path.jpg", caption: "Complex" },
  { url: "complex/tennis.jpg", caption: "Tennis Courts" },
  { url: "room/3.jpg", caption: "Bed and Kitchen" },
  { url: "room/4.jpg", caption: "Room" },
  { url: "room/bathroom.jpg", caption: "Bathroom" },
].map((g) => {
  g.url = `gallery/${g.url}`;
  return g;
});
