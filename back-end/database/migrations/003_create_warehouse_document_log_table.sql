create table warehouse_document_logs (
    id serial primary key,
    warehouse_document_id integer not null references warehouse_document(id) on delete cascade, -- id văn bản
    actions varchar(255) not null, -- hành động
    created_at timestamp default current_timestamp, -- ngày tạo
    updated_at timestamp default current_timestamp, -- ngày cập nhật
    deleted_at timestamp null -- ngày xóa
);