# Vimes Coding Test

## 1. Tổng quan

Đây là kết quả bài test lập trình của **Nguyễn Thế Toại**.

### Bài toán

Xây dựng một chức năng nhập thông tin của phiếu nhập kho theo mẫu có sẵn.

### Yêu cầu

1. Thiết kế cấu trúc các bảng cơ sở dữ liệu để lưu trữ thông tin.
2. Thiết kế giao diện nhập liệu.
3. Xây dựng chức năng nhập liệu và lưu dữ liệu vào cơ sở dữ liệu.
4. Viết Unit Test cho các chức năng chính.

---

## 2. Giải pháp thực hiện

Tôi xây dựng ứng dụng theo mô hình Web Application, tách biệt Front-end và Back-end:

* **Front-end:** React + TypeScript, chịu trách nhiệm giao diện và xử lý tương tác với người dùng.
* **Back-end:** Node.js + Express + TypeScript, cung cấp API và xử lý business logic.
* **Database:** PostgreSQL, sử dụng để lưu trữ thông tin phiếu nhập kho và các dữ liệu liên quan.

Request từ Front-end được gửi tới Back-end thông qua REST API. Dữ liệu đầu vào được validate bằng Zod trước khi xử lý và lưu vào database.

---

## 3. Tech Stack

### Back-end

* Node.js
* Express
* TypeScript
* PostgreSQL
* Zod
* Drizzle ORM

### Front-end

* React
* TypeScript
* MUI
* Vite

### Development Tools

* pnpm

---

## 4. Thiết kế cơ sở dữ liệu

Database gồm 4 bảng chính:

| Table                        | Mô tả                                                     |
| ---------------------------- | --------------------------------------------------------- |
| `warehouse_document`         | Lưu trữ thông tin chung của phiếu nhập kho                |
| `warehouse_asset`            | Lưu trữ danh sách tài sản thuộc phiếu nhập kho            |
| `warehouse_document_log`     | Lưu trữ lịch sử và các thao tác được thực hiện trên phiếu |
| `warehouse_document_approve` | Lưu trữ thông tin người ký và phê duyệt phiếu             |

### Quan hệ giữa các bảng

* Một `warehouse_document` có thể có nhiều `warehouse_asset`.
* Một `warehouse_document` có thể có nhiều `warehouse_document_log`.
* Một `warehouse_document` có thể có thông tin phê duyệt tương ứng trong `warehouse_document_approve`.

Thiết kế này giúp tách thông tin chung của phiếu, danh sách tài sản, lịch sử thao tác và thông tin phê duyệt thành các nhóm dữ liệu riêng biệt, đồng thời hạn chế việc lưu trữ dữ liệu lặp lại.

---

## 5. Validation và xử lý dữ liệu

Dữ liệu từ request được validate bằng Zod trước khi thực hiện business logic.

Một số trường hợp được kiểm tra:

* Kiểm tra các trường bắt buộc.
* Kiểm tra kiểu dữ liệu.
* Kiểm tra định dạng dữ liệu.
* Kiểm tra dữ liệu của danh sách tài sản.
* Trả về lỗi phù hợp khi dữ liệu đầu vào không hợp lệ.

Việc tách validation khỏi business logic giúp API dễ bảo trì và hạn chế dữ liệu không hợp lệ được lưu vào database.

---

## 6. Unit Test

Unit Test được sử dụng để kiểm tra các chức năng chính của ứng dụng.

Các trường hợp kiểm thử tập trung vào:

* Dữ liệu hợp lệ.
* Dữ liệu không hợp lệ.
* Validation request.
* Xử lý các trường hợp lỗi.
* Business logic chính của chức năng nhập kho.

---

## 7. Video Demo

Video demo quá trình sử dụng chức năng nhập phiếu nhập kho:

> **Video Demo:** *[Thêm link video tại đây]*

---

## 8. Cách chạy ứng dụng

### Yêu cầu môi trường

* Node.js
* pnpm
* PostgreSQL

### 1. Clone project

```bash
git clone https://github.com/toai-nguyen/vimes-coding-test.git
cd vimes-coding-test
```

### 2. Cấu hình Environment Variables

Tạo file `.env` dựa trên `.env.example` tại cả hai thư mục Front-end và Back-end.

Ví dụ:

```bash
cp .env.example .env
```

Sau đó cập nhật các giá trị cấu hình phù hợp với môi trường local.

### 3. Khởi tạo Database

Đảm bảo PostgreSQL đang chạy và database đã được tạo.

Sau đó chạy:

```bash
pnpm db:push
```

### 4. Chạy Back-end

Di chuyển vào thư mục Back-end và chạy:

```bash
pnpm dev
```

### 5. Chạy Front-end

Mở terminal khác, di chuyển vào thư mục Front-end và chạy:

```bash
pnpm dev
```

Sau khi cả Front-end và Back-end được khởi động, truy cập địa chỉ được Vite hiển thị trong terminal để sử dụng ứng dụng.

---

## 9. Repository

Source code của bài test:

**GitHub:** https://github.com/toai-nguyen/vimes-coding-test.git