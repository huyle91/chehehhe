export default function GenerateUniqueHash() {
  // Sử dụng crypto để tạo chuỗi ngẫu nhiên
  const array = new Uint8Array(32); // 32 bytes sẽ cho khoảng 43-50 ký tự sau khi mã hóa
  crypto.getRandomValues(array);

  // Chuyển thành base64 và loại bỏ ký tự đặc biệt
  const base64 = btoa(String.fromCharCode(...array))
    .replace(/\+/g, "")
    .replace(/\//g, "")
    .replace(/=/g, "");

  // Thêm timestamp để tăng tính duy nhất
  const timestamp = Date.now().toString(36);

  // Kết hợp và cắt/chèn để đạt khoảng 50 ký tự
  const hash = (base64 + timestamp).slice(0, 50);

  return hash.padEnd(50, "x"); // Đảm bảo đủ 50 ký tự
}
