import express from "express";
import cors from "cors";
import { Client } from "@notionhq/client";

const app = express();
const PORT = process.env.PORT || 3000;

// CORS: set FRONTEND_ORIGIN to restrict
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || "*";
app.use(cors({ origin: FRONTEND_ORIGIN === "*" ? true : FRONTEND_ORIGIN }));
app.use(express.json());

// Optional API secret for basic auth
const API_SECRET = process.env.API_SECRET || "";

const notionToken = process.env.NOTION_TOKEN;
const databaseId = process.env.NOTION_DATABASE_ID;

if (!notionToken || !databaseId) {
  console.warn("Missing NOTION_TOKEN or NOTION_DATABASE_ID — Notion writes will fail.");
}

app.get("/", (_req, res) => {
  res.json({ ok: true, service: "les-cuisines-de-sandrine-server" });
});

app.post("/api/orders", async (req, res) => {
  try {
    if (API_SECRET) {
      const auth = req.headers.authorization || "";
      if (auth !== `Bearer ${API_SECRET}`) {
        return res.status(401).json({ ok: false, error: "Unauthorized" });
      }
    }

    const body = req.body || {};

    if (!notionToken || !databaseId) {
      return res.status(500).json({ ok: false, error: "Notion not configured" });
    }

    const notion = new Client({ auth: notionToken });

    const euros = (n) => {
      try { return Number(n).toLocaleString("fr-FR", { style: "currency", currency: "EUR" }); } catch { return String(n); }
    };

    const title = `${body.name || "Commande"} — ${body.mode === "delivery" ? "Livraison" : "Retrait"} — ${euros(body.total)}`;
    const itemsText = Array.isArray(body.items)
      ? body.items.map((i) => `${i.qty}× ${i.item}${i.unitPrice ? ` (${euros(i.unitPrice)})` : ""}`).join("\n")
      : "";

    await notion.pages.create({
      parent: { database_id: databaseId },
      properties: {
        Name: { title: [{ type: "text", text: { content: title } }] },
        Client: { rich_text: [{ type: "text", text: { content: body.name || "" } }] },
        Phone: { rich_text: [{ type: "text", text: { content: body.phone || "" } }] },
        Mode: { select: { name: body.mode === "delivery" ? "Livraison" : "Retrait" } },
        Status: { select: { name: "A préparer" } },
        Slot: { rich_text: [{ type: "text", text: { content: body.slot || "" } }] },
        Address: { rich_text: [{ type: "text", text: { content: body.deliveryAddress || "" } }] },
        Allergies: { rich_text: [{ type: "text", text: { content: body.allergies || "" } }] },
        Subtotal: { number: Number(body.subtotal || 0) },
        DeliveryFee: { number: Number(body.deliveryFee || 0) },
        Total: { number: Number(body.total || 0) },
        Timestamp: { date: { start: body.timestamp || new Date().toISOString() } },
      },
      children: itemsText
        ? [
            {
              object: "block",
              paragraph: {
                rich_text: [ { type: "text", text: { content: itemsText } } ],
              },
            },
          ]
        : [],
    });

    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: String(err) });
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on :${PORT}`);
});
