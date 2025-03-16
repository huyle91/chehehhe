

export default function GetDatetime(date:string) {

    const getTimes = new Date(date).toLocaleString("vi-VN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false, // Định dạng 24h
      });
  return getTimes;
}
