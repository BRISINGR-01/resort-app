export const basicInformation = {
  cost: 100,
  contact: {
    location: {
      maps: "https://maps.app.goo.gl/jHkYXsp1XhXaSntE9",
      text: "Созопол",
    },
    email: "",
    phone: "088 266 2200",
    facebook: "https://www.facebook.com/profile.php?id=61591135034073",
  },
  maxGuests: 3,
};

export const text = {
  homePage: {
    name: "Design Studio-Green life",
    description:
      "За незабравима почивка на море в комфортна и много уютна обстановка, заповядайте в Дизайн студио в комплекс Green life Созопол / Каваци",
  },
  aboutPage: {
    greeting: "Насладете се на спокойствие, комфорт и море",
    description: (
      <>
        Добре дошли в нашето уютно студио, разположено в модерен комплекс на
        българското Черноморие - идеалното място за спокойна и незабравима
        почивка.
        <br />
        Студиото е с площ от 40 кв.м. и е подходящо за до 4 гости. Разполага с
        комфортна спалня (160×200 см), разтегателен диван, напълно оборудван
        кухненски кът, климатик, Wi-Fi, телевизия, пералня и просторна тераса за
        сутрешното кафе или вечерния отдих.
        <br />
        Комплексът предлага красив басейн, ресторант, детски кът, денонощна
        охрана и отлично поддържани зелени площи, които създават спокойна и
        приятна атмосфера. Плажът и всички необходими удобства са на удобно
        разстояние, което прави студиото отличен избор както за семейства, така
        и за двойки. Подарете си комфорт, спокойствие и морски емоции - очакваме
        ви!
      </>
    ),
  },
  galleryPage: {
    title: "Един поглед към вашата почивка",
    description:
      "Разгледайте студиото, красивия комплекс, басейна и атмосферата, която превръща всяка почивка в незабравимо изживяване.",
  },
};

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
].map((item, i) => {
  const [monthName, yearStr] = item.month.split(" ");

  const year = parseInt(yearStr);
  const days = generateDays(item.month, item.status, i);
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
  const availableDays = days.filter((day) => day === "available").length;
  const totalDays = new Date(year, monthNum + 1, 0).getDate();

  return {
    ...item,
    status:
      availableDays === 0
        ? "booked"
        : availableDays < 10
          ? "limited"
          : "available",
    spots: availableDays,
    days,
  };
});

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
