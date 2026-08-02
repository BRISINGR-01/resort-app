import { useTranslation } from "react-i18next";

export default function useInfo() {
  const { t } = useTranslation();
  const maxGuests = 3;
  return {
    contact: {
      location: {
        embed:
          "https://www.google.com/maps/embed?pb=!1m13!1m8!1m3!1d5893.6147770565285!2d27.7014685!3d42.3892495!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zNDLCsDIzJzIxLjMiTiAyN8KwNDInMDUuMyJF!5e0!3m2!1sen!2sbg!4v1785590494254!5m2!1sen!2sbg",
        maps: "https://maps.app.goo.gl/jHkYXsp1XhXaSntE9",
        text: t("key4", "Созопол - Green life"),
      },
      phone: "088 266 2200",
      facebook: "https://www.facebook.com/profile.php?id=61591135034073",
    },
    homePage: {
      name: t("designStudiogreenLife", "Design Studio-Green life"),
      description: t("key3", "An atmosphere crafted for unforgettable moments"),
    },
    aboutPage: {
      greeting: t("key", "Насладете се на спокойствие, комфорт и море"),
      description: t(
        "heroDescription",
        `Добре дошли в нашето уютно студио, разположено в модерен комплекс на
        българското Черноморие - идеалното място за спокойна и незабравима
        почивка.
        
        Студиото е с площ от 40 кв.м. и е подходящо за до {{maxGuests}} гости. Разполага с
        комфортна спалня (160×200 см), разтегателен диван, напълно оборудван
        кухненски кът, климатик, Wi-Fi, телевизия, пералня и просторна тераса за
        сутрешното кафе или вечерния отдих.
        
        Комплексът предлага красив басейн, ресторант, детски кът, денонощна
        охрана и отлично поддържани зелени площи, които създават спокойна и
        приятна атмосфера. Плажът и всички необходими удобства са на удобно
        разстояние, което прави студиото отличен избор както за семейства, така
        и за двойки. Подарете си комфорт, спокойствие и морски емоции - очакваме
        ви!`,
        { maxGuests },
      ),
    },
    galleryPage: {
      title: t("key2", "Един поглед към вашата почивка"),
      description: t(
        "key3",
        "Разгледайте студиото, красивия комплекс, басейна и атмосферата, която превръща всяка почивка в незабравимо изживяване.",
      ),
    },
    maxGuests,
    defaultPrice: 120,
    galleryImages: [
      {
        url: "room/2.jpg",
        caption: t("masterBedroom", "Master Bedroom"),
      },
      {
        url: "complex/drone.jpg",
        caption: t("viewFromTheSky", "View from the Sky"),
      },
      {
        url: "room/balcony.jpg",
        caption: t("privateTerrace", "Private Terrace"),
      },
      {
        url: "complex/pool.jpg",
        caption: t("resortPool", "Resort Pool"),
      },
      { url: "beach/3.jpg", caption: t("beach", "Beach") },
      { url: "beach/4.jpg", caption: t("beach", "Beach") },
      { url: "beach/5.jpg", caption: t("beach", "Beach") },
      {
        url: "complex/pool-2.jpg",
        caption: t("resortPool", "Resort Pool"),
      },
      {
        url: "complex/pool-night.jpg",
        caption: t("resortPool", "Resort Pool"),
      },
      { url: "beach/2.jpg", caption: t("beach", "Beach") },
      {
        url: "complex/drone-2.jpg",
        caption: t("viewFromTheSky", "View from the Sky"),
      },

      {
        url: "complex/kids-2.jpg",
        caption: t("kidsPlayground", "Kid's Playground"),
      },
      {
        url: "complex/kids.jpg",
        caption: t("kidsPlayground", "Kid's Playground"),
      },
      {
        url: "complex/map.jpg",
        caption: t("complexMap", "Complex Map"),
      },
      { url: "complex/path-2.jpg", caption: t("complex", "Complex") },
      { url: "complex/path.jpg", caption: t("complex", "Complex") },
      {
        url: "complex/tennis.jpg",
        caption: t("tennisCourts", "Tennis Courts"),
      },
      {
        url: "room/3.jpg",
        caption: t("bedAndKitchen", "Bed and Kitchen"),
      },
      { url: "room/4.jpg", caption: t("room", "Room") },
      { url: "room/bathroom.jpg", caption: t("bathroom", "Bathroom") },
    ].map((g) => {
      const category = g.url.split("/")[0];
      g.url = `gallery/${g.url}`;
      return { ...g, category };
    }),
    amenities: [
      {
        icon: "icons/sea.svg",
        label: t("closeToTheSea", "Close to the sea"),
      },
      {
        icon: "icons/kitchen.svg",
        label: t("fullKitchen", "Full Kitchen"),
      },
      { icon: "icons/wifi.svg", label: t("wifi", "WiFi") },
      { icon: "icons/pool.svg", label: t("pool", "Pool") },
      { icon: "icons/iron.svg", label: t("iron", "Iron/Hair dryer") },
      { icon: "icons/tv.svg", label: t("tv", "TV") },
      { icon: "icons/ac.svg", label: t("ac", "AC") },
      {
        icon: "icons/washing-machine.svg",
        label: t("washingMachine", "Washing Machine"),
      },
    ],
  };
}
