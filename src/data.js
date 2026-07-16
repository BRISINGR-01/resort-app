export const galleryImages = [
  {
    url: "https://images.unsplash.com/photo-1602002418816-5c0aeef426aa?w=800&q=80",
    alt: "Studio living area with ocean view",
    caption: "Ocean View Living",
  },
  {
    url: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&q=80",
    alt: "Modern bedroom with tropical decor",
    caption: "Master Bedroom",
  },
  {
    url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80",
    alt: "Private terrace overlooking the bay",
    caption: "Private Terrace",
  },
  {
    url: "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=800&q=80",
    alt: "Resort pool area with palm trees",
    caption: "Resort Pool",
  },
  {
    url: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=80",
    alt: "Beachfront dining area",
    caption: "Beachfront Dining",
  },
  {
    url: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80",
    alt: "Spa and wellness center",
    caption: "Wellness & Spa",
  },
  {
    url: "https://images.unsplash.com/photo-1540541338287-41700207dee6?w=800&q=80",
    alt: "Crystal clear beach waters",
    caption: "Crystal Waters",
  },
  {
    url: "https://images.unsplash.com/photo-1610641818989-c2051b5e2cfd?w=800&q=80",
    alt: "Sunset view from the studio",
    caption: "Golden Sunsets",
  },
  {
    url: "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=800&q=80",
    alt: "Kitchen and dining area",
    caption: "Fully Equipped Kitchen",
  },
];

function seededRandom(seed) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function generateDays(month, status, monthIndex) {
  const [monthName, yearStr] = month.split(" ");
  const monthNum = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ].indexOf(monthName);
  const year = parseInt(yearStr);
  const totalDays = new Date(year, monthNum + 1, 0).getDate();
  const rand = seededRandom(monthIndex * 1000 + 7);

  return Array.from({ length: totalDays }, (_, i) => {
    if (status === "booked") {
      if (rand() < 0.08) return "available";
      return "booked";
    }
    if (status === "limited") {
      if (rand() < 0.35) return "booked";
      return "available";
    }
    // available
    return "available";
  });
}

export const availability = [
  { month: "July 2026", status: "limited", spots: 2 },
  { month: "August 2026", status: "available", spots: 8 },
  { month: "September 2026", status: "available", spots: 10 },
  { month: "October 2026", status: "available", spots: 12 },
  { month: "November 2026", status: "limited", spots: 3 },
  { month: "December 2026", status: "booked", spots: 0 },
  { month: "January 2027", status: "available", spots: 14 },
  { month: "February 2027", status: "limited", spots: 4 },
  { month: "March 2027", status: "booked", spots: 0 },
  { month: "April 2027", status: "available", spots: 11 },
  { month: "May 2027", status: "available", spots: 13 },
  { month: "June 2027", status: "limited", spots: 5 },
].map((item, i) => ({
  ...item,
  days: generateDays(item.month, item.status, i),
}));

export const amenities = [
  { icon: "icons/sea.svg", label: "Close to the sea" },
  { icon: "icons/kitchen.svg", label: "Full Kitchen" },
  { icon: "icons/wifi.svg", label: "WiFi" },
  { icon: "icons/parking.svg", label: "Free Parking" },
  { icon: "icons/pool.svg", label: "Pool Access" },
  { icon: "🧖", label: "Spa & Wellness" },
  { icon: "🏖️", label: "Beach Service" },
  { icon: "👕", label: "In-Unit Laundry" },
];
