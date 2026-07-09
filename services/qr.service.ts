import QRCode from "qrcode";
import { getShortUrl } from "@/lib/utils";

export const qrService = {
  async generatePng(slug: string, size = 256): Promise<Buffer> {
    const url = getShortUrl(slug);
    return QRCode.toBuffer(url, {
      width: size,
      margin: 2,
      color: { dark: "#0D9488", light: "#FFFFFF" },
    });
  },

  async generateSvg(slug: string, size = 256): Promise<string> {
    const url = getShortUrl(slug);
    return QRCode.toString(url, {
      type: "svg",
      width: size,
      margin: 2,
      color: { dark: "#0D9488", light: "#FFFFFF" },
    });
  },
};
