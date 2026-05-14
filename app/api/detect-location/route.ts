import { NextRequest, NextResponse } from "next/server";

function isIpv4(value: string): boolean {
  const parts = value.split(".");
  if (parts.length !== 4) return false;

  return parts.every((part) => {
    if (!/^\d+$/.test(part)) return false;
    const n = Number(part);
    return n >= 0 && n <= 255;
  });
}

function extractFirstIpv4(value: string | null): string {
  if (!value) return "";

  for (const rawPart of value.split(",")) {
    const part = rawPart.trim();
    if (isIpv4(part)) return part;
  }

  return "";
}

export async function GET(request: NextRequest) {
  try {
    const headers = request.headers;

    // Vercel inject x-vercel-ip-country header - dùng trực tiếp
    const vercelCountry = headers.get("x-vercel-ip-country") || "";

    // Nếu có country từ Vercel (đáng tin cậy hơn)
    if (vercelCountry && vercelCountry.length === 2) {
      return NextResponse.json({
        success: true,
        countryCode: vercelCountry,
        ip: headers.get("x-real-ip") || "",
        ipv4: "",
        country: vercelCountry,
        city: headers.get("x-vercel-ip-city") || "",
        region: headers.get("x-vercel-ip-country-region") || "",
      });
    }

    // Fallback: dùng IP detection cho local/hosting khác
    const xRealIp = (headers.get("x-real-ip") || "").trim();
    const forwarded = headers.get("x-forwarded-for");
    const forwardedIpv4 = extractFirstIpv4(forwarded);

    const rawIp = xRealIp || forwardedIpv4 || "unknown";
    const ipv4 = isIpv4(rawIp) ? rawIp : forwardedIpv4;

    const isLocalhost =
      !rawIp ||
      rawIp === "127.0.0.1" ||
      rawIp === "::1" ||
      rawIp === "unknown";

    if (isLocalhost) {
      // Localhost: fallback về browser language detection (en)
      return NextResponse.json({ success: false, countryCode: "US", ip: rawIp, ipv4: "" });
    }

    // Dùng ipinfo để lấy country
    const ipinfoToken = process.env.IPINFO_TOKEN;
    const lookupIp = ipv4 || rawIp;
    let countryCode = "US";
    let country = "";
    let city = "";
    let region = "";

    if (ipinfoToken) {
      try {
        const res = await fetch(`https://ipinfo.io/${lookupIp}?token=${ipinfoToken}`);
        const data = await res.json();
        if (!data?.error) {
          countryCode = data.country || "US";
          city = data.city || "";
          region = data.region || "";
        }
      } catch {
        // Ignore failure
      }
    }

    try {
      country = new Intl.DisplayNames(["en"], { type: "region" }).of(countryCode) || countryCode;
    } catch {
      country = countryCode;
    }

    return NextResponse.json({
      success: true,
      countryCode,
      ip: ipv4 || rawIp,
      ipv4: ipv4 || "",
      country,
      city,
      region,
    });
  } catch (error) {
    console.error("Detect location error:", error);
    return NextResponse.json({ success: false, countryCode: "US", ip: "unknown", ipv4: "" });
  }
}
