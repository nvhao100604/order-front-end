# 🍔 Food Ordering Platform – Modern Full-stack Architecture

> **A high-performance, responsive food ordering solution built with Next.js 15, leveraging modern state management and real-time data fetching.**

---

## 📸 Preview
*(Dán hình ảnh giao diện đẹp nhất của bạn vào đây để tạo ấn tượng ngay lập tức)*
![Project Hero Image](https://via.placeholder.com/800x400?text=Insert+Your+Project+Screenshot+Here)

---

## 📝 Abstract
Dự án này là một phần trong hệ thống quản lý đặt hàng toàn diện, tập trung vào việc tối ưu hóa trải nghiệm người dùng (UX) và hiệu suất xử lý dữ liệu. Với tư duy của một sinh viên **Hệ thống thông tin (IS)** tại **Đại học Sài Gòn (SGU)**, tôi tập trung vào việc xây dựng một kiến trúc Frontend bền vững, có khả năng mở rộng cao và tích hợp mượt mà với hệ thống **FastAPI Backend**.

---

## 🚀 Key Features
* **Modern UI/UX:** Giao diện tinh tế sử dụng **shadcn/ui** và **Tailwind CSS**, tích hợp tính năng **drag-to-scroll** mượt mà cho danh mục thực đơn.
* **Real-time Data Fetching:** Sử dụng **SWR** (Stale-While-Revalidate) để đảm bảo dữ liệu thực đơn luôn mới nhất mà không làm gián đoạn trải nghiệm người dùng.
* **Global State Management:** Quản lý logic giỏ hàng và luồng dữ liệu ứng dụng một cách chuyên nghiệp với **Redux Toolkit**.
* **Responsive Design:** Tối ưu hóa hiển thị hoàn hảo trên mọi thiết bị, từ di động đến máy tính để bàn.
* **Smart Search:** Thành phần **MenuSearch** tích hợp bộ lọc thông minh, cho phép truy vấn món ăn theo thời gian thực với hiệu suất cao.

---

## 🛠 Tech Stack

### **Core Framework & Language**
* **Next.js (15.3.5):** Tận dụng App Router để tối ưu hóa hiệu suất load trang.
* **TypeScript:** Đảm bảo tính chặt chẽ của mã nguồn và tính toàn vẹn của dữ liệu trong quá trình phát triển.

### **State & Data Handling**
* **Redux Toolkit:** Quản lý trạng thái giỏ hàng và luồng nghiệp vụ phức tạp.
* **SWR & Axios:** Xử lý các truy vấn API bất đồng bộ và cơ chế caching thông minh.

### **Styling & Components**
* **Tailwind CSS:** Xây dựng giao diện với kiến trúc Utility-first nhanh chóng và linh hoạt.
* **shadcn/ui:** Hệ thống component chất lượng cao giúp chuẩn hóa giao diện người dùng.

---

## 🏗 System Architecture
Hệ thống được thiết kế theo mô hình tách biệt Frontend và Backend để tối đa hóa khả năng bảo trì:
* **Frontend (Project này):** Next.js triển khai trên nền tảng Vercel.
* **Backend Repository:** [👉 Xem mã nguồn FastAPI tại đây](https://github.com/nvhao100604/order_fast_api).

---

## ⚙️ Getting Started

### **1. Clone dự án**
```bash
git clone [https://github.com/nvhao100604/order-front-end.git](https://github.com/nvhao100604/order-front-end.git)
cd order-front-end
```

- Sao chép file mẫu: 
```bash
cp .env.example .env
```
- Mở file .env và điều chỉnh các giá trị phù hợp với môi trường chạy thực tế của bạn (ví dụ: đổi NEXT_PUBLIC_API_BASE_URL thành link deploy Backend nếu có).

### **2. Cài đặt môi trường**
```bash
npm install
```

### **3. Chạy môi trường Development**
```bash
npm run dev
```

Mở [http://localhost:3000](http://localhost:3000) để trải nghiệm sản phẩm.

## 🌐 Live Demo
👉 [Trải nghiệm thực tế sản phẩm tại đây](https://order-vh.vercel.app)

## Contact
- Author: Nguyễn Văn Hào

- Position: Final-year Information Systems Student at Sai Gon University

- Location: Binh Dong Ward, Ho Chi Minh City

- GitHub: [nvhao100604](https://github.com/nvhao100604)