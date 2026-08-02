import supabase from "./supabase";
import type { PricesData, SupabaseResponse } from "./types";
import { clearTime, formatDate } from "../pages/admin/utils";

const TABLE = "design-studio-green-life-prices";

interface Prices {
  getPrices(from: Date, to: Date): Promise<SupabaseResponse<PricesData[]>>;
  setPrice(price: number, date: Date): Promise<Error | null>;
}

const mock: Prices = {
  async getPrices(): Promise<SupabaseResponse<PricesData[]>> {
    return {
      data: [{ price: 120, date: clearTime(new Date()) }] as PricesData[],
      error: null,
    };
  },
  async setPrice(): Promise<Error | null> {
    return null;
  },
};

const prices: Prices = import.meta.env.DEV
  ? mock
  : {
      async getPrices(
        from: Date,
        to: Date,
      ): Promise<SupabaseResponse<PricesData[]>> {
        const res: SupabaseResponse<PricesData[]> = await supabase
          .from(TABLE)
          .select("*")
          .gte("date", formatDate(clearTime(from)))
          .lte("date", formatDate(clearTime(to)));

        if (res.data) {
          res.data = res.data.map((d) => ({
            ...d,
            date: clearTime(new Date(d.date)),
          }));
        }

        return res;
      },

      async setPrice(price: number, date: Date): Promise<Error | null> {
        return (
          await supabase.from(TABLE).upsert({
            price,
            date: formatDate(date),
          })
        ).error;
      },
    };

export default prices;
