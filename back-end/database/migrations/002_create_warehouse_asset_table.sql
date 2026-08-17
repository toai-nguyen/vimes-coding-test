create table warehouse_assets (
    id serial primary key,
    warehouse_document_id integer not null references warehouse_document(id) on delete cascade, -- id văn bản
    asset_name varchar(255) not null, -- tên tài sản
    asset_code varchar(255) not null, -- mã tài sản
    asset_unit_name varchar(255) not null, -- tên đơn vị tài sản
    evident_quantity integer not null, -- số lượng chứng từ
    realized_quantity integer not null, -- số lượng thực tế
    unit_price numeric(10, 2) not null, -- đơn giá
    total_amount numeric(10, 2) not null, -- tổng số tiền
    created_at timestamp default current_timestamp, -- ngày tạo
    updated_at timestamp default current_timestamp, -- ngày cập nhật
    deleted_at timestamp null -- ngày xóa
);