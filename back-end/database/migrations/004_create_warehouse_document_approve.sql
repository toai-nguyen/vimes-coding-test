create table warehouse_document_approve (
    id serial primary key,
    warehouse_document_id integer not null references warehouse_document(id) on delete cascade, -- id văn bản
    approve_status varchar(255) not null, -- trạng thái phê duyệt
    approve_by varchar(255) not null, -- người phê duyệt
    approve_at timestamp default current_timestamp, -- ngày phê duyệt
    created_at timestamp default current_timestamp, -- ngày tạo
    updated_at timestamp default current_timestamp, -- ngày cập nhật
    deleted_at timestamp null -- ngày xóa
);