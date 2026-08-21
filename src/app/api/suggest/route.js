import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

function extractPlaylistId(url) {
  const match = url.match(/[?&]list=([^#&?]+)/);
  return match ? match[1] : null;
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { link, author, title } = body;

    if (!link || typeof link !== "string" || link.trim().length === 0) {
      return NextResponse.json({ error: "YouTube link is required" }, { status: 400 });
    }

    const playlistId = extractPlaylistId(link.trim());
    
    if (!playlistId) {
      return NextResponse.json({ error: "Invalid link. Please provide a valid YouTube Playlist link (containing list=)." }, { status: 400 });
    }

    const suggestedBy = author?.trim() || "Anonymous";
    const playlistTitle = title?.trim() || "Unknown Playlist";

    let finalData = null;

    if (!supabase) {
      return NextResponse.json({
        data: { playlist_id: playlistId, original_link: link, request_count: 1 },
        message: "Saved locally (Supabase not configured)",
      });
    }

    // Check if the suggestion already exists
    const { data: existing } = await supabase
      .from("song_suggestions")
      .select("id, request_count")
      .eq("playlist_id", playlistId)
      .single();

    if (existing) {
      // Update request count
      const { data, error } = await supabase
        .from("song_suggestions")
        .update({ request_count: existing.request_count + 1 })
        .eq("id", existing.id)
        .select()
        .single();
        
      if (error) throw error;
      finalData = data;
    } else {
      // Insert new suggestion
      const { data, error } = await supabase
        .from("song_suggestions")
        .insert({
          playlist_id: playlistId,
          original_link: link.trim(),
          suggested_by: suggestedBy,
          request_count: 1,
        })
        .select()
        .single();
        
      if (error) throw error;
      finalData = data;
    }

    // Send Webhook Notification
    const discordWebhookUrl = process.env.DISCORD_WEBHOOK_URL;
    const telegramWebhookUrl = process.env.TELEGRAM_WEBHOOK_URL;

    if (discordWebhookUrl) {
      try {
        await fetch(discordWebhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            content: `🎵 **New Song Suggestion!**\n**Link:** ${link}\n**Suggested By:** ${suggestedBy}\n**Total Requests:** ${finalData.request_count}`
          })
        });
      } catch (err) {
        console.error("Discord webhook failed:", err);
      }
    }

    const telegramBotToken = process.env.TELEGRAM_BOT_TOKEN;
    const telegramAdminId = process.env.TELEGRAM_ADMIN_CHAT_ID;
    const legacyTelegramUrl = process.env.TELEGRAM_WEBHOOK_URL;

    if (telegramBotToken && telegramAdminId) {
      try {
        const url = `https://api.telegram.org/bot${telegramBotToken}/sendMessage`;
        await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: telegramAdminId,
            text: `🎵 *New Song Suggestion!*\n*Link:* ${link}\n*Suggested By:* ${suggestedBy}\n*Total Requests:* ${finalData.request_count}`,
            parse_mode: 'Markdown',
            reply_markup: {
              inline_keyboard: [
                [
                  { text: "✅ Accept", callback_data: `accept_${finalData.id}` },
                  { text: "❌ Reject", callback_data: `reject_${finalData.id}` }
                ]
              ]
            }
          })
        });
      } catch (err) {
        console.error("Telegram admin bot failed:", err);
      }
    } else if (legacyTelegramUrl) {
      try {
        await fetch(legacyTelegramUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text: `🎵 *New Song Suggestion!*\n*Link:* ${link}\n*Suggested By:* ${suggestedBy}\n*Total Requests:* ${finalData.request_count}`,
            parse_mode: 'Markdown'
          })
        });
      } catch (err) {
        console.error("Telegram webhook failed:", err);
      }
    }

    return NextResponse.json({ data: finalData, message: "Suggestion submitted!" });
  } catch (err) {
    console.error("Error submitting suggestion:", err);
    return NextResponse.json({ error: "Failed to submit suggestion" }, { status: 500 });
  }
}
