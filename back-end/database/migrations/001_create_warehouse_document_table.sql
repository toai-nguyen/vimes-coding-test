create table warehouse_document (
    id serial primary key,
    department_name varchar(255) not null, -- tên đơn vị
    unit_name varchar(255) not null, -- tên bộ phận
    number_of_documents varchar(255) not null, -- số văn bản (identity)
    delivery_name varchar(255) not null, -- tên người giao
    received_warehouse_name varchar(255) not null, -- nhập tại kho
    received_location_name varchar(255) not null, -- địa điểm nhập
    total_amount numeric(10, 2) not null, -- tổng số tiền
    number_of_files integer not null, -- số lượng file bổ sung
    created_at timestamp default current_timestamp, -- ngày tạo
    updated_at timestamp default current_timestamp, -- ngày cập nhật
    deleted_at timestamp null -- ngày xóa
);