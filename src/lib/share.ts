export function generateWhatsAppText({
  type,
  people,
  total,
}: {
  type: "equal" | "percentage" | "item";
  people: any[];
  total: number;
}) {
  let title = "";

  if (type === "equal") title = "Split Bill - Equal";
  else if (type === "percentage") title = "Split Bill - Percentage";
  else if (type === "item") title = "Split Bill - By Item";

  let text = `${title}\n`;
  text += `----------------------\n`;

  people.forEach((p: any, index: number) => {
    text += `${index + 1}. ${p.name}\n`;
    text += `   Bayar : Rp ${p.total}\n`;

    if (type === "item" && p.paid !== undefined) {
      text += `   Dibayar : Rp ${p.paid}\n`;

      if (p.change >= 0) {
        text += `   Kembalian : Rp ${p.change}\n`;
      } else {
        text += `   Kurang : Rp ${Math.abs(p.change)}\n`;
      }
    }

    text += `\n`;
  });

  text += `----------------------\n`;
  text += `Total Bill : Rp ${total}`;

  return text;
}
