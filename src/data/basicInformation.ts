interface BasicInformation {
  cost: number;
  contact: {
    location: {
      maps: string;
      text: string;
    };
    email: string;
    phone: string;
    facebook: string;
  };
  maxGuests: number;
}

export const basicInformation: BasicInformation = {
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
