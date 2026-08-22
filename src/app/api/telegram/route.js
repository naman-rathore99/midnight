import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

// Helper to send messages back via Telegram
async function sendMessage(chatId, text) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) return;
  await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text, parse_mode: "Markdown" })
  });
}

// Helper to edit messages (e.g., to remove inline keyboard)
async function editMessageText(chatId, messageId, text) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) return;
  await fetch(`https://api.telegram.org/bot${token}/editMessageText`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, message_id: messageId, text, parse_mode: "Markdown" })
  });
}

export async function POST(request) {
  try {
    const update = await request.json();
    const telegramAdminId = process.env.TELEGRAM_ADMIN_CHAT_ID;

    // Handle Callback Queries (Button Clicks)
    if (update.callback_query) {
      const callback = update.callback_query;
      const data = callback.data; // e.g. "accept_123" or "reject_123"
      const chatId = callback.message.chat.id;
      const messageId = callback.message.message_id;

      // Verify it's the admin
      if (telegramAdminId && String(chatId) !== String(telegramAdminId)) {
        return NextResponse.json({ ok: true });
      }

      if (data.startsWith("accept_")) {
        const id = data.replace("accept_", "");
        
        if (supabase) {
          // Fetch suggestion
          const { data: suggestion } = await supabase.from("song_suggestions").select("*").eq("id", id).single();
          
          if (suggestion) {
            // Insert into accepted_playlists
            await supabase.from("accepted_playlists").insert({
              playlist_id: suggestion.playlist_id || suggestion.youtube_id,
              title: "Midnight Radio Playlist " + Math.floor(Math.random() * 1000), // Can be updated by admin later
              suggested_by: suggestion.suggested_by
            });
            // Optional: delete from suggestions
            // await supabase.from("song_suggestions").delete().eq("id", id);
          }
        }
        
        await editMessageText(chatId, messageId, callback.message.text + "\n\n✅ *ACCEPTED*");
      } 
      else if (data.startsWith("reject_")) {
        const id = data.replace("reject_", "");
        
        // Delete from database
        if (supabase) {
          await supabase.from("song_suggestions").delete().eq("id", id);
        }
        
        await editMessageText(chatId, messageId, callback.message.text + "\n\n❌ *REJECTED & DELETED*");
      }
      else if (data.startsWith("acceptShayari_")) {
        await editMessageText(chatId, messageId, callback.message.text + "\n\n✅ *ACCEPTED*");
      }
      else if (data.startsWith("rejectShayari_")) {
        const id = data.replace("rejectShayari_", "");
        if (supabase) {
          await supabase.from("shayari").delete().eq("id", id);
        }
        await editMessageText(chatId, messageId, callback.message.text + "\n\n❌ *REJECTED & DELETED*");
      }

      // Tell Telegram we processed the callback
      const token = process.env.TELEGRAM_BOT_TOKEN;
      if (token) {
        await fetch(`https://api.telegram.org/bot${token}/answerCallbackQuery`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ callback_query_id: callback.id })
        });
      }

      return NextResponse.json({ ok: true });
    }

    // Handle normal text messages (like /status or suggestions via DM)
    if (update.message && update.message.text) {
      const text = update.message.text;
      const chatId = update.message.chat.id;

      // Admin Commands
      if (text.startsWith("/status")) {
        if (telegramAdminId && String(chatId) === String(telegramAdminId)) {
          if (!supabase) {
            await sendMessage(chatId, "Supabase is not configured.");
            return NextResponse.json({ ok: true });
          }

          const { count } = await supabase
            .from("song_suggestions")
            .select("*", { count: "exact", head: true });

          await sendMessage(chatId, `📻 *Midnight Radio Status*\nPending Suggestions: ${count || 0}`);
        }
        return NextResponse.json({ ok: true });
      }

      // Public Commands
      if (text.startsWith("/coffee") || text.startsWith("/donate")) {
        await sendMessage(chatId, "☕ Love Midnight Radio?\n\nYou can support the project and help keep the servers running on Ko-fi!\n\n👉 [Support on Ko-fi here](https://ko-fi.com/cc4cc5bb-33f1-4ac6-a7e2-e180ae640a95)");
        return NextResponse.json({ ok: true });
      }

      // If a normal user sends a link directly to the bot
      const match = text.match(/[?&]list=([^#&?]+)/);
      
      if (match) {
        const playlistId = match[1];
        const author = update.message.from.first_name || "Telegram User";

        if (supabase) {
          const { data: existing } = await supabase
            .from("song_suggestions")
            .select("id, request_count")
            .eq("playlist_id", playlistId)
            .single();

          if (existing) {
            await supabase
              .from("song_suggestions")
              .update({ request_count: existing.request_count + 1 })
              .eq("id", existing.id);
          } else {
            const { error: insertError } = await supabase
              .from("song_suggestions")
              .insert({
                playlist_id: playlistId,
                original_link: text,
                suggested_by: author,
                request_count: 1,
              });
              
            if (insertError && insertError.message.includes('playlist_id')) {
              await supabase
                .from("song_suggestions")
                .insert({
                  youtube_id: playlistId,
                  original_link: text,
                  suggested_by: author,
                  request_count: 1,
                });
            }
          }
          await sendMessage(chatId, "✅ Awesome! Your playlist has been added to the Midnight Radio suggestions.");
        }
      } else {
        await sendMessage(chatId, "Hello! Send me a YouTube Playlist link (containing list=) to suggest it for Midnight Radio.");
      }
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Telegram webhook error:", err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
